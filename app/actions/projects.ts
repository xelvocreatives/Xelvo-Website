"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { parseId, projects } from "@/lib/db/models";

const ProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
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
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
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
      message: "Missing Fields. Failed to Create Project.",
    };
  }
  if (!isOwnUploadUrl(imageUrl, "project")) {
    return {
      ok: false,
      errors: { imageUrl: ["Please upload a project image."] },
      message: "Image is required.",
    };
  }

  try {
    const now = new Date();
    await (await projects()).insertOne({
      _id: new ObjectId(),
      ...parsed.data,
      imageUrl,
      isFeatured,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Database Error: Failed to Create Project." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Project Created" };
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
      message: "Missing Fields. Failed to Update Project.",
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
    return { ok: false, message: "Database Error: Failed to Update Project." };
  }

  revalidateProjectPages();
  return { ok: true, message: "Project Updated" };
}

export async function deleteProject(id: string) {
  if (!(await isAdmin())) return { message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { message: "Project not found." };

  try {
    await (await projects()).deleteOne({ _id });
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete Project." };
  }

  revalidateProjectPages();
  return { message: "Deleted Project" };
}
