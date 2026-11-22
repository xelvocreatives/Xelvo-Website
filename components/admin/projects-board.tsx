"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, House, Images, Info, LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProject, reorderProjects, setProjectFeatured } from "@/app/actions/projects";
import { showsOn } from "@/lib/admin-format";
import type { Project } from "@/types";
import { XaButton } from "./kit/button";
import { PageHeader, SectionHeading } from "./kit/page-header";
import { EmptyState } from "./kit/empty-state";
import { ActionMenu, type MenuItem } from "./kit/action-menu";
import { ConfirmDialog } from "./kit/confirm-dialog";
import { EditorPanel } from "./kit/editor-panel";
import { ReorderHint, SortableGrid } from "./kit/sortable-grid";
import { ProjectTile } from "./project-tile";
import { ProjectEditor } from "./project-editor";

const HOME_LIMIT = 4;

export function ProjectsBoard({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ?new=1 and ?edit=<id> let the Home page open the editor directly.
  const editId = searchParams.get("edit");
  const editing = editId ? projects.find((p) => p.id === editId) : undefined;
  const [open, setOpen] = React.useState(Boolean(searchParams.get("new") || editing));
  const [current, setCurrent] = React.useState<Project | undefined>(editing);
  const [editorKey, setEditorKey] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Project | null>(null);
  const [, startTransition] = React.useTransition();

  // Local copy so a drag shows instantly; the server's list wins whenever it changes.
  const [list, setList] = React.useState(projects);
  React.useEffect(() => setList(projects), [projects]);

  function openEditor(project?: Project) {
    setCurrent(project);
    setEditorKey((k) => k + 1);
    setDirty(false);
    setOpen(true);
  }

  function closeEditor() {
    setOpen(false);
    setDirty(false);
    if (searchParams.size > 0) router.replace(pathname, { scroll: false });
  }

  function toggleFeatured(project: Project) {
    startTransition(async () => {
      const result = await setProjectFeatured(project.id, !project.isFeatured);
      if (result.ok) toast.success(result.message, { description: project.title });
      else toast.error(result.message);
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const result = await deleteProject(toDelete.id);
    if (result.ok) toast.success(result.message, { description: toDelete.title });
    else toast.error(result.message);
  }

  const featured = list.filter((p) => p.isFeatured);
  const others = list.filter((p) => !p.isFeatured);

  /** Save a new arrangement of one section; the other section keeps its order. */
  function saveOrder(section: "home" | "page", arranged: Project[]) {
    const next = section === "home" ? [...arranged, ...others] : [...featured, ...arranged];
    const previous = list;
    setList(next);
    startTransition(async () => {
      const result = await reorderProjects(next.map((p) => p.id));
      if (result.ok) {
        toast.success(result.message, {
          id: "project-order",
          description: section === "home" ? "Home page order updated." : "Projects page order updated.",
        });
      } else {
        setList(previous);
        toast.error(result.message, { id: "project-order" });
      }
    });
  }

  function move(section: "home" | "page", items: Project[], index: number, by: -1 | 1) {
    const target = index + by;
    if (target < 0 || target >= items.length) return;
    const arranged = [...items];
    [arranged[index], arranged[target]] = [arranged[target], arranged[index]];
    saveOrder(section, arranged);
  }

  const renderSection = (section: "home" | "page", items: Project[]) => (
    <SortableGrid
      items={items}
      itemLabel={(p) => p.title}
      onReorder={(arranged) => saveOrder(section, arranged)}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      renderItem={(project, handle, index) => {
        const menu: MenuItem[] = [
          { label: "Edit", icon: <Pencil />, onSelect: () => openEditor(project) },
          ...(index > 0
            ? [{ label: "Move up", icon: <ArrowUp />, onSelect: () => move(section, items, index, -1) }]
            : []),
          ...(index < items.length - 1
            ? [{ label: "Move down", icon: <ArrowDown />, onSelect: () => move(section, items, index, 1) }]
            : []),
          project.isFeatured
            ? { label: "Move to projects page", icon: <LayoutGrid />, onSelect: () => toggleFeatured(project) }
            : { label: "Show on home page", icon: <House />, onSelect: () => toggleFeatured(project) },
          { label: "Delete", icon: <Trash2 />, danger: true, onSelect: () => setToDelete(project) },
        ];
        return (
          <>
            <button
              type="button"
              onClick={() => openEditor(project)}
              className="block w-full text-left"
              aria-label={`Edit ${project.title}`}
            >
              <ProjectTile project={project} />
            </button>
            <div className="absolute top-3 right-3 flex gap-1.5">
              {items.length > 1 && handle}
              <ActionMenu label={`Options for ${project.title}`} items={menu} />
            </div>
            {section === "home" && index >= HOME_LIMIT && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-xa-muted">
                <Info className="size-3.5" aria-hidden />
                Not shown: the home page shows the first {HOME_LIMIT}. Drag it higher to show it.
              </p>
            )}
          </>
        );
      }}
    />
  );

  return (
    <>
      <PageHeader
        title="Projects"
        description="Your portfolio on the website. Choose which projects appear on the home page, and drag cards to set the order visitors see."
        actions={
          <XaButton variant="primary" onClick={() => openEditor()}>
            <Plus />
            Add project
          </XaButton>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<Images />}
          title="No projects yet"
          description="Add your first case study: a cover image, a name and a short story about the work."
          action={
            <XaButton variant="primary" onClick={() => openEditor()}>
              <Plus />
              Add project
            </XaButton>
          }
        />
      ) : (
        <div className="space-y-12">
          <section aria-labelledby="home-projects">
            <SectionHeading title="On the home page" meta={showsOn(featured.length, HOME_LIMIT, "the home page")} />
            {featured.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-xa-line-strong px-5 py-6 text-sm text-xa-muted">
                No projects on the home page yet. Open a project&apos;s menu and choose{" "}
                <span className="font-semibold text-xa-ink">Show on home page</span>.
              </p>
            ) : (
              <>
                {featured.length > 1 && (
                  <ReorderHint>Drag the grip on a card to change the order on your home page.</ReorderHint>
                )}
                {renderSection("home", featured)}
              </>
            )}
          </section>

          <section aria-labelledby="projects-page">
            <SectionHeading title="On the projects page" meta={showsOn(others.length, Infinity, "the projects page")} />
            {others.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-xa-line-strong px-5 py-6 text-sm text-xa-muted">
                Every project is on the home page right now, so your website&apos;s Projects page is empty.
                Move some here to fill it.
              </p>
            ) : (
              <>
                {others.length > 1 && (
                  <ReorderHint>Drag the grip on a card to change the order on your Projects page.</ReorderHint>
                )}
                {renderSection("page", others)}
              </>
            )}
          </section>
        </div>
      )}

      <EditorPanel
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : closeEditor())}
        title={current ? "Edit project" : "Add a project"}
        description={current ? current.title : "Add a case study to your website."}
        dirty={dirty}
      >
        {(requestClose) => (
          <ProjectEditor
            key={editorKey}
            project={current}
            onDirtyChange={setDirty}
            onSaved={closeEditor}
            onCancel={requestClose}
          />
        )}
      </EditorPanel>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(next) => !next && setToDelete(null)}
        title="Delete this project?"
        description={
          <>
            <span className="font-semibold text-xa-ink">{toDelete?.title}</span> will be removed from your website
            right away. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete project"
        onConfirm={confirmDelete}
      />
    </>
  );
}
