"use client";

import * as React from "react";
import { ExternalLink, EyeOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { XaButton } from "@/components/admin/kit/button";
import { ReorderHint, SortableGrid } from "@/components/admin/kit/sortable-grid";
import { saveHomeLayout, saveHomeSection } from "@/app/actions/site";
import { DEFAULT_HOME } from "@/lib/site/defaults";
import {
  HOME_SECTION_INFO,
  HOME_SECTION_SCHEMAS,
  type HomeLayout,
  type HomeSectionId,
  type HomeSections,
} from "@/lib/site/schema";
import { XaSwitch } from "./form-kit";
import { HOME_SECTION_FORMS } from "./home-section-forms";
import { PanelForm } from "./panel-form";

/** A one-line reminder of what each section currently says. */
function summary(id: HomeSectionId, s: HomeSections): string {
  switch (id) {
    case "hero":
      return s.hero.title.text;
    case "metrics":
      return s.metrics.items.map((m) => `${m.prefix}${m.value}${m.suffix} ${m.label}`).join(" · ");
    case "about":
      return s.about.title.text;
    case "services":
      return s.services.cards.map((c) => c.title).join(" · ");
    case "framework":
      return s.framework.phases.map((p) => p.title).join(" → ");
    case "featured":
      return s.featured.title.text;
    case "testimonials":
      return s.testimonials.title;
    case "blog":
      return s.blog.title.text;
    case "faq":
      return `${s.faq.items.length} questions`;
    case "cta":
      return s.cta.title;
    case "contact":
      return s.contact.title;
  }
}

export function HomeBoard({ layout, sections }: { layout: HomeLayout; sections: HomeSections }) {
  const [rows, setRows] = React.useState(layout);
  const [content, setContent] = React.useState(sections);
  const [editing, setEditing] = React.useState<HomeSectionId | null>(null);
  const [saving, setSaving] = React.useState(false);

  async function persist(next: HomeLayout, success: string) {
    const previous = rows;
    setRows(next); // show it straight away; undo if saving fails
    setSaving(true);
    const result = await saveHomeLayout(next);
    setSaving(false);
    if (result.ok) toast.success(success);
    else {
      setRows(previous);
      toast.error(result.message);
    }
  }

  const visibleCount = rows.filter((r) => r.visible).length;

  return (
    <>
      <ReorderHint>Drag a section by its handle to move it up or down the Home page. Changes go live right away.</ReorderHint>
      <SortableGrid
        items={rows}
        itemLabel={(r) => HOME_SECTION_INFO[r.id].name}
        onReorder={(next) => persist(next, "New order saved.")}
        className="grid grid-cols-[minmax(0,1fr)] gap-2"
        renderItem={(row, handle, index) => {
          const info = HOME_SECTION_INFO[row.id];
          return (
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border border-xa-line bg-xa-panel p-3 pr-4 transition-opacity sm:gap-4",
                !row.visible && "opacity-60",
              )}
            >
              <div className="[&>button]:bg-white/8 [&>button]:backdrop-blur-none">{handle}</div>
              <span className="w-5 shrink-0 text-center text-sm font-semibold text-xa-faint tabular-nums">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-xa-ink">
                  {info.name}
                  {!row.visible && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-xs font-semibold text-xa-muted">
                      <EyeOff className="size-3" aria-hidden />
                      Hidden
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-xa-muted" title={summary(row.id, content)}>
                  {summary(row.id, content).replace(/\n/g, " ")}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-xa-muted">
                <span className="hidden sm:inline" aria-hidden>
                  Show
                </span>
                <XaSwitch
                  checked={row.visible}
                  disabled={saving || (row.visible && visibleCount === 1)}
                  label={`Show ${info.name} on the Home page`}
                  onCheckedChange={(visible) =>
                    persist(
                      rows.map((r) => (r.id === row.id ? { ...r, visible } : r)),
                      visible ? `${info.name} is back on the Home page.` : `${info.name} is hidden from the Home page.`,
                    )
                  }
                />
              </div>
              {info.anchor ? (
                <a
                  href={`/#${info.anchor}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`See ${info.name} on the website`}
                  title="See it on the website"
                  className="hidden size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted hover:bg-white/5 hover:text-xa-ink md:flex"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : (
                // Keeps the switches and buttons lined up on rows without a link.
                <span className="hidden size-9 shrink-0 md:block" aria-hidden />
              )}
              <XaButton variant="secondary" size="sm" onClick={() => setEditing(row.id)} aria-label={`Edit ${info.name}`}>
                <Pencil />
                <span className="hidden sm:inline">Edit</span>
              </XaButton>
            </div>
          );
        }}
      />

      {editing && <SectionPanel key={editing} id={editing} value={content[editing]} onClose={() => setEditing(null)} onSaved={(v) => setContent((c) => ({ ...c, [editing]: v }))} />}
    </>
  );
}

function SectionPanel<K extends HomeSectionId>({
  id,
  value,
  onClose,
  onSaved,
}: {
  id: K;
  value: HomeSections[K];
  onClose: () => void;
  onSaved: (v: HomeSections[K]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  // Open on mount so the slide-in animation runs.
  React.useEffect(() => setOpen(true), []);
  const Form = HOME_SECTION_FORMS[id] as (props: {
    value: HomeSections[K];
    set: (path: (string | number)[], v: unknown) => void;
    errors: Record<string, string>;
  }) => React.ReactNode;

  return (
    <PanelForm
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setTimeout(onClose, 300);
      }}
      title={`Edit: ${HOME_SECTION_INFO[id].name}`}
      description={HOME_SECTION_INFO[id].about}
      initial={value}
      defaults={DEFAULT_HOME[id]}
      schema={HOME_SECTION_SCHEMAS[id] as unknown as import("zod").ZodType<HomeSections[K]>}
      onSave={async (v) => {
        const result = await saveHomeSection(id, v);
        if (result.ok) onSaved(v);
        return result;
      }}
    >
      {(draft) => <Form value={draft.value} set={draft.set} errors={draft.errors} />}
    </PanelForm>
  );
}
