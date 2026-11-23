"use client";

import * as React from "react";
import { toast } from "sonner";
import * as Switch from "@radix-ui/react-switch";
import { House, LayoutGrid } from "lucide-react";
import { createProject, updateProject, type State } from "@/app/actions/projects";
import { uploadToCloudinary } from "@/lib/upload-client";
import { MAX_PROJECT_IMAGES } from "@/lib/admin-format";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { XaButton } from "./kit/button";
import { Field, fieldA11y, inputClass } from "./kit/field";
import { GalleryPicker, galleryFromUrls, type GalleryItem } from "./kit/gallery-picker";

type Values = { title: string; category: string; description: string; isFeatured: boolean };
type Errors = Partial<Record<"title" | "category" | "description" | "images", string>>;

const LIMITS = { title: 100, category: 60, description: 600 };

function validate(values: Values, imageCount: number): Errors {
  const errors: Errors = {};
  if (!values.title.trim()) errors.title = "Give the project a name.";
  else if (values.title.length > LIMITS.title) errors.title = `Keep the name under ${LIMITS.title} characters.`;
  if (!values.category.trim()) errors.category = "Add a category, e.g. Branding.";
  else if (values.category.length > LIMITS.category)
    errors.category = `Keep the category under ${LIMITS.category} characters.`;
  if (values.description.trim().length < 10)
    errors.description = "Write at least a short sentence (10+ characters).";
  else if (values.description.length > LIMITS.description)
    errors.description = `Keep the description under ${LIMITS.description} characters.`;
  if (imageCount === 0) errors.images = "Add at least one image for this project.";
  return errors;
}

const FIELD_ORDER: (keyof Errors)[] = ["images", "title", "category", "description"];

export function ProjectEditor({
  project,
  onDirtyChange,
  onSaved,
  onCancel,
}: {
  project?: Project;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const initial: Values = {
    title: project?.title ?? "",
    category: project?.category ?? "",
    description: project?.description ?? "",
    isFeatured: project?.isFeatured ?? false,
  };
  const initialImages = React.useMemo(() => project?.images ?? [], [project]);
  const [values, setValues] = React.useState<Values>(initial);
  const [gallery, setGallery] = React.useState<GalleryItem[]>(() => galleryFromUrls(initialImages));
  const [errors, setErrors] = React.useState<Errors>({});
  const [upload, setUpload] = React.useState<{ done: number; total: number } | null>(null);

  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction, saving] = React.useActionState<State, FormData>(action, {});
  const uploading = upload !== null;
  const busy = saving || uploading;

  const galleryChanged =
    gallery.length !== initialImages.length || gallery.some((g, i) => g.file || g.url !== initialImages[i]);
  const dirty =
    galleryChanged ||
    values.title !== initial.title ||
    values.category !== initial.category ||
    values.description !== initial.description ||
    values.isFeatured !== initial.isFeatured;

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  // React to the server's answer.
  const lastState = React.useRef(state);
  React.useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.ok) {
      toast.success(state.message ?? "Saved.");
      onDirtyChange(false);
      onSaved();
    } else if (state.message) {
      setErrors({
        title: state.errors?.title?.[0],
        category: state.errors?.category?.[0],
        description: state.errors?.description?.[0],
        images: state.errors?.images?.[0],
      });
      toast.error(state.message);
    }
  }, [state, onSaved, onDirtyChange]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validate(values, gallery.length);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) document.getElementById(`project-${first}`)?.focus();
      return;
    }

    // Upload new files in order, then send only URLs.
    const pending = gallery.filter((g) => g.file);
    const uploaded = new Map<string, string>();
    if (pending.length) {
      setUpload({ done: 0, total: pending.length });
      try {
        for (const [i, item] of pending.entries()) {
          uploaded.set(item.id, await uploadToCloudinary(item.file!, "project"));
          setUpload({ done: i + 1, total: pending.length });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed.";
        setErrors((e) => ({ ...e, images: message }));
        toast.error("An image couldn't be uploaded.", { description: message });
        return;
      } finally {
        setUpload(null);
      }
    }

    const data = new FormData();
    data.set("title", values.title.trim());
    data.set("category", values.category.trim());
    data.set("description", values.description.trim());
    data.set("images", JSON.stringify(gallery.map((g) => uploaded.get(g.id) ?? g.url)));
    if (values.isFeatured) data.set("isFeatured", "on");

    React.startTransition(() => formAction(data));
  }

  const previewItem = {
    title: values.title.trim() || "Your project name",
    category: values.category.trim() || "Category",
    images: gallery.map((g) => g.url),
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid h-full grid-rows-[1fr_auto]">
      <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Form */}
        <div className="space-y-6 px-5 py-6 sm:px-8">
          <Field
            id="project-images"
            label="Images"
            error={errors.images}
            hint={`Up to ${MAX_PROJECT_IMAGES}. The first is the cover; drag to change the order. Several images play as a slideshow on the website.`}
          >
            <GalleryPicker
              id="project-images"
              items={gallery}
              max={MAX_PROJECT_IMAGES}
              error={errors.images}
              onError={(message) => setErrors((e) => ({ ...e, images: message ?? undefined }))}
              onChange={(next) => {
                setGallery(next);
                if (next.length) setErrors((e) => ({ ...e, images: undefined }));
              }}
            />
          </Field>

          <Field
            id="project-title"
            label="Project name"
            error={errors.title}
            counter={{ value: values.title.length, max: LIMITS.title }}
          >
            <input
              {...fieldA11y("project-title", errors.title)}
              className={cn(inputClass, "h-12")}
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. The Horizon Travels"
              autoComplete="off"
            />
          </Field>

          <Field
            id="project-category"
            label="Category"
            error={errors.category}
            hint="Used for the filters on your Portfolio page, e.g. Branding, Social media, Packaging."
          >
            <input
              {...fieldA11y("project-category", errors.category, true)}
              className={cn(inputClass, "h-12")}
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Brand identity"
              autoComplete="off"
            />
          </Field>

          <Field
            id="project-description"
            label="About the project"
            error={errors.description}
            counter={{ value: values.description.length, max: LIMITS.description }}
            hint="Shown when a visitor opens the project: the client, the challenge and what you made."
          >
            <textarea
              {...fieldA11y("project-description", errors.description, true)}
              className={cn(inputClass, "min-h-[140px] resize-y py-3 leading-relaxed")}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. A faith-aligned rebrand for a travel agency: logo, company profile and social media kit."
            />
          </Field>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-xa-line bg-xa-panel p-4">
            <div>
              <label htmlFor="project-featured" className="text-sm font-semibold text-xa-ink">
                Show on the home page
              </label>
              <p className="mt-1 text-[13px] leading-relaxed text-xa-muted">
                {values.isFeatured
                  ? "Appears on your Home page (choose how many in Website → Home page → Featured projects) and on your Portfolio page."
                  : "Appears on your Portfolio page only."}
              </p>
            </div>
            <Switch.Root
              id="project-featured"
              checked={values.isFeatured}
              onCheckedChange={(checked) => set("isFeatured", checked)}
              className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-white/12 transition-colors duration-200 data-[state=checked]:bg-xa-accent"
            >
              <Switch.Thumb className="block size-5 translate-x-1 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.4)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:translate-x-6" />
            </Switch.Root>
          </div>
        </div>

        {/* Live preview: the real public card component. */}
        <aside
          aria-label="Live preview"
          className="border-t border-xa-line bg-[#0f0f0f] px-5 py-6 sm:px-8 lg:border-t-0 lg:border-l"
        >
          <div className="lg:sticky lg:top-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-xa-ink">Live preview</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-xs font-medium text-xa-muted">
                {values.isFeatured ? <House className="size-3" aria-hidden /> : <LayoutGrid className="size-3" aria-hidden />}
                {values.isFeatured ? "Home + Portfolio" : "Portfolio page"}
              </span>
            </div>
            <p className="mb-4 text-[13px] text-xa-muted">
              The card as visitors see it. On the website the name appears when they hover.
            </p>
            {previewItem.images.length > 0 ? (
              <div className="mx-auto max-w-[320px] bg-[#111111] p-3">
                <PortfolioCard item={previewItem} alwaysShowLabel sizes="320px" />
              </div>
            ) : (
              <div className="mx-auto flex aspect-[4/5] max-w-[320px] items-center justify-center rounded-2xl border-2 border-dashed border-xa-accent/50 bg-xa-accent/5 px-6 text-center text-sm text-xa-muted">
                Add images to see the card
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-xa-line bg-xa-ground px-5 py-4 sm:px-8">
        <p className="hidden text-[13px] text-xa-muted sm:block" aria-live="polite">
          {upload
            ? `Uploading image ${Math.min(upload.done + 1, upload.total)} of ${upload.total}…`
            : saving
              ? "Saving…"
              : dirty
                ? "You have unsaved changes."
                : ""}
        </p>
        <div className="flex w-full justify-end gap-2 sm:w-auto">
          <XaButton type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </XaButton>
          <XaButton type="submit" variant="primary" loading={busy} className="min-w-[150px]">
            {upload
              ? `Uploading ${Math.min(upload.done + 1, upload.total)}/${upload.total}…`
              : saving
                ? "Saving…"
                : project
                  ? "Save changes"
                  : "Add project"}
          </XaButton>
        </div>
      </div>
    </form>
  );
}
