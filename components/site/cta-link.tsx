"use client";

import * as React from "react";

/**
 * A call-to-action link.
 * - "#section" links glide to that section (clear of the fixed header) and,
 *   on devices with a mouse, put the cursor in the first form field so the
 *   visitor can start typing straight away.
 * - Web addresses on other sites open in a new tab.
 * - Paths, email and phone links behave like normal links; no link = not clickable.
 */
export function CtaLink({
  href,
  children,
  ...rest
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href?: string }) {
  const external = /^https?:\/\//i.test(href ?? "");

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    rest.onClick?.(e);
    if (e.defaultPrevented || !href?.startsWith("#") || href.length < 2) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return; // let the browser handle it

    e.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (window.location.hash !== href) window.history.pushState(null, "", href);

    // Opening the keyboard mid-scroll is jarring on phones, so only focus with a mouse.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const field = target.querySelector<HTMLElement>(
        "input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled])",
      );
      field?.focus({ preventScroll: true });
    }
  }

  return (
    <a
      {...rest}
      href={href || undefined}
      onClick={onClick}
      {...(external && !rest.target ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
