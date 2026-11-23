"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { PostHeading } from "@/types";

/**
 * The journal spine on the article page: a gradient reading-progress bar
 * pinned under the header, and a contents rail whose active marker follows
 * the section being read.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = React.useState(0);
  const [top, setTop] = React.useState(0);
  React.useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // The site header is fixed and shrinks on scroll; sit the bar on its bottom edge.
    const siteHeader = document.querySelector("body header");
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setTop(Math.max(0, Math.round(siteHeader?.getBoundingClientRect().bottom ?? 0)));
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.6;
        setProgress(Math.min(1, Math.max(0, (-rect.top + window.innerHeight * 0.2) / Math.max(total, 1))));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
      style={{ top }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,#E69700,#FF6600)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const [active, setActive] = React.useState(headings[0]?.id ?? "");

  React.useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-semibold text-white">On this page</p>
      <ol className="relative space-y-0.5 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-[linear-gradient(to_bottom,rgb(255_255_255/0.22),rgb(255_255_255/0.05))]">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative block py-1.5 leading-snug transition-colors before:absolute before:inset-y-0 before:left-[-0.5px] before:w-[2px] before:rounded-full before:bg-[linear-gradient(to_bottom,#E69700,#FF6600)] before:transition-opacity",
                  h.level === 3 ? "pl-7" : "pl-4",
                  isActive ? "font-medium text-white before:opacity-100" : "text-white/55 before:opacity-0 hover:text-white/85",
                )}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
