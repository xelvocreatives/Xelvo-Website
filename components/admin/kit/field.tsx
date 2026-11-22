import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-xa-line-strong bg-[#101010] px-4 text-[15px] text-xa-ink transition-[border-color,box-shadow] duration-200 outline-none hover:border-white/25 focus:border-xa-accent focus:shadow-[0_0_0_3px_rgb(255_102_0/0.18)] aria-[invalid=true]:border-xa-red/70 aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgb(255_122_114/0.18)] disabled:opacity-60";

/** Label + control + hint/error, with the error announced to screen readers. */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  counter,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  optional?: boolean;
  counter?: { value: number; max: number };
  children: React.ReactNode;
  className?: string;
}) {
  const over = counter && counter.value > counter.max;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-xa-ink">
          {label}
          {optional && <span className="ml-1.5 font-normal text-xa-muted">(optional)</span>}
        </label>
        {counter && (
          <span className={cn("text-xs tabular-nums", over ? "text-xa-red" : "text-xa-faint")}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-[13px] text-xa-red">
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-relaxed text-xa-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function fieldA11y(id: string, error?: string | null, hint?: boolean) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}
