"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { EditorPanel } from "@/components/admin/kit/editor-panel";
import { XaButton } from "@/components/admin/kit/button";
import { ConfirmDialog } from "@/components/admin/kit/confirm-dialog";
import type { SiteSaveResult } from "@/app/actions/site";
import { useDraft, type Draft } from "./form-kit";

/**
 * Slide-over form for one block of website content. Validates in the
 * browser first, then saves on the server; "Restore original" fills in the
 * text the website shipped with (it still needs saving).
 */
export function PanelForm<T>({
  open,
  onOpenChange,
  title,
  description,
  initial,
  defaults,
  schema,
  onSave,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initial: T;
  defaults?: T;
  schema: z.ZodType<T>;
  onSave: (value: T) => Promise<SiteSaveResult>;
  children: (draft: Draft<T>) => React.ReactNode;
}) {
  // Remount the form on every open so it starts from the saved content.
  const [session, setSession] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  return (
    <EditorPanel
      open={open}
      onOpenChange={(next) => {
        if (next) setSession((s) => s + 1);
        if (!next) setDirty(false);
        onOpenChange(next);
      }}
      title={title}
      description={description}
      dirty={dirty}
    >
      {(close) => (
        <PanelBody
          key={session}
          initial={initial}
          defaults={defaults}
          schema={schema}
          onSave={onSave}
          onDirty={setDirty}
          close={() => {
            setDirty(false);
            onOpenChange(false);
          }}
          requestClose={close}
        >
          {children}
        </PanelBody>
      )}
    </EditorPanel>
  );
}

function PanelBody<T>({
  initial,
  defaults,
  schema,
  onSave,
  onDirty,
  close,
  requestClose,
  children,
}: {
  initial: T;
  defaults?: T;
  schema: z.ZodType<T>;
  onSave: (value: T) => Promise<SiteSaveResult>;
  onDirty: (dirty: boolean) => void;
  close: () => void;
  requestClose: () => void;
  children: (draft: Draft<T>) => React.ReactNode;
}) {
  const draft = useDraft(initial, schema);
  const [busy, setBusy] = React.useState(false);
  const isDefault = defaults !== undefined && JSON.stringify(draft.value) === JSON.stringify(defaults);

  React.useEffect(() => onDirty(draft.dirty), [draft.dirty, onDirty]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = draft.check();
    if (!clean) return;
    setBusy(true);
    const result = await onSave(clean);
    setBusy(false);
    if (!result.ok) {
      if (result.errors) draft.setErrors(result.errors);
      toast.error(result.message);
      return;
    }
    draft.markSaved(clean);
    toast.success(result.message);
    close();
  }

  return (
    <form onSubmit={submit} className="flex h-full flex-col" noValidate>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-5">{children(draft)}</div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-xa-line bg-xa-ground px-5 py-4 sm:px-8">
        {defaults !== undefined ? (
          <ConfirmDialog
            trigger={
              <XaButton type="button" variant="ghost" size="sm" disabled={isDefault}>
                <RotateCcw />
                Restore original
              </XaButton>
            }
            title="Restore the original text?"
            description="This fills the form with the text your website came with. Nothing changes on the website until you press Save."
            confirmLabel="Restore original"
            destructive={false}
            onConfirm={() => draft.setValue(defaults)}
          />
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <XaButton type="button" variant="ghost" onClick={requestClose}>
            Cancel
          </XaButton>
          <XaButton type="submit" variant="primary" loading={busy} disabled={busy || !draft.dirty}>
            Save changes
          </XaButton>
        </div>
      </div>
    </form>
  );
}
