"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { parseId, testimonials } from "@/lib/db/models";

const TestimonialSchema = z.object({
  clientName: z.string().trim().min(1, "Client Name is required"),
  company: z.string().trim().min(1, "Company is required"),
  text: z.string().trim().min(10, "Review text must be at least 10 characters"),
  rating: z.coerce.number().min(1).max(5),
  socialPlatform: z.string().optional(),
});

export type TestimonialState = {
  ok?: boolean;
  errors?: {
    clientName?: string[];
    company?: string[];
    text?: string[];
    rating?: string[];
    socialPlatform?: string[];
  };
  message?: string | null;
};

function readForm(formData: FormData) {
  return {
    parsed: TestimonialSchema.safeParse({
      clientName: formData.get("clientName"),
      company: formData.get("company"),
      text: formData.get("text"),
      rating: formData.get("rating"),
      socialPlatform: formData.get("socialPlatform") ?? undefined,
    }),
    // Set by the form after the browser uploads the photo to Cloudinary.
    imageUrl: formData.get("imageUrl"),
  };
}

function revalidateTestimonialPages() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createTestimonial(
  _prevState: TestimonialState,
  formData: FormData,
): Promise<TestimonialState> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const { parsed, imageUrl } = readForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Testimonial.",
    };
  }

  const { socialPlatform, ...fields } = parsed.data;

  try {
    const now = new Date();
    await (await testimonials()).insertOne({
      _id: new ObjectId(),
      ...fields,
      socialPlatform: socialPlatform || null,
      socialLink: null,
      imageUrl: isOwnUploadUrl(imageUrl, "testimonial") ? imageUrl : null,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      ok: false,
      message: "Database Error: Failed to Create Testimonial.",
    };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Testimonial Created" };
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialState,
  formData: FormData,
): Promise<TestimonialState> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Testimonial not found." };

  const { parsed, imageUrl } = readForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Testimonial.",
    };
  }

  const { socialPlatform, ...fields } = parsed.data;

  try {
    const result = await (await testimonials()).updateOne(
      { _id },
      {
        $set: {
          ...fields,
          socialPlatform: socialPlatform || null,
          updatedAt: new Date(),
          // Only replace the photo when a new one was uploaded.
          ...(isOwnUploadUrl(imageUrl, "testimonial") ? { imageUrl } : {}),
        },
      },
    );
    if (result.matchedCount === 0) {
      return { ok: false, message: "Testimonial not found." };
    }
  } catch (error) {
    console.error("Database Error:", error);
    return {
      ok: false,
      message: "Database Error: Failed to Update Testimonial.",
    };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Testimonial Updated" };
}

export async function deleteTestimonial(id: string) {
  if (!(await isAdmin())) return { message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { message: "Testimonial not found." };

  try {
    await (await testimonials()).deleteOne({ _id });
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete Testimonial." };
  }

  revalidateTestimonialPages();
  return { message: "Deleted Testimonial" };
}
