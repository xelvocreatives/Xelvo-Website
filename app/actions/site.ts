"use server";

import { revalidatePath } from "next/cache";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { BUILT_IN_IMAGES } from "@/lib/site/defaults";
import {
  HOME_SECTION_IDS,
  HOME_SECTION_SCHEMAS,
  SITE_DOCS,
  fieldErrors,
  homeLayoutSchema,
  pageSeoSchema,
  seoSchema,
  SEO_PAGE_IDS,
  type HomeSectionId,
  type SeoPageId,
  type SiteDocId,
} from "@/lib/site/schema";
import { siteCollection } from "@/lib/site/store";

export type SiteSaveResult = { ok: boolean; message: string; errors?: Record<string, string> };

const IMAGE_KEYS = new Set(["image", "shareImage"]);

/** Every image address inside a value must be our own upload or a built-in picture. */
function badImage(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(badImage);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value as Record<string, unknown>).some(([key, v]) =>
    IMAGE_KEYS.has(key) && typeof v === "string"
      ? v !== "" && !BUILT_IN_IMAGES.has(v) && !isOwnUploadUrl(v, "site")
      : badImage(v),
  );
}

const PAGE_PATHS: Record<SiteDocId, string[]> = {
  careers: ["/career"],
  portfolio: ["/portfolio"],
  blogPage: ["/blog"],
  // Footer, contact details and SEO appear on every page.
  site: [],
  seo: [],
};

function refresh(paths: string[]) {
  if (paths.length === 0) {
    revalidatePath("/", "layout");
  } else {
    for (const p of paths) revalidatePath(p);
  }
  revalidatePath("/admin/website", "layout");
}

const invalid = (errors: Record<string, string>): SiteSaveResult => ({
  ok: false,
  message: "Some fields need attention.",
  errors,
});

export async function saveHomeSection(id: HomeSectionId, input: unknown): Promise<SiteSaveResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  if (!HOME_SECTION_IDS.includes(id)) return { ok: false, message: "Unknown section." };

  const parsed = HOME_SECTION_SCHEMAS[id].safeParse(input);
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (badImage(parsed.data)) return { ok: false, message: "One of the images wasn't uploaded here. Please upload it again." };

  try {
    await (await siteCollection()).updateOne(
      { _id: "home" },
      { $set: { [`sections.${id}`]: parsed.data, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    console.error("saveHomeSection error:", error);
    return { ok: false, message: "Couldn’t save. Please check your connection and try again." };
  }
  refresh(["/"]);
  return { ok: true, message: "Saved. The Home page is updated." };
}

export async function saveHomeLayout(input: unknown): Promise<SiteSaveResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  const parsed = homeLayoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "That order couldn't be saved. Please refresh and try again." };

  try {
    await (await siteCollection()).updateOne(
      { _id: "home" },
      { $set: { layout: parsed.data, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    console.error("saveHomeLayout error:", error);
    return { ok: false, message: "Couldn’t save the new order. Please try again." };
  }
  refresh(["/"]);
  return { ok: true, message: "Home page updated." };
}

export async function saveSiteDoc(id: SiteDocId, input: unknown): Promise<SiteSaveResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  if (!(id in SITE_DOCS)) return { ok: false, message: "Unknown page." };

  const parsed = SITE_DOCS[id].safeParse(input);
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (badImage(parsed.data)) return { ok: false, message: "One of the images wasn't uploaded here. Please upload it again." };

  try {
    await (await siteCollection()).updateOne(
      { _id: id },
      { $set: { data: parsed.data, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    console.error("saveSiteDoc error:", error);
    return { ok: false, message: "Couldn’t save. Please check your connection and try again." };
  }
  refresh(PAGE_PATHS[id]);
  return { ok: true, message: "Saved. Your website is updated." };
}

const seoGlobalSchema = seoSchema.omit({ pages: true });

/** Site-wide SEO fields only; each page's own settings are saved separately. */
export async function saveSeoSettings(input: unknown): Promise<SiteSaveResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  const parsed = seoGlobalSchema.safeParse(input);
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (badImage(parsed.data)) return { ok: false, message: "The share picture wasn't uploaded here. Please upload it again." };

  const set: Record<string, unknown> = { updatedAt: new Date() };
  for (const [key, value] of Object.entries(parsed.data)) set[`data.${key}`] = value;
  try {
    await (await siteCollection()).updateOne({ _id: "seo" }, { $set: set }, { upsert: true });
  } catch (error) {
    console.error("saveSeoSettings error:", error);
    return { ok: false, message: "Couldn’t save. Please check your connection and try again." };
  }
  refresh([]);
  return { ok: true, message: "Saved. Google will pick this up on its next visit." };
}

/** Google title, description, share picture and visibility for one page. */
export async function savePageSeo(page: SeoPageId, input: unknown): Promise<SiteSaveResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  if (!SEO_PAGE_IDS.includes(page)) return { ok: false, message: "Unknown page." };
  const parsed = pageSeoSchema.safeParse(input);
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (badImage(parsed.data)) return { ok: false, message: "The share picture wasn't uploaded here. Please upload it again." };

  try {
    await (await siteCollection()).updateOne(
      { _id: "seo" },
      { $set: { [`data.pages.${page}`]: parsed.data, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error) {
    console.error("savePageSeo error:", error);
    return { ok: false, message: "Couldn’t save. Please check your connection and try again." };
  }
  refresh([]);
  return { ok: true, message: "Saved. Google will pick this up on its next visit." };
}
