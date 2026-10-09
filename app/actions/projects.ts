"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveFile } from "@/lib/file-upload";

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional(), // Made optional to handle file uploads
  category: z.string().min(1, "Category is required"),
  isFeatured: z.string().optional(), // Form data comes as string "on" or undefined
});

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    imageUrl?: string[];
    category?: string[];
    isFeatured?: string[];
  };
  message?: string | null;
};

export async function createProject(prevState: State, formData: FormData) {
  const validatedFields = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    isFeatured: formData.get("isFeatured") === "on" ? "on" : undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Project.",
    };
  }

  const { title, description, category, isFeatured } = validatedFields.data;
  let { imageUrl } = validatedFields.data;

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveFile(imageFile);
    if (uploadedPath) {
      imageUrl = uploadedPath;
    }
  }

  if (!imageUrl) {
    return {
      message: "Image is required (either URL or File upload).",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Unauthorized: You must be logged in.",
    };
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("Project").insert({
      title,
      description,
      imageUrl,
      category,
      isFeatured: isFeatured === "on",
    });

    if (error) throw error;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Project.",
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/"); // Update home page as well
  return { message: "Project Created" };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Unauthorized: You must be logged in.",
    };
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("Project").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { message: "Deleted Project" };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete Project." };
  }
}

export async function updateProject(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    isFeatured: formData.get("isFeatured") === "on" ? "on" : undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Project.",
    };
  }

  const { title, description, category, isFeatured } = validatedFields.data;
  let { imageUrl } = validatedFields.data;

  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveFile(imageFile);
    if (uploadedPath) {
      imageUrl = uploadedPath;
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: "Unauthorized: You must be logged in.",
    };
  }

  try {
    // We can define a strict type safe object for update
    const updateData: {
      title: string;
      description: string;
      category: string;
      isFeatured: boolean;
      updatedAt: string;
      imageUrl?: string;
    } = {
      title,
      description,
      category,
      isFeatured: isFeatured === "on",
      updatedAt: new Date().toISOString(),
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("Project")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Project.",
    };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { message: "Project Updated" };
}
