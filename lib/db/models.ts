import "server-only";
import { ObjectId, type Collection } from "mongodb";
import { getDb } from "./mongo";
import type { Application, Inquiry, Post, PostSummary, Project, Testimonial } from "@/types";

/*
 * Stored document shapes. Dates are real Date objects in MongoDB; the mappers
 * below convert them to ISO strings so the rest of the app keeps using the
 * plain types in types/index.ts.
 */

type Timestamps = { createdAt: Date; updatedAt: Date };

/** Old Supabase UUID, kept on migrated documents so the copy script is re-runnable. */
type Legacy = { legacyId?: string };

// `images` is optional in storage: projects saved before galleries existed only
// have `imageUrl`, which toProject() turns into a one-image gallery.
export type ProjectDoc = Omit<Project, "id" | "createdAt" | "updatedAt" | "images"> &
  Timestamps &
  Legacy & { _id: ObjectId; images?: string[] };

export type TestimonialDoc = Omit<
  Testimonial,
  "id" | "createdAt" | "updatedAt"
> &
  Timestamps &
  Legacy & { _id: ObjectId };

export type InquiryDoc = Omit<Inquiry, "id" | "createdAt" | "updatedAt"> &
  Timestamps &
  Legacy & { _id: ObjectId };

export type ApplicationDoc = Omit<
  Application,
  "id" | "createdAt" | "updatedAt"
> &
  Timestamps &
  Legacy & { _id: ObjectId };

// publishedAt is a Date in storage (null for never-published drafts).
export type PostDoc = Omit<Post, "id" | "createdAt" | "updatedAt" | "publishedAt"> &
  Timestamps & { _id: ObjectId; publishedAt: Date | null };

export const COLLECTIONS = {
  posts: "posts",
  projects: "projects",
  testimonials: "testimonials",
  inquiries: "inquiries",
  applications: "applications",
} as const;

export async function projects(): Promise<Collection<ProjectDoc>> {
  return (await getDb()).collection<ProjectDoc>(COLLECTIONS.projects);
}
export async function posts(): Promise<Collection<PostDoc>> {
  return (await getDb()).collection<PostDoc>(COLLECTIONS.posts);
}
export async function testimonials(): Promise<Collection<TestimonialDoc>> {
  return (await getDb()).collection<TestimonialDoc>(COLLECTIONS.testimonials);
}
export async function inquiries(): Promise<Collection<InquiryDoc>> {
  return (await getDb()).collection<InquiryDoc>(COLLECTIONS.inquiries);
}
export async function applications(): Promise<Collection<ApplicationDoc>> {
  return (await getDb()).collection<ApplicationDoc>(COLLECTIONS.applications);
}

/** Parses a route/form id. Returns null for anything that isn't a valid ObjectId. */
export function parseId(id: string): ObjectId | null {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id
    ? new ObjectId(id)
    : null;
}

function serialize<T extends { _id: ObjectId } & Timestamps & Legacy>(doc: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, createdAt, updatedAt, legacyId, ...rest } = doc;
  return {
    ...rest,
    id: _id.toHexString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

export const toProject = (doc: ProjectDoc): Project => {
  const images = doc.images?.length ? doc.images : doc.imageUrl ? [doc.imageUrl] : [];
  return { ...serialize(doc), images, imageUrl: images[0] ?? null };
};
export const toTestimonial = (doc: TestimonialDoc): Testimonial =>
  serialize(doc);
export const toInquiry = (doc: InquiryDoc): Inquiry => serialize(doc);
export const toApplication = (doc: ApplicationDoc): Application =>
  serialize(doc);

export const toPost = (doc: PostDoc): Post => ({
  ...serialize(doc),
  publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
});

/** Fields needed for lists and cards (skips the article body). */
export const POST_SUMMARY_PROJECTION = {
  content: 0,
  contentHtml: 0,
  headings: 0,
  seoTitle: 0,
  seoDescription: 0,
} as const;

export const toPostSummary = (doc: Omit<PostDoc, "content" | "contentHtml" | "headings" | "seoTitle" | "seoDescription">): PostSummary => ({
  id: doc._id.toHexString(),
  title: doc.title,
  slug: doc.slug,
  excerpt: doc.excerpt,
  coverImage: doc.coverImage,
  coverAlt: doc.coverAlt,
  category: doc.category,
  tags: doc.tags ?? [],
  author: doc.author,
  readingMinutes: doc.readingMinutes,
  status: doc.status,
  publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
  createdAt: doc.createdAt.toISOString(),
  updatedAt: doc.updatedAt.toISOString(),
});
