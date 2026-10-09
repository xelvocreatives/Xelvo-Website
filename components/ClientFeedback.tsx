import { Star } from "lucide-react";
import Image from "next/image";
import HeartLogo from "../public/images/feedback-logo.svg";
import ArrowElement from "../public/images/arrow-element.svg";

interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientFeedbackProps {
  testimonials?: Testimonial[];
}

export function ClientFeedback({ testimonials = [] }: ClientFeedbackProps) {
  const itemsToDisplay =
    testimonials.length > 0
      ? testimonials.map((t) => ({
          name: t.clientName,
          company: t.company,
          rating: t.rating,
          text: t.text,
          imageUrl: t.imageUrl,
        }))
      : [];

  return (
    <section
      id="testimonials"
      className="max-w-[1280px] mx-auto flex flex-col items-center gap-12 lg:gap-[50px] px-4 py-20"
    >
      <div className="flex flex-col justify-center items-center gap-[8px]">
        <Image src={HeartLogo} alt="Clients" width={55} height={55} />
        <div className="flex justify-center items-center gap-[8px] w-fit px-[12px] py-[8px] bg-black rounded-full">
          <Image
            src={ArrowElement}
            alt="Clients"
            width={30}
            height={30}
            className="rotate-180"
          />
          <p className="text-[#FFFFFF] text-[14px] font-light leading-[14px]">
            Testimonials
          </p>
          <Image src={ArrowElement} alt="Clients" width={30} height={30} />
        </div>
        {/* Section Title */}
        <h2 className="text-center text-3xl lg:text-[40px] font-bold text-white">
          Client Feedback
        </h2>
        <p className="text-center text-[#B9B9B9] text-base lg:text-[18px] font-light leading-[27px]">
          Trusted by 100+ happy clients
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToDisplay.map((review, index) => (
          <div
            key={index}
            className="w-full max-w-[340px] lg:max-w-[290px] h-auto p-[12px] rounded-[20px] border border-[#181818] flex flex-col gap-[14px] bg-[#121212] transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="flex flex-col p-[15px] gap-[10px] bg-[#121212] border border-[#181818] rounded-[22px]">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill="#FF6C25"
                    style={{ color: "#FF6C25" }}
                  />
                ))}
              </div>
              {/* Review Text */}
              <p className="text-[14px] leading-[24px] font-light text-[#B9B9B9]">
                {review.text}
              </p>
            </div>

            {/* Client Info */}
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-[10px]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF6600 0%, #E69700 100%)",
                  }}
                >
                  {review.imageUrl ? (
                    <Image
                      src={review.imageUrl}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                      {review.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h6 className="text-[18px] font-normal leading-[24px] text-[#FFFFFF]">
                    {review.name}
                  </h6>
                  <p className="text-[14px] font-normal leading-[20px] text-[#B9B9B9]">
                    {review.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-[460px] min-h-[75px] py-4 bg-[#121212] rounded-[20px] flex flex-wrap items-center justify-center gap-x-[15px] gap-y-2 px-6 shadow-[0px_4px_24px_rgba(0,0,0,0.1)] cursor-pointer hover:scale-105 transition-all duration-300">
        <Star size={24} fill="#FF6C25" style={{ color: "#FF6C25" }} />
        <h6 className="text-[16px] md:text-[18px] font-normal leading-tight text-[#FFFFFF]">
          4.9 . Based on 1.5k reviews
        </h6>
        <p className="text-[12px] md:text-[14px] font-normal leading-tight text-[#B9B9B9]">
          1,500 happy clients
        </p>
      </div>
    </section>
  );
}
