"use client";

import { useActionState } from "react";
import { createProject, updateProject, State } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types";
import { Upload, Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function ProjectForm({
  project,
}: {
  project?: Project;
  onClose?: () => void;
}) {
  const initialState: State = { message: null, errors: {} };
  const updateProjectWithId = project
    ? updateProject.bind(null, project.id)
    : null;

  const [state, formAction, isPending] = useActionState(
    project ? updateProjectWithId! : createProject,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8 px-2 max-w-2xl mx-auto pb-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Title Field */}
        <div className="space-y-3">
          <Label
            htmlFor="title"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            Project Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="THE HORIZON TRAVELS"
            defaultValue={project?.title}
            required
            className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl transition-all font-bold px-6 text-lg"
          />
          {state.errors?.title && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1 animate-shake">
              {state.errors.title.join(", ")}
            </p>
          )}
        </div>

        {/* Category Field */}
        <div className="space-y-3">
          <Label
            htmlFor="category"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            Industry / Category
          </Label>
          <Input
            id="category"
            name="category"
            placeholder="SOCIAL MEDIA / BRANDING"
            defaultValue={project?.category}
            required
            className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 h-14 rounded-2xl transition-all font-bold px-6 uppercase text-sm tracking-widest"
          />
          {state.errors?.category && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1 animate-shake">
              {state.errors.category.join(", ")}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-3">
          <Label
            htmlFor="description"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            Case Study Overview
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the creative journey and global impact..."
            defaultValue={project?.description}
            required
            className="bg-white/3 border-white/10 text-white placeholder:text-gray-700 focus:border-[#FF6600]/50 focus:ring-[#FF6600]/20 min-h-[160px] rounded-[24px] transition-all font-medium p-6 text-base leading-relaxed"
          />
          {state.errors?.description && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1 animate-shake">
              {state.errors.description.join(", ")}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <Label
            htmlFor="image"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6600] ml-1"
          >
            Visual Asset
          </Label>
          <div className="flex flex-col gap-6 p-6 bg-white/2 border border-white/5 rounded-[24px] hover:border-[#FF6600]/20 transition-all">
            {project?.imageUrl && (
              <div className="relative h-48 w-full rounded-[20px] overflow-hidden border border-white/10 group">
                <Image
                  src={project.imageUrl}
                  alt="Current project visual"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full">
                    Current asset
                  </span>
                </div>
              </div>
            )}
            <div className="relative group">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              />
              <div className="h-20 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 text-gray-500 group-hover:border-[#FF6600]/30 group-hover:text-white transition-all bg-white/1">
                <Upload size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Deploy New Visual
                </span>
              </div>
            </div>
            <Input
              type="hidden"
              name="imageUrl"
              value={project?.imageUrl || ""}
            />
          </div>
          {state.errors?.imageUrl && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1 animate-shake">
              {state.errors.imageUrl.join(", ")}
            </p>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="relative p-7 bg-white/2 border border-white/5 rounded-[24px] flex items-center justify-between group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Star size={100} className="text-[#FF6600]" />
          </div>
          <div className="relative z-10">
            <h4 className="text-white font-black text-sm tracking-tight">
              Showcase Priority
            </h4>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
              Feature this work on the Global Showroom
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer z-10">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={project?.isFeatured}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-white/5 border border-white/10 rounded-full peer peer-checked:bg-[#FF6600]/20 peer-checked:border-[#FF6600]/40 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white/20 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6 peer-checked:after:bg-[#FF6600]"></div>
          </label>
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

      <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-linear-to-r from-[#FF6600] to-[#FF8800] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black uppercase tracking-[0.2em] text-xs h-16 rounded-[24px] shadow-2xl shadow-[#FF6600]/20"
        >
          {isPending
            ? "INITIALIZING DEPLOYMENT..."
            : project
              ? "UPDATE CORE RECORD"
              : "DEPLOY TO SHOWROOM"}
        </Button>
      </div>
    </form>
  );
}
