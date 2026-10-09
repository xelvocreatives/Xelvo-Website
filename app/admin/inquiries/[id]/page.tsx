import { Inquiry } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { updateInquiryStatus } from "@/app/actions/inquire";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  User,
  Building2,
  Zap,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInquiryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead, error: dbError } = await supabase
    .from("Inquiry")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError || !lead) {
    return (
      <div className="text-white p-10 text-center space-y-4">
        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tight">
          Inquiry not found
        </h2>
        <Link
          href="/admin/inquiries"
          className="text-[#FF6600] font-black uppercase tracking-widest text-xs hover:underline block mt-4"
        >
          Return to Business leads
        </Link>
      </div>
    );
  }

  const inquiry = lead as Inquiry;

  // Contact links
  const whatsappNumber = inquiry.phone?.replace(/\D/g, "") || "";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi ${inquiry.name}, thank you for reaching out to Xelvo Creatives regarding ${inquiry.service || "our services"}. I'd love to discuss how we can help your brand grow.`;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-all group font-black uppercase tracking-[0.2em] text-[10px]"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform text-[#FF6600]"
        />
        Back to Lead Pulse
      </Link>

      <div className="bg-[#181818] border border-[#222] rounded-[40px] overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="p-10 lg:p-16 bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] border-b border-[#222]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex items-start gap-8">
              <div className="w-24 h-24 rounded-[32px] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-2xl">
                <User size={48} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6600]">
                    Strategic Lead
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-800" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    ID: {inquiry.id.slice(0, 8)}
                  </span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                  {inquiry.name}
                </h1>
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2.5 text-gray-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Building2 size={16} className="text-[#FF6600]" />
                    {inquiry.company || "Individual Lead"}
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-400 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Zap size={16} className="text-[#FF6600]" />
                    {inquiry.service || "General Brand Growth"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 justify-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                  Lead Pipeline
                </span>
                <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                  {inquiry.status}
                </span>
              </div>

              <div className="flex gap-3">
                {inquiry.phone && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-[12px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#25D366]/10"
                  >
                    <MessageSquare size={18} /> WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#FF6600] hover:bg-[#FF7700] text-white px-8 py-4 rounded-[12px] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#FF6600]/10"
                >
                  <Mail size={18} /> Direct Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 p-10 lg:p-16 space-y-16 border-r border-[#222]">
            {/* AI Business Insight */}
            {inquiry.aiInsight && (
              <div className="relative overflow-hidden bg-linear-to-br from-[#FF6600]/10 to-transparent border border-[#FF6600]/20 p-10 rounded-[32px] shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <ShieldCheck size={140} className="text-[#FF6600]" />
                </div>
                <h3 className="text-[#FF6600] text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-pulse" />{" "}
                  AI Business Intent Matrix
                </h3>
                <p className="text-gray-100 text-2xl font-medium leading-relaxed italic z-10 relative">
                  &ldquo;{inquiry.aiInsight}&rdquo;
                </p>
              </div>
            )}

            <div className="space-y-8">
              <h3 className="text-white text-2xl font-black flex items-center gap-4 tracking-tight uppercase">
                <MessageSquare size={24} className="text-[#FF6600]" />
                Requirement message
              </h3>
              <div className="p-10 bg-white/5 border border-white/5 rounded-[32px] leading-relaxed text-gray-300 text-lg italic">
                {inquiry.message}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Stats & Actions */}
          <div className="lg:col-span-4 p-10 lg:p-12 bg-[#0C0C0C] space-y-12">
            <div className="space-y-8">
              <h3 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Client Meta Info
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-white/5 border border-white/5 rounded-[24px] flex items-center gap-4 shadow-2xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-white font-black text-xs uppercase tracking-tight">
                      Electronic Mail
                    </div>
                    <div className="text-gray-500 text-[10px] font-bold mt-1 truncate max-w-[140px]">
                      {inquiry.email}
                    </div>
                  </div>
                </div>
                {inquiry.phone && (
                  <div className="p-6 bg-white/5 border border-white/5 rounded-[24px] flex items-center gap-4 shadow-2xl">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/10">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-white font-black text-xs uppercase tracking-tight">
                        Direct Line
                      </div>
                      <div className="text-gray-500 text-[10px] font-bold mt-1 tracking-widest">
                        {inquiry.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Lead Qualification
              </h3>
              <div className="flex flex-col gap-4">
                {["contacted", "qualified", "converted", "rejected"].map(
                  (status) => (
                    <form
                      key={status}
                      action={async () => {
                        "use server";
                        await updateInquiryStatus(inquiry.id, status);
                      }}
                    >
                      <button
                        type="submit"
                        disabled={inquiry.status === status}
                        className={`w-full py-4 px-6 rounded-[18px] text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                          inquiry.status === status
                            ? "bg-white/5 border border-white/10 text-gray-700 cursor-default"
                            : "bg-white/5 border border-white/5 text-gray-400 hover:border-[#FF6600]/40 hover:text-white hover:bg-[#FF6600]/5"
                        }`}
                      >
                        {inquiry.status === status ? "✓ " : ""}
                        MOVE TO {status}
                      </button>
                    </form>
                  ),
                )}
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={14} className="text-[#FF6600]/30" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Received: {new Date(inquiry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock size={14} className="text-[#FF6600]/30" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Modified: {new Date(inquiry.updatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
