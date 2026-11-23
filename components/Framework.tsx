import React from "react";
import { HighlightedText } from "./site/highlighted-text";
import type { HomeSections } from "@/lib/site/schema";

// Literal class names so Tailwind generates them.
const LG_COLS: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export function Framework({ content }: { content: HomeSections["framework"] }) {
  // Steps are numbered straight through all phases (1, 2, 3 … 18).
  let counter = 0;
  const phases = content.phases.map((phase) => ({
    title: phase.title,
    steps: phase.steps.map((text) => ({ number: String(++counter), text })),
  }));
  const last = phases.length - 1;

  return (
    <section
      id="framework"
      className="py-20 lg:py-[170px] flex flex-col items-center gap-[36px] bg-white/5 px-4 w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-[16px]">
        <h2 className="text-3xl lg:text-[48px] font-bold leading-tight lg:leading-[52px] text-white text-center">
          <HighlightedText value={content.title} />
        </h2>
        <p className="max-w-[550px] text-center text-[14px] font-normal leading-[22px] text-white/70">
          {content.description}
        </p>
      </div>

      {/* Framework Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${LG_COLS[phases.length] ?? "lg:grid-cols-4"} relative w-full max-w-7xl mx-auto`}>
        {phases.map((phase, index) => {
          // Determine borders based on position and breakpoint
          // Mobile: No vertical borders usually, maybe bottom borders
          // Tablet (md): 2 cols. Index 0 & 2 have right border. Index 0 & 1 have bottom border (maybe)
          // Desktop (lg): 4 cols. Index 0, 1, 2 have right border.

          let borderClasses = "border-white/10 border-b md:border-b-0"; // Default bottom border for mobile stacking

          // Last item doesn't need bottom border on mobile
          if (index === phases.length - 1) borderClasses = "border-none";

          // Tablet borders (2 cols)
          // Right border for odd items (0, 2)
          if (index % 2 === 0) {
            borderClasses += " md:border-r md:border-white";
          }

          // Desktop borders (4 cols)
          // Reset tablet borders
          // Right border for 0, 1, 2. No border for 3.
          if (index < last) {
            borderClasses += " lg:border-r lg:border-white";
          } else {
            borderClasses += " lg:border-r-0";
          }

          // Remove bottom borders for md+ since we have the top line
          borderClasses += " md:border-b-0";

          return (
            <div
              key={phase.title}
              className={`
                  relative py-[27px] px-[30px] lg:px-[55px]
                  ${borderClasses}
                `}
            >
              <h3 className="text-white font-bold mb-[34px] text-[16px] lg:text-[13px] leading-[21px]">
                {phase.title}
              </h3>

              <div className="space-y-[4px]">
                {phase.steps.map((step) => (
                  <div
                    key={step.number}
                    className="w-full md:w-fit flex gap-[12px] items-center bg-white cursor-pointer rounded-full p-[6px] pr-[20px] lg:pr-[40px] shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-300 hover:scale-[1.02] origin-left"
                  >
                    {/* Number Circle */}
                    <div className="z-10 shrink-0 w-[30px] h-[30px] rounded-full bg-[#FF6600] flex items-center justify-center text-white font-bold text-[12px] leading-[12px] shadow-lg">
                      {step.number}
                    </div>

                    {/* Text Pill */}
                    <h6 className="text-black text-[13px] leading-[21px] font-medium whitespace-nowrap">
                      {step.text}
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Global Top Line for Desktop */}
        <div className="absolute top-0 left-0 w-full h-[.5px] bg-[#FFFFFF] hidden md:block" />
      </div>
    </section>
  );
}
