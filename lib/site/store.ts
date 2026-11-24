import "server-only";
import { cache } from "react";
import { z } from "zod";
import { getDb } from "@/lib/db/mongo";
import { DEFAULT_DOCS, DEFAULT_HOME, DEFAULT_HOME_LAYOUT } from "./defaults";
import {
  HOME_SECTION_IDS,
  HOME_SECTION_SCHEMAS,
  SITE_DOCS,
  type HomeLayout,
  type HomeSections,
  type SiteDocId,
  type SiteDocs,
} from "./schema";

/*
 * Reads and writes the owner's website content (collection `site_content`).
 *
 *   { _id: "home", layout: [...], sections: { hero: {...}, ... } }
 *   { _id: "careers" | "portfolio" | "blogPage" | "site" | "seo", data: {...} }
 *
 * Reads never throw: if the database is unreachable or a block is damaged,
 * the built-in default is used, so the public site always renders.
 */

export const SITE_COLLECTION = "site_content";

type StoredHome = { _id: "home"; layout?: unknown; sections?: Record<string, unknown>; updatedAt?: Date };
type StoredDoc = { _id: SiteDocId; data?: unknown; updatedAt?: Date };
type Stored = StoredHome | StoredDoc;

export async function siteCollection() {
  return (await getDb()).collection<Stored>(SITE_COLLECTION);
}

/** One small query per request, shared by metadata and page rendering. */
const loadAll = cache(async (): Promise<Map<string, Stored>> => {
  try {
    const docs = await (await siteCollection()).find({}).toArray();
    return new Map(docs.map((d) => [d._id, d]));
  } catch (error) {
    console.error("[site] content read failed, using defaults:", error);
    return new Map();
  }
});

/**
 * Keeps every valid part of a saved value and falls back to the default only
 * where something is missing or broken, field by field.
 */
function withFallback<T>(schema: z.ZodTypeAny, saved: unknown, fallback: T): T {
  if (saved === undefined || saved === null) return fallback;
  const whole = schema.safeParse(saved);
  if (whole.success) return whole.data as T;

  if (
    schema instanceof z.ZodObject &&
    typeof saved === "object" &&
    !Array.isArray(saved) &&
    fallback &&
    typeof fallback === "object"
  ) {
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    const merged: Record<string, unknown> = {};
    for (const key of Object.keys(shape)) {
      merged[key] = withFallback(shape[key], (saved as Record<string, unknown>)[key], (fallback as Record<string, unknown>)[key]);
    }
    const again = schema.safeParse(merged);
    if (again.success) return again.data as T;
  }
  return fallback;
}

/** Saved order, repaired so every known section appears exactly once. */
function repairLayout(saved: unknown): HomeLayout {
  const parsed = z.array(z.object({ id: z.string(), visible: z.boolean() })).safeParse(saved);
  if (!parsed.success) return DEFAULT_HOME_LAYOUT;
  const known = new Set<string>(HOME_SECTION_IDS);
  const seen = new Set<string>();
  const rows: HomeLayout = [];
  for (const row of parsed.data) {
    if (known.has(row.id) && !seen.has(row.id)) {
      seen.add(row.id);
      rows.push(row as HomeLayout[number]);
    }
  }
  // Sections added to the site later appear at their default position.
  for (const id of HOME_SECTION_IDS) if (!seen.has(id)) rows.push({ id, visible: true });
  return rows;
}

export async function getHomeContent(): Promise<{ layout: HomeLayout; sections: HomeSections; updatedAt: string | null }> {
  const home = (await loadAll()).get("home") as StoredHome | undefined;
  const saved = home?.sections ?? {};
  const sections = Object.fromEntries(
    HOME_SECTION_IDS.map((id) => [id, withFallback(HOME_SECTION_SCHEMAS[id], saved[id], DEFAULT_HOME[id])]),
  ) as HomeSections;
  return {
    layout: repairLayout(home?.layout),
    sections,
    updatedAt: home?.updatedAt ? home.updatedAt.toISOString() : null,
  };
}

export async function getSiteDoc<K extends SiteDocId>(id: K): Promise<SiteDocs[K]> {
  const doc = (await loadAll()).get(id) as StoredDoc | undefined;
  return withFallback(SITE_DOCS[id], doc?.data, DEFAULT_DOCS[id]);
}

/** Saved-at times for the admin overview ("Last changed …"). */
export async function getSiteUpdatedTimes(): Promise<Record<string, string | null>> {
  const all = await loadAll();
  return Object.fromEntries(
    ["home", ...Object.keys(SITE_DOCS)].map((id) => [id, all.get(id)?.updatedAt?.toISOString() ?? null]),
  );
}
