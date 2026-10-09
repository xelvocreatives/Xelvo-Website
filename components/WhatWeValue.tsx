import { Lightbulb, Ruler, Target, Heart } from "lucide-react";

const values = [
  {
    title: "Ideas Over Noise",
    description:
      "We value substance and strategy over trends and gimmicks. Every project should have purpose.",
    icon: Lightbulb,
    color: "#FF6600",
  },
  {
    title: "Craft & Execution",
    description:
      "Details matter. We respect the process, refine until it's right, and deliver work we're proud of.",
    icon: Ruler,
    color: "#E69700",
  },
  {
    title: "Ownership & Accountability",
    description:
      "We take responsibility for our work, own our mistakes, and constantly push to improve.",
    icon: Target,
    color: "#FF6600",
  },
  {
    title: "Meaningful Work",
    description:
      "We believe creativity should serve a greater purpose - helping brands grow and make an impact.",
    icon: Heart,
    color: "#E69700",
  },
];

export function WhatWeValue() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-6 py-[80px] lg:py-[100px]">
      <div className="flex flex-col items-center mb-[60px] text-center">
        <h2 className="text-[32px] md:text-[42px] font-bold text-white mb-4">
          What We Value
        </h2>
        <div className="w-20 h-1 bg-[#FF6600] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {values.map((value, index) => (
          <div
            key={index}
            className="group relative bg-[#1A1A1A] border border-white/5 p-8 lg:p-10 rounded-[24px] overflow-hidden transition-all duration-500 hover:border-[#FF6600]/30 hover:translate-y-[-5px]"
          >
            {/* Background Glow */}
            <div
              className="absolute -right-10 -top-10 w-32 h-32 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: value.color }}
            />

            <div className="relative z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `${value.color}15`,
                  border: `1px solid ${value.color}30`,
                }}
              >
                <value.icon size={28} className="text-[#FF6600]" />
              </div>

              <h3 className="text-[22px] lg:text-[24px] font-bold text-white mb-4">
                {value.title}
              </h3>
              <p className="text-[16px] lg:text-[17px] text-[#A0A0A0] leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
