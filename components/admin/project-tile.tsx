import * as React from "react";
import Image from "next/image";
import { House, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * A project as the owner thinks of it: the image first, name and category
 * over it, and where it shows on the website.
 */
export function ProjectTile({
  project,
  size = "md",
  actions,
  className,
  sizes,
}: {
  project: Project;
  size?: "md" | "lg";
  actions?: React.ReactNode;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[14px] bg-xa-panel ring-1 ring-xa-line transition-[box-shadow] duration-300 hover:ring-white/20",
        size === "lg" ? "aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[340px]" : "aspect-[4/3]",
        className,
      )}
    >
      {project.imageUrl ? (
        <Image
          src={project.imageUrl}
          alt=""
          fill
          sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 400px"}
          className="-z-10 object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center text-xa-faint">
          <ImageOff className="size-8" aria-hidden />
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[linear-gradient(to_top,rgb(0_0_0/0.92),rgb(0_0_0/0.7)_35%,rgb(0_0_0/0.25)_70%,transparent)]"
        aria-hidden
      />

      <div className="absolute top-3 left-3 flex gap-2">
        {project.isFeatured && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-xa-accent px-2.5 py-1 text-[11px] font-bold text-xa-on-accent">
            <House className="size-3" aria-hidden />
            On home page
          </span>
        )}
      </div>
      {actions && <div className="absolute top-3 right-3 z-10">{actions}</div>}

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="mb-1 truncate text-xs font-semibold text-white/75">{project.category}</p>
        <h3
          className={cn(
            "font-bold tracking-[-0.01em] text-balance text-white",
            size === "lg" ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
          )}
        >
          {project.title}
        </h3>
      </div>
    </div>
  );
}
