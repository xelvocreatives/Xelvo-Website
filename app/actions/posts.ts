"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import { isOwnUploadUrl } from "@/lib/cloudinary";
import { parseId, posts } from "@/lib/db/models";
import { plainText, renderArticle, sanitizeDoc, slugify } from "@/lib/blog/content";

export type PostIntent = "draft" | "publish" | "schedule" | "unpublish";

export type PostInput = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  content: unknown;
  seoTitle: string;
  seoDescription: string;
  intent: PostIntent;
  /** ISO date-time for scheduling. */
  publishAt?: string | null;
};

export type PostFieldErrors = Partial<
  Record<"title" | "slug" | "excerpt" | "cover" | "category" | "tags" | "author" | "content" | "seo" | "publishAt", string>
>;

export type SavePostResult = {
  ok: boolean;
  message: string;
  errors?: PostFieldErrors;
  id?: string;
  slug?: string;
  status?: "draft" | "published";
  publishedAt?: string | null;
};

const Schema = z.object({
  title: z.string().trim().max(140, "Keep the title under 140 characters."),
  slug: z
    .string()
    .trim()
    .max(90, "Keep the link under 90 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, "Use lowercase letters, numbers and dashes only."),
  excerpt: z.string().trim().max(300, "Keep the summary under 300 characters."),
  coverAlt: z.string().trim().max(200),
  category: z.string().trim().max(40, "Keep the category under 40 characters."),
  tags: z.array(z.string().trim().min(1).max(30)).max(10, "Use up to 10 tags."),
  author: z.string().trim().max(60, "Keep the author name under 60 characters."),
  seoTitle: z.string().trim().max(70, "Keep the search title under 70 characters."),
  seoDescription: z.string().trim().max(170, "Keep the search description under 170 characters."),
});

function revalidateBlog(slugs: string[]) {
  revalidatePath("/admin", "layout");
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
}

export async function savePost(input: PostInput): Promise<SavePostResult> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };

  const parsed = Schema.safeParse(input);
  const errors: PostFieldErrors = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      const field = (key === "coverAlt" ? "cover" : key === "seoTitle" || key === "seoDescription" ? "seo" : key) as keyof PostFieldErrors;
      errors[field] ??= issue.message;
    }
  }
  const v = parsed.success ? parsed.data : null;
  const publishing = input.intent === "publish" || input.intent === "schedule";

  // Publishing needs a complete article; drafts only need a title.
  if (!input.title?.trim()) errors.title = "Give the article a title.";
  if (input.coverImage && !isOwnUploadUrl(input.coverImage, "blog")) errors.cover = "Upload the cover image again.";

  const doc = sanitizeDoc(input.content);
  if (typeof doc === "string") errors.content = doc;
  const rendered = typeof doc === "string" ? null : renderArticle(doc);

  if (publishing) {
    if (!rendered || rendered.words < 30) errors.content ??= "Write at least a few paragraphs (30+ words) before publishing.";
    if (!input.coverImage) errors.cover ??= "Add a cover image before publishing.";
    if (!input.category?.trim()) errors.category ??= "Choose a category before publishing.";
  }

  let publishAt: Date | null = null;
  if (input.intent === "schedule") {
    publishAt = input.publishAt ? new Date(input.publishAt) : null;
    if (!publishAt || Number.isNaN(publishAt.getTime())) errors.publishAt = "Pick a date and time to publish.";
    else if (publishAt.getTime() < Date.now() + 60_000) errors.publishAt = "Pick a time in the future, or use Publish now.";
  }

  if (Object.keys(errors).length || !v || !rendered || typeof doc === "string") {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  try {
    const col = await posts();
    const _id = input.id ? parseId(input.id) : new ObjectId();
    if (!_id) return { ok: false, message: "Article not found." };
    const existing = input.id ? await col.findOne({ _id }) : null;
    if (input.id && !existing) return { ok: false, message: "Article not found." };

    // Unique, readable link. A typed slug that is taken is an error; an
    // automatic one gets a number added.
    const wanted = v.slug || slugify(v.title) || "article";
    let slug = wanted;
    const taken = async (s: string) => Boolean(await col.findOne({ slug: s, _id: { $ne: _id } }, { projection: { _id: 1 } }));
    if (await taken(slug)) {
      if (v.slug && v.slug !== existing?.slug) {
        return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "Another article already uses this link." } };
      }
      let n = 2;
      while (await taken(`${wanted}-${n}`)) n++;
      slug = `${wanted}-${n}`;
    }

    let status: "draft" | "published" = existing?.status ?? "draft";
    let publishedAt: Date | null = existing?.publishedAt ?? null;
    if (input.intent === "publish") {
      status = "published";
      // Keep the original date when updating an already-live article.
      publishedAt = existing?.status === "published" && existing.publishedAt && existing.publishedAt <= new Date()
        ? existing.publishedAt
        : new Date();
    } else if (input.intent === "schedule") {
      status = "published";
      publishedAt = publishAt;
    } else if (input.intent === "unpublish") {
      status = "draft";
    }

    const excerpt = v.excerpt || rendered.text.slice(0, 220).replace(/\s+\S*$/, "") + (rendered.text.length > 220 ? "…" : "");
    const now = new Date();
    const fields = {
      title: v.title || "Untitled article",
      slug,
      excerpt,
      excerptAuto: !v.excerpt,
      coverImage: input.coverImage || null,
      coverAlt: v.coverAlt,
      category: v.category,
      tags: [...new Set(v.tags)],
      author: v.author || "Xelvo Creatives",
      content: doc as Record<string, unknown>,
      contentHtml: rendered.html,
      headings: rendered.headings,
      readingMinutes: rendered.readingMinutes,
      status,
      publishedAt,
      seoTitle: v.seoTitle,
      seoDescription: v.seoDescription,
      updatedAt: now,
    };

    if (existing) await col.updateOne({ _id }, { $set: fields });
    else await col.insertOne({ _id, ...fields, createdAt: now });

    revalidateBlog([slug, existing?.slug ?? ""]);

    const scheduled = status === "published" && publishedAt && publishedAt > now;
    const message =
      input.intent === "publish"
        ? existing?.status === "published" ? "Changes published." : "Article published."
        : input.intent === "schedule"
          ? "Article scheduled."
          : input.intent === "unpublish"
            ? "Article moved back to drafts."
            : scheduled
              ? "Saved. It stays scheduled."
              : status === "published"
                ? "Saved. Changes are live."
                : "Draft saved.";

    return {
      ok: true,
      message,
      id: _id.toHexString(),
      slug,
      status,
      publishedAt: publishedAt ? publishedAt.toISOString() : null,
    };
  } catch (error) {
    console.error("savePost error:", error);
    return { ok: false, message: "Couldn’t save the article. Please try again." };
  }
}

export async function deletePost(id: string): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdmin())) return { ok: false, message: UNAUTHORIZED };
  const _id = parseId(id);
  if (!_id) return { ok: false, message: "Article not found." };
  try {
    const col = await posts();
    const doc = await col.findOneAndDelete({ _id });
    revalidateBlog([doc?.slug ?? ""]);
    return { ok: true, message: "Article deleted." };
  } catch (error) {
    console.error("deletePost error:", error);
    return { ok: false, message: "Couldn’t delete the article. Please try again." };
  }
}

/** Plain-text excerpt suggestion from the current editor content. */
export async function suggestExcerpt(content: unknown): Promise<string> {
  if (!(await isAdmin())) return "";
  const doc = sanitizeDoc(content);
  if (typeof doc === "string") return "";
  const text = plainText(doc);
  return text.length > 220 ? text.slice(0, 220).replace(/\s+\S*$/, "") + "…" : text;
}
