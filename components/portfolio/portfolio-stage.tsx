"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoAdvance } from "./use-auto-advance";
import type { PreviewProject } from "./project-preview";

/**
 * The opening stage: the studio's home-page projects, one at a time, each
 * shown whole (contained, never cropped) on a blurred, darkened copy of
 * itself, crossfading every few seconds.
 */
export function PortfolioStage({
  projects,
  onOpen,
}: {
  projects: PreviewProject[];
  onOpen: (project: PreviewProject) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const { index, setIndex } = useAutoAdvance({
    count: projects.length,
    ref,
    paused: hovered,
    interval: 5200,
  });

  if (projects.length === 0) return null;
  const active = projects[index];

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Featured work"
      className="relative isolate h-[62svh] min-h-[420px] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8 sm:h-[72svh] sm:max-h-[780px]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {projects.map((project, i) => {
        const cover = project.images[0];
        return (
          <div
            key={project.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={cover}
              alt=""
              fill
              sizes="40vw"
              priority={i === 0}
              className="scale-125 object-cover opacity-45 blur-2xl"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(11_11_11/0.75)_100%)]" />
            <Image
              src={cover}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              priority={i === 0}
              className={cn(
                "object-contain px-4 pt-6 pb-44 drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)] transition-transform duration-[6000ms] ease-out sm:px-10 sm:pt-10 sm:pb-32",
                i === index ? "scale-100" : "scale-[0.97]",
              )}
            />
          </div>
        );
      })}

      {/* Caption + action */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 bg-[linear-gradient(to_top,rgb(11_11_11/0.92),rgb(11_11_11/0.6)_60%,transparent)] px-5 pt-14 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-7">
        <div className="min-w-0" aria-live="polite">
          <h2 className="text-2xl leading-tight font-bold text-balance text-white sm:text-[32px]">{active.title}</h2>
          <p className="mt-1.5 text-sm font-medium text-white/70">{active.category}</p>
        </div>
        <div className="flex items-center justify-between gap-5 sm:justify-end">
          {projects.length > 1 && (
            <div className="flex items-center" role="group" aria-label="Choose featured project">
              {projects.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${project.title}`}
                  aria-current={i === index ? "true" : undefined}
                  className="group/dot flex h-8 min-w-6 items-center justify-center px-1"
                >
                  <span
                    className={cn(
                      "block h-2 rounded-full transition-all duration-500",
                      i === index ? "w-7 bg-[#FF6600]" : "w-2 bg-white/45 group-hover/dot:bg-white/80",
                    )}
                  />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => onOpen(active)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#111] transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6600]"
          >
            View project
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
