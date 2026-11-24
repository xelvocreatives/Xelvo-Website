"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_ORDER,
  LEAD_STATUS_ORDER,
  statusInfo,
} from "@/lib/admin-format";
import { updateInquiryStatus } from "@/app/actions/inquire";
import { updateApplicationStatus } from "@/app/actions/career";
import { toneClasses } from "./kit/status-pill";

/**
 * The status as a set of plain choices; picking one saves immediately and
 * shows the result at once (rolled back if saving fails).
 */
export function StatusControl({
  kind,
  id,
  status,
}: {
  kind: "lead" | "application";
  id: string;
  status: string;
}) {
  const [current, setCurrent] = React.useState(status);
  const [pending, setPending] = React.useState<string | null>(null);
  const order = kind === "lead" ? LEAD_STATUS_ORDER : APPLICATION_STATUS_ORDER;

  React.useEffect(() => setCurrent(status), [status]);

  async function choose(next: string) {
    if (next === current || pending) return;
    const previous = current;
    setCurrent(next);
    setPending(next);
    const result =
      kind === "lead" ? await updateInquiryStatus(id, next) : await updateApplicationStatus(id, next);
    setPending(null);
    if (result.success) {
      toast.success(`Marked as ${statusInfo(kind, next).label.toLowerCase()}.`);
    } else {
      setCurrent(previous);
      toast.error(result.error ?? "Couldn't update the status. Please try again.");
    }
  }

  return (
    <div role="radiogroup" aria-label="Status" className="grid gap-1.5">
      {order.map((value) => {
        const info = statusInfo(kind, value);
        const selected = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => choose(value)}
            disabled={pending !== null && !selected}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-200 disabled:opacity-60",
              selected
                ? "border-white/20 bg-white/[0.07]"
                : "border-transparent hover:border-xa-line-strong hover:bg-white/[0.03]",
            )}
          >
            <span className={cn("size-2.5 shrink-0 rounded-full", toneClasses[info.tone].dot)} aria-hidden />
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm font-semibold", selected ? "text-xa-ink" : "text-xa-muted")}>
                {info.label}
              </span>
              <span className="block truncate text-xs text-xa-muted">{info.hint}</span>
            </span>
            {pending === value ? (
              <Loader2 className="size-4 animate-spin text-xa-muted" aria-label="Saving" />
            ) : selected ? (
              <Check className="size-4 text-xa-ink" aria-hidden />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
