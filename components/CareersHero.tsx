"use client";

import { ArrowRight } from "lucide-react";
import { GradientText } from "./ui/GradientText";
import Image from "next/image";

export function CareersHero() {
  const scrollToForm = () => {
    const formElement = document.getElementById("careers-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex items-start justify-center pb-[60px] md:pb-[100px] lg:pb-[140px] pt-[120px] md:pt-[160px] lg:pt-[200px]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Top Left Glow */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[50%] h-[60%] bg-[#FF6600]/15 blur-[140px] rounded-full animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        {/* Bottom Right Glow */}
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[60%] bg-[#FF6600]/10 blur-[140px] rounded-full animate-pulse"
          style={{ animationDuration: "12s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center gap-6 lg:gap-[34px]">
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
            Careers @Xelvo Creatives
          </h6>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-[64px] font-bold leading-tight lg:leading-[72px] text-center text-white tracking-tight lg:tracking-[-2px] animate-fade-in-up">
          We&apos;re Always Looking for People Who{" "}
          <GradientText>Care About the Work</GradientText>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-base md:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[32px] text-center text-[#C7C7C7] animate-fade-in-up">
          At Xelvo Creatives, we don&apos;t hire for rigid roles. We look for
          talented minds who value meaningful creativity, take ownership of
          their craft, and believe good work should mean something. If that
          sounds like you, we&apos;d love to hear from you.
        </p>

        {/* Updated CTA Button to match Home Hero */}
        <div className="relative inline-block group w-full lg:w-auto mt-4 animate-fade-in-up">
          <button
            onClick={scrollToForm}
            className="relative w-full lg:w-auto px-8 py-4 rounded-[10px] font-semibold text-[16px] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
              boxShadow:
                "0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <span>Join the Talent Pool</span>
            <ArrowRight
              className="transition-transform duration-300 group-hover:translate-x-1"
              size={18}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
