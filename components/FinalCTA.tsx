import type { HomeSections } from "@/lib/site/schema";
import { CtaLink } from "./site/cta-link";

export function FinalCTA({ content }: { content: HomeSections["cta"] }) {
  return (
    <section className="w-full px-4 py-[60px] lg:py-[120px] max-w-[1280px] mx-auto flex justify-center items-center">
      <CtaLink
        href={content.href}
        className="w-full h-[100px] lg:h-[200px] rounded-[20px] flex justify-center items-center text-center"
        style={{
          background: "linear-gradient(135deg, #FF6600 0%, #E69700 100%)",
          boxShadow: "0 20px 60px rgba(255, 102, 0, 0.4)",
        }}
      >
        <h2 className="text-[34px] leading-tight md:text-[60px] lg:text-[90px] lg:leading-[130px] font-bold text-white px-4">
          {content.title}
        </h2>
      </CtaLink>
    </section>
  );
}
