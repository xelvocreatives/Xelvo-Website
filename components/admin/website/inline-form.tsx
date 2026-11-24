"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { XaButton } from "@/components/admin/kit/button";
import { ConfirmDialog } from "@/components/admin/kit/confirm-dialog";
import type { SiteSaveResult } from "@/app/actions/site";
import { useDraft, useLeaveWarning, type Draft } from "./form-kit";

/**
 * A whole-page form with a save bar that sticks to the bottom of the screen
 * while there are unsaved changes, so Save is never out of reach.
 */
export function InlineForm<T>({
  initial,
  defaults,
  schema,
  onSave,
  children,
}: {
  initial: T;
  defaults?: T;
  schema: z.ZodType<T>;
  onSave: (value: T) => Promise<SiteSaveResult>;
  children: (draft: Draft<T>) => React.ReactNode;
}) {
  const draft = useDraft(initial, schema);
  const [busy, setBusy] = React.useState(false);
  useLeaveWarning(draft.dirty);
  const isDefault = defaults !== undefined && JSON.stringify(draft.value) === JSON.stringify(defaults);

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
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {children(draft)}
      <div
        className={cn(
          "z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors",
          // Pinned to the screen only while there is something to save.
          draft.dirty
            ? "sticky bottom-20 border-xa-line-strong bg-xa-raised shadow-[0_16px_40px_-12px_rgb(0_0_0/0.8)] lg:bottom-4"
            : "border-xa-line bg-xa-panel",
        )}
      >
        <p className="text-sm text-xa-muted" aria-live="polite">
          {busy ? "Saving…" : draft.dirty ? "You have unsaved changes." : "Everything is saved."}
        </p>
        <div className="flex gap-2">
          {defaults !== undefined && (
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
          )}
          <XaButton type="submit" variant="primary" size="sm" loading={busy} disabled={busy || !draft.dirty}>
            Save changes
          </XaButton>
        </div>
      </div>
    </form>
  );
}
