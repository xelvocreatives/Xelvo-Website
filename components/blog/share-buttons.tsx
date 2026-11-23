"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = React.useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: "Share on WhatsApp", icon: FaWhatsapp, href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: "Share on LinkedIn", icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "Share on X", icon: FaXTwitter, href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}` },
  ];
  const btn =
    "flex size-11 items-center justify-center rounded-full border border-white/12 text-white/75 transition-colors hover:border-white/35 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6600]";

  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, icon: Icon, href }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={btn}>
          <Icon className="size-4" />
        </a>
      ))}
      <button
        type="button"
        className={btn}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy this link:", url);
          }
        }}
      >
        {copied ? <Check className="size-4 text-[#4ADE80]" /> : <Link2 className="size-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
