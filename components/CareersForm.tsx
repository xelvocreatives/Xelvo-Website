"use client";

import React, { useState, useActionState } from "react";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  Clock,
  MapPin,
  Upload,
  MessageSquare,
  FileText,
  Rocket,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ContactInput } from "./ui/contact-input";
import { cn } from "@/lib/utils";
import { submitApplication } from "@/app/actions/career";

const initialState = {
  success: false,
  error: null as string | null,
  message: null as string | null,
};

export function CareersForm() {
  const [location, setLocation] = useState("remote");
  const [fileName, setFileName] = useState("");
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialState,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  if (state?.success) {
    return (
      <section className="w-full max-w-[800px] mx-auto px-6 py-[80px]">
        <div className="bg-[#0D0D0D] border border-green-500/30 rounded-[32px] p-12 lg:p-16 text-center space-y-6 shadow-2xl animate-fade-in-up">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Application Received!
          </h2>
          <p className="text-gray-400 text-lg">
            Thanks for your interest in joining Xelvo Creatives. We&apos;ve
            received your application and our team will review it shortly. If
            it&apos;s a match, we&apos;ll be in touch!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#FF6600] font-bold hover:underline"
          >
            Submit another application
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="careers-form"
      className="w-full max-w-[1280px] mx-auto px-6 py-[80px] opacity-0 animate-fade-in"
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[32px] p-6 sm:p-10 lg:p-16 shadow-2xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6600]/5 blur-[120px] rounded-full -mr-64 -mt-64" />

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-[32px] md:text-[48px] font-bold text-white mb-4">
              Apply Now
            </h2>
            <p className="text-[#A0A0A0] text-lg">
              Tell us about yourself and why you&apos;d like to join our team
            </p>
          </div>

          <form action={formAction} className="max-w-[800px] mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white font-medium">
                  <User size={18} className="text-[#FF6600]" />
                  Full Name <span className="text-[#FF6600]">*</span>
                </label>
                <ContactInput
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Phone size={18} className="text-[#FF6600]" />
                  WhatsApp Number <span className="text-[#FF6600]">*</span>
                </label>
                <ContactInput
                  type="tel"
                  name="whatsapp"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Address */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Mail size={18} className="text-[#FF6600]" />
                  Email Address <span className="text-[#FF6600]">*</span>
                </label>
                <ContactInput
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Position */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white font-medium">
                  <Briefcase size={18} className="text-[#FF6600]" />
                  Position You&apos;d Like to Apply For{" "}
                  <span className="text-[#FF6600]">*</span>
                </label>
                <ContactInput
                  type="text"
                  name="position"
                  placeholder="Designer, Developer, Strategist..."
                  required
                />
              </div>
            </div>

            {/* Experience (Full Width) */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white font-medium">
                <Clock size={18} className="text-[#FF6600]" />
                Years of Experience <span className="text-[#FF6600]">*</span>
              </label>
              <div className="relative">
                <select
                  name="experience"
                  required
                  className="w-full h-[60px] rounded-xl border border-white/10 bg-white/5 px-6 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6600]/50 transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#1A1A1A]">
                    Select your experience level
                  </option>
                  <option
                    value="Entry Level (0-1 years)"
                    className="bg-[#1A1A1A]"
                  >
                    Entry Level (0-1 years)
                  </option>
                  <option value="Junior (1-3 years)" className="bg-[#1A1A1A]">
                    Junior (1-3 years)
                  </option>
                  <option
                    value="Mid-Level (3-5 years)"
                    className="bg-[#1A1A1A]"
                  >
                    Mid-Level (3-5 years)
                  </option>
                  <option value="Senior (5+ years)" className="bg-[#1A1A1A]">
                    Senior (5+ years)
                  </option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <Clock size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Location */}
              <div className="col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-white font-medium">
                  <MapPin size={18} className="text-[#FF6600]" />
                  Location <span className="text-[#FF6600]">*</span>
                </label>
                <input type="hidden" name="locationType" value={location} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setLocation("remote")}
                    className={cn(
                      "flex-1 flex items-center gap-3 px-6 py-4 rounded-xl border transition-all text-left",
                      location === "remote"
                        ? "bg-[#FF6600]/10 border-[#FF6600] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        location === "remote"
                          ? "border-[#FF6600]"
                          : "border-white/30",
                      )}
                    >
                      {location === "remote" && (
                        <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                      )}
                    </div>
                    <span>Remote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation("onsite")}
                    className={cn(
                      "flex-1 flex items-center gap-3 px-6 py-4 rounded-xl border transition-all text-left",
                      location === "onsite"
                        ? "bg-[#FF6600]/10 border-[#FF6600] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        location === "onsite"
                          ? "border-[#FF6600]"
                          : "border-white/30",
                      )}
                    >
                      {location === "onsite" && (
                        <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                      )}
                    </div>
                    <span>On-site / Hybrid</span>
                  </button>
                </div>
              </div>

              {/* Conditional Location Input */}
              {location === "onsite" && (
                <div className="space-y-3 animate-fade-in col-span-2">
                  <label className="flex items-center gap-2 text-white font-medium">
                    <MapPin size={18} className="text-[#FF6600]" />
                    Your City/Location <span className="text-[#FF6600]">*</span>
                  </label>
                  <ContactInput
                    type="text"
                    name="locationDetail"
                    placeholder="e.g. London, Dubai, or City Name"
                    required
                  />
                </div>
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white font-medium">
                <Upload size={18} className="text-[#FF6600]" />
                Upload Resume <span className="text-[#FF6600]">*</span>
              </label>
              <div className="relative group">
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  required
                />
                <div className="border-2 border-dashed border-white/10 bg-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all group-hover:border-[#FF6600]/50 group-hover:bg-[#FF6600]/5">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="text-[#FF6600]" size={28} />
                  </div>
                  <p className="text-white font-medium mb-1">
                    {fileName || "Click to upload or drag and drop"}
                  </p>
                  <p className="text-[#6B7280] text-sm">
                    PDF, DOC, or DOCX (max 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* About Yourself */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white font-medium">
                <MessageSquare size={18} className="text-[#FF6600]" />
                Tell Us About Yourself <span className="text-[#FF6600]">*</span>
              </label>
              <p className="text-xs text-[#6B7280]">
                Be authentic, not formal. We want to know the real you.
              </p>
              <ContactInput
                as="textarea"
                name="bio"
                placeholder="Share your background, skills, and what makes you passionate about your work..."
                className="min-h-[150px]"
                required
              />
            </div>

            {/* Why Join */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-white font-medium">
                <Rocket size={18} className="text-[#FF6600]" />
                Why Do You Want to Join Xelvo Creatives?{" "}
                <span className="text-[#FF6600]">*</span>
              </label>
              <p className="text-xs text-[#6B7280]">
                1–2 lines only. We just want to understand your motivation.
              </p>
              <ContactInput
                as="textarea"
                name="motivation"
                placeholder="What draws you to Xelvo Creatives?"
                className="min-h-[100px]"
                required
              />
            </div>

            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle size={18} />
                {state.error}
              </div>
            )}

            {/* Privacy Notice */}
            <p className="text-[#6B7280] text-sm leading-relaxed border-l-2 border-[#FF6600]/30 pl-4 py-1">
              We respect your privacy. Your information will be used solely for
              recruitment purposes and will not be shared with third parties. We
              handle all applications with care and confidentiality.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 rounded-2xl bg-[#FF6600] text-white font-bold text-xl hover:bg-[#FF7700] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_10px_30px_rgba(255,92,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isPending ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
