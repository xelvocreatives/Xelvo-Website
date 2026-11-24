"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Quote, Star, Trash2 } from "lucide-react";
import { deleteTestimonial, reorderTestimonials } from "@/app/actions/testimonials";
import { formatDate } from "@/lib/admin-format";
import type { Testimonial } from "@/types";
import { XaButton } from "./kit/button";
import { XaAvatar } from "./kit/avatar";
import { PageHeader } from "./kit/page-header";
import { EmptyState } from "./kit/empty-state";
import { ActionMenu, type MenuItem } from "./kit/action-menu";
import { ConfirmDialog } from "./kit/confirm-dialog";
import { EditorPanel } from "./kit/editor-panel";
import { ReorderHint, SortableGrid } from "./kit/sortable-grid";
import { SOCIAL_PLATFORMS, TestimonialEditor } from "./testimonial-editor";

const WEBSITE_LIMIT = 9;

export function TestimonialsBoard({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const editId = searchParams.get("edit");
  const editing = editId ? testimonials.find((t) => t.id === editId) : undefined;
  const [open, setOpen] = React.useState(Boolean(searchParams.get("new") || editing));
  const [current, setCurrent] = React.useState<Testimonial | undefined>(editing);
  const [editorKey, setEditorKey] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Testimonial | null>(null);
  const [, startTransition] = React.useTransition();

  // Local copy so a drag shows instantly; the server's list wins whenever it changes.
  const [list, setList] = React.useState(testimonials);
  React.useEffect(() => setList(testimonials), [testimonials]);

  function openEditor(t?: Testimonial) {
    setCurrent(t);
    setEditorKey((k) => k + 1);
    setDirty(false);
    setOpen(true);
  }

  function closeEditor() {
    setOpen(false);
    setDirty(false);
    if (searchParams.size > 0) router.replace(pathname, { scroll: false });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const result = await deleteTestimonial(toDelete.id);
    if (result.ok) toast.success(result.message, { description: toDelete.clientName });
    else toast.error(result.message);
  }

  function saveOrder(next: Testimonial[]) {
    const previous = list;
    setList(next);
    startTransition(async () => {
      const result = await reorderTestimonials(next.map((t) => t.id));
      if (result.ok) toast.success(result.message, { id: "testimonial-order", description: "Website order updated." });
      else {
        setList(previous);
        toast.error(result.message, { id: "testimonial-order" });
      }
    });
  }

  function move(index: number, by: -1 | 1) {
    const target = index + by;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    saveOrder(next);
  }

  return (
    <>
      <PageHeader
        title="Testimonials"
        description={`Reviews from your clients. The first ${WEBSITE_LIMIT} appear on your home page, in the order you set here.`}
        actions={
          <XaButton variant="primary" onClick={() => openEditor()}>
            <Plus />
            Add testimonial
          </XaButton>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<Quote />}
          title="No testimonials yet"
          description="Kind words from clients build trust. Add your first review."
          action={
            <XaButton variant="primary" onClick={() => openEditor()}>
              <Plus />
              Add testimonial
            </XaButton>
          }
        />
      ) : (
        <>
          {list.length > 1 && <ReorderHint>Drag the grip on a card to change the order on your website.</ReorderHint>}
          <SortableGrid
            items={list}
            itemLabel={(t) => `review from ${t.clientName}`}
            onReorder={saveOrder}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            renderItem={(t, handle, index) => {
              const platform = SOCIAL_PLATFORMS.find((p) => p.value === t.socialPlatform)?.label;
              const menu: MenuItem[] = [
                { label: "Edit", icon: <Pencil />, onSelect: () => openEditor(t) },
                ...(index > 0 ? [{ label: "Move up", icon: <ArrowUp />, onSelect: () => move(index, -1) }] : []),
                ...(index < list.length - 1
                  ? [{ label: "Move down", icon: <ArrowDown />, onSelect: () => move(index, 1) }]
                  : []),
                { label: "Delete", icon: <Trash2 />, danger: true, onSelect: () => setToDelete(t) },
              ];
              return (
                <>
                  <button
                    type="button"
                    onClick={() => openEditor(t)}
                    aria-label={`Edit review from ${t.clientName}`}
                    className="flex h-full w-full flex-col gap-5 rounded-2xl border border-xa-line bg-xa-panel p-5 text-left transition-colors duration-200 hover:border-white/20"
                  >
                    <div className="flex items-center gap-3 pr-20">
                      <XaAvatar name={t.clientName} src={t.imageUrl} />
                      <div className="min-w-0">
                        <p className="truncate font-bold text-xa-ink">{t.clientName}</p>
                        <p className="truncate text-sm text-xa-muted">{t.company}</p>
                      </div>
                    </div>
                    <p className="line-clamp-4 flex-1 text-[15px] leading-relaxed text-xa-ink/85">“{t.text}”</p>
                    <div className="flex items-center justify-between gap-3 border-t border-xa-line pt-4">
                      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={i < t.rating ? "size-4 fill-xa-accent text-xa-accent" : "size-4 text-xa-faint"}
                            aria-hidden
                          />
                        ))}
                      </div>
                      <span className="truncate text-xs text-xa-muted">
                        {[platform, formatDate(t.createdAt)].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    {index >= WEBSITE_LIMIT && (
                      <span className="-mt-2 text-xs text-xa-muted">
                        Not on the website: only the first {WEBSITE_LIMIT} show. Drag it higher to show it.
                      </span>
                    )}
                  </button>
                  <div className="absolute top-4 right-4 flex gap-1.5">
                    {list.length > 1 && handle}
                    <ActionMenu label={`Options for ${t.clientName}'s review`} items={menu} />
                  </div>
                </>
              );
            }}
          />
        </>
      )}

      <EditorPanel
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeEditor())}
        title={current ? "Edit testimonial" : "Add a testimonial"}
        description={current ? `Review from ${current.clientName}` : "Add a client review to your website."}
        dirty={dirty}
      >
        {(requestClose) => (
          <TestimonialEditor
            key={editorKey}
            testimonial={current}
            onDirtyChange={setDirty}
            onSaved={closeEditor}
            onCancel={requestClose}
          />
        )}
      </EditorPanel>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(next) => !next && setToDelete(null)}
        title="Delete this testimonial?"
        description={
          <>
            The review from <span className="font-semibold text-xa-ink">{toDelete?.clientName}</span> will be removed
            from your website right away. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete testimonial"
        onConfirm={confirmDelete}
      />
    </>
  );
}
