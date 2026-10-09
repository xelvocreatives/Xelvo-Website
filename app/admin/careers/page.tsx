import { Application } from "@/types";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { User, Mail, Briefcase, Calendar, MapPin, Users2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const supabase = await createClient();
  const { data: applications, error: dbError } = await supabase
    .from("Application")
    .select("*")
    .order("createdAt", { ascending: false });

  if (dbError) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <h3 className="text-red-500 font-bold text-xl mb-2">Database Error</h3>
        <p className="text-gray-400">
          Could not fetch applications. Please ensure you have run the SQL setup
          in your Supabase editor as described in the walkthrough.
        </p>
        <pre className="mt-4 p-4 bg-black/40 rounded-lg text-left text-xs text-red-400 overflow-x-auto">
          {dbError.message}
        </pre>
      </div>
    );
  }

  if (!applications) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "reviewing":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "contacted":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "hired":
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
            <Users2 className="text-[#FF6600]" size={36} />
            Talent Pulse
          </h2>
          <p className="text-gray-400 mt-1 font-medium italic">
            Analyze and curate potential talent for the XELVO pool.
          </p>
        </div>
        <div className="bg-[#1A1A1A] px-6 py-3 rounded-[24px] border border-white/5 text-sm shadow-2xl">
          <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">
            Active Applications
          </span>
          <span className="text-white font-black ml-3 text-lg">
            {applications.length}
          </span>
        </div>
      </div>

      <div className="bg-[#181818] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-[#222]">
              <tr>
                <th className="p-8">Candidate Profile</th>
                <th className="p-8">Career Focus</th>
                <th className="p-8">Status & Timeline</th>
                <th className="p-8 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-gray-600 italic"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Users2 size={48} className="text-gray-800" />
                      <div>No candidates have joined the pulse yet.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                (applications as Application[]).map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[20px] bg-[#FF6600]/10 border border-[#FF6600]/20 flex items-center justify-center text-[#FF6600] shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="text-white font-black text-lg group-hover:text-[#FF6600] transition-colors">
                            {app.fullName}
                          </div>
                          <div className="text-gray-500 text-xs flex items-center gap-2 mt-1 font-medium bg-white/5 px-2 py-0.5 rounded-md w-fit italic">
                            <Mail size={12} className="text-[#FF6600]/60" />{" "}
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 border-x border-[#222]/30">
                      <div className="space-y-3">
                        <div className="text-gray-200 text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                          <Briefcase size={16} className="text-[#FF6600]" />
                          {app.position}
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] items-center">
                          <span className="text-gray-500 font-bold">
                            {app.experience}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className="text-gray-500 flex items-center gap-1 font-bold">
                            <MapPin size={10} className="text-[#FF6600]/40" />
                            {app.locationType === "remote"
                              ? "Remote"
                              : app.locationDetail || "On-site"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="space-y-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                        <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={12} className="text-[#FF6600]/30" />
                          {new Date(app.createdAt).toLocaleDateString(
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
                        href={`/admin/careers/${app.id}`}
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
