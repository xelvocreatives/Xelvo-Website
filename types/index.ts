export interface Project {
  id: string;
  title: string;
  description: string;
  /** Cover image (always images[0]); kept for older code paths. */
  imageUrl: string | null;
  /** Every image of the project in display order; the first is the cover. */
  images: string[];
  category: string;
  isFeatured: boolean;
  /** Position chosen by the admin (lower = earlier). Missing on never-arranged data. */
  order?: number;
  createdAt: string; // ISO string (stored as a Date in MongoDB)
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  text: string;
  socialPlatform: string | null;
  socialLink: string | null;
  imageUrl: string | null;
  /** Position chosen by the admin (lower = earlier). Missing on never-arranged data. */
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface Application {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  position: string;
  experience: string;
  locationType: "remote" | "onsite";
  locationDetail: string | null;
  resumeUrl: string;
  bio: string;
  motivation: string;
  status: "new" | "reviewing" | "contacted" | "rejected" | "hired";
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = "draft" | "published";

export interface PostHeading {
  id: string;
  text: string;
  level: number;
}

/** A blog article. "Scheduled" = published with a publishedAt in the future. */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** True when the summary was generated from the body, not written by the author. */
  excerptAuto?: boolean;
  coverImage: string | null;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  /** Tiptap JSON document (the editable source). */
  content: Record<string, unknown>;
  /** Server-rendered, sanitised HTML built from `content` on save. */
  contentHtml: string;
  headings: PostHeading[];
  readingMinutes: number;
  status: PostStatus;
  publishedAt: string | null;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

/** List/card view of a post (no body). */
export type PostSummary = Pick<
  Post,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "coverImage"
  | "coverAlt"
  | "category"
  | "tags"
  | "author"
  | "readingMinutes"
  | "status"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
>;
