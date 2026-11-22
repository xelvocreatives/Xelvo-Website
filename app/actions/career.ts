"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { applications, parseId } from "@/lib/db/models";

export type FormState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

const ApplicationSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().min(1),
  position: z.string().trim().min(1),
  experience: z.string().trim().min(1),
  locationType: z.enum(["remote", "onsite"]),
  locationDetail: z.string().trim().optional(),
  bio: z.string().trim().min(1),
  motivation: z.string().trim().min(1),
});

export async function submitApplication(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = ApplicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    position: formData.get("position"),
    experience: formData.get("experience"),
    locationType: formData.get("locationType"),
    locationDetail: formData.get("locationDetail") ?? undefined,
    bio: formData.get("bio"),
    motivation: formData.get("motivation"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fill in all required fields correctly.",
      message: null,
    };
  }

  // Set by the form after the browser uploads the CV to Cloudinary.
  const resumeUrl = formData.get("resumeUrl");
  if (!isOwnUploadUrl(resumeUrl, "resume")) {
    return {
      success: false,
      error: "Please upload your resume.",
      message: null,
    };
  }

  const { bio, motivation, locationDetail, ...fields } = parsed.data;

  // AI Insight Generation (Simulated)
  let aiInsight = "Standard application review needed.";
  const lowerBio = bio.toLowerCase();
  const lowerMotiv = motivation.toLowerCase();

  if (
    lowerBio.includes("expert") ||
    lowerBio.includes("senior") ||
    lowerBio.includes("lead")
  ) {
    aiInsight =
      "🚀 High Potential: Candidate mentions senior-level expertise. Priority: HIGH.";
  } else if (
    lowerMotiv.includes("passion") ||
    lowerMotiv.includes("mission") ||
    lowerMotiv.includes("values")
  ) {
    aiInsight =
      "✨ Value Matched: Candidate shows strong alignment with agency culture.";
  }

  try {
    const now = new Date();
    await (await applications()).insertOne({
      _id: new ObjectId(),
      ...fields,
      locationDetail: locationDetail || null,
      resumeUrl,
      bio,
      motivation,
      status: "new",
      aiInsight,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error:
        "We couldn't save your application right now. Please try again, or email it to hello@xelvocreatives.com.",
      message: null,
    };
  }

  revalidatePath("/admin/careers");
  revalidatePath("/admin");
  return {
    success: true,
    message: "Application submitted successfully!",
    error: null,
  };
}

const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "rejected",
  "hired",
] as const;

export async function updateApplicationStatus(id: string, status: string) {
  if (!(await isAdmin())) return { success: false, error: UNAUTHORIZED };

  const _id = parseId(id);
  const nextStatus = APPLICATION_STATUSES.find((s) => s === status);
  if (!_id || !nextStatus) {
    return { success: false, error: "Invalid application or status." };
  }

  try {
    await (await applications()).updateOne(
      { _id },
      { $set: { status: nextStatus, updatedAt: new Date() } },
    );
  } catch (error) {
    console.error("Status update error:", error);
    return { success: false, error: "Failed to update status." };
  }

  revalidatePath(`/admin/careers/${id}`);
  revalidatePath("/admin/careers");
  return { success: true };
}
