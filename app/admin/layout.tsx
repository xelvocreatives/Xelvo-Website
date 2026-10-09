import { AppSidebar } from "@/components/admin/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Home, ShieldCheck } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#050505] text-white selection:bg-[#FF6600]/30 min-h-screen">
        <header className="h-20 bg-white/3 border-white/10 shadow-2xl backdrop-blur-md rounded-2xl flex items-center justify-between px-6 transition-all duration-500 overflow-hidden">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-11 w-11 text-gray-400 hover:text-white hover:bg-white/5 transition-all rounded-[14px] border border-white/5 shadow-xl" />
            <Separator
              orientation="vertical"
              className="h-6 bg-white/5 hidden md:block"
            />
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] group">
              <div className="md:flex items-center gap-2 hidden">
                <Home
                  size={14}
                  className="text-[#FF6600] group-hover:scale-110 transition-transform"
                />
                <span className="text-gray-500">System</span>
              </div>
              <span className="text-gray-700 hidden md:inline">/</span>
              <span className="bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Control Pulse
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-white/3 border border-white/5 rounded-full shadow-lg">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Security Verified
              </span>
            </div>
            <div className="flex sm:hidden items-center justify-center h-10 w-10 bg-[#FF6600]/10 border border-[#FF6600]/20 rounded-full text-[#FF6600]">
              <ShieldCheck size={20} />
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 lg:p-12">
          <div className="max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
