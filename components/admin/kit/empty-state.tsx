import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-xa-line-strong px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/5 text-xa-muted [&_svg]:size-5">
        {icon}
      </span>
      <h3 className="text-base font-bold text-xa-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-xa-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
