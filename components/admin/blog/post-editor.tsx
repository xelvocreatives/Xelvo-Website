"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CalendarClock, ExternalLink, Eye, Send, Sparkles, Trash2, X } from "lucide-react";
import { deletePost, savePost, suggestExcerpt, type PostFieldErrors, type PostIntent } from "@/app/actions/posts";
import { uploadToCloudinary } from "@/lib/upload-client";
import { formatDate } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import { XaButton } from "../kit/button";
import { ConfirmDialog } from "../kit/confirm-dialog";
import { Field, fieldA11y, inputClass } from "../kit/field";
import { ImagePicker, usePreviewUrl, validateImage } from "../kit/image-picker";
import { RichEditor } from "./rich-editor";
import { PostStatusPill, postState } from "./post-status";

type Values = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle: string;
  seoDescription: string;
};

const SITE = "xelvocreatives.com";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** datetime-local value in the viewer's local time. */
/**
 * ProseMirror builds node/mark attrs with Object.create(null). React's
 * server-action serialiser drops those, so heading levels, link hrefs, image
 * sources and colours would arrive empty. Send a plain-object copy instead.
 */
function plainJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toLocalInput(iso: string | null) {
  const d = iso ? new Date(iso) : new Date(Date.now() + 24 * 3600e3);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostEditor({ post, categories }: { post: Post | null; categories: string[] }) {
  const router = useRouter();
  const initial: Values = {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerptAuto ? "" : (post?.excerpt ?? ""),
    coverImage: post?.coverImage ?? null,
    coverAlt: post?.coverAlt ?? "",
    category: post?.category ?? "",
    tags: post?.tags ?? [],
    author: post?.author ?? "Xelvo Creatives",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  };

  const [values, setValues] = React.useState<Values>(initial);
  const [saved, setSaved] = React.useState({
    id: post?.id ?? null,
    slug: post?.slug ?? null,
    status: post?.status ?? ("draft" as const),
    publishedAt: post?.publishedAt ?? null,
  });
  const [slugTouched, setSlugTouched] = React.useState(Boolean(post?.slug));
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const coverPreview = usePreviewUrl(coverFile, values.coverImage);
  const [content, setContent] = React.useState<Record<string, unknown> | null>(post?.content ?? null);
  const [words, setWords] = React.useState(0);
  const [errors, setErrors] = React.useState<PostFieldErrors>({});
  const [busy, setBusy] = React.useState<PostIntent | "upload" | null>(null);
  const [mode, setMode] = React.useState<"now" | "schedule">(
    post && postState(post) === "scheduled" ? "schedule" : "now",
  );
  const [publishAt, setPublishAt] = React.useState(toLocalInput(post?.publishedAt ?? null));
  const [tagDraft, setTagDraft] = React.useState("");
  const [minPublish] = React.useState(() => toLocalInput(new Date(Date.now() + 5 * 60e3).toISOString()));

  // Dirty tracking: compare against the last saved snapshot. The first
  // snapshot is taken once the editor has normalised the loaded content.
  const contentRef = React.useRef(content);
  const [savedSnapshot, setSavedSnapshot] = React.useState<string | null>(null);
  const currentSnapshot = JSON.stringify({ values, content });
  const dirty = coverFile !== null || (savedSnapshot !== null && currentSnapshot !== savedSnapshot);

  React.useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const state = postState({ status: saved.status, publishedAt: saved.publishedAt });

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    const errKey = key === "coverAlt" ? "cover" : key === "seoTitle" || key === "seoDescription" ? "seo" : key;
    setErrors((e) => ({ ...e, [errKey]: undefined }));
  }

  function addTag(raw: string) {
    const tag = raw.trim().replace(/,$/, "");
    if (!tag) return;
    if (values.tags.length >= 10) {
      setErrors((e) => ({ ...e, tags: "Use up to 10 tags." }));
      return;
    }
    if (!values.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) set("tags", [...values.tags, tag]);
    setTagDraft("");
  }

  async function save(intent: PostIntent) {
    if (busy) return;
    setErrors({});
    let coverImage = values.coverImage;
    if (coverFile) {
      setBusy("upload");
      try {
        coverImage = await uploadToCloudinary(coverFile, "blog");
      } catch (err) {
        setBusy(null);
        setErrors({ cover: err instanceof Error ? err.message : "Upload failed." });
        toast.error("The cover image couldn't be uploaded.");
        return;
      }
    }
    setBusy(intent);
    const result = await savePost({
      id: saved.id ?? undefined,
      ...values,
      coverImage,
      content: plainJson(contentRef.current ?? { type: "doc", content: [] }),
      intent,
      publishAt: intent === "schedule" ? new Date(publishAt).toISOString() : null,
    });
    setBusy(null);

    if (!result.ok) {
      setErrors(result.errors ?? {});
      toast.error(result.message);
      const first = ["title", "content", "cover", "category", "publishAt", "slug", "excerpt", "tags", "author", "seo"].find(
        (k) => result.errors?.[k as keyof PostFieldErrors],
      );
      if (first) document.getElementById(`post-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    toast.success(result.message);
    setCoverFile(null);
    const nextValues = { ...values, coverImage, slug: result.slug ?? values.slug };
    setValues(nextValues);
    setSlugTouched(true);
    setSavedSnapshot(JSON.stringify({ values: nextValues, content: contentRef.current }));
    setSaved({ id: result.id ?? saved.id, slug: result.slug ?? saved.slug, status: result.status ?? saved.status, publishedAt: result.publishedAt ?? null });
    if (!post && result.id) router.replace(`/admin/blog/${result.id}`, { scroll: false });
    else router.refresh();
  }

  // Ctrl/Cmd+S saves without changing the publish state.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save("draft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const primary =
    state === "published"
      ? { label: "Update article", intent: "publish" as const, icon: <Send /> }
      : mode === "schedule"
        ? { label: state === "scheduled" ? "Update schedule" : "Schedule", intent: "schedule" as const, icon: <CalendarClock /> }
        : { label: "Publish now", intent: "publish" as const, icon: <Send /> };

  const seoTitle = values.seoTitle || values.title || "Article title";
  const seoDescription = values.seoDescription || values.excerpt || "A short summary of the article appears here in search results.";

  return (
    <div className="pb-16">
      {/* Top bar: stays in view on desktop so Save and Publish are always reachable. */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:sticky lg:top-0 lg:z-30 lg:mb-2 lg:h-16 lg:bg-xa-ground">
        <div className="flex min-w-0 items-center gap-3">
          {dirty ? (
            <ConfirmDialog
              trigger={
                <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium text-xa-muted hover:text-xa-ink">
                  <ArrowLeft className="size-4" />
                  All articles
                </button>
              }
              title="Leave without saving?"
              description="You have unsaved changes to this article. If you leave now, they'll be lost."
              confirmLabel="Leave without saving"
              cancelLabel="Keep editing"
              onConfirm={() => router.push("/admin/blog")}
            />
          ) : (
            <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-xa-muted hover:text-xa-ink">
              <ArrowLeft className="size-4" />
              All articles
            </Link>
          )}
          <PostStatusPill post={{ status: saved.status, publishedAt: saved.publishedAt }} />
          <span className="truncate text-xs text-xa-muted" aria-live="polite">
            {busy === "upload" ? "Uploading cover…" : busy ? "Saving…" : dirty ? "Unsaved changes" : saved.id ? "All changes saved" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {saved.slug && (
            <XaButton asChild variant="ghost" size="sm">
              <a href={`/blog/${saved.slug}${state === "published" ? "" : "?preview=1"}`} target="_blank" rel="noreferrer">
                <Eye />
                {state === "published" ? "View live" : "Preview"}
              </a>
            </XaButton>
          )}
          <XaButton variant="secondary" size="sm" loading={busy === "draft"} disabled={Boolean(busy)} onClick={() => save("draft")}>
            {state === "draft" ? "Save draft" : "Save"}
          </XaButton>
          <XaButton variant="primary" size="sm" loading={busy === primary.intent} disabled={Boolean(busy)} onClick={() => save(primary.intent)}>
            {primary.icon}
            {primary.label}
          </XaButton>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Writing column */}
        <div className="min-w-0 space-y-4">
          <div>
            <label htmlFor="post-title" className="sr-only">
              Title
            </label>
            <textarea
              id="post-title"
              value={values.title}
              onChange={(e) => set("title", e.target.value.replace(/\n/g, " "))}
              placeholder="Article title"
              rows={1}
              maxLength={140}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "post-title-error" : undefined}
              className="field-sizing-content w-full resize-none bg-transparent text-[30px] leading-tight font-bold tracking-[-0.02em] text-xa-ink outline-none placeholder:text-white/25 sm:text-[38px]"
            />
            {errors.title && (
              <p id="post-title-error" role="alert" className="mt-1 text-[13px] text-xa-red">
                {errors.title}
              </p>
            )}
          </div>
          <div id="post-content">
            <RichEditor
              initialContent={post?.content ?? null}
              invalid={Boolean(errors.content)}
              onChange={(json, count) => {
                contentRef.current = json;
                setContent(json);
                setWords(count);
                setSavedSnapshot((s) => s ?? JSON.stringify({ values: initial, content: json }));
                if (errors.content) setErrors((e) => ({ ...e, content: undefined }));
              }}
            />
            {errors.content && (
              <p role="alert" className="mt-2 text-[13px] text-xa-red">
                {errors.content}
              </p>
            )}
          </div>
        </div>

        {/* Settings column */}
        <aside className="space-y-4 xl:sticky xl:top-6 xl:max-h-[calc(100dvh-3rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
          <Panel title="Publishing">
            {state === "published" ? (
              <p className="text-sm text-xa-muted">
                Live since {saved.publishedAt ? formatDate(saved.publishedAt, true) : "now"}. Changes go live when you click
                <span className="font-semibold text-xa-ink"> Update article</span>.
              </p>
            ) : (
              <div role="radiogroup" aria-label="When to publish" className="grid gap-1.5">
                {(
                  [
                    ["now", "Publish now", "Goes live as soon as you publish."],
                    ["schedule", "Schedule for later", "Goes live automatically at the time you pick."],
                  ] as const
                ).map(([key, label, hint]) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={mode === key}
                    onClick={() => setMode(key)}
                    className={cn(
                      "rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                      mode === key ? "border-white/25 bg-white/6" : "border-transparent hover:bg-white/3",
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-xa-ink">
                      <span className={cn("size-3 rounded-full border-2", mode === key ? "border-xa-ink bg-xa-ink" : "border-xa-faint")} />
                      {label}
                    </span>
                    <span className="mt-0.5 block pl-5 text-xs text-xa-muted">{hint}</span>
                  </button>
                ))}
                {mode === "schedule" && (
                  <Field id="post-publishAt" label="Publish on" error={errors.publishAt} className="mt-2">
                    <input
                      {...fieldA11y("post-publishAt", errors.publishAt)}
                      type="datetime-local"
                      value={publishAt}
                      min={minPublish}
                      onChange={(e) => {
                        setPublishAt(e.target.value);
                        setErrors((er) => ({ ...er, publishAt: undefined }));
                      }}
                      className={cn(inputClass, "h-11 text-sm [color-scheme:dark]")}
                    />
                  </Field>
                )}
              </div>
            )}
            {state !== "draft" && (
              <ConfirmDialog
                trigger={
                  <button type="button" className="mt-3 text-[13px] font-semibold text-xa-muted underline-offset-4 hover:text-xa-ink hover:underline">
                    {state === "scheduled" ? "Cancel schedule (back to draft)" : "Unpublish (back to draft)"}
                  </button>
                }
                title={state === "scheduled" ? "Cancel the schedule?" : "Unpublish this article?"}
                description="It will be removed from your website and kept as a draft. You can publish it again any time."
                confirmLabel={state === "scheduled" ? "Cancel schedule" : "Unpublish"}
                destructive={false}
                onConfirm={() => save("unpublish")}
              />
            )}
          </Panel>

          <Panel title="Cover image">
            <div id="post-cover">
              <ImagePicker
                id="post-cover-input"
                previewUrl={coverPreview}
                error={errors.cover}
                emptyLabel="Add a cover image"
                onPick={(file) => {
                  const problem = validateImage(file);
                  if (problem) setErrors((e) => ({ ...e, cover: problem }));
                  else {
                    setCoverFile(file);
                    setErrors((e) => ({ ...e, cover: undefined }));
                  }
                }}
                onRemove={() => {
                  setCoverFile(null);
                  set("coverImage", null);
                }}
              />
              {errors.cover && <p role="alert" className="mt-2 text-[13px] text-xa-red">{errors.cover}</p>}
            </div>
            <Field id="post-coverAlt" label="Describe the image" optional hint="Helps screen readers and Google." className="mt-4">
              <input
                {...fieldA11y("post-coverAlt", null, true)}
                value={values.coverAlt}
                onChange={(e) => set("coverAlt", e.target.value)}
                maxLength={200}
                className={cn(inputClass, "h-10 text-sm")}
              />
            </Field>
          </Panel>

          <Panel title="Summary">
            <Field
              id="post-excerpt"
              label="Short summary"
              error={errors.excerpt}
              counter={{ value: values.excerpt.length, max: 300 }}
              hint="Shown on blog cards, the Home page and under the article title. Left empty, cards use the first lines of the article instead."
            >
              <textarea
                {...fieldA11y("post-excerpt", errors.excerpt, true)}
                value={values.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={4}
                className={cn(inputClass, "resize-y py-2.5 text-sm leading-relaxed")}
              />
            </Field>
            <button
              type="button"
              disabled={words < 5}
              onClick={async () => set("excerpt", await suggestExcerpt(plainJson(contentRef.current)))}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-xa-muted hover:text-xa-ink disabled:opacity-40"
            >
              <Sparkles className="size-3.5" />
              Fill from article
            </button>
          </Panel>

          <Panel title="Organise">
            <Field id="post-category" label="Category" error={errors.category} hint="Used for the filters on your Blog page.">
              <input
                {...fieldA11y("post-category", errors.category, true)}
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                list="xa-post-categories"
                placeholder="e.g. Branding"
                maxLength={40}
                className={cn(inputClass, "h-10 text-sm")}
              />
              <datalist id="xa-post-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            {categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {categories.slice(0, 8).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      values.category === c ? "border-xa-ink bg-xa-ink text-xa-ground" : "border-xa-line-strong text-xa-muted hover:text-xa-ink",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <Field id="post-tags" label="Tags" optional error={errors.tags} hint="Press Enter or comma to add. Up to 10." className="mt-5">
              <div className={cn(inputClass, "flex min-h-10 flex-wrap items-center gap-1.5 px-2 py-1.5")}>
                {values.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white/8 py-0.5 pr-1 pl-2.5 text-xs font-medium text-xa-ink">
                    {t}
                    <button
                      type="button"
                      aria-label={`Remove tag ${t}`}
                      onClick={() => set("tags", values.tags.filter((x) => x !== t))}
                      className="flex size-5 items-center justify-center rounded-full hover:bg-white/10"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="post-tags"
                  value={tagDraft}
                  onChange={(e) => {
                    if (e.target.value.endsWith(",")) addTag(e.target.value);
                    else setTagDraft(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagDraft);
                    } else if (e.key === "Backspace" && !tagDraft && values.tags.length) {
                      set("tags", values.tags.slice(0, -1));
                    }
                  }}
                  onBlur={() => addTag(tagDraft)}
                  maxLength={30}
                  placeholder={values.tags.length ? "" : "e.g. D2C, Logo design"}
                  className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm text-xa-ink outline-none placeholder:text-[#8a857e]"
                />
              </div>
            </Field>

            <Field id="post-author" label="Author" error={errors.author} className="mt-5">
              <input
                {...fieldA11y("post-author", errors.author)}
                value={values.author}
                onChange={(e) => set("author", e.target.value)}
                maxLength={60}
                className={cn(inputClass, "h-10 text-sm")}
              />
            </Field>
          </Panel>

          <Panel title="Link and search">
            <Field id="post-slug" label="Page link" error={errors.slug} hint="Created from the title. Change it only if you need to.">
              <div className={cn(inputClass, "flex h-10 items-center gap-0 px-0 text-sm")}>
                <span className="shrink-0 pl-3 text-xa-muted">/blog/</span>
                <input
                  {...fieldA11y("post-slug", errors.slug, true)}
                  value={values.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value.replace(/\s/g, "-")) + (e.target.value.endsWith("-") ? "-" : ""));
                  }}
                  maxLength={90}
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 text-xa-ink outline-none"
                />
              </div>
            </Field>

            <Field id="post-seoTitle" label="Search title" optional counter={{ value: values.seoTitle.length, max: 70 }} className="mt-5">
              <input
                {...fieldA11y("post-seoTitle", null)}
                value={values.seoTitle}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={values.title || "Defaults to the article title"}
                className={cn(inputClass, "h-10 text-sm")}
              />
            </Field>
            <Field id="post-seoDescription" label="Search description" optional error={errors.seo} counter={{ value: values.seoDescription.length, max: 170 }} className="mt-4">
              <textarea
                {...fieldA11y("post-seoDescription", errors.seo)}
                value={values.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)}
                placeholder="Defaults to the summary"
                rows={3}
                className={cn(inputClass, "resize-y py-2.5 text-sm leading-relaxed")}
              />
            </Field>

            <div className="mt-4 rounded-xl bg-white p-4 text-left" aria-label="Google search preview">
              <p className="truncate text-xs text-[#4d5156]">
                {SITE} › blog › {values.slug || "article-link"}
              </p>
              <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{seoTitle}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[#4d5156]">{seoDescription}</p>
            </div>
          </Panel>

          {saved.id && (
            <div className="flex items-center justify-between px-1">
              {state === "published" && saved.slug && (
                <a
                  href={`/blog/${saved.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-xa-muted hover:text-xa-ink"
                >
                  <ExternalLink className="size-3.5" />
                  Open on website
                </a>
              )}
              <ConfirmDialog
                trigger={
                  <XaButton variant="ghost" size="sm" className="ml-auto text-xa-muted hover:text-xa-red">
                    <Trash2 />
                    Delete article
                  </XaButton>
                }
                title="Delete this article?"
                description={
                  <>
                    <span className="font-semibold text-xa-ink">{values.title || "This article"}</span> will be removed
                    permanently{state === "published" ? ", including from your website" : ""}. This can&apos;t be undone.
                  </>
                }
                confirmLabel="Delete article"
                onConfirm={async () => {
                  const result = await deletePost(saved.id!);
                  if (result.ok) {
                    toast.success(result.message);
                    setSavedSnapshot(currentSnapshot);
                    router.push("/admin/blog");
                  } else toast.error(result.message);
                }}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-xa-line bg-xa-panel p-4">
      <h2 className="mb-3 text-sm font-bold text-xa-ink">{title}</h2>
      {children}
    </section>
  );
}
