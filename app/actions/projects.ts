"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { MAX_PROJECT_IMAGES } from "@/lib/admin-format";
import { parseId, projects } from "@/lib/db/models";
import { applyOrder, topOrder, type Orderable } from "@/lib/db/ordering";
import type { Collection } from "mongodb";

const ProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give the project a name.")
    .max(100, "Keep the name under 100 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Write at least a short sentence (10+ characters).")
    .max(600, "Keep the description under 600 characters."),
  category: z
    .string()
    .trim()
    .min(1, "Add a category, e.g. Branding.")
    .max(60, "Keep the category under 60 characters."),
});

export type State = {
  ok?: boolean;
  errors?: {
    title?: string[];
    description?: string[];
    images?: string[];
    category?: string[];
  };
  message?: string | null;
};

function readForm(formData: FormData) {
  return {
    parsed: ProjectSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    }),
    // JSON array of image URLs in display order, set by the form after the
    // browser uploads any new files to Cloudinary.
    images: formData.get("images"),
    isFeatured: formData.get("isFeatured") === "on",
  };
}

/**
 * Validates the gallery: 1-12 URLs, each either a fresh upload to this
 * account's project folder or an image the project already had.
 */
function readImages(raw: FormDataEntryValue | null, existing: string[] = []): string[] | string {
  let list: unknown;
  try {
    list = JSON.parse(typeof raw === "string" ? raw : "[]");
  } catch {
    return "Something went wrong with the images. Please try again.";
  }
  if (!Array.isArray(list) || list.length === 0) return "Add at least one image for this project.";
  if (list.length > MAX_PROJECT_IMAGES) return `A project can have up to ${MAX_PROJECT_IMAGES} images.`;
  const urls = list.filter((u): u is string => typeof u === "string");
  if (urls.length !== list.length || new Set(urls).size !== urls.length) {
    return "Something went wrong with the images. Please try again.";
  }
  const allowed = new Set(existing);
  if (!urls.every((u) => allowed.has(u) || isOwnUploadUrl(u, "project"))) {
    return "One of the images couldn't be verified. Please upload it again.";
  }
  return urls;
}

function revalidateProjectPages() {
  revalidatePath("/admin", "layout");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function createProject(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const { parsed, images: rawImages, isFeatured } = readForm(formData);
  const images = readImages(rawImages);
  if (!parsed.success || typeof images === "string") {
    return {
      ok: false,
      errors: {
        ...(parsed.success ? {} : parsed.error.flatten().fieldErrors),
        ...(typeof images === "string" ? { images: [images] } : {}),
      },
      message: "Please fix the highlighted fields.",
    };
  }

  try {
    const now = new Date();
    const col = await projects();
    await col.insertOne({
      _id: new ObjectId(),
      ...parsed.data,
      images,
      imageUrl: images[0],
      isFeatured,
      order: await topOrder(col as unknown as Collection<Orderable>),
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Couldn’t save the project. Please try again." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Project added." };
}

export async function updateProject(
  id: string,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Project not found." };

  const { parsed, images: rawImages, isFeatured } = readForm(formData);

  try {
    const col = await projects();
    const current = await col.findOne({ _id });
    if (!current) return { ok: false, message: "Project not found." };

    const existing = current.images?.length ? current.images : current.imageUrl ? [current.imageUrl] : [];
    const images = readImages(rawImages, existing);
    if (!parsed.success || typeof images === "string") {
      return {
        ok: false,
        errors: {
          ...(parsed.success ? {} : parsed.error.flatten().fieldErrors),
          ...(typeof images === "string" ? { images: [images] } : {}),
        },
        message: "Please fix the highlighted fields.",
      };
    }

    await col.updateOne(
      { _id },
      {
        $set: {
          ...parsed.data,
          images,
          imageUrl: images[0],
          isFeatured,
          updatedAt: new Date(),
        },
      },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Couldn’t save your changes. Please try again." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Changes saved." };
}

export type ActionResult = { ok: boolean; message: string };

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Project not found." };

  try {
    await (await projects()).deleteOne({ _id });
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Couldn’t delete the project. Please try again." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Project deleted." };
}

/** Shows or hides a project on the home page (the "featured" flag). */
export async function setProjectFeatured(
  id: string,
  featured: boolean,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Project not found." };

  try {
    await (await projects()).updateOne(
      { _id },
      { $set: { isFeatured: featured, updatedAt: new Date() } },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Couldn’t update the project. Please try again." };
  }

  revalidateProjectPages();
  return {
    ok: true,
    message: featured ? "Now showing on the home page." : "Removed from the home page.",
  };
}

/** Saves the drag-and-drop arrangement: `ids` is every project, in order. */
export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const parsed = ids.map(parseId);
  if (parsed.some((id) => id === null)) return { ok: false, message: "Couldn’t save the new order." };

  try {
    const outcome = await applyOrder(
      (await projects()) as unknown as Collection<Orderable>,
      parsed as ObjectId[],
    );
    if (outcome === "stale") {
      return { ok: false, message: "Your projects changed in the meantime. Refresh the page and try again." };
    }
  } catch (error) {
    console.error("Reorder error:", error);
    return { ok: false, message: "Couldn’t save the new order. Please try again." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Order saved." };
}
