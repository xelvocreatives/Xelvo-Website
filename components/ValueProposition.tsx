import { AnimatedTooltip } from "./ui/animated-tooltip";
import { HighlightedText } from "./site/highlighted-text";
import type { HomeSections } from "@/lib/site/schema";

export function ValueProposition({ content }: { content: HomeSections["about"] }) {
  const people = content.people.map((p, i) => ({ id: i + 1, name: p.name, designation: p.role, image: p.image }));
  return (
    <section
      id="about"
      className="py-20 lg:py-[140px] max-w-[1280px] mx-auto px-4"
    >
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0">
        {/* Left: Content Block */}
        <div className="w-full lg:w-[50%] flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
          <div className="flex flex-col gap-[25px] items-center lg:items-start">
            {/* Badge */}
            <div className="max-w-[290px] flex items-center gap-[30px] px-3 py-2 rounded-full bg-[rgba(255,255,255,0.03)] border border-white/20">
              {people.length > 0 && (
                <div className="flex items-center gap-[10px]">
                  <AnimatedTooltip items={people} width={30} height={30} />
                </div>
              )}
              <span className="text-white/80 text-[12px] leading-[13px] font-medium">
                <HighlightedText value={{ text: content.badge, highlight: "" }} />
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl lg:text-[42px] font-bold leading-tight lg:leading-[47px] text-white">
              <HighlightedText value={content.title} />
            </h2>

            {/* Description */}
            <p className="max-w-[540px] text-[18px] leading-[24px] font-medium text-white/70 mt-[10px]">
              {content.description}
            </p>
            {content.points.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4 mt-6">
                {content.points.map((point, i) => (
                  <div key={i} className="flex items-center gap-[10px]">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#FF6600] flex items-center justify-center shrink-0" />
                    <p className="text-[16px] font-medium leading-[24px] text-white/70">{point}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Visual Card Grid */}
        <div className="grid grid-cols-2 gap-4 lg:gap-[16px] w-full lg:w-auto justify-center">
          {/* Column 1 */}
          <div className="space-y-4 lg:space-y-[16px] flex flex-col items-center lg:items-end w-full">
            {/* Tall Dark Card with Gradient Border */}
            <div
              className="w-full md:w-[265px] h-[200px] lg:h-[315px] rounded-[15px] border border-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, #000000 0%, #0F0F0F 100%), linear-gradient(180deg, #000000 0%, #E69700 50%, #FF6600 100%)",
                backgroundClip: "padding-box, border-box",
                backgroundOrigin: "padding-box, border-box",
              }}
            />
            {/* Short Orange Gradient Card */}
            <div
              className="w-full md:w-[265px] h-[100px] lg:h-[160px] rounded-[15px]"
              style={{
                background: "linear-gradient(180deg, #FF6600 0%, #E69700 100%)",
              }}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4 lg:space-y-[16px] flex flex-col items-center lg:items-start w-full">
            {/* Short Orange Gradient Card */}
            <div
              className="w-full md:w-[265px] h-[100px] lg:h-[160px] rounded-[15px]"
              style={{
                background: "linear-gradient(180deg, #FF6600 0%, #E69700 100%)",
              }}
            />
            {/* Tall Dark Card with Gradient Border */}
            <div
              className="w-full md:w-[265px] h-[200px] lg:h-[315px] rounded-[15px] border border-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, #000000 0%, #0F0F0F 100%), linear-gradient(0deg, #000000 0%, #E69700 50%, #FF6600 100%)",
                backgroundClip: "padding-box, border-box",
                backgroundOrigin: "padding-box, border-box",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
