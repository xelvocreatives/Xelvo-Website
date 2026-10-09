import Image from "next/image";
import { GradientText } from "./ui/GradientText";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CaseStudiesProps {
  projects?: Project[];
}

export function CaseStudies({ projects = [] }: CaseStudiesProps) {
  const CTACase = [
    {
      name: "This Could Be You",
      description: "Book a free Brand Audit today",
      cta: true,
      imageUrl: null,
    },
  ];

  const projectItems = projects.map((p) => ({
    name: p.title,
    description: p.description,
    cta: false,
    imageUrl: p.imageUrl,
  }));

  const itemsToDisplay = [...projectItems, ...CTACase];

  return (
    <section
      id="featured"
      className="py-20 lg:py-[170px] max-w-[1280px] mx-auto flex flex-col items-center gap-[32px] px-4"
    >
      {/* Section Title */}
      <h2 className="text-3xl lg:text-[48px] font-bold leading-tight lg:leading-[53px] text-white max-w-6xl text-center mx-auto">
        How Muslim Brands Like Yours{" "}
        <GradientText>Scaled Globally,</GradientText>Without Compromising Faith
      </h2>

      <p className="text-[14px] font-normal leading-[22px] text-white/70 text-center mx-auto">
        Real Shariah-compliant creative solutions that doubled engagement,
        tripled sales, and built lifelong loyalty in months.
      </p>

      {/* Case Studies */}
      <div className="mt-[32px] w-full flex flex-col gap-[20px]">
        {itemsToDisplay.map((caseStudy, index) => {
          return (
            <div
              key={index}
              className={`flex flex-col justify-between md:flex-row gap-[30px] items-center p-6 lg:p-[15px] ${
                index % 2 === 0 ? "lg:pl-[40px]" : "lg:pr-[40px]"
              } bg-white rounded-[20px] min-h-[250px] md:max-h-[250px] ${
                index % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div className={`relative`}>
                {/* Text Content */}
                <div
                  className={`flex flex-col ${
                    index % 2 === 0
                      ? "items-center lg:items-start text-center lg:text-start gap-[16px]"
                      : "items-center lg:items-end text-center lg:text-end"
                  }`}
                >
                  <h3 className="text-2xl lg:text-[40px] font-bold leading-tight lg:leading-[44px] mb-2 lg:mb-0">
                    <GradientText>{caseStudy.name}</GradientText>
                  </h3>

                  <p className="text-base lg:text-[20px] font-normal leading-[28px] text-black">
                    {caseStudy.description}
                  </p>
                </div>
                {caseStudy.cta && (
                  <Image
                    className="mt-4 mr-[120px] hidden md:block"
                    src="/images/cta-arrow.svg"
                    alt="cta-arrow"
                    width={300}
                    height={70}
                  />
                )}
              </div>

              {/* Visual Block */}
              <div
                className={`w-full full min-h-[220px] max-h-[220px] md:min-w-[670px] max-w-[670px] rounded-[16px]`}
                style={{
                  background: caseStudy.imageUrl
                    ? `url(${caseStudy.imageUrl}) center/cover no-repeat`
                    : "rgb(255 102 0 / 25%)",
                  border: caseStudy.imageUrl ? "" : "2px dashed #FF6600",
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
