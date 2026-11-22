"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { parseId, testimonials } from "@/lib/db/models";
import { applyOrder, topOrder, type Orderable } from "@/lib/db/ordering";
import type { Collection } from "mongodb";

const TestimonialSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, "Add the client's name.")
    .max(80, "Keep the name under 80 characters."),
  company: z
    .string()
    .trim()
    .min(1, "Add the client's company or brand.")
    .max(80, "Keep the company under 80 characters."),
  text: z
    .string()
    .trim()
    .min(10, "The review needs at least 10 characters.")
    .max(500, "Keep the review under 500 characters."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Choose a rating from 1 to 5 stars.")
    .max(5, "Choose a rating from 1 to 5 stars."),
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
    removeImage: formData.get("removeImage") === "1",
  };
}

function revalidateTestimonialPages() {
  revalidatePath("/admin", "layout");
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
      message: "Please fix the highlighted fields.",
    };
  }

  const { socialPlatform, ...fields } = parsed.data;

  try {
    const now = new Date();
    const col = await testimonials();
    await col.insertOne({
      _id: new ObjectId(),
      order: await topOrder(col as unknown as Collection<Orderable>),
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
      message: "Couldn’t save the testimonial. Please try again.",
    };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Testimonial added." };
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialState,
  formData: FormData,
): Promise<TestimonialState> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Testimonial not found." };

  const { parsed, imageUrl, removeImage } = readForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the highlighted fields.",
    };
  }

  const { socialPlatform, ...fields } = parsed.data;
  const newImage = isOwnUploadUrl(imageUrl, "testimonial") ? imageUrl : null;

  try {
    const result = await (await testimonials()).updateOne(
      { _id },
      {
        $set: {
          ...fields,
          socialPlatform: socialPlatform || null,
          updatedAt: new Date(),
          // Replace the photo only when a new one was uploaded, or clear it
          // when the admin removed it.
          ...(newImage ? { imageUrl: newImage } : removeImage ? { imageUrl: null } : {}),
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
      message: "Couldn’t save your changes. Please try again.",
    };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Changes saved." };
}

export async function deleteTestimonial(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Testimonial not found." };

  try {
    await (await testimonials()).deleteOne({ _id });
  } catch (error) {
    console.error("Database Error:", error);
    return { ok: false, message: "Couldn’t delete the testimonial. Please try again." };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Testimonial deleted." };
}

/** Saves the drag-and-drop arrangement: `ids` is every testimonial, in order. */
export async function reorderTestimonials(
  ids: string[],
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const parsed = ids.map(parseId);
  if (parsed.some((id) => id === null)) return { ok: false, message: "Couldn’t save the new order." };

  try {
    const outcome = await applyOrder(
      (await testimonials()) as unknown as Collection<Orderable>,
      parsed as ObjectId[],
    );
    if (outcome === "stale") {
      return { ok: false, message: "Your testimonials changed in the meantime. Refresh the page and try again." };
    }
  } catch (error) {
    console.error("Reorder error:", error);
    return { ok: false, message: "Couldn’t save the new order. Please try again." };
  }

  revalidateTestimonialPages();
  return { ok: true, message: "Order saved." };
}
