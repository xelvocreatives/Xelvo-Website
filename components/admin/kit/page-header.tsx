import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
  back,
  leading,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  leading?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-xa-muted transition-colors hover:text-xa-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {back.label}
          </Link>
        )}
        <div className="flex items-center gap-4">
          {leading}
          <div className="min-w-0 space-y-2">
            <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-balance break-words text-xa-ink sm:text-[34px]">
              {title}
            </h1>
            {description && (
              <div className="max-w-[62ch] text-[15px] leading-relaxed text-xa-muted">{description}</div>
            )}
          </div>
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function SectionHeading({
  title,
  meta,
  action,
}: {
  title: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-lg font-bold tracking-[-0.01em] text-xa-ink">{title}</h2>
        {meta && <span className="text-sm text-xa-muted">{meta}</span>}
      </div>
      {action}
    </div>
  );
}
