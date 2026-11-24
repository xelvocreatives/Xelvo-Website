"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PortfolioCard } from "./portfolio-card";
import { PortfolioStage } from "./portfolio-stage";
import { ProjectPreview, type PreviewProject } from "./project-preview";

export type PortfolioProject = PreviewProject & { isFeatured: boolean };

type Category = { key: string; label: string; count: number };

const keyOf = (category: string) => category.trim().toLowerCase();

/** Filter chips come straight from the categories typed in the admin. */
function categoriesOf(projects: PortfolioProject[]): Category[] {
  const map = new Map<string, Category>();
  for (const p of projects) {
    const key = keyOf(p.category);
    if (!key) continue;
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else map.set(key, { key, label: p.category.trim(), count: 1 });
  }
  return [...map.values()];
}

export function PortfolioExperience({ projects }: { projects: PortfolioProject[] }) {
  const [filter, setFilter] = React.useState("all");
  const [open, setOpen] = React.useState<{ project: PreviewProject; image: number } | null>(null);

  const featured = projects.filter((p) => p.isFeatured);
  const categories = categoriesOf(projects);
  const visible = filter === "all" ? projects : projects.filter((p) => keyOf(p.category) === filter);

  return (
    <>
      {featured.length > 0 && (
        <PortfolioStage projects={featured} onOpen={(project) => setOpen({ project, image: 0 })} />
      )}

      <section aria-labelledby="all-work" className={featured.length > 0 ? "mt-5" : ""}>
        <h2 id="all-work" className="sr-only">
          All work, {visible.length} {visible.length === 1 ? "project" : "projects"}
        </h2>
        <div className="mb-6 sm:mb-8">
          {categories.length > 1 && (
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {[{ key: "all", label: "All", count: projects.length }, ...categories].map((c) => {
                const active = filter === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setFilter(c.key)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-300",
                      active
                        ? "bg-[linear-gradient(135deg,#E69700,#FF6600)] text-[#160a00]"
                        : "border border-white/12 text-white/70 hover:border-white/30 hover:text-white",
                    )}
                  >
                    {c.label}
                    <span className={cn("tabular-nums", active ? "text-[#160a00]/70" : "text-white/40")}>{c.count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-lg font-semibold text-white">New work is on its way.</p>
            <p className="mt-2 text-white/60">
              In the meantime,{" "}
              <Link href="/#contact" className="text-[#FF8A3D] underline-offset-4 hover:underline">
                tell us about your project
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul
            key={filter}
            className="columns-1 gap-4 animate-in fade-in-0 duration-500 sm:columns-2 sm:gap-5 lg:columns-3 [&>li]:mb-4 sm:[&>li]:mb-5"
          >
            {visible.map((project, i) => (
              <li key={project.id} className="break-inside-avoid">
                <PortfolioCard
                  item={project}
                  delayIndex={i}
                  priority={i < 3 && featured.length === 0}
                  onOpen={(image) => setOpen({ project, image })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProjectPreview project={open?.project ?? null} startIndex={open?.image ?? 0} onClose={() => setOpen(null)} />
    </>
  );
}
