import type { MetadataRoute } from "next";
import { getPostSitemapEntries } from "@/lib/data";
import { absoluteUrl } from "@/lib/site-url";
import { getSiteDoc } from "@/lib/site/store";
import { SEO_PAGE_IDS, SEO_PAGE_INFO, type SeoPageId } from "@/lib/site/schema";

export const dynamic = "force-dynamic";

const PAGE_HINTS: Record<SeoPageId, { changeFrequency: "daily" | "weekly" | "monthly"; priority: number }> = {
  home: { changeFrequency: "weekly", priority: 1 },
  portfolio: { changeFrequency: "weekly", priority: 0.9 },
  blog: { changeFrequency: "daily", priority: 0.8 },
  careers: { changeFrequency: "monthly", priority: 0.5 },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, seo] = await Promise.all([getPostSitemapEntries(), getSiteDoc("seo")]);
  if (!seo.allowIndexing) return [];
  const now = new Date();

  // Pages the owner hid from Google are left out.
  const pages = SEO_PAGE_IDS.filter((id) => !seo.pages[id].hidden).map((id) => ({
    url: absoluteUrl(SEO_PAGE_INFO[id].path),
    lastModified: now,
    ...PAGE_HINTS[id],
  }));

  return [
    ...pages,
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
