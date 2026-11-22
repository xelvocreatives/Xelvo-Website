"use server";

import { ObjectId } from "mongodb";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { inquiries, parseId } from "@/lib/db/models";
import { revalidatePath } from "next/cache";

const InquirySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export type InquiryFormState = {
  success: boolean;
  error: string | null;
  message: string | null;
};

export async function submitInquiry(
  prevState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  try {
    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    const result = InquirySchema.safeParse(rawData);

    if (!result.success) {
      return {
        success: false,
        error: "Please fill in all required fields correctly.",
        message: null,
      };
    }

    const { firstName, lastName, email, phone, company, service, message } =
      result.data;

    // --- Advanced AI Business Insights ---
    let aiInsight = "Standard lead review.";
    const lowerMsg = message.toLowerCase();
    const lowerService = service?.toLowerCase() || "";

    if (
      lowerMsg.includes("urgent") ||
      lowerMsg.includes("immediately") ||
      lowerMsg.includes("asap")
    ) {
      aiInsight =
        "🚨 High Priority: Client mentioned urgency. Immediate follow-up recommended.";
    } else if (
      lowerMsg.includes("budget") ||
      lowerMsg.includes("investment") ||
      lowerMsg.includes("pricing")
    ) {
      aiInsight =
        "💰 Commercial Intent: Client is interested in pricing details.";
    } else if (lowerService.includes("shariah") || lowerMsg.includes("halal")) {
      aiInsight =
        "☪️ Value Aligned: Client specifically values Shariah-compliant design.";
    } else if (company && company.length > 3) {
      aiInsight = "🏢 B2B Lead: Inquiry from a potential corporate client.";
    }

    const now = new Date();
    await (await inquiries()).insertOne({
      _id: new ObjectId(),
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || null,
      company: company || null,
      service: service || "General Inquiry",
      message: message,
      aiInsight,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin/inquiries");
    return {
      success: true,
      message:
        "Your inquiry has been received! Our team will reach out to you shortly.",
      error: null,
    };
  } catch (error) {
    console.error("Submission error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
      message: null,
    };
  }
}

const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "rejected",
] as const;

export async function updateInquiryStatus(id: string, status: string) {
  if (!(await isAdmin())) return { success: false, error: UNAUTHORIZED };

  const _id = parseId(id);
  const nextStatus = INQUIRY_STATUSES.find((s) => s === status);
  if (!_id || !nextStatus) {
    return { success: false, error: "Invalid inquiry or status." };
  }

  try {
    await (await inquiries()).updateOne(
      { _id },
      { $set: { status: nextStatus, updatedAt: new Date() } },
    );

    revalidatePath(`/admin/inquiries/${id}`);
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Status update error:", error);
    return { success: false, error: "Failed to update inquiry status." };
  }
}
