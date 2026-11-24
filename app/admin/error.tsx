"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CloudOff, RotateCcw } from "lucide-react";
import { XaButton } from "@/components/admin/kit/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-xa-line bg-xa-panel p-8 text-center">
      <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-xa-red/12 text-xa-red">
        <CloudOff className="size-5" aria-hidden />
      </span>
      <h1 className="text-xl font-bold text-xa-ink">This page couldn&apos;t load</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-xa-muted">
        Usually this means the connection dropped for a moment. Try again; if it keeps happening, contact your
        developer.
      </p>
      {error.digest && <p className="mt-3 text-xs text-xa-muted">Reference: {error.digest}</p>}
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <XaButton variant="primary" onClick={reset}>
          <RotateCcw />
          Try again
        </XaButton>
        <XaButton asChild variant="secondary">
          <Link href="/admin">Go to Home</Link>
        </XaButton>
      </div>
    </div>
  );
}
