"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/website", label: "Home page" },
  { href: "/admin/website/portfolio", label: "Portfolio page" },
  { href: "/admin/website/careers", label: "Careers page" },
  { href: "/admin/website/blog", label: "Blog page" },
  { href: "/admin/website/contact", label: "Contact & social" },
  { href: "/admin/website/seo", label: "SEO & Google" },
];

/** Sub-navigation for the Website area; scrolls sideways on small screens. */
export function WebsiteTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Website sections" className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-1 rounded-xl border border-xa-line bg-xa-panel p-1">
        {TABS.map((tab) => {
          const active = tab.href === "/admin/website" ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-semibold whitespace-nowrap transition-colors",
                  active ? "bg-white/12 text-xa-ink" : "text-xa-muted hover:bg-white/5 hover:text-xa-ink",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
