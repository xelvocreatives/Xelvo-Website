"use client";

import * as React from "react";
import { toast } from "sonner";
import * as Switch from "@radix-ui/react-switch";
import { House, LayoutGrid } from "lucide-react";
import { createProject, updateProject, type State } from "@/app/actions/projects";
import { uploadToCloudinary } from "@/lib/upload-client";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";
import { XaButton } from "./kit/button";
import { Field, fieldA11y, inputClass } from "./kit/field";
import { ImagePicker, usePreviewUrl, validateImage } from "./kit/image-picker";

type Values = { title: string; category: string; description: string; isFeatured: boolean };
type Errors = Partial<Record<"title" | "category" | "description" | "image", string>>;

const LIMITS = { title: 100, category: 60, description: 600 };

function validate(values: Values, hasImage: boolean): Errors {
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
  if (!hasImage) errors.image = "Add a cover image for this project.";
  return errors;
}

const FIELD_ORDER: (keyof Errors)[] = ["title", "category", "description", "image"];

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
  const [values, setValues] = React.useState<Values>(initial);
  const [file, setFile] = React.useState<File | null>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [uploading, setUploading] = React.useState(false);
  const previewUrl = usePreviewUrl(file, project?.imageUrl);

  const action = project ? updateProject.bind(null, project.id) : createProject;
  const [state, formAction, saving] = React.useActionState<State, FormData>(action, {});
  const busy = saving || uploading;

  const dirty =
    file !== null ||
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
      const serverErrors: Errors = {
        title: state.errors?.title?.[0],
        category: state.errors?.category?.[0],
        description: state.errors?.description?.[0],
        image: state.errors?.imageUrl?.[0],
      };
      setErrors(serverErrors);
      toast.error(state.message);
    }
  }, [state, onSaved, onDirtyChange]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function focusFirstError(errs: Errors) {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) document.getElementById(`project-${first}`)?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validate(values, Boolean(file || project?.imageUrl));
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    const data = new FormData();
    data.set("title", values.title.trim());
    data.set("category", values.category.trim());
    data.set("description", values.description.trim());
    if (values.isFeatured) data.set("isFeatured", "on");

    if (file) {
      setUploading(true);
      try {
        data.set("imageUrl", await uploadToCloudinary(file, "project"));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed.";
        setErrors((e) => ({ ...e, image: message }));
        toast.error("The image couldn't be uploaded.", { description: message });
        return;
      } finally {
        setUploading(false);
      }
    }

    React.startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid h-full grid-rows-[1fr_auto]">
      <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Form */}
        <div className="space-y-6 px-5 py-6 sm:px-8">
          <Field
            id="project-image"
            label="Cover image"
            error={errors.image}
            hint="Landscape works best. Large photos are resized automatically."
          >
            <ImagePicker
              id="project-image"
              previewUrl={previewUrl}
              error={errors.image}
              emptyLabel="Add a cover image"
              onPick={(picked) => {
                const problem = validateImage(picked);
                if (problem) {
                  setErrors((e) => ({ ...e, image: problem }));
                  return;
                }
                setFile(picked);
                setErrors((e) => ({ ...e, image: undefined }));
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
            hint="What kind of work it was, e.g. Branding, Social media, Website."
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
            hint="One or two sentences: the client, the challenge and what you made."
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
                  ? "This project appears on your home page, which shows the first 4. Drag cards on the Projects screen to change the order."
                  : "This project appears on the Projects page of your website."}
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

        {/* Live preview */}
        <aside
          aria-label="Live preview"
          className="border-t border-xa-line bg-[#0f0f0f] px-5 py-6 sm:px-8 lg:border-t-0 lg:border-l"
        >
          <div className="lg:sticky lg:top-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-xa-ink">Live preview</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-xs font-medium text-xa-muted">
                {values.isFeatured ? <House className="size-3" aria-hidden /> : <LayoutGrid className="size-3" aria-hidden />}
                {values.isFeatured ? "Home page" : "Projects page"}
              </span>
            </div>
            <p className="mb-4 text-[13px] text-xa-muted">This is how the card looks to visitors on your website.</p>

            {/* Mirrors the public site's case-study card (components/CaseStudies.tsx). */}
            <div className="rounded-[20px] bg-white p-5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)]">
              <h3 className="mb-2 text-2xl leading-tight font-bold">
                <span className="bg-[linear-gradient(to_right,#E69700,#FF6600)] bg-clip-text break-words text-transparent">
                  {values.title.trim() || "Your project name"}
                </span>
              </h3>
              <p className={cn("text-base leading-[26px] break-words", values.description.trim() ? "text-black" : "text-black/40")}>
                {values.description.trim() || "Your short project story appears here."}
              </p>
              <div
                className="mt-5 h-[180px] w-full rounded-2xl bg-cover bg-center"
                style={
                  previewUrl
                    ? { backgroundImage: `url("${previewUrl}")` }
                    : { background: "rgb(255 102 0 / 0.25)", border: "2px dashed #FF6600" }
                }
                role="img"
                aria-label={previewUrl ? "Cover image" : "No cover image yet"}
              />
            </div>
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-xa-line bg-xa-ground px-5 py-4 sm:px-8">
        <p className="hidden text-[13px] text-xa-muted sm:block" aria-live="polite">
          {uploading ? "Uploading image…" : saving ? "Saving…" : dirty ? "You have unsaved changes." : ""}
        </p>
        <div className="flex w-full justify-end gap-2 sm:w-auto">
          <XaButton type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </XaButton>
          <XaButton type="submit" variant="primary" loading={busy} className="min-w-[140px]">
            {uploading ? "Uploading…" : saving ? "Saving…" : project ? "Save changes" : "Add project"}
          </XaButton>
        </div>
      </div>
    </form>
  );
}
