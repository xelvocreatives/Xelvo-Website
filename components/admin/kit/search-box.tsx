"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "./field";

/** Search that writes ?q= to the URL (debounced), keeping the status filter. */
export function SearchBox({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get("q") ?? "");

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      const trimmed = value.trim();
      if (trimmed === (searchParams.get("q") ?? "")) return;
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
    }, 250);
    return () => clearTimeout(handle);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-xa-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(inputClass, "h-10 pr-9 pl-10 text-sm [&::-webkit-search-cancel-button]:hidden")}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-xa-muted hover:text-xa-ink"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
