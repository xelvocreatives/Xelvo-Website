import { Project } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, LayoutGrid, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectForm } from "@/components/admin/project-form";
import Image from "next/image";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("Project")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <h3 className="text-red-500 font-bold text-xl">Data Error</h3>
        <p className="text-gray-400 mt-2">{error.message}</p>
      </div>
    );
  }

  if (!projects) return null;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <LayoutGrid className="text-[#FF6600]" size={36} />
            Showcase Cabinet
          </h2>
          <p className="text-gray-400 mt-1 font-medium italic">
            Curate your portfolio projects and case studies.
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
              <span>Add New Project</span>
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#0A0A0A] border-l border-white/5 text-white min-w-[400px] md:min-w-[700px] shadow-2xl p-0">
            <div className="h-full flex flex-col">
              <div className="p-8 md:p-12 bg-linear-to-br from-[#111] to-[#0A0A0A] border-b border-white/5">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FF6600]/10 flex items-center justify-center text-[#FF6600] border border-[#FF6600]/20">
                      <LayoutGrid size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                      System / Showcase
                    </span>
                  </div>
                  <SheetTitle className="text-4xl font-black text-white px-0 uppercase tracking-tight">
                    NEW PROJECT
                  </SheetTitle>
                  <SheetDescription className="text-gray-400 font-medium px-0 mt-2">
                    Deploy a new case study to your global showroom.
                  </SheetDescription>
                </SheetHeader>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                <ProjectForm />
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
                <th className="p-8">Visual Identity</th>
                <th className="p-8 text-center md:text-left">
                  Project Details
                </th>
                <th className="p-8">Display Status</th>
                <th className="p-8 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-gray-600 italic"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <LayoutGrid size={48} className="text-gray-800" />
                      <div>
                        Your cabinet is currently empty. Start showcasing your
                        craft.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                (projects as Project[]).map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-8">
                      <div className="relative h-24 w-40 overflow-hidden rounded-[20px] border border-white/5 group-hover:border-[#FF6600]/30 transition-all shadow-lg bg-[#111]">
                        {project.imageUrl ? (
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-800 font-black text-[10px]">
                            NO VISUAL
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-8 max-w-[300px]">
                      <h3 className="text-white font-black text-lg group-hover:text-[#FF6600] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed italic font-medium">
                        {project.description}
                      </p>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            project.isFeatured
                              ? "bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/20"
                              : "bg-white/5 text-gray-600 border border-white/5"
                          }`}
                        >
                          {project.isFeatured ? "Featured" : "Standard"}
                        </span>
                        {project.isFeatured && (
                          <Zap size={14} className="text-[#FF6600]" />
                        )}
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
                                      <LayoutGrid size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                      System / Modify
                                    </span>
                                  </div>
                                  <SheetTitle className="text-4xl font-black text-white px-0 uppercase tracking-tight">
                                    MODIFY WORK
                                  </SheetTitle>
                                  <SheetDescription className="text-gray-400 font-medium px-0 mt-2">
                                    Update case study details and assets.
                                  </SheetDescription>
                                </SheetHeader>
                              </div>
                              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                                <ProjectForm project={project} />
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <DeleteProjectButton id={project.id} />
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
