import { z } from "zod";

/*
 * Website content that the owner edits in Admin → Website.
 *
 * Shared by the admin forms (browser) and the server: the same schemas
 * validate what the owner types and what the public pages read back. Every
 * block has a default equal to the text the site shipped with, so the site
 * looks identical until something is changed, and a missing or damaged block
 * quietly falls back to its default.
 */

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

/** Web links the owner may use: on-page anchors, site paths, web, email, phone. */
export const LINK_PATTERN = /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+|\/(?!\/)[^\s]*|#[\w-]*)$/i;

const text = (max: number, label = "This") =>
  z.string().trim().max(max, `${label} can be up to ${max} characters.`);
const required = (max: number, label = "This") => text(max, label).min(1, `${label} can't be empty.`);

const link = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || LINK_PATTERN.test(v), "Use a web address (https://…), a page path (/portfolio) or a section link (#contact).");

/** Image address. The server also checks it is our own upload or a built-in default. */
const image = z.string().trim().max(600);

/** A line of text where one part shows in the orange gradient. */
export const highlightedSchema = z
  .object({
    text: required(300, "The text"),
    highlight: text(120, "The highlighted part"),
  })
  .refine((v) => !v.highlight || v.text.includes(v.highlight), {
    message: "The orange words must appear exactly as written in the text above.",
    path: ["highlight"],
  });
export type Highlighted = z.infer<typeof highlightedSchema>;

const ctaSchema = z.object({ label: required(60, "Button text"), href: link });
export type Cta = z.infer<typeof ctaSchema>;

const personSchema = z.object({
  name: required(60, "Name"),
  role: text(60, "Role"),
  image: image.min(1, "Add a photo."),
});
export type Person = z.infer<typeof personSchema>;

const list = <T extends z.ZodTypeAny>(item: T, min: number, max: number, label: string) =>
  z
    .array(item)
    .min(min, min === 1 ? `Add at least one ${label}.` : `Add at least ${min} ${label}s.`)
    .max(max, `You can add up to ${max} ${label}s.`);

/* ------------------------------------------------------------------ */
/* Home page sections                                                  */
/* ------------------------------------------------------------------ */

export const HOME_SECTION_IDS = [
  "hero",
  "metrics",
  "about",
  "services",
  "framework",
  "featured",
  "testimonials",
  "blog",
  "faq",
  "cta",
  "contact",
] as const;
export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

/** Names and one-line explanations the owner sees in the admin. */
export const HOME_SECTION_INFO: Record<HomeSectionId, { name: string; about: string; anchor?: string }> = {
  hero: { name: "Hero", about: "The first thing visitors see: headline, button and client photos." },
  metrics: { name: "Numbers", about: "The three big counters, like “50+ Satisfied Brands”." },
  about: { name: "About us", about: "“More than just designers” with your key points.", anchor: "about" },
  services: { name: "Services", about: "Your service cards and the button under them.", anchor: "services" },
  framework: { name: "Our process", about: "The four-phase framework with numbered steps.", anchor: "framework" },
  featured: { name: "Featured projects", about: "Heading for the projects you mark as featured.", anchor: "featured" },
  testimonials: { name: "Testimonials", about: "Heading and rating line above the client reviews.", anchor: "testimonials" },
  blog: { name: "Latest from the blog", about: "Your three newest articles. Hidden until one is published.", anchor: "blog" },
  faq: { name: "Questions & answers", about: "The questions visitors often ask.", anchor: "faq" },
  cta: { name: "Big call to action", about: "The large orange “Ready to work with us?” banner." },
  contact: { name: "Contact form", about: "Heading, service choices and picture next to the form.", anchor: "contact" },
};

export const heroSchema = z.object({
  badge: required(60, "Badge text"),
  title: highlightedSchema,
  subtitle: highlightedSchema,
  cta: ctaSchema,
  trustText: highlightedSchema,
  people: list(personSchema, 0, 5, "photo"),
});

export const metricsSchema = z.object({
  items: list(
    z.object({
      value: z.number({ message: "Enter a number." }).min(0, "Use 0 or more.").max(1_000_000, "That number is too big."),
      prefix: text(4, "Before the number"),
      suffix: text(6, "After the number"),
      label: required(40, "Label"),
    }),
    1,
    4,
    "number",
  ),
});

export const aboutSchema = z.object({
  badge: required(80, "Badge text"),
  people: list(personSchema, 0, 5, "photo"),
  title: highlightedSchema,
  description: required(600, "Description"),
  points: list(required(40, "Point"), 0, 6, "point"),
});

export const servicesSchema = z.object({
  title: highlightedSchema,
  cards: list(
    z.object({
      title: required(60, "Card title"),
      description: required(240, "Card description"),
      features: list(required(40, "Feature"), 0, 6, "feature"),
    }),
    1,
    6,
    "service",
  ),
  /** Card shown in its white “selected” style; -1 for none. */
  featuredCard: z.number().int().min(-1).max(5),
  outro: text(120, "Text above the button"),
  cta: ctaSchema,
});

export const frameworkSchema = z.object({
  title: highlightedSchema,
  description: required(300, "Description"),
  phases: list(
    z.object({
      title: required(40, "Phase name"),
      steps: list(required(40, "Step"), 1, 8, "step"),
    }),
    1,
    4,
    "phase",
  ),
});

export const featuredSchema = z.object({
  title: highlightedSchema,
  description: required(300, "Description"),
  count: z.number().int().min(1).max(8),
  ctaCard: z.object({
    show: z.boolean(),
    title: required(60, "Card title"),
    description: required(120, "Card text"),
  }),
});

export const testimonialsSchema = z.object({
  label: required(30, "Small label"),
  title: required(80, "Heading"),
  subtitle: text(120, "Line under the heading"),
  count: z.number().int().min(1).max(12),
  rating: z.object({
    show: z.boolean(),
    title: required(60, "Rating line"),
    subtitle: text(60, "Second line"),
  }),
});

export const blogSectionSchema = z.object({
  title: highlightedSchema,
  description: text(200, "Description"),
  buttonLabel: required(40, "Button text"),
});

export const faqSchema = z.object({
  title: required(100, "Heading"),
  description: text(240, "Description"),
  items: list(
    z.object({ question: required(160, "Question"), answer: required(1200, "Answer") }),
    1,
    20,
    "question",
  ),
});

export const ctaBannerSchema = z.object({
  title: required(60, "Banner text"),
  href: link,
});

export const contactSchema = z.object({
  title: required(100, "Heading"),
  description: text(300, "Description"),
  services: list(required(60, "Service"), 1, 12, "service"),
  submitLabel: required(50, "Button text"),
  image: image,
  imageAlt: text(160, "Image description"),
});

export const HOME_SECTION_SCHEMAS = {
  hero: heroSchema,
  metrics: metricsSchema,
  about: aboutSchema,
  services: servicesSchema,
  framework: frameworkSchema,
  featured: featuredSchema,
  testimonials: testimonialsSchema,
  blog: blogSectionSchema,
  faq: faqSchema,
  cta: ctaBannerSchema,
  contact: contactSchema,
} satisfies Record<HomeSectionId, z.ZodTypeAny>;

export type HomeSections = { [K in HomeSectionId]: z.infer<(typeof HOME_SECTION_SCHEMAS)[K]> };

export const homeLayoutSchema = z
  .array(z.object({ id: z.enum(HOME_SECTION_IDS), visible: z.boolean() }))
  .length(HOME_SECTION_IDS.length)
  .refine((rows) => new Set(rows.map((r) => r.id)).size === rows.length, "Each section can appear once.");
export type HomeLayout = z.infer<typeof homeLayoutSchema>;

/* ------------------------------------------------------------------ */
/* Other pages                                                         */
/* ------------------------------------------------------------------ */

export const VALUE_ICONS = ["lightbulb", "ruler", "target", "heart", "sparkles", "users", "shield", "rocket"] as const;
export type ValueIcon = (typeof VALUE_ICONS)[number];
export const VALUE_ICON_NAMES: Record<ValueIcon, string> = {
  lightbulb: "Light bulb",
  ruler: "Ruler",
  target: "Target",
  heart: "Heart",
  sparkles: "Sparkles",
  users: "People",
  shield: "Shield",
  rocket: "Rocket",
};

export const careersSchema = z.object({
  hero: z.object({
    badge: required(60, "Badge text"),
    title: highlightedSchema,
    description: required(600, "Description"),
    ctaLabel: required(50, "Button text"),
  }),
  values: z.object({
    show: z.boolean(),
    title: required(60, "Heading"),
    items: list(
      z.object({ title: required(60, "Value"), description: required(240, "Description"), icon: z.enum(VALUE_ICONS) }),
      1,
      8,
      "value",
    ),
  }),
  form: z.object({
    title: required(60, "Heading"),
    description: text(200, "Description"),
    privacy: text(400, "Privacy note"),
    submitLabel: required(40, "Button text"),
    successTitle: required(60, "Thank-you heading"),
    successMessage: required(400, "Thank-you message"),
  }),
});

export const portfolioPageSchema = z.object({
  title: highlightedSchema,
  description: text(200, "Description"),
});

export const blogPageSchema = z.object({
  title: highlightedSchema,
  description: text(200, "Description"),
});

/* ------------------------------------------------------------------ */
/* Contact details & social links (footer, contact info, Google)       */
/* ------------------------------------------------------------------ */

export const SOCIAL_KEYS = ["facebook", "instagram", "linkedin", "behance", "pinterest", "x", "youtube", "tiktok"] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];
export const SOCIAL_NAMES: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  behance: "Behance",
  pinterest: "Pinterest",
  x: "X (Twitter)",
  youtube: "YouTube",
  tiktok: "TikTok",
};

const webUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), "Use the full address, starting with https://");

export const siteSchema = z.object({
  footerText: required(240, "Footer text"),
  phone: text(40, "Phone"),
  whatsapp: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g, "")), "Use digits only, with the country code, like +923190504566."),
  email: z.union([z.literal(""), z.string().trim().email("That email address doesn't look right.").max(120)]),
  address: text(120, "Address"),
  mapUrl: webUrl,
  footerServices: list(required(40, "Service"), 0, 8, "service"),
  socials: z.object(Object.fromEntries(SOCIAL_KEYS.map((k) => [k, webUrl])) as Record<SocialKey, typeof webUrl>),
});

/* ------------------------------------------------------------------ */
/* SEO                                                                  */
/* ------------------------------------------------------------------ */

export const SEO_PAGE_IDS = ["home", "portfolio", "careers", "blog"] as const;
export type SeoPageId = (typeof SEO_PAGE_IDS)[number];
export const SEO_PAGE_INFO: Record<SeoPageId, { name: string; path: string }> = {
  home: { name: "Home page", path: "/" },
  portfolio: { name: "Portfolio page", path: "/portfolio" },
  careers: { name: "Careers page", path: "/career" },
  blog: { name: "Blog page", path: "/blog" },
};

export const pageSeoSchema = z.object({
  title: required(70, "Google title"),
  description: required(200, "Google description"),
  keywords: list(required(60, "Keyword"), 0, 20, "keyword"),
  shareImage: image,
  hidden: z.boolean(),
});
export type PageSeo = z.infer<typeof pageSeoSchema>;

export const seoSchema = z.object({
  siteName: required(60, "Business name"),
  defaultDescription: required(200, "Default description"),
  shareImage: image,
  twitterHandle: z
    .string()
    .trim()
    .max(16)
    .refine((v) => v === "" || /^@?\w{1,15}$/.test(v), "Use your X username, like @xelvocreatives."),
  googleVerification: text(100, "Google code").refine((v) => !/[<>"]/.test(v), "Paste only the code, not the whole tag."),
  bingVerification: text(100, "Bing code").refine((v) => !/[<>"]/.test(v), "Paste only the code, not the whole tag."),
  analyticsId: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || /^G-[A-Z0-9]{4,15}$/i.test(v), "A Google Analytics ID looks like G-ABC123XYZ."),
  allowIndexing: z.boolean(),
  pages: z.object(Object.fromEntries(SEO_PAGE_IDS.map((k) => [k, pageSeoSchema])) as Record<SeoPageId, typeof pageSeoSchema>),
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type CareersContent = z.infer<typeof careersSchema>;
export type PortfolioPageContent = z.infer<typeof portfolioPageSchema>;
export type BlogPageContent = z.infer<typeof blogPageSchema>;
export type SiteSettings = z.infer<typeof siteSchema>;
export type SeoSettings = z.infer<typeof seoSchema>;

/** Every editable document, keyed by its id in the site_content collection. */
export const SITE_DOCS = {
  careers: careersSchema,
  portfolio: portfolioPageSchema,
  blogPage: blogPageSchema,
  site: siteSchema,
  seo: seoSchema,
} as const;
export type SiteDocId = keyof typeof SITE_DOCS;
export type SiteDocs = { [K in SiteDocId]: z.infer<(typeof SITE_DOCS)[K]> };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** First message per field path, for showing errors beside each input. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** WhatsApp chat link from a phone number, or "" when none. */
export function whatsappLink(number: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}
