"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";

/**
 * Slide-over editor used for adding and editing content. Closing with unsaved
 * changes asks first, so nobody loses a half-written case study by accident.
 */
export function EditorPanel({
  open,
  onOpenChange,
  title,
  description,
  dirty,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  dirty: boolean;
  /** Receives a close function that respects the unsaved-changes check. */
  children: (requestClose: () => void) => React.ReactNode;
}) {
  const [confirmDiscard, setConfirmDiscard] = React.useState(false);

  function requestClose(next: boolean) {
    if (!next && dirty) {
      setConfirmDiscard(true);
      return;
    }
    onOpenChange(next);
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={requestClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="xa fixed inset-0 z-[60] bg-black/65 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <Dialog.Content
            className="xa fixed inset-y-0 right-0 z-[61] flex w-full max-w-[1120px] flex-col border-l border-xa-line-strong bg-xa-ground text-xa-ink shadow-[-24px_0_60px_-20px_rgb(0_0_0/0.8)] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
            onOpenAutoFocus={(e) => {
              // Focus the first field rather than the close button.
              const first = (e.currentTarget as HTMLElement).querySelector<HTMLElement>(
                "input:not([type=hidden]):not([type=file]), textarea",
              );
              if (first) {
                e.preventDefault();
                first.focus();
              }
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-xa-line px-5 py-4 sm:px-8 sm:py-5">
              <div className="min-w-0">
                <Dialog.Title className="text-xl font-bold tracking-[-0.01em]">{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-xa-muted">{description}</Dialog.Description>
                ) : (
                  <Dialog.Description className="sr-only">{title}</Dialog.Description>
                )}
              </div>
              <Dialog.Close
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted transition-colors hover:bg-white/5 hover:text-xa-ink"
                aria-label="Close"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div className="min-h-0 flex-1">{children(() => requestClose(false))}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Discard your changes?"
        description="You have unsaved changes. If you close now, they'll be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onConfirm={() => onOpenChange(false)}
      />
    </>
  );
}
