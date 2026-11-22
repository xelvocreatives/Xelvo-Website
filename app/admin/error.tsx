"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

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
    <div className="p-10 bg-red-500/5 border border-red-500/20 rounded-[32px] text-center space-y-6 max-w-2xl mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <AlertTriangle size={28} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Something went wrong
        </h2>
        <p className="text-gray-400">
          The admin panel couldn&apos;t load this data. If the database was
          asleep or the connection dropped, trying again usually fixes it.
        </p>
        {error.digest && (
          <p className="text-gray-600 text-xs font-mono">Ref: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6600] text-white font-bold hover:bg-[#FF7700] transition-colors"
      >
        <RotateCcw size={16} />
        Try again
      </button>
    </div>
  );
}
