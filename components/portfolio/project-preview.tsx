"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreviewProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
};

/**
 * Clear, distraction-free view of one project: the image contained (never
 * cropped), a thumbnail strip, swipe and arrow-key navigation, and the story.
 */
export function ProjectPreview({
  project,
  startIndex = 0,
  onClose,
}: {
  project: PreviewProject | null;
  startIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = React.useState(startIndex);
  const touchStart = React.useRef<number | null>(null);
  const count = project?.images.length ?? 0;

  React.useEffect(() => setIndex(startIndex), [project, startIndex]);

  const go = React.useCallback(
    (by: number) => setIndex((i) => (count ? (i + by + count) % count : 0)),
    [count],
  );

  return (
    <Dialog.Root open={project !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-[#070707] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed inset-0 z-[91] flex flex-col font-sans text-white outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:flex-row"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
          aria-describedby={undefined}
        >
          {project && (
            <>
              {/* Image stage */}
              <div className="relative flex min-h-0 flex-1 flex-col">
                <div
                  className="relative min-h-0 flex-1 touch-pan-y"
                  onPointerDown={(e) => (touchStart.current = e.clientX)}
                  onPointerUp={(e) => {
                    if (touchStart.current === null) return;
                    const dx = e.clientX - touchStart.current;
                    touchStart.current = null;
                    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                  }}
                >
                  {project.images.map((src, i) => (
                    <Image
                      key={src}
                      src={src}
                      alt={`${project.title}, image ${i + 1} of ${count}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      priority={i === index}
                      className={cn(
                        "object-contain p-4 transition-opacity duration-500 ease-out sm:p-8",
                        i === index ? "opacity-100" : "pointer-events-none opacity-0",
                      )}
                    />
                  ))}
                </div>

                {count > 1 && (
                  <div className="flex shrink-0 items-center justify-center gap-2 overflow-x-auto px-4 pb-4 sm:pb-6">
                    {project.images.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show image ${i + 1} of ${count}`}
                        aria-current={i === index ? "true" : undefined}
                        className={cn(
                          "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 transition-[box-shadow,opacity] duration-300 sm:h-16 sm:w-16",
                          i === index ? "opacity-100 ring-[#FF6600]" : "opacity-55 ring-transparent hover:opacity-90",
                        )}
                      >
                        <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Story */}
              <aside className="max-h-[38dvh] shrink-0 overflow-y-auto border-t border-white/8 bg-[#0d0d0d] px-6 py-6 lg:max-h-none lg:w-[380px] lg:border-t-0 lg:border-l lg:px-8 lg:py-10">
                <Dialog.Title className="text-2xl leading-tight font-bold text-balance sm:text-[28px] lg:pr-10">
                  {project.title}
                </Dialog.Title>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white/70">{project.category}</p>
                  {count > 1 && (
                    <p className="text-sm text-white/55 tabular-nums" aria-live="polite">
                      {index + 1} / {count}
                    </p>
                  )}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-white/75">{project.description}</p>

                <div className="mt-8 border-t border-white/8 pt-6">
                  <p className="text-sm text-white/60">Want work like this for your brand?</p>
                  <Link
                    href="/#contact"
                    onClick={onClose}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#FF6600,#FF7700)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start a project
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
                {count > 1 && (
                  <p className="mt-6 hidden text-xs text-white/55 lg:block">Tip: use ← → keys to browse the images.</p>
                )}
              </aside>

              <Dialog.Close
                aria-label="Close preview"
                className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-[#1c1c1c] text-white ring-1 ring-white/15 transition-colors hover:bg-[#2a2a2a] focus-visible:outline-2 focus-visible:outline-[#FF6600]"
              >
                <X className="size-5" />
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
