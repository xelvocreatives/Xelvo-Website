"use client";

import * as React from "react";
import Image from "next/image";
import { EyeOff, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { XaButton } from "@/components/admin/kit/button";
import { savePageSeo } from "@/app/actions/site";
import { DEFAULT_DOCS } from "@/lib/site/defaults";
import { pageSeoSchema, SEO_PAGE_INFO, type PageSeo, type SeoPageId } from "@/lib/site/schema";
import { ImageField, KeywordsField, TextField, ToggleField, type Draft } from "./form-kit";
import { PanelForm } from "./panel-form";

/** Friendly length guidance: Google shows roughly 60 / 160 characters. */
function lengthNote(length: number, [low, high]: [number, number]) {
  if (length === 0) return { tone: "muted", text: "" };
  if (length < low) return { tone: "warn", text: `${length} characters. A little short: aim for ${low}–${high}.` };
  if (length > high) return { tone: "warn", text: `${length} characters. Google may cut it off after about ${high}.` };
  return { tone: "good", text: `${length} characters. A good length.` };
}

function LengthHint({ length, range, extra }: { length: number; range: [number, number]; extra: string }) {
  const note = lengthNote(length, range);
  return (
    <span>
      {extra}{" "}
      {note.text && (
        <span className={cn(note.tone === "good" ? "text-xa-green" : note.tone === "warn" ? "font-medium text-xa-ink" : "")}>{note.text}</span>
      )}
    </span>
  );
}

/** How a page will roughly look in Google's results. */
export function GooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
  return (
    <div className="rounded-xl bg-white px-4 py-3.5 font-[arial,sans-serif]" aria-label="Google preview">
      <p className="truncate text-[12px] text-[#4d5156]">{url}</p>
      <p className="mt-0.5 text-[18px] leading-snug text-[#1a0dab]">{clip(title || "Page title", 62)}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#4d5156]">
        {clip(description || "A short description of the page appears here.", 165)}
      </p>
    </div>
  );
}

export function PageSeoFields({ draft, url }: { draft: Draft<PageSeo>; url: string }) {
  const { value, set, errors } = draft;
  return (
    <>
      <GooglePreview title={value.title} description={value.description} url={url} />
      <TextField
        id="seo-title"
        label="Title on Google"
        value={value.title}
        onChange={(v) => set(["title"], v)}
        error={errors.title}
        max={70}
        hint={<LengthHint length={value.title.length} range={[30, 60]} extra="Also shown on the browser tab. Put the most important words first." />}
      />
      <TextField
        id="seo-description"
        label="Description on Google"
        value={value.description}
        onChange={(v) => set(["description"], v)}
        error={errors.description}
        max={200}
        rows={3}
        hint={<LengthHint length={value.description.length} range={[70, 160]} extra="One or two sentences that make people want to click." />}
      />
      <KeywordsField
        id="seo-keywords"
        label="Keywords"
        hint="Words people might search for. Google mostly ignores these today, but some other search engines still read them."
        items={value.keywords}
        onChange={(v) => set(["keywords"], v)}
        max={20}
        error={errors.keywords}
      />
      <ImageField
        id="seo-image"
        label="Share picture"
        optional
        value={value.shareImage}
        onChange={(v) => set(["shareImage"], v)}
        error={errors.shareImage}
        aspect="aspect-[1200/630]"
        hint="Shown when this page is shared on WhatsApp, Facebook, LinkedIn or X. Best size: 1200 × 630. Leave empty to use the website's default picture."
      />
      <ToggleField
        id="seo-hidden"
        label="Hide this page from Google"
        description="Asks search engines not to list this page. Visitors can still open it from your menu."
        checked={value.hidden}
        onChange={(v) => set(["hidden"], v)}
      />
    </>
  );
}

/** A page's Google appearance with an Edit button; used on every page tab. */
export function PageSeoCard({
  page,
  value,
  siteUrl,
  fallbackImage,
}: {
  page: SeoPageId;
  value: PageSeo;
  siteUrl: string;
  fallbackImage: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(value);
  const url = `${siteUrl.replace(/^https?:\/\//, "")}${SEO_PAGE_INFO[page].path === "/" ? "" : SEO_PAGE_INFO[page].path}`;
  const image = current.shareImage || fallbackImage;

  return (
    <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-xa-ink">{SEO_PAGE_INFO[page].name} on Google</h2>
          <p className="mt-1 text-sm text-xa-muted">How the {SEO_PAGE_INFO[page].name.toLowerCase()} appears in search results and on social media.</p>
        </div>
        <XaButton
          variant="secondary"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label={`Edit Google settings for the ${SEO_PAGE_INFO[page].name.toLowerCase()}`}
        >
          <Pencil />
          Edit
        </XaButton>
      </div>
      {current.hidden && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-2 text-[13px] font-medium text-xa-ink">
          <EyeOff className="size-4" aria-hidden />
          Hidden from Google
        </p>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_200px]">
        <GooglePreview title={current.title} description={current.description} url={url} />
        <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-xa-line bg-[#101010]">
          {image ? (
            <Image src={image} alt="" fill sizes="200px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-xa-muted">No share picture yet</span>
          )}
        </div>
      </div>

      <PanelForm
        open={open}
        onOpenChange={setOpen}
        title={`${SEO_PAGE_INFO[page].name}: Google and sharing`}
        description="Changes reach Google the next time it visits your website, usually within a few days."
        initial={current}
        defaults={DEFAULT_DOCS.seo.pages[page]}
        schema={pageSeoSchema}
        onSave={async (v) => {
          const result = await savePageSeo(page, v);
          if (result.ok) setCurrent(v);
          return result;
        }}
      >
        {(draft) => <PageSeoFields draft={draft} url={url} />}
      </PanelForm>
    </section>
  );
}
