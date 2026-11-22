"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle } from "lucide-react";
import { XaButton } from "./button";

/**
 * In-app confirmation for destructive or important actions (never
 * window.confirm). Wrap any trigger element; `onConfirm` may be async and the
 * dialog stays open with a spinner until it settles.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  async function handleConfirm(event: React.MouseEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(next) => !busy && setOpen(next)}>
      {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="xa fixed inset-0 z-[80] bg-black/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <AlertDialog.Content className="xa fixed top-1/2 left-1/2 z-[81] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-xa-line-strong bg-xa-panel p-6 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.8)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex gap-4">
            {destructive && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-xa-red/12 text-xa-red">
                <AlertTriangle className="size-5" aria-hidden />
              </span>
            )}
            <div className="min-w-0 space-y-2">
              <AlertDialog.Title className="text-lg font-bold text-xa-ink">{title}</AlertDialog.Title>
              <AlertDialog.Description className="text-sm leading-relaxed text-xa-muted">
                {description}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <XaButton variant="secondary" disabled={busy}>
                {cancelLabel}
              </XaButton>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <XaButton
                variant={destructive ? "danger" : "primary"}
                loading={busy}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </XaButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
