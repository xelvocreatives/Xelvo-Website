import Link from "next/link";
import { cn } from "@/lib/utils";

export type FilterTab = { value: string; label: string; count: number };

/** Status filter as links (?status=…), so the filter survives refresh and sharing. */
export function FilterTabs({
  basePath,
  tabs,
  active,
  query,
}: {
  basePath: string;
  tabs: FilterTab[];
  active: string;
  query?: string;
}) {
  return (
    <nav aria-label="Filter by status" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-1.5">
        {tabs.map((tab) => {
          const params = new URLSearchParams();
          if (tab.value !== "all") params.set("status", tab.value);
          if (query) params.set("q", query);
          const href = params.size ? `${basePath}?${params}` : basePath;
          const isActive = active === tab.value;
          return (
            <li key={tab.value}>
              <Link
                href={href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                  isActive
                    ? "border-xa-ink bg-xa-ink text-xa-ground"
                    : "border-xa-line-strong text-xa-muted hover:border-white/25 hover:text-xa-ink",
                )}
              >
                {tab.label}
                <span className={cn("tabular-nums", isActive ? "text-xa-ground/70" : "text-xa-faint")}>
                  {tab.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
