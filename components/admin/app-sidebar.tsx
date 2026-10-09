"use client";

import * as React from "react";
import {
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Star,
  Sparkles,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SignOutButton } from "./SignOutButton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-white/5 bg-[#050505] shadow-2xl"
    >
      <SidebarHeader className="h-20 flex justify-center border-b border-white/5 bg-[#050505] group-data-[collapsible=icon]:p-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center">
            <div className="flex items-center gap-4 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
              <div className="relative flex aspect-square size-10 items-center justify-center rounded-[14px] bg-linear-to-br from-[#FF6600] to-[#FF8800] text-white shadow-lg shadow-[#FF6600]/20 shrink-0 group-data-[collapsible=icon]:size-8">
                <Sparkles className="h-6 w-6 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                <div className="absolute -inset-1 bg-[#FF6600]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="truncate font-black text-white tracking-[-0.05em] text-xl">
                  XELVO<span className="text-[#FF6600]">.</span>
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="truncate text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Control Core
                  </span>
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#050505] gap-4 px-2 pt-6 group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333] mb-4 group-data-[collapsible=icon]:hidden">
            Nodal Overview
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin"}
                tooltip="Dashboard"
                className="h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.03] data-[active=true]:bg-[#FF6600]/10 data-[active=true]:text-[#FF6600] data-[active=true]:shadow-lg data-[active=true]:shadow-[#FF6600]/5 transition-all duration-300 group/btn group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
              >
                <Link
                  href="/admin"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <div className="relative">
                    <LayoutDashboard className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                    <div className="absolute inset-0 bg-[#FF6600] blur-md opacity-0 group-data-[active=true]:opacity-20" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                    Control Center
                  </span>
                  <ChevronRight
                    size={14}
                    className="ml-auto text-[#333] group-hover/btn:text-[#FF6600] group-data-[collapsible=icon]:hidden transition-colors"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333] mb-4 group-data-[collapsible=icon]:hidden border-t border-white/5 pt-8">
            Resource Engine
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin/projects")}
                tooltip="Projects"
                className="h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.03] data-[active=true]:bg-[#FF6600]/10 data-[active=true]:text-[#FF6600] transition-all duration-300 group/btn group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
              >
                <Link
                  href="/admin/projects"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <FolderKanban className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                  <span className="font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                    Showcase Cabinet
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin/testimonials")}
                tooltip="Testimonials"
                className="h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.03] data-[active=true]:bg-[#FF6600]/10 data-[active=true]:text-[#FF6600] transition-all duration-300 group/btn group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
              >
                <Link
                  href="/admin/testimonials"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <Star className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                  <span className="font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                    Client Voices
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-[#333] mb-4 group-data-[collapsible=icon]:hidden border-t border-white/5 pt-8">
            Inbound Pulses
          </SidebarGroupLabel>
          <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin/inquiries")}
                tooltip="Inquiries"
                className="h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.03] data-[active=true]:bg-[#FF6600]/10 data-[active=true]:text-[#FF6600] transition-all duration-300 group/btn group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
              >
                <Link
                  href="/admin/inquiries"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <MessageSquare className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                  <span className="font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                    Strategic Leads
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/admin/careers")}
                tooltip="Careers"
                className="h-12 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.03] data-[active=true]:bg-[#FF6600]/10 data-[active=true]:text-[#FF6600] transition-all duration-300 group/btn group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:rounded-xl"
              >
                <Link
                  href="/admin/careers"
                  className="group-data-[collapsible=icon]:justify-center"
                >
                  <Briefcase className="h-5 w-5 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4" />
                  <span className="font-black uppercase tracking-widest text-[11px] group-data-[collapsible=icon]:hidden">
                    Talent Pulse
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#050505] border-t border-white/5 p-4 flex flex-col gap-4">
        <SignOutButton />
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-[#FF6600]/20" />
    </Sidebar>
  );
}
