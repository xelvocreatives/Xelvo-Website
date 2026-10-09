import { Users, Briefcase, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { GradientText } from "./ui/GradientText";

export function TrustMetrics() {
  const metrics = [
    {
      icon: Users,
      number: 50,
      suffix: "+",
      label: "Satisfied Clients",
    },
    {
      icon: Briefcase,
      number: 100,
      suffix: "+",
      label: "Projects Completed",
    },
    {
      icon: TrendingUp,
      number: 30,
      prefix: "$",
      suffix: "M+",
      label: "Revenue Generated",
    },
  ];

  return (
    <section className="py-20 lg:py-[140px] px-4">
      <div className="flex flex-wrap justify-center items-center gap-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="w-full max-w-[405px] px-[44px] py-[35px] z-1 rounded-[24px] transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            style={{
              backgroundImage:
                "linear-gradient(0deg, #000000 0%, #0F0F0F 100%), linear-gradient(180deg, #000000 0%, #E69700 50%, #FF6600 100%)",
              backgroundClip: "padding-box, border-box",
              backgroundOrigin: "padding-box, border-box",
            }}
          >
            <div className="flex flex-col justify-center items-center gap-[12px]">
              <div className="text-[48px] lg:text-[64px] font-bold leading-tight lg:leading-[71px]">
                <GradientText>
                  <AnimatedCounter
                    end={metric.number}
                    prefix={metric.prefix || ""}
                    suffix={metric.suffix}
                    duration={2000}
                  />
                </GradientText>
              </div>
              <div className="text-[24px] lg:text-[32px] font-medium leading-[34px] text-white text-center">
                {metric.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
