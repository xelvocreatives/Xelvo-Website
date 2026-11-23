import "server-only";
import { createHash } from "node:crypto";

/*
 * Minimal Cloudinary helpers (no SDK needed).
 * Files are uploaded straight from the browser with a short-lived signature
 * from the server, so large images never pass through Vercel's 4.5 MB
 * request limit.
 */

export type UploadKind = "project" | "testimonial" | "resume" | "blog" | "site";

type UploadTarget = {
  folder: string;
  /** "image" for pictures; "auto" lets Cloudinary pick image (PDF) or raw (DOC/DOCX). */
  resourceType: "image" | "auto";
  allowedFormats?: string;
  adminOnly: boolean;
};

export const UPLOAD_TARGETS: Record<UploadKind, UploadTarget> = {
  project: { folder: "xelvo/projects", resourceType: "image", adminOnly: true },
  testimonial: {
    folder: "xelvo/testimonials",
    resourceType: "image",
    adminOnly: true,
  },
  blog: { folder: "xelvo/blog", resourceType: "image", adminOnly: true },
  /** Website content images: client photos, contact picture, share images. */
  site: { folder: "xelvo/site", resourceType: "image", adminOnly: true },
  resume: {
    folder: "xelvo/resumes",
    resourceType: "auto",
    allowedFormats: "pdf,doc,docx",
    adminOnly: false,
  },
};

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not set");
  }
  return { cloudName, apiKey, apiSecret };
}

/** Cloudinary signature: SHA-1 of the sorted params plus the API secret. */
export function signParams(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== "" && params[key] !== undefined)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

/**
 * True only for files in this account's Cloudinary folder for `kind`. Stops
 * a form submission from saving an arbitrary third-party URL.
 */
export function isOwnUploadUrl(url: unknown, kind: UploadKind): url is string {
  if (typeof url !== "string") return false;
  const { cloudName } = getCloudinaryConfig();
  const prefix = `https://res.cloudinary.com/${cloudName}/`;
  return url.startsWith(prefix) && url.includes(`/${UPLOAD_TARGETS[kind].folder}/`);
}
