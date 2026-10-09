"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "What does Shariah-compliant branding mean?",
      answer:
        "Shariah-compliant branding means creating visual identities and marketing strategies that align with Islamic principles. We avoid imagery, messaging, or business models that contradict Islamic values, ensuring your brand represents your faith authentically while maintaining professional excellence.",
    },
    {
      question: "How much do your services cost?",
      answer:
        "Our pricing varies based on project scope and requirements. We offer packages for startups, growing businesses, and established brands. Contact us for a custom quote tailored to your specific needs and budget.",
    },
    {
      question: "What is your process and timeline?",
      answer:
        "Our process includes four stages: Discovery & Alignment (1 week), Ethical Strategy (1-2 weeks), Visual Execution (2-4 weeks), and Scale & Optimization (ongoing). Timelines vary based on project complexity, but most branding projects complete within 6-8 weeks.",
    },
    {
      question: "Do you work with clients outside your country?",
      answer:
        "Absolutely! We work with Muslim businesses globally. Our remote collaboration process ensures seamless communication regardless of location. We've successfully delivered projects for clients across multiple continents.",
    },
    {
      question: "Can you help with both branding and marketing?",
      answer:
        "Yes! We offer comprehensive services covering brand identity, visual design, web development, and digital marketing. We can handle everything from logo design to full-scale marketing campaigns, all while maintaining Shariah compliance.",
    },
    {
      question: "What makes you different from other agencies?",
      answer:
        "We specialize in Shariah-compliant creative solutions, combining Islamic values with world-class design standards. Our deep understanding of Muslim markets and ethical business practices sets us apart, ensuring your brand resonates authentically with your target audience.",
    },
  ];

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <section
      id="faq"
      className="py-20 lg:py-[120px] max-w-[1280px] mx-auto flex flex-col justify-center items-center gap-8 lg:gap-[52px] px-4"
    >
      <div className="flex items-center justify-center flex-col gap-[6px] text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-[40px] font-bold leading-tight lg:leading-[40px] text-white">
          Have Questions? We&apos;ve Got Answers.
        </h2>
        <p className="text-base lg:text-[16px] font-normal leading-[25px] text-[rgba(255,255,255,0.7)]">
          We&apos;ve heard it all. Here&apos;s everything you need to know
          before working with us.
        </p>
      </div>

      {/* FAQ Accordion */}
      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        value={openItem}
        onValueChange={setOpenItem}
        className="w-full flex flex-col gap-4"
      >
        {faqs.map((faq, index) => {
          const value = `item-${index}`;
          const isOpen = openItem === value;
          return (
            <AccordionItem
              key={index}
              value={value}
              className="p-px rounded-[20px] bg-linear-to-r from-[#181818] via-[#666666] to-[#181818] border-none group transition-all duration-300"
            >
              <div
                className={`w-full h-full rounded-[19px] px-6 transition-all duration-300 ${
                  isOpen
                    ? "bg-[#1E1E1E]"
                    : "bg-[#181818] group-hover:bg-[#1E1E1E]"
                }`}
              >
                <AccordionTrigger
                  className="hover:no-underline py-6"
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: "#FF6600" }}
                    />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent
                  className="pb-6"
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#B5B5B5",
                    paddingLeft: "1.75rem",
                  }}
                >
                  {faq.answer}
                </AccordionContent>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
