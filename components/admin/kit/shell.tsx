"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  Globe,
  House,
  Images,
  LogOut,
  MessageSquareText,
  Newspaper,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import BrandLogo from "@/public/images/brand-logo.png";

type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function Badge({ count, compact }: { count?: number; compact?: boolean }) {
  if (!count) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-xa-accent font-bold text-xa-on-accent tabular-nums",
        compact ? "absolute -top-1 left-1/2 ml-1.5 h-4 min-w-4 px-1 text-[10px]" : "h-5 px-1.5 text-[11px]",
      )}
      aria-label={`${count} new`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function AdminShell({
  counts,
  email,
  children,
}: {
  counts: { newLeads: number; newApplications: number };
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/admin", label: "Home", short: "Home", icon: House },
    { href: "/admin/inquiries", label: "Leads", short: "Leads", icon: MessageSquareText, badge: counts.newLeads },
    {
      href: "/admin/careers",
      label: "Job applications",
      short: "Jobs",
      icon: Briefcase,
      badge: counts.newApplications,
    },
    { href: "/admin/projects", label: "Projects", short: "Projects", icon: Images },
    { href: "/admin/testimonials", label: "Testimonials", short: "Reviews", icon: Quote },
    { href: "/admin/blog", label: "Blog", short: "Blog", icon: Newspaper },
    { href: "/admin/website", label: "Website", short: "Website", icon: Globe },
  ];

  return (
    <div className="xa min-h-dvh bg-xa-ground text-xa-ink">
      <a
        href="#xa-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-xa-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-xa-on-accent"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-xa-line bg-[#0e0e0e] lg:flex">
        <Link href="/admin" className="flex h-[76px] items-center px-6" aria-label="Xelvo Creatives admin home">
          <Image src={BrandLogo} alt="Xelvo Creatives" height={34} className="h-[34px] w-auto" priority />
        </Link>

        <nav aria-label="Admin" className="flex-1 space-y-1 px-3 pt-2">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors duration-200",
                  active ? "bg-white/[0.07] text-xa-ink" : "text-xa-muted hover:bg-white/[0.04] hover:text-xa-ink",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] transition-colors",
                    active ? "text-xa-accent" : "text-xa-faint group-hover:text-xa-muted",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                <Badge count={item.badge} />
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-xa-line px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-xa-muted transition-colors hover:bg-white/[0.04] hover:text-xa-ink"
          >
            <ExternalLink className="size-4 text-xa-faint" />
            View website
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-xa-muted transition-colors hover:bg-white/[0.04] hover:text-xa-ink"
            >
              <LogOut className="size-4 text-xa-faint" />
              Log out
            </button>
          </form>
          <p className="truncate px-3 pt-2 text-xs text-xa-muted" title={email}>
            Signed in as {email}
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-xa-line bg-xa-ground/90 px-4 backdrop-blur-md lg:hidden">
        <Link href="/admin" aria-label="Xelvo Creatives admin home">
          <Image src={BrandLogo} alt="Xelvo Creatives" height={26} className="h-[26px] w-auto" priority />
        </Link>
        <div className="flex items-center gap-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            aria-label="View website"
            className="flex size-10 items-center justify-center rounded-lg text-xa-muted hover:bg-white/5 hover:text-xa-ink"
          >
            <ExternalLink className="size-[18px]" />
          </a>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Log out"
              className="flex size-10 items-center justify-center rounded-lg text-xa-muted hover:bg-white/5 hover:text-xa-ink"
            >
              <LogOut className="size-[18px]" />
            </button>
          </form>
        </div>
      </header>

      <main id="xa-main" className="lg:pl-[248px]">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </div>
      </main>

      {/* Mobile tab bar */}
      <nav
        aria-label="Admin"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-7 border-t border-xa-line bg-[#0e0e0e]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                active ? "text-xa-ink" : "text-xa-muted",
              )}
            >
              <span className="relative">
                <Icon className={cn("size-5", active && "text-xa-accent")} />
                <Badge count={item.badge} compact />
              </span>
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
