import { createClient } from "@/utils/supabase/server";
import {
  MessageSquare,
  FolderKanban,
  Star,
  ArrowUpRight,
  UserPlus,
  Zap,
  Clock,
  Briefcase,
} from "lucide-react";
import { Inquiry, Application } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch all counts and recent data parallel
  const [
    inquiryCount,
    projectCount,
    testimonialCount,
    applicationCount,
    recentInquiries,
    recentApplications,
  ] = await Promise.all([
    supabase.from("Inquiry").select("*", { count: "exact", head: true }),
    supabase.from("Project").select("*", { count: "exact", head: true }),
    supabase.from("Testimonial").select("*", { count: "exact", head: true }),
    supabase.from("Application").select("*", { count: "exact", head: true }),
    supabase
      .from("Inquiry")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(3),
    supabase
      .from("Application")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(3),
  ]);

  const stats = [
    {
      label: "Business Leads",
      value: inquiryCount.count || 0,
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-400",
      glow: "shadow-blue-500/20",
      href: "/admin/inquiries",
    },
    {
      label: "Talent Pool",
      value: applicationCount.count || 0,
      icon: UserPlus,
      color: "from-[#FF6600] to-[#FF8800]",
      glow: "shadow-[#FF6600]/20",
      href: "/admin/careers",
    },
    {
      label: "Live Projects",
      value: projectCount.count || 0,
      icon: FolderKanban,
      color: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/20",
      href: "/admin/projects",
    },
    {
      label: "Client Love",
      value: testimonialCount.count || 0,
      icon: Star,
      color: "from-yellow-400 to-orange-500",
      glow: "shadow-yellow-500/20",
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            System Core
          </h2>
          <p className="text-gray-400 mt-2 font-medium italic text-sm md:text-base">
            Welcome back to XELVO Command Center.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white/3 border border-white/10 rounded-[20px] shadow-2xl w-fit">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Node Status: Optimal
          </span>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            href={stat.href}
            key={stat.label}
            className={`group bg-[#111] border border-white/5 p-8 rounded-[32px] transition-all duration-500 hover:border-[#FF6600]/50 hover:translate-y-[-4px] shadow-2xl ${stat.glow}`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-4 rounded-[18px] bg-linear-to-br ${stat.color} text-white shadow-lg`}
              >
                <stat.icon size={26} />
              </div>
              <ArrowUpRight
                size={22}
                className="text-gray-700 group-hover:text-[#FF6600] transition-colors"
              />
            </div>
            <div className="mt-8">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                {stat.label}
              </p>
              <h3 className="text-5xl md:text-6xl font-black text-white mt-3 tabular-nums tracking-tighter">
                {stat.value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-7 bg-[#181818] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
          <div className="p-8 border-b border-[#222] flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Zap size={20} className="text-[#FF6600]" />
              Pulse: Business Leads
            </h3>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-[#FF6600] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="p-4 flex-1">
            {recentInquiries.data && recentInquiries.data.length > 0 ? (
              <div className="space-y-2">
                {recentInquiries.data.map((lead: Inquiry) => (
                  <div
                    key={lead.id}
                    className="p-6 rounded-[24px] bg-white/2 border border-transparent hover:border-white/5 hover:bg-white/4 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">
                          {lead.name}
                        </div>
                        <div className="text-gray-500 text-[10px] flex items-center gap-1.5 uppercase tracking-wider font-bold mt-0.5">
                          {lead.service || "Brand Growth"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-[#555] uppercase tracking-widest">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[9px] text-gray-600 italic mt-0.5 flex items-center gap-1 justify-end">
                        <Clock size={10} />{" "}
                        {new Date(lead.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-gray-600 italic text-sm">
                No active leads detected in pulse.
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="lg:col-span-5 bg-[#181818] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
          <div className="p-8 border-b border-[#222] flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Briefcase size={20} className="text-[#FF6600]" />
              Talent Watch
            </h3>
            <Link
              href="/admin/careers"
              className="text-xs font-bold text-[#FF6600] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="p-4 flex-1">
            {recentApplications.data && recentApplications.data.length > 0 ? (
              <div className="space-y-2">
                {recentApplications.data.map((app: Application) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-[24px] bg-white/2 border border-transparent hover:border-white/5 hover:bg-white/4 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center text-[#FF6600]">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">
                        {app.fullName}
                      </div>
                      <div className="text-[#FF6600] text-[10px] font-black uppercase tracking-widest mt-0.5">
                        {app.position}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-gray-600 italic text-sm">
                Talent watch is quiet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
