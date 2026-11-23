"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import type { HomeSections } from "@/lib/site/schema";

export function FAQ({ content }: { content: HomeSections["faq"] }) {
  const faqs = content.items;

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <section
      id="faq"
      className="py-20 lg:py-[120px] max-w-[1280px] mx-auto flex flex-col justify-center items-center gap-8 lg:gap-[52px] px-4"
    >
      <div className="flex items-center justify-center flex-col gap-[6px] text-center">
        {/* Section Title */}
        <h2 className="text-3xl lg:text-[40px] font-bold leading-tight lg:leading-[40px] text-white">
          {content.title}
        </h2>
        {content.description && (
          <p className="text-base lg:text-[16px] font-normal leading-[25px] text-[rgba(255,255,255,0.7)]">
            {content.description}
          </p>
        )}
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
