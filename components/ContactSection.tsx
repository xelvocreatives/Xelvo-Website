"use client";

import Image from "next/image";
import React, { useActionState } from "react";
import { ContactInput } from "./ui/contact-input";
import { submitInquiry } from "@/app/actions/inquire";
import type { HomeSections } from "@/lib/site/schema";

const initialState = {
  success: false,
  error: "",
  message: "",
};

export function ContactSection({ content }: { content: HomeSections["contact"] }) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry,
    initialState,
  );

  return (
    <section
      id="contact"
      className="w-full max-w-[1280px] min-h-[630px] bg-white/5 mb-20 lg:mb-[120px] rounded-[20px] border-2 border-[#0A0D17] p-6 lg:p-[50px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-[70px]"
    >
      {/* Left: Contact Form */}
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[30px] font-bold leading-[34px] text-[#FFFFFF]">
            {content.title}
          </h2>
          {content.description && (
            <p className="text-[16px] font-normal leading-[24px] text-[#FFFFFF]">{content.description}</p>
          )}
        </div>

        <form action={formAction} className="space-y-[20px]">
          {/* Name Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            <div className="space-y-2">
              <ContactInput
                type="text"
                name="firstName"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <ContactInput
                type="text"
                name="lastName"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {/* Email Field */}
            <div className="space-y-2">
              <ContactInput
                type="email"
                name="email"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <ContactInput
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {/* Company Field */}
            <div className="space-y-2">
              <ContactInput
                type="text"
                name="company"
                placeholder="Your Agency / Business"
              />
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <select
                name="service"
                required
                className="w-full h-[60px] rounded-xl border-2 border-white/10 bg-white/5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#111]">
                  Select a service
                </option>
                {content.services.map((service) => (
                  <option key={service} value={service} className="bg-[#111]">
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <ContactInput
              as="textarea"
              name="message"
              rows={4}
              placeholder="What are your goals? How can we help you thrive?"
              className="resize-none"
              required
            />
          </div>

          {state?.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium animate-shake">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-bold text-center animate-fade-in">
              {state.message}
            </div>
          )}

          {/* Submit Button */}
          {!state?.success && (
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[66px] rounded-2xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center text-white text-[18px] font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(255,92,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,92,0,0.4)]"
              style={{
                background: "linear-gradient(135deg, #FF5C00 0%, #FF7700 100%)",
              }}
            >
              {isPending
                ? "Connecting with our experts..."
                : content.submitLabel}
            </button>
          )}
        </form>
      </div>

      {/* Right: picture chosen in the admin */}
      {content.image && (
      <div className="w-full h-full relative min-h-[400px] flex items-center justify-center">
        <Image
          src={content.image}
          alt={content.imageAlt}
          className="rounded-[20px] object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      )}
    </section>
  );
}
