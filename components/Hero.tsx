import { ArrowRight } from "lucide-react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import Image from "next/image";
import { HighlightedText } from "./site/highlighted-text";
import { CtaLink } from "./site/cta-link";
import type { HomeSections } from "@/lib/site/schema";

export function Hero({ content }: { content: HomeSections["hero"] }) {
  const people = content.people.map((p, i) => ({ id: i + 1, name: p.name, designation: p.role, image: p.image }));
  return (
    <section className="relative md:min-h-screen flex items-start justify-center overflow-x-clip md:overflow-hidden pb-[150px] md:pb-0 pt-[200px] lg:pt-[180px]">
      {/* Desktop Background Image */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Image
          src="/images/hero-masked-background.svg"
          alt="Particles"
          className="object-cover"
          fill
          quality={100}
          sizes="100vw"
          priority
        />
      </div>

      {/* Mobile/Tablet Gradient Background */}
      <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[50%] bg-[#FF6600]/15 blur-[100px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[50%] bg-[#FF6600]/15 blur-[100px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center flex flex-col items-center justify-center gap-6 lg:gap-[34px]">
        {/* Badge */}
        <div
          className="flex justify-center items-center gap-[12px] px-[19px] py-[12px] rounded-full backdrop-blur-sm"
          style={{
            border: "1px solid #FFFFFF60",
          }}
        >
          <Image
            src="/images/badge-icon.svg"
            alt="Badge Icon"
            width={15}
            height={15}
          />
          <h6 className="text-white text-[12px] font-medium leading-[21px]">
            {content.badge}
          </h6>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-[60px] font-bold leading-tight lg:leading-[66px] text-center text-white tracking-tight lg:tracking-[-3px] [word-spacing:normal] md:[word-spacing:6px]">
          <HighlightedText value={content.title} gradientClassName="mx-[6px]" />
        </h1>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-[20px] font-semibold leading-relaxed lg:leading-[30px] text-center text-[#C7C7C7]">
          <HighlightedText value={content.subtitle} />
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-[24px] w-full">
          {/* CTA Button */}
          <div className="relative inline-block group w-full lg:w-auto">
            {/* Main button */}
            <CtaLink
              href={content.cta.href || "#contact"}
              className="relative w-full lg:w-auto px-8 py-4 rounded-[10px] font-semibold text-[16px] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
                boxShadow:
                  "0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <span>{content.cta.label}</span>
              <ArrowRight
                className="transition-transform duration-300 group-hover:translate-x-1"
                size={18}
              />
            </CtaLink>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {people.length > 0 && (
              <div className="flex justify-center items-center">
                <AnimatedTooltip items={people} />
              </div>
            )}
            <p className="text-[16px] font-medium text-white text-center sm:text-start leading-[22px]">
              <HighlightedText value={content.trustText} breakClassName="hidden sm:block" />
            </p>
          </div>
        </div>

        {/* Add keyframes for pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.75;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
