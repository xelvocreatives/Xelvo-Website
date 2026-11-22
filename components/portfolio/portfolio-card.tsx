"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAutoAdvance } from "./use-auto-advance";

export type PortfolioItem = {
  title: string;
  category: string;
  images: string[];
};

/**
 * A "living" portfolio card: images only, at the cover's natural shape.
 * Multi-image projects crossfade on their own (only while on screen, never
 * with reduced motion) and show pill dots; the name and category rise in on
 * hover. Clicking opens the project preview.
 */
export function PortfolioCard({
  item,
  onOpen,
  delayIndex = 0,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority,
  alwaysShowLabel,
  className,
}: {
  item: PortfolioItem;
  onOpen?: (imageIndex: number) => void;
  /** Staggers the auto-advance clock so a wall of cards never flips in unison. */
  delayIndex?: number;
  sizes?: string;
  priority?: boolean;
  /** Admin preview: show the hover label permanently. */
  alwaysShowLabel?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const { index, setIndex } = useAutoAdvance({
    count: item.images.length,
    ref,
    paused: hovered,
    interval: 3800,
    delay: 900 + (delayIndex % 6) * 650,
  });

  const [cover, ...rest] = item.images;
  if (!cover) return null;
  const isBlob = (url: string) => url.startsWith("blob:");

  return (
    <div
      ref={ref}
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8 transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgb(0_0_0/0.9)]",
        className,
      )}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* The cover sets the card's natural height; later images layer over it. */}
      <Image
        src={cover}
        alt=""
        width={1200}
        height={1500}
        sizes={sizes}
        priority={priority}
        unoptimized={isBlob(cover)}
        className={cn(
          "block h-auto w-full transition-[opacity,scale] duration-[900ms] ease-out group-hover:scale-[1.025]",
          index === 0 ? "opacity-100" : "opacity-0",
        )}
      />
      {rest.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={sizes}
          unoptimized={isBlob(src)}
          className={cn(
            "object-cover transition-[opacity,scale] duration-[900ms] ease-out group-hover:scale-[1.025]",
            index === i + 1 ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Label: rises in on hover (pointer devices only). */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.85),rgb(0_0_0/0.4)_55%,transparent)] px-5 pt-16 pb-5 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          alwaysShowLabel ? "opacity-100" : "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <h3 className="text-lg leading-snug font-semibold text-white text-balance">{item.title}</h3>
        <p className="mt-1 text-xs font-medium text-white/70">{item.category}</p>
      </div>

      {/* Whole-card action. */}
      <button
        type="button"
        onClick={() => onOpen?.(index)}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6600]"
        aria-label={`View project: ${item.title}`}
      />

      {item.images.length > 1 && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center rounded-full bg-[#0b0b0b]/75 px-1">
          {item.images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${item.images.length}`}
              aria-current={index === i ? "true" : undefined}
              className="group/dot flex h-6 min-w-6 items-center justify-center px-1"
            >
              <span className={cn("block h-1.5 rounded-full transition-all duration-500", index === i ? "w-5 bg-[#FF6600]" : "w-1.5 bg-white/60 group-hover/dot:bg-white")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
