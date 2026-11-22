import "server-only";
import {
  applications,
  inquiries,
  parseId,
  projects,
  testimonials,
  toApplication,
  toInquiry,
  toProject,
  toTestimonial,
} from "@/lib/db/models";
import type { Application, Inquiry, Project, Testimonial } from "@/types";

/*
 * Every database READ in the app goes through this file.
 *
 * Public-site reads (used by the home page and /projects) never throw: if the
 * database is unreachable they log and return an empty list, so a database
 * outage can't take the marketing site down. This is also where a fallback
 * snapshot can be plugged in later.
 *
 * Admin reads throw on failure; app/admin/error.tsx shows the error.
 */

const newestFirst = { createdAt: -1 } as const;
// Projects and testimonials follow the order the admin arranged (drag and
// drop); items never arranged fall back to newest first.
const arranged = { order: 1, createdAt: -1 } as const;

async function publicRead<T>(label: string, read: () => Promise<T[]>) {
  try {
    return await read();
  } catch (error) {
    console.error(`[data] ${label} failed:`, error);
    return [] as T[];
  }
}

// --- Public site -----------------------------------------------------------

export function getFeaturedProjects(limit = 4): Promise<Project[]> {
  return publicRead("getFeaturedProjects", async () =>
    (
      await (await projects())
        .find({ isFeatured: true })
        .sort(arranged)
        .limit(limit)
        .toArray()
    ).map(toProject),
  );
}

export function getLatestTestimonials(limit = 9): Promise<Testimonial[]> {
  return publicRead("getLatestTestimonials", async () =>
    (
      await (await testimonials())
        .find()
        .sort(arranged)
        .limit(limit)
        .toArray()
    ).map(toTestimonial),
  );
}

// --- Admin -----------------------------------------------------------------

export async function getAllProjects(): Promise<Project[]> {
  return (await (await projects()).find().sort(arranged).toArray()).map(
    toProject,
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return (await (await testimonials()).find().sort(arranged).toArray()).map(
    toTestimonial,
  );
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  return (await (await inquiries()).find().sort(newestFirst).toArray()).map(
    toInquiry,
  );
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const _id = parseId(id);
  if (!_id) return null;
  const doc = await (await inquiries()).findOne({ _id });
  return doc ? toInquiry(doc) : null;
}

export async function getAllApplications(): Promise<Application[]> {
  return (
    await (await applications()).find().sort(newestFirst).toArray()
  ).map(toApplication);
}

export async function getApplication(id: string): Promise<Application | null> {
  const _id = parseId(id);
  if (!_id) return null;
  const doc = await (await applications()).findOne({ _id });
  return doc ? toApplication(doc) : null;
}

export async function getDashboardData() {
  const [p, t, i, a] = await Promise.all([
    projects(),
    testimonials(),
    inquiries(),
    applications(),
  ]);

  const [
    projectCount,
    testimonialCount,
    inquiryCount,
    applicationCount,
    recentInquiries,
    recentApplications,
  ] = await Promise.all([
    p.countDocuments(),
    t.countDocuments(),
    i.countDocuments(),
    a.countDocuments(),
    i.find().sort(newestFirst).limit(3).toArray(),
    a.find().sort(newestFirst).limit(3).toArray(),
  ]);

  return {
    projectCount,
    testimonialCount,
    inquiryCount,
    applicationCount,
    recentInquiries: recentInquiries.map(toInquiry),
    recentApplications: recentApplications.map(toApplication),
  };
}

/** Leads and job applications still marked "new", newest first. */
export async function getNeedsReply(limit = 12) {
  const [i, a] = await Promise.all([inquiries(), applications()]);
  const [leads, apps] = await Promise.all([
    i.find({ status: "new" }).sort(newestFirst).limit(limit).toArray(),
    a.find({ status: "new" }).sort(newestFirst).limit(limit).toArray(),
  ]);
  return { leads: leads.map(toInquiry), applications: apps.map(toApplication) };
}

/** Counts for the admin navigation badges. Never throws. */
export async function getAdminCounts() {
  try {
    const [i, a] = await Promise.all([inquiries(), applications()]);
    const [newLeads, newApplications] = await Promise.all([
      i.countDocuments({ status: "new" }),
      a.countDocuments({ status: "new" }),
    ]);
    return { newLeads, newApplications };
  } catch (error) {
    console.error("[data] getAdminCounts failed:", error);
    return { newLeads: 0, newApplications: 0 };
  }
}

/**
 * Everything the Portfolio page shows: home-page (featured) projects first in
 * the admin's order, then the rest. Never throws.
 */
export function getPortfolioProjects(): Promise<Project[]> {
  return publicRead("getPortfolioProjects", async () => {
    const all = (await (await projects()).find().sort(arranged).toArray()).map(toProject);
    return [...all.filter((p) => p.isFeatured), ...all.filter((p) => !p.isFeatured)];
  });
}
