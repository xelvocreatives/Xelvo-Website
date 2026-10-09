import { Inquiry } from "@/types";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Mail, User, Calendar, Zap, Building2, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries, error: dbError } = await supabase
    .from("Inquiry")
    .select("*")
    .order("createdAt", { ascending: false });

  if (dbError) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <h3 className="text-red-500 font-bold text-xl mb-2">Database Error</h3>
        <p className="text-gray-400 mb-4">
          Could not fetch inquiries. You may need to update your database schema
          to match the new Inquiry model.
        </p>
        <pre className="mt-4 p-4 bg-black/40 rounded-lg text-left text-xs text-red-400 overflow-x-auto">
          {dbError.message}
        </pre>
      </div>
    );
  }

  if (!inquiries) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "qualified":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "converted":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <Target className="text-[#FF6600]" size={36} />
            Lead Pulse
          </h2>
          <p className="text-gray-400 mt-1 font-medium italic">
            Manage business growth journeys and strategic leads.
          </p>
        </div>
        <div className="bg-[#1A1A1A] px-6 py-3 rounded-[24px] border border-white/5 text-sm shadow-2xl">
          <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
            Total Leads
          </span>
          <span className="text-white font-black ml-3 text-lg">
            {inquiries.length}
          </span>
        </div>
      </div>

      <div className="bg-[#181818] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-[#222]">
              <tr>
                <th className="p-8">Lead Identity</th>
                <th className="p-8">Growth focus</th>
                <th className="p-8">Pipeline status</th>
                <th className="p-8 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {inquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-gray-600 italic"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Target size={48} className="text-gray-800" />
                      <div>No leads have entered the pulse ecosystem.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                (inquiries as Inquiry[]).map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[20px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="text-white font-black text-lg group-hover:text-[#FF6600] transition-colors leading-tight">
                            {inquiry.name}
                            {inquiry.status === "new" && (
                              <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#FF6600] inline-block animate-pulse align-middle" />
                            )}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-2 mt-1.5 font-medium bg-white/5 px-2.5 py-1 rounded-md w-fit italic">
                            <Mail size={12} className="text-[#FF6600]/60" />{" "}
                            {inquiry.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 border-x border-[#222]/30">
                      <div className="space-y-3">
                        <div className="text-gray-200 text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                          <Zap size={16} className="text-[#FF6600]" />
                          {inquiry.service || "Brand Growth"}
                        </div>
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                          <Building2 size={12} />{" "}
                          {inquiry.company || "Individual Lead"}
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${getStatusColor(inquiry.status)}`}
                        >
                          {inquiry.status}
                        </span>
                        <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} className="text-[#FF6600]/30" />
                          {new Date(inquiry.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="relative px-6 py-3 rounded-[10px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl w-fit ml-auto"
                        style={{
                          background:
                            "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
                          boxShadow:
                            "0 4px 15px rgba(255, 102, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        Details Core
                      </Link>
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
