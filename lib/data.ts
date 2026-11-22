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
        .sort(newestFirst)
        .limit(limit)
        .toArray()
    ).map(toProject),
  );
}

export function getPortfolioProjects(): Promise<Project[]> {
  return publicRead("getPortfolioProjects", async () =>
    (
      await (await projects())
        .find({ isFeatured: false })
        .sort(newestFirst)
        .toArray()
    ).map(toProject),
  );
}

export function getLatestTestimonials(limit = 9): Promise<Testimonial[]> {
  return publicRead("getLatestTestimonials", async () =>
    (
      await (await testimonials())
        .find()
        .sort(newestFirst)
        .limit(limit)
        .toArray()
    ).map(toTestimonial),
  );
}

// --- Admin -----------------------------------------------------------------

export async function getAllProjects(): Promise<Project[]> {
  return (await (await projects()).find().sort(newestFirst).toArray()).map(
    toProject,
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return (await (await testimonials()).find().sort(newestFirst).toArray()).map(
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
