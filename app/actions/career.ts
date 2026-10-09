"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export type FormState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export async function submitApplication(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const locationType = formData.get("locationType") as "remote" | "onsite";
    const locationDetail = formData.get("locationDetail") as string;
    const bio = formData.get("bio") as string;
    const motivation = formData.get("motivation") as string;
    const resumeFile = formData.get("resume") as File;

    if (!resumeFile) throw new Error("Resume is required");

    const supabaseAdmin = createAdminClient();

    // 1. Upload Resume to Storage
    const fileExt = resumeFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("resumes")
      .upload(filePath, resumeFile);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("resumes").getPublicUrl(filePath);

    // 2. AI Insight Generation (Simulated)
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

    // 3. Save to Database
    const { error: dbError } = await supabaseAdmin.from("Application").insert({
      fullName,
      email,
      whatsapp,
      position,
      experience,
      locationType,
      locationDetail,
      resumeUrl: publicUrl,
      bio,
      motivation,
      status: "new",
      aiInsight,
    });

    if (dbError) throw dbError;

    revalidatePath("/admin/careers");
    return {
      success: true,
      message: "Application submitted successfully!",
      error: null,
    };
  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error: "Failed to submit application. Please try again.",
      message: null,
    };
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  try {
    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("Application")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/admin/careers/${id}`);
    revalidatePath("/admin/careers");
    return { success: true };
  } catch (error) {
    console.error("Status update error:", error);
    return { success: false, error: "Failed to update status." };
  }
}
