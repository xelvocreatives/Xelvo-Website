import { ArrowRight } from "lucide-react";
import { HighlightedText } from "./site/highlighted-text";
import { CtaLink } from "./site/cta-link";
import type { HomeSections } from "@/lib/site/schema";

export function Services({ content }: { content: HomeSections["services"] }) {
  const services = content.cards;

  return (
    <section
      id="services"
      className="py-20 lg:py-[140px] max-w-[1028px] mx-auto flex flex-col justify-center items-center gap-12 lg:gap-[85px] px-4"
    >
      {/* Section Title */}
      <h2 className="text-3xl lg:text-[48px] font-bold text-center leading-tight lg:leading-[60px] text-white">
        <HighlightedText value={content.title} />
      </h2>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full place-items-center">
        {services.map((service, index) => {
          // The chosen card is always shown in its hover (white) state.
          const featured = index === content.featuredCard;
          const text = featured ? "text-black" : "text-white group-hover:text-black";
          const dot = featured ? "bg-[#FF6600]" : "bg-white group-hover:bg-[#FF6600]";

          return (
            <div
              key={index}
              className={`w-full max-w-[315px] h-auto min-h-[385px] flex flex-col justify-between px-[21px] py-[24px] rounded-[20px] cursor-pointer transition-all duration-300 group border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.5)] ${
                featured ? "bg-white scale-105" : "bg-[#FF6600] hover:scale-105 hover:bg-white"
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className={`w-[21px] h-[21px] rounded-full flex items-center justify-center shrink-0 ${dot}`} />
                <h3 className={`text-[26px] font-bold leading-[31px] ${text}`}>
                  {service.title}
                </h3>

                <p className={`text-[16px] font-medium leading-[24px] ${text}`}>
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 mt-4">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 text-[16px] font-medium leading-[24px] ${text}`}
                    >
                      <span className={`w-[7px] h-[7px] rounded-full flex items-center justify-center shrink-0 ${dot}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        {content.outro && (
          <p className="text-[16px] font-medium leading-[24px] text-white">{content.outro}</p>
        )}
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
      </div>
    </section>
  );
}
