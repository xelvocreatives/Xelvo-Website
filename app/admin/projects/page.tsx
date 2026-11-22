import { Suspense } from "react";
import { getAllProjects } from "@/lib/data";
import { ProjectsBoard } from "@/components/admin/projects-board";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <Suspense>
      <ProjectsBoard projects={projects} />
    </Suspense>
  );
}
