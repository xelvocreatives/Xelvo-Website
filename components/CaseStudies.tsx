"use client";

import * as React from "react";
import Image from "next/image";
import { GradientText } from "./ui/GradientText";
import type { Project } from "@/types";
import type { HomeSections } from "@/lib/site/schema";
import { HighlightedText } from "./site/highlighted-text";
import { ProjectPreview, type PreviewProject } from "./portfolio/project-preview";
import { useAutoAdvance } from "./portfolio/use-auto-advance";

/**
 * The case-study image area (same size and corners as before). Several images
 * crossfade on their own with pill dots; clicking opens the project preview.
 */
function CaseVisual({
  project,
  onOpen,
}: {
  project: PreviewProject;
  onOpen: (image: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const { index, setIndex } = useAutoAdvance({
    count: project.images.length,
    ref,
    paused: hovered,
    interval: 3800,
    delay: 600,
  });

  return (
    <div
      ref={ref}
      className="relative w-full full min-h-[220px] max-h-[220px] md:min-w-[670px] max-w-[670px] rounded-[16px] overflow-hidden"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {project.images.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
          style={{ background: `url(${src}) center/cover no-repeat` }}
        />
      ))}
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View project: ${project.title}`}
        className="absolute inset-0 z-10 cursor-zoom-in rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6600]"
      />
      {project.images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-full bg-[#0b0b0b]/75 px-1">
          {project.images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${project.images.length}`}
              aria-current={index === i ? "true" : undefined}
              className="group/dot flex h-6 min-w-6 items-center justify-center px-1"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${index === i ? "w-5 bg-[#FF6600]" : "w-1.5 bg-white/60 group-hover/dot:bg-white"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CaseStudiesProps {
  projects?: Project[];
  content: HomeSections["featured"];
}

export function CaseStudies({ projects = [], content }: CaseStudiesProps) {
  const [open, setOpen] = React.useState<{ project: PreviewProject; image: number } | null>(null);

  const CTACase = content.ctaCard.show
    ? [
        {
          name: content.ctaCard.title,
          description: content.ctaCard.description,
          cta: true,
          imageUrl: null,
          project: null,
        },
      ]
    : [];

  const projectItems = projects.map((p) => ({
    name: p.title,
    description: p.description,
    cta: false,
    imageUrl: p.imageUrl,
    project:
      p.images.length > 0
        ? { id: p.id, title: p.title, category: p.category, description: p.description, images: p.images }
        : null,
  }));

  const itemsToDisplay = [...projectItems, ...CTACase];

  return (
    <section
      id="featured"
      className="py-20 lg:py-[170px] max-w-[1280px] mx-auto flex flex-col items-center gap-[32px] px-4"
    >
      {/* Section Title */}
      <h2 className="text-3xl lg:text-[48px] font-bold leading-tight lg:leading-[53px] text-white max-w-6xl text-center mx-auto">
        <HighlightedText value={content.title} />
      </h2>

      <p className="text-[14px] font-normal leading-[22px] text-white/70 text-center mx-auto">
        {content.description}
      </p>

      {/* Case Studies */}
      <div className="mt-[32px] w-full flex flex-col gap-[20px]">
        {itemsToDisplay.map((caseStudy, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col justify-between md:flex-row gap-[30px] items-center p-6 lg:p-[15px] ${
                index % 2 === 0 ? "lg:pl-[40px]" : "lg:pr-[40px]"
              } bg-white rounded-[20px] min-h-[250px] md:max-h-[250px] ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className={`relative`}>
                {/* Text Content */}
                <div
                  className={`flex flex-col ${
                    index % 2 === 0
                      ? "items-center lg:items-start text-center lg:text-start gap-[16px]"
                      : "items-center lg:items-end text-center lg:text-end"
                  }`}
                >
                  <h3 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[44px] mb-2 lg:mb-0">
                    <GradientText>{caseStudy.name}</GradientText>
                  </h3>

                  <p className="text-base lg:text-[20px] font-normal leading-[28px] text-black">
                    {caseStudy.description}
                  </p>
                </div>
                {caseStudy.cta && (
                  <Image
                    className="mt-4 mr-[120px] hidden md:block"
                    src="/images/cta-arrow.svg"
                    alt="cta-arrow"
                    width={300}
                    height={70}
                  />
                )}
              </div>

              {/* Visual Block */}
              {caseStudy.project ? (
                <CaseVisual
                  project={caseStudy.project}
                  onOpen={(image) => setOpen({ project: caseStudy.project!, image })}
                />
              ) : (
                <div
                  className={`w-full full min-h-[220px] max-h-[220px] md:min-w-[670px] max-w-[670px] rounded-[16px]`}
                  style={{
                    background: caseStudy.imageUrl
                      ? `url(${caseStudy.imageUrl}) center/cover no-repeat`
                      : "rgb(255 102 0 / 25%)",
                    border: caseStudy.imageUrl ? "" : "2px dashed #FF6600",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <ProjectPreview project={open?.project ?? null} startIndex={open?.image ?? 0} onClose={() => setOpen(null)} />
    </section>
  );
}
