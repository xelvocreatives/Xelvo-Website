import "server-only";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { SEO_PAGE_INFO, SOCIAL_KEYS, type SeoPageId } from "./schema";
import { getSiteDoc } from "./store";

/*
 * Turns the SEO settings from Admin → Website into Next.js metadata, so the
 * title, description, share picture and indexing rules are in the HTML that
 * Google and social networks read (no client-side tricks).
 */

const handle = (h: string) => (h ? (h.startsWith("@") ? h : `@${h}`) : undefined);

/** Site-wide defaults, set once in the root layout. */
export async function siteMetadata(): Promise<Metadata> {
  const seo = await getSiteDoc("seo");
  let base: URL | undefined;
  try {
    base = new URL(absoluteUrl("/"));
  } catch {
    base = undefined;
  }
  return {
    metadataBase: base,
    title: seo.siteName,
    description: seo.defaultDescription,
    applicationName: seo.siteName,
    robots: seo.allowIndexing ? undefined : { index: false, follow: false },
    openGraph: {
      siteName: seo.siteName,
      type: "website",
      locale: "en_US",
      images: seo.shareImage ? [{ url: seo.shareImage }] : undefined,
    },
    twitter: {
      card: seo.shareImage ? "summary_large_image" : "summary",
      site: handle(seo.twitterHandle),
      images: seo.shareImage ? [seo.shareImage] : undefined,
    },
    verification: {
      google: seo.googleVerification || undefined,
      other: seo.bingVerification ? { "msvalidate.01": seo.bingVerification } : undefined,
    },
  };
}

/** Title, description, share picture and indexing for one main page. */
export async function pageMetadata(page: SeoPageId): Promise<Metadata> {
  const seo = await getSiteDoc("seo");
  const p = seo.pages[page];
  const path = SEO_PAGE_INFO[page].path;
  const image = p.shareImage || seo.shareImage;
  const hidden = p.hidden || !seo.allowIndexing;
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: p.keywords.length ? p.keywords : undefined,
    alternates: { canonical: path },
    robots: hidden ? { index: false, follow: !p.hidden } : undefined,
    openGraph: {
      type: "website",
      url: path,
      siteName: seo.siteName,
      title: p.title,
      description: p.description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      site: handle(seo.twitterHandle),
      title: p.title,
      description: p.description,
      images: image ? [image] : undefined,
    },
  };
}

/** Organisation details for Google's knowledge panel (JSON-LD). */
export async function organizationJsonLd() {
  const [seo, site] = await Promise.all([getSiteDoc("seo"), getSiteDoc("site")]);
  const sameAs = SOCIAL_KEYS.map((k) => site.socials[k]).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: seo.siteName,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/images/brand-logo.png"),
        description: seo.defaultDescription,
        email: site.email || undefined,
        telephone: site.phone || undefined,
        address: site.address ? { "@type": "PostalAddress", addressLocality: site.address } : undefined,
        sameAs: sameAs.length ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: seo.siteName,
        url: absoluteUrl("/"),
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };
}
