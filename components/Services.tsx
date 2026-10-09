import { Palette, Megaphone, Globe, ArrowRight } from "lucide-react";
import { GradientText } from "./ui/GradientText";

export function Services() {
  const services = [
    {
      icon: Palette,
      title: "Unique Brand Identity",
      description:
        "Custom logo design, comprehensive brand systems, and unique visual language that sets you apart in the global market.",
      features: [
        "Logo Design",
        "Brand Guidelines",
        "Visual Language",
        "Brand Strategy",
      ],
    },
    {
      icon: Megaphone,
      title: "Engaging Social Graphics & Ads",
      description:
        "High-converting visuals designed for social media and advertising campaigns that follow ethical marketing principles.",
      features: [
        "Social Media Design",
        "Ad Campaigns",
        "Content Graphics",
        "Performance Focused",
      ],
    },
    {
      icon: Globe,
      title: "Website That Sells 24/7",
      description:
        "Conversion-focused web design with trust-driven layouts that turn visitors into customers around the clock.",
      features: [
        "Landing Pages",
        "E-commerce",
        "UI/UX Design",
        "Conversion Optimization",
      ],
    },
  ];

  return (
    <section
      id="services"
      className="py-20 lg:py-[140px] max-w-[1028px] mx-auto flex flex-col justify-center items-center gap-12 lg:gap-[85px] px-4"
    >
      {/* Section Title */}
      <h2 className="text-3xl lg:text-[48px] font-bold text-center leading-tight lg:leading-[60px] text-white">
        <GradientText>Shariah-Compliant</GradientText> Visual Communication &
        Marketing Solutions to Grow & Scale Your Brand in Global Markets
      </h2>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full place-items-center">
        {services.map((service, index) => (
          <div
            key={index}
            className="w-full max-w-[315px] h-auto min-h-[385px] flex flex-col justify-between px-[21px] py-[24px] rounded-[20px] bg-[#FF6600] cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white group border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col gap-6">
              <div className="w-[21px] h-[21px] rounded-full bg-white flex items-center justify-center shrink-0 group-hover:bg-[#FF6600] group-hover:text-white" />
              <h3 className="text-[26px] font-bold leading-[31px] text-white group-hover:text-black">
                {service.title}
              </h3>

              <p className="text-[16px] font-medium leading-[24px] text-white group-hover:text-black">
                {service.description}
              </p>
              <ul className="flex flex-col gap-2 mt-4">
                {service.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-[16px] font-medium leading-[24px] text-white group-hover:text-black"
                  >
                    <span className="w-[7px] h-[7px] rounded-full bg-white group-hover:bg-[#FF6600] flex items-center justify-center shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <p className="text-[16px] font-medium leading-[24px] text-white">
          Let&apos;s create something amazing together!
        </p>
        <div className="relative inline-block group w-full lg:w-auto">
          {/* Main button */}
          <button
            className="relative w-full lg:w-auto px-8 py-4 rounded-[10px] font-semibold text-[16px] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
              boxShadow:
                "0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <span>Start your success journey</span>
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
