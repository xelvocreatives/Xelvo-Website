import { AnimatedTooltip } from "./ui/animated-tooltip";
import { GradientText } from "./ui/GradientText";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
];

export function ValueProposition() {
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
              <div className="flex items-center gap-[10px]">
                <AnimatedTooltip items={people} width={30} height={30} />
              </div>
              <span className="text-white/80 text-[12px] leading-[13px] font-medium">
                Trusted by 50+ Brands & <br />
                Entrepreneur
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl lg:text-[42px] font-bold leading-tight lg:leading-[47px] text-white">
              More Than Just <br />
              Designers, We&apos;re Your <br />
              <GradientText>Creative Growth Partner</GradientText>
            </h2>

            {/* Description */}
            <p className="max-w-[540px] text-[18px] leading-[24px] font-medium text-white/70 mt-[10px]">
              We don&apos;t just create pretty visuals, we engineer brand
              experiences that convert. Our approach combines strategic thinking
              with stunning design to help your brand stand out in crowded
              markets while staying true to Islamic values.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4 mt-6">
              <div className="flex items-center gap-[10px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#FF6600] flex items-center justify-center shrink-0" />
                <p className="text-[16px] font-medium leading-[24px] text-white/70">
                  Strategy-First Approach
                </p>
              </div>
              <div className="flex items-center gap-[10px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#FF6600] flex items-center justify-center shrink-0" />
                <p className="text-[16px] font-medium leading-[24px] text-white/70">
                  Ethical Design
                </p>
              </div>
              <div className="flex items-center gap-[10px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#FF6600] flex items-center justify-center shrink-0" />
                <p className="text-[16px] font-medium leading-[24px] text-white/70">
                  Global Standards
                </p>
              </div>
            </div>
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
