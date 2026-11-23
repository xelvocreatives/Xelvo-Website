import type { MetadataRoute } from "next";
import { getSiteDoc } from "@/lib/site/store";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/** robots.txt: follows "Let search engines show my website" in Admin → Website → SEO & Google. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSiteDoc("seo");
  if (!seo.allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
