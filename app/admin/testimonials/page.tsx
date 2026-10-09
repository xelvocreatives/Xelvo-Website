import { Testimonial } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Star,
  Quote,
  Heart,
  Calendar,
  Building2,
  User,
} from "lucide-react";
import NextImage from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { DeleteTestimonialButton } from "@/components/admin/delete-testimonial-button";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("Testimonial")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <h3 className="text-red-500 font-bold text-xl">System Error</h3>
        <p className="text-gray-400 mt-2">{error.message}</p>
      </div>
    );
  }

  if (!testimonials) return null;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <Heart className="text-[#FF6600]" size={36} />
            Client Voice
          </h2>
          <p className="text-gray-400 mt-1 font-medium italic">
            Manage client reviews and strategic feedback pulse.
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="relative px-8 py-4 rounded-[10px] font-semibold text-[16px] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
                boxShadow:
                  "0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <Plus className="h-5 w-5" />
              <span>Add Client Voice</span>
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#0A0A0A] border-l border-white/5 text-white min-w-[400px] md:min-w-[700px] shadow-2xl p-0">
            <div className="h-full flex flex-col">
              <div className="p-8 md:p-12 bg-linear-to-br from-[#111] to-[#0A0A0A] border-b border-white/5">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FF6600]/10 flex items-center justify-center text-[#FF6600] border border-[#FF6600]/20">
                      <Quote size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                      System / Testimonials
                    </span>
                  </div>
                  <SheetTitle className="text-4xl font-black text-white px-0 uppercase tracking-tight">
                    MANUAL LOG
                  </SheetTitle>
                  <SheetDescription className="text-gray-400 font-medium px-0 mt-2">
                    Add a new client review manually to the pulse system.
                  </SheetDescription>
                </SheetHeader>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                <TestimonialForm />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-[#181818] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-[#222]">
              <tr>
                <th className="p-8">Client Identity</th>
                <th className="p-8">Strategic Insight</th>
                <th className="p-8">Rating & Date</th>
                <th className="p-8 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-gray-600 italic"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Quote size={48} className="text-gray-800" />
                      <div>No client voices have been recorded yet.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                (testimonials as Testimonial[]).map((testimonial) => (
                  <tr
                    key={testimonial.id}
                    className="hover:bg-white/5 transition-all group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/5 group-hover:border-[#FF6600]/30 transition-all overflow-hidden shadow-inner">
                          {testimonial.imageUrl ? (
                            <NextImage
                              src={testimonial.imageUrl}
                              fill
                              className="object-cover"
                              alt={testimonial.clientName}
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-black text-base group-hover:text-[#FF6600] transition-colors">
                            {testimonial.clientName}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                            <Building2
                              size={10}
                              className="text-[#FF6600]/40"
                            />
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 max-w-[400px]">
                      <div className="relative">
                        <Quote
                          size={16}
                          className="absolute -top-1 -left-5 text-[#FF6600]/20"
                        />
                        <p className="text-gray-400 text-sm italic line-clamp-2 leading-relaxed font-medium">
                          {testimonial.text}
                        </p>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={
                                i < testimonial.rating
                                  ? "text-[#FF6600] fill-[#FF6600]"
                                  : "text-gray-800"
                              }
                            />
                          ))}
                        </div>
                        <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} className="text-[#FF6600]/30" />
                          {new Date(testimonial.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-12 w-12 bg-white/5 hover:bg-[#FF6600] text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                            >
                              <Pencil size={18} />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="bg-[#0A0A0A] border-l border-white/5 text-white min-w-[400px] md:min-w-[700px] shadow-2xl p-0">
                            <div className="h-full flex flex-col">
                              <div className="p-8 md:p-12 bg-linear-to-br from-[#111] to-[#0A0A0A] border-b border-white/5">
                                <SheetHeader className="text-left">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#FF6600]/10 flex items-center justify-center text-[#FF6600] border border-[#FF6600]/20">
                                      <Quote size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                      System / Modify
                                    </span>
                                  </div>
                                  <SheetTitle className="text-4xl font-black text-white px-0 uppercase tracking-tight">
                                    MODIFY VOICE
                                  </SheetTitle>
                                  <SheetDescription className="text-gray-400 font-medium px-0 mt-2">
                                    Update client feedback record and metadata.
                                  </SheetDescription>
                                </SheetHeader>
                              </div>
                              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                                <TestimonialForm testimonial={testimonial} />
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <DeleteTestimonialButton id={testimonial.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
