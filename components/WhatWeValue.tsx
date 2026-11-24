import { Heart, Lightbulb, Rocket, Ruler, Shield, Sparkles, Target, Users, type LucideIcon } from "lucide-react";
import type { CareersContent, ValueIcon } from "@/lib/site/schema";

const ICONS: Record<ValueIcon, LucideIcon> = {
  lightbulb: Lightbulb,
  ruler: Ruler,
  target: Target,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
  shield: Shield,
  rocket: Rocket,
};

// Cards alternate between the two brand oranges, as before.
const COLORS = ["#FF6600", "#E69700"];

export function WhatWeValue({ content }: { content: CareersContent["values"] }) {
  const values = content.items.map((v, i) => ({ ...v, icon: ICONS[v.icon], color: COLORS[i % 2] }));
  return (
    <section className="w-full max-w-[1280px] mx-auto px-6 py-[80px] lg:py-[100px]">
      <div className="flex flex-col items-center mb-[60px] text-center">
        <h2 className="text-[32px] md:text-[42px] font-bold text-white mb-4">
          {content.title}
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
