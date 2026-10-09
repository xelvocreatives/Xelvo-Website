"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveFile } from "@/lib/file-upload";

const TestimonialSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  company: z.string().min(1, "Company is required"),
  text: z.string().min(10, "Review text must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5),
  socialPlatform: z.string().optional(),
});

export type TestimonialState = {
  errors?: {
    clientName?: string[];
    company?: string[];
    text?: string[];
    rating?: string[];
    socialPlatform?: string[];
  };
  message?: string | null;
};

export async function createTestimonial(
  prevState: TestimonialState,
  formData: FormData
) {
  const validatedFields = TestimonialSchema.safeParse({
    clientName: formData.get("clientName"),
    company: formData.get("company"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    socialPlatform: formData.get("socialPlatform"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Testimonial.",
    };
  }

  const { clientName, company, text, rating, socialPlatform } =
    validatedFields.data;

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File;
  if (imageFile) {
    imageUrl = await saveFile(imageFile);
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
    const { error } = await supabaseAdmin.from("Testimonial").insert({
      clientName,
      company,
      text,
      rating,
      socialPlatform: socialPlatform || null,
      imageUrl,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Testimonial.",
    };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { message: "Testimonial Created" };
}

export async function updateTestimonial(
  id: string,
  prevState: TestimonialState,
  formData: FormData
) {
  const validatedFields = TestimonialSchema.safeParse({
    clientName: formData.get("clientName"),
    company: formData.get("company"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    socialPlatform: formData.get("socialPlatform"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Testimonial.",
    };
  }

  const { clientName, company, text, rating, socialPlatform } =
    validatedFields.data;

  let imageUrl;
  const imageFile = formData.get("image") as File;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile);
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
    const updateData: {
      clientName: string;
      company: string;
      text: string;
      rating: number;
      socialPlatform: string | null;
      updatedAt: string;
      imageUrl?: string;
    } = {
      clientName,
      company,
      text,
      rating,
      socialPlatform: socialPlatform || null,
      updatedAt: new Date().toISOString(),
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin
      .from("Testimonial")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Testimonial.",
    };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { message: "Testimonial Updated" };
}

export async function deleteTestimonial(id: string) {
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
    const { error } = await supabaseAdmin
      .from("Testimonial")
      .delete()
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { message: "Deleted Testimonial" };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete Testimonial." };
  }
}
