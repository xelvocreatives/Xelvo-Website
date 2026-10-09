"use client";

import { useActionState } from "react";
import {
  createTestimonial,
  updateTestimonial,
  TestimonialState,
} from "@/app/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Testimonial } from "@/types";
import { Upload, Star, Quote, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: Testimonial;
  onClose?: () => void;
}) {
  const initialState: TestimonialState = { message: null, errors: {} };
  const updateTestimonialWithId = testimonial
    ? updateTestimonial.bind(null, testimonial.id)
    : null;

  const [state, formAction, isPending] = useActionState(
    testimonial ? updateTestimonialWithId! : createTestimonial,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-8 px-2 max-w-2xl mx-auto pb-10"
    >
      <div className="grid grid-cols-1 gap-8">
        {/* Client Name & Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="clientName"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
            >
              Client Name
            </Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="JOHN DOE"
              defaultValue={testimonial?.clientName}
              required
              className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl transition-all font-black px-6 uppercase text-sm"
            />
            {state.errors?.clientName && (
              <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1 animate-shake">
                {state.errors.clientName.join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="company"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
            >
              Company
            </Label>
            <Input
              id="company"
              name="company"
              placeholder="ACME INDUSTRIES"
              defaultValue={testimonial?.company}
              required
              className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl transition-all font-black px-6 uppercase text-sm"
            />
            {state.errors?.company && (
              <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1 animate-shake">
                {state.errors.company.join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Rating & Social Platform Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="rating"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
            >
              Strategic Rating (1-5)
            </Label>
            <div className="relative">
              <Input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                defaultValue={testimonial?.rating || 5}
                required
                className="bg-white/3 border-white/10 text-white/50 focus:text-white focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl transition-all font-black px-6 text-lg"
              />
              <Star
                size={18}
                className="absolute right-6 top-4 text-[#FF6600] pointer-events-none opacity-40"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="socialPlatform"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
            >
              Social Linkage
            </Label>
            <Select
              name="socialPlatform"
              defaultValue={testimonial?.socialPlatform || "linkedin"}
            >
              <SelectTrigger className="bg-white/3 border-white/10 text-white focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl font-black px-6 uppercase text-xs tracking-widest">
                <SelectValue placeholder="PLATFORM" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-white/10 text-white rounded-2xl">
                <SelectItem
                  value="linkedin"
                  className="focus:bg-[#FF6600] focus:text-white font-black uppercase text-xs tracking-widest py-3"
                >
                  LinkedIn
                </SelectItem>
                <SelectItem
                  value="twitter"
                  className="focus:bg-[#FF6600] focus:text-white font-black uppercase text-xs tracking-widest py-3"
                >
                  Twitter
                </SelectItem>
                <SelectItem
                  value="upwork"
                  className="focus:bg-[#FF6600] focus:text-white font-black uppercase text-xs tracking-widest py-3"
                >
                  Upwork
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Client Photo Upload */}
        <div className="space-y-3">
          <Label
            htmlFor="image"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            Client Visual ID
          </Label>
          <div className="flex items-center gap-6 p-6 bg-white/2 border border-white/5 rounded-[24px] hover:border-[#FF6600]/20 transition-all">
            <div className="relative h-20 w-20 rounded-[20px] overflow-hidden border-2 border-white/10 shrink-0 bg-[#0A0A0A] group">
              {testimonial?.imageUrl ? (
                <Image
                  src={testimonial.imageUrl}
                  alt="Client"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-800">
                  <span className="text-2xl font-black">
                    {testimonial?.clientName?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 relative group">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <div className="h-14 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-gray-500 group-hover:border-[#FF6600]/30 group-hover:text-white transition-all bg-white/1">
                <Upload size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Update Photo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Textarea */}
        <div className="space-y-3">
          <Label
            htmlFor="text"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            The Strategic Feedback
          </Label>
          <div className="relative">
            <Quote
              size={24}
              className="absolute right-6 top-6 text-[#FF6600] opacity-10"
            />
            <Textarea
              id="text"
              name="text"
              placeholder="Paste the unfiltered client review here..."
              defaultValue={testimonial?.text}
              required
              className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 min-h-[160px] rounded-[24px] transition-all font-medium p-7 text-base leading-relaxed italic"
            />
          </div>
          {state.errors?.text && (
            <p className="text-red-500 text-[10px] font-black uppercase mt-2 ml-1 animate-shake">
              {state.errors.text.join(", ")}
            </p>
          )}
        </div>
      </div>

      {state.message && (
        <div className="flex items-center gap-3 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 animate-fade-in shadow-lg">
          <CheckCircle2 size={20} />
          <p className="text-xs font-black uppercase tracking-widest">
            {state.message}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-8 border-t border-white/5">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-16 bg-linear-to-r from-[#FF6600] to-[#FF8800] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black uppercase tracking-[0.2em] text-xs rounded-[24px] shadow-2xl shadow-[#FF6600]/20"
        >
          {isPending
            ? "SYNCHRONIZING RECORD..."
            : testimonial
              ? "UPDATE CLIENT VOICE"
              : "COMMIT NEW FEEDBACK"}
        </Button>
      </div>
    </form>
  );
}
