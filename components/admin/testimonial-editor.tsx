"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, Star } from "lucide-react";
import { createTestimonial, updateTestimonial, type TestimonialState } from "@/app/actions/testimonials";
import { uploadToCloudinary } from "@/lib/upload-client";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import { XaButton } from "./kit/button";
import { Field, fieldA11y, inputClass } from "./kit/field";
import { ImagePicker, usePreviewUrl, validateImage } from "./kit/image-picker";

type Values = { clientName: string; company: string; text: string; rating: number; socialPlatform: string };
type Errors = Partial<Record<"clientName" | "company" | "text" | "rating" | "image", string>>;

const LIMITS = { clientName: 80, company: 80, text: 500 };

export const SOCIAL_PLATFORMS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "upwork", label: "Upwork" },
  { value: "fiverr", label: "Fiverr" },
  { value: "google", label: "Google review" },
  { value: "other", label: "Other / direct" },
];

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.clientName.trim()) e.clientName = "Add the client's name.";
  else if (v.clientName.length > LIMITS.clientName) e.clientName = `Keep the name under ${LIMITS.clientName} characters.`;
  if (!v.company.trim()) e.company = "Add the client's company or brand.";
  else if (v.company.length > LIMITS.company) e.company = `Keep the company under ${LIMITS.company} characters.`;
  if (v.text.trim().length < 10) e.text = "The review needs at least 10 characters.";
  else if (v.text.length > LIMITS.text) e.text = `Keep the review under ${LIMITS.text} characters.`;
  if (v.rating < 1 || v.rating > 5) e.rating = "Choose a rating from 1 to 5 stars.";
  return e;
}

const FIELD_ORDER: (keyof Errors)[] = ["clientName", "company", "rating", "text", "image"];

export function TestimonialEditor({
  testimonial,
  onDirtyChange,
  onSaved,
  onCancel,
}: {
  testimonial?: Testimonial;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const initial: Values = {
    clientName: testimonial?.clientName ?? "",
    company: testimonial?.company ?? "",
    text: testimonial?.text ?? "",
    rating: testimonial?.rating ?? 5,
    socialPlatform: testimonial?.socialPlatform ?? "linkedin",
  };
  const [values, setValues] = React.useState<Values>(initial);
  const [file, setFile] = React.useState<File | null>(null);
  const [removed, setRemoved] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [uploading, setUploading] = React.useState(false);
  const previewUrl = usePreviewUrl(file, removed ? null : testimonial?.imageUrl);

  const action = testimonial ? updateTestimonial.bind(null, testimonial.id) : createTestimonial;
  const [state, formAction, saving] = React.useActionState<TestimonialState, FormData>(action, {});
  const busy = saving || uploading;

  const dirty =
    file !== null ||
    removed ||
    (Object.keys(initial) as (keyof Values)[]).some((k) => values[k] !== initial[k]);

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

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
        clientName: state.errors?.clientName?.[0],
        company: state.errors?.company?.[0],
        text: state.errors?.text?.[0],
        rating: state.errors?.rating?.[0],
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
    const errs = validate(values);
    if (Object.values(errs).some(Boolean)) {
      setErrors(errs);
      const first = FIELD_ORDER.find((k) => errs[k]);
      if (first) document.getElementById(`testimonial-${first}`)?.focus();
      return;
    }

    const data = new FormData();
    data.set("clientName", values.clientName.trim());
    data.set("company", values.company.trim());
    data.set("text", values.text.trim());
    data.set("rating", String(values.rating));
    data.set("socialPlatform", values.socialPlatform);
    if (removed && !file) data.set("removeImage", "1");

    if (file) {
      setUploading(true);
      try {
        data.set("imageUrl", await uploadToCloudinary(file, "testimonial"));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed.";
        setErrors((e) => ({ ...e, image: message }));
        toast.error("The photo couldn't be uploaded.", { description: message });
        return;
      } finally {
        setUploading(false);
      }
    }

    React.startTransition(() => formAction(data));
  }

  const name = values.clientName.trim() || "Client name";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid h-full grid-rows-[1fr_auto]">
      <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6 px-5 py-6 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="testimonial-clientName" label="Client name" error={errors.clientName}>
              <input
                {...fieldA11y("testimonial-clientName", errors.clientName)}
                className={cn(inputClass, "h-12")}
                value={values.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                placeholder="e.g. Aisha Khan"
                autoComplete="off"
              />
            </Field>
            <Field id="testimonial-company" label="Company or brand" error={errors.company}>
              <input
                {...fieldA11y("testimonial-company", errors.company)}
                className={cn(inputClass, "h-12")}
                value={values.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Barakah Foods"
                autoComplete="off"
              />
            </Field>
          </div>

          <Field id="testimonial-rating" label="Rating" error={errors.rating}>
            <div
              role="radiogroup"
              aria-labelledby="testimonial-rating-label"
              id="testimonial-rating"
              tabIndex={-1}
              className="flex items-center gap-3"
            >
              <span id="testimonial-rating-label" className="sr-only">
                Rating
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={values.rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => set("rating", n)}
                    className="rounded-md p-1 transition-transform duration-150 hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "size-7 transition-colors",
                        n <= values.rating ? "fill-xa-accent text-xa-accent" : "text-xa-faint",
                      )}
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm font-medium text-xa-muted">{RATING_WORDS[values.rating]}</span>
            </div>
          </Field>

          <Field
            id="testimonial-text"
            label="What they said"
            error={errors.text}
            counter={{ value: values.text.length, max: LIMITS.text }}
            hint="Paste the review in the client's own words."
          >
            <textarea
              {...fieldA11y("testimonial-text", errors.text, true)}
              className={cn(inputClass, "min-h-[150px] resize-y py-3 leading-relaxed")}
              value={values.text}
              onChange={(e) => set("text", e.target.value)}
              placeholder="e.g. Xelvo understood our values from day one and gave us a brand we're proud of."
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="testimonial-image" label="Client photo" optional error={errors.image} hint="Without a photo, their initials are shown.">
              <ImagePicker
                id="testimonial-image"
                shape="round"
                previewUrl={previewUrl}
                error={errors.image}
                onPick={(picked) => {
                  const problem = validateImage(picked);
                  if (problem) {
                    setErrors((e) => ({ ...e, image: problem }));
                    return;
                  }
                  setFile(picked);
                  setRemoved(false);
                  setErrors((e) => ({ ...e, image: undefined }));
                }}
                onRemove={() => {
                  setFile(null);
                  setRemoved(Boolean(testimonial?.imageUrl));
                }}
              />
            </Field>
            <Field id="testimonial-platform" label="Where the review came from" optional>
              <div className="relative">
                <select
                  id="testimonial-platform"
                  value={values.socialPlatform}
                  onChange={(e) => set("socialPlatform", e.target.value)}
                  className={cn(inputClass, "h-12 appearance-none pr-10")}
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value} className="bg-[#1c1c1c]">
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-xa-muted"
                  aria-hidden
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Live preview, mirrors the public review card (components/ClientFeedback.tsx). */}
        <aside
          aria-label="Live preview"
          className="border-t border-xa-line bg-[#0f0f0f] px-5 py-6 sm:px-8 lg:border-t-0 lg:border-l"
        >
          <div className="lg:sticky lg:top-0">
            <p className="mb-1 text-sm font-semibold text-xa-ink">Live preview</p>
            <p className="mb-4 text-[13px] text-xa-muted">This is how the review looks on your website.</p>
            <div className="flex w-full max-w-[300px] flex-col gap-3.5 rounded-[20px] border border-[#181818] bg-[#121212] p-3 shadow-[0_4px_24px_rgb(0_0_0/0.2)]">
              <div className="flex flex-col gap-2.5 rounded-[22px] border border-[#181818] bg-[#121212] p-[15px]">
                <div className="flex gap-1">
                  {Array.from({ length: values.rating }, (_, i) => (
                    <Star key={i} size={20} fill="#FF6C25" className="text-[#FF6C25]" aria-hidden />
                  ))}
                </div>
                <p className={cn("text-sm leading-6 font-light break-words", values.text.trim() ? "text-[#B9B9B9]" : "text-[#6b6b6b]")}>
                  {values.text.trim() || "The client's review appears here."}
                </p>
              </div>
              <div className="flex gap-2.5">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#FF6600_0%,#E69700_100%)]">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="size-full object-cover"
                      unoptimized={previewUrl.startsWith("blob:")}
                    />
                  ) : (
                    <span className="text-base font-bold text-white">{name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg leading-6 text-white">{name}</p>
                  <p className="truncate text-sm leading-5 text-[#B9B9B9]">{values.company.trim() || "Company"}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-xa-line bg-xa-ground px-5 py-4 sm:px-8">
        <p className="hidden text-[13px] text-xa-muted sm:block" aria-live="polite">
          {uploading ? "Uploading photo…" : saving ? "Saving…" : dirty ? "You have unsaved changes." : ""}
        </p>
        <div className="flex w-full justify-end gap-2 sm:w-auto">
          <XaButton type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </XaButton>
          <XaButton type="submit" variant="primary" loading={busy} className="min-w-[160px]">
            {uploading ? "Uploading…" : saving ? "Saving…" : testimonial ? "Save changes" : "Add testimonial"}
          </XaButton>
        </div>
      </div>
    </form>
  );
}
