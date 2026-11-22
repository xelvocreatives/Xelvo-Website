"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({
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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="text-white/60">
          Please try again. If the problem continues, email us at{" "}
          <a
            href="mailto:hello@xelvocreatives.com"
            className="text-[#FF6600] hover:underline"
          >
            hello@xelvocreatives.com
          </a>
          .
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-[#FF6600] text-white font-semibold hover:bg-[#FF7700] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
