"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
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
    imageUrl?: string[];
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
    // Set by the form after the browser uploads the image to Cloudinary.
    imageUrl: formData.get("imageUrl"),
    isFeatured: formData.get("isFeatured") === "on",
  };
}

function revalidateProjectPages() {
  revalidatePath("/admin", "layout");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createProject(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const { parsed, imageUrl, isFeatured } = readForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the highlighted fields.",
    };
  }
  if (!isOwnUploadUrl(imageUrl, "project")) {
    return {
      ok: false,
      errors: { imageUrl: ["Add a cover image for this project."] },
      message: "Please fix the highlighted fields.",
    };
  }

  try {
    const now = new Date();
    const col = await projects();
    await col.insertOne({
      _id: new ObjectId(),
      ...parsed.data,
      imageUrl,
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

  const { parsed, imageUrl, isFeatured } = readForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the highlighted fields.",
    };
  }

  try {
    const result = await (await projects()).updateOne(
      { _id },
      {
        $set: {
          ...parsed.data,
          isFeatured,
          updatedAt: new Date(),
          // Only replace the image when a new one was uploaded.
          ...(isOwnUploadUrl(imageUrl, "project") ? { imageUrl } : {}),
        },
      },
    );
    if (result.matchedCount === 0) {
      return { ok: false, message: "Project not found." };
    }
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
    message: featured ? "Now showing on the home page." : "Moved to the projects page.",
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
