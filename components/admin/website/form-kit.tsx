"use client";

import * as React from "react";
import Image from "next/image";
import * as Switch from "@radix-ui/react-switch";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { Field, fieldA11y, inputClass } from "@/components/admin/kit/field";
import { validateImage } from "@/components/admin/kit/image-picker";
import { uploadToCloudinary } from "@/lib/upload-client";
import { GradientText } from "@/components/ui/GradientText";
import { fieldErrors, type Highlighted, type Person } from "@/lib/site/schema";

/* ------------------------------------------------------------------ */
/* Draft state                                                          */
/* ------------------------------------------------------------------ */

type Path = (string | number)[];

function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[head] = setIn(copy[head], rest, value);
  return copy as T;
}

/**
 * Form state for one block of content: the working copy, field errors keyed
 * by path ("cards.0.title"), dirty tracking, and validation with the same
 * schema the server uses.
 */
export function useDraft<T>(initial: T, schema: z.ZodType<T>) {
  const [value, setValue] = React.useState<T>(initial);
  const [saved, setSaved] = React.useState(() => JSON.stringify(initial));
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const set = React.useCallback((path: Path, next: unknown) => {
    setValue((v) => setIn(v, path, next));
    const key = path.join(".");
    setErrors((e) => {
      if (!Object.keys(e).some((k) => k === key || k.startsWith(`${key}.`))) return e;
      const copy = { ...e };
      for (const k of Object.keys(copy)) if (k === key || k.startsWith(`${key}.`)) delete copy[k];
      return copy;
    });
  }, []);

  const dirty = JSON.stringify(value) !== saved;

  /** Validates in the browser; returns the clean value or null (and shows errors). */
  function check(): T | null {
    const parsed = schema.safeParse(value);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }
    setErrors(fieldErrors(parsed.error));
    toast.error("Some fields need attention.");
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    });
    return null;
  }

  function markSaved(next: T) {
    setValue(next);
    setSaved(JSON.stringify(next));
  }

  return { value, set, setValue, errors, setErrors, dirty, check, markSaved };
}

export type Draft<T> = ReturnType<typeof useDraft<T>>;

/** Warns before leaving the page with unsaved edits. */
export function useLeaveWarning(dirty: boolean) {
  React.useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

/* ------------------------------------------------------------------ */
/* Layout                                                               */
/* ------------------------------------------------------------------ */

/** A titled group of fields inside a form. */
export function FormGroup({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6", className)}>
      <h3 className="text-base font-bold text-xa-ink">{title}</h3>
      {description && <p className="mt-1 text-sm leading-relaxed text-xa-muted">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                               */
/* ------------------------------------------------------------------ */

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  max,
  optional,
  rows,
  placeholder,
  list,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: React.ReactNode;
  max?: number;
  optional?: boolean;
  /** Multi-line when set. */
  rows?: number;
  placeholder?: string;
  list?: string;
}) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      counter={max && value.length > max * 0.7 ? { value: value.length, max } : undefined}
    >
      {rows ? (
        <textarea
          {...fieldA11y(id, error, Boolean(hint))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={cn(inputClass, "resize-y py-3 leading-relaxed")}
        />
      ) : (
        <input
          {...fieldA11y(id, error, Boolean(hint))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          list={list}
          className={cn(inputClass, "h-11")}
        />
      )}
    </Field>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  error?: string;
  hint?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        {...fieldA11y(id, error, Boolean(hint))}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step ?? "any"}
        onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
        className={cn(inputClass, "h-11 tabular-nums")}
      />
    </Field>
  );
}

const LINK_SUGGESTIONS = ["#contact", "#services", "#featured", "#about", "#faq", "/portfolio", "/blog", "/career"];

/** Button/banner destination with the common choices offered as suggestions. */
export function LinkField(props: Omit<React.ComponentProps<typeof TextField>, "list" | "hint">) {
  return (
    <>
      <TextField
        {...props}
        list="xa-link-suggestions"
        placeholder="#contact"
        hint="Where it goes when clicked: #contact (the form on the Home page), /portfolio, or a full web address. If you hide the section it points to, it opens your WhatsApp (from Contact & social) instead."
      />
      <datalist id="xa-link-suggestions">
        {LINK_SUGGESTIONS.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
    </>
  );
}

/**
 * A line of text with some words shown in the orange gradient, plus a live
 * preview so the owner sees exactly what visitors will see.
 */
export function HighlightField({
  id,
  label,
  value,
  onChange,
  errors,
  max = 300,
  multiline,
  hint,
}: {
  id: string;
  label: string;
  value: Highlighted;
  onChange: (v: Highlighted) => void;
  errors: Record<string, string>;
  /** Error keys are looked up as `${prefix}.text` / `${prefix}.highlight`. */
  max?: number;
  multiline?: boolean;
  hint?: string;
} & { errorPrefix?: string }) {
  const textError = errors[`${id}.text`];
  const hlError = errors[`${id}.highlight`];
  const at = value.highlight ? value.text.indexOf(value.highlight) : -1;

  return (
    <div className="space-y-3 rounded-xl border border-xa-line p-4">
      <TextField
        id={`${id}-text`}
        label={label}
        value={value.text}
        onChange={(text) => onChange({ ...value, text })}
        error={textError}
        max={max}
        rows={multiline ? 3 : undefined}
        hint={hint ?? (multiline ? "Press Enter to start a new line." : undefined)}
      />
      <TextField
        id={`${id}-highlight`}
        label="Words in orange"
        optional
        value={value.highlight}
        onChange={(highlight) => onChange({ ...value, highlight })}
        error={hlError ?? (value.highlight && at < 0 ? "These words must appear exactly as written above." : undefined)}
        hint="Copy the words from above that should show in the orange gradient."
      />
      <div aria-hidden className="rounded-lg bg-[#111111] px-4 py-3">
        <p className="mb-1 text-xs font-semibold tracking-wide text-xa-faint uppercase">Preview</p>
        <p className="text-lg leading-snug font-bold text-white">
          {at < 0 ? (
            <Lines text={value.text} />
          ) : (
            <>
              <Lines text={value.text.slice(0, at)} />
              <GradientText>
                <Lines text={value.highlight} />
              </GradientText>
              <Lines text={value.text.slice(at + value.highlight.length)} />
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </>
  );
}

export function ToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-xa-ink">
          {label}
        </label>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-xa-muted">{description}</p>}
      </div>
      <XaSwitch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function XaSwitch({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  id?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Switch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      disabled={disabled}
      className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full bg-white/12 transition-colors duration-200 disabled:opacity-50 data-[state=checked]:bg-xa-accent"
    >
      <Switch.Thumb className="block size-5 translate-x-1 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.4)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:translate-x-6" />
    </Switch.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Lists                                                                */
/* ------------------------------------------------------------------ */

function move<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowButtons({
  index,
  count,
  onMove,
  onRemove,
  removeLabel,
  canRemove,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  removeLabel: string;
  canRemove: boolean;
}) {
  const btn =
    "flex size-9 shrink-0 items-center justify-center rounded-lg text-xa-muted transition-colors hover:bg-white/8 hover:text-xa-ink disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Move up" title="Move up">
        <ArrowUp className="size-4" />
      </button>
      <button
        type="button"
        className={btn}
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
        aria-label="Move down"
        title="Move down"
      >
        <ArrowDown className="size-4" />
      </button>
      <button
        type="button"
        className={cn(btn, "hover:text-xa-red")}
        disabled={!canRemove}
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

/** A short list of one-line items (bullet points, features, menu items). */
export function StringListField({
  id,
  label,
  items,
  onChange,
  errors,
  min = 0,
  max,
  itemName,
  hint,
}: {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  errors: Record<string, string>;
  min?: number;
  max: number;
  itemName: string;
  hint?: string;
}) {
  const listError = errors[id];
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-xa-ink">{label}</legend>
      {hint && <p className="text-[13px] leading-relaxed text-xa-muted">{hint}</p>}
      <ul className="space-y-2">
        {items.map((item, i) => {
          const err = errors[`${id}.${i}`];
          return (
            <li key={i} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <input
                  {...fieldA11y(`${id}-${i}`, err)}
                  aria-label={`${itemName} ${i + 1}`}
                  value={item}
                  onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
                  className={cn(inputClass, "h-10 min-w-0 flex-1 text-sm")}
                />
                <RowButtons
                  index={i}
                  count={items.length}
                  onMove={(to) => onChange(move(items, i, to))}
                  onRemove={() => onChange(items.filter((_, j) => j !== i))}
                  removeLabel={`Remove ${itemName.toLowerCase()} ${i + 1}`}
                  canRemove={items.length > min}
                />
              </div>
              {err && (
                <p id={`${id}-${i}-error`} role="alert" className="text-[13px] text-xa-red">
                  {err}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {listError && (
        <p role="alert" className="text-[13px] text-xa-red">
          {listError}
        </p>
      )}
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-xa-ink hover:bg-white/8"
        >
          <Plus className="size-4" />
          Add {itemName.toLowerCase()}
        </button>
      )}
    </fieldset>
  );
}

/** Repeating cards (services, FAQ entries, phases…), each with its own fields. */
export function CardListField<T>({
  id,
  label,
  items,
  onChange,
  errors,
  min = 0,
  max,
  itemName,
  newItem,
  itemTitle,
  renderItem,
  hint,
}: {
  id: string;
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  errors: Record<string, string>;
  min?: number;
  max: number;
  itemName: string;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (path: Path, value: unknown) => void, index: number) => React.ReactNode;
  hint?: string;
}) {
  const listError = errors[id];
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-xa-ink">{label}</legend>
      {hint && <p className="text-[13px] leading-relaxed text-xa-muted">{hint}</p>}
      {items.map((item, i) => {
        const hasError = Object.keys(errors).some((k) => k.startsWith(`${id}.${i}.`) || k === `${id}.${i}`);
        return (
          <div
            key={i}
            className={cn("rounded-xl border bg-[#0f0f0f]", hasError ? "border-xa-red/50" : "border-xa-line")}
          >
            <div className="flex items-center gap-2 border-b border-xa-line py-1.5 pr-1.5 pl-4">
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-xa-ink">
                <span className="mr-2 text-xa-faint tabular-nums">{i + 1}.</span>
                {itemTitle(item, i) || `New ${itemName.toLowerCase()}`}
              </p>
              <RowButtons
                index={i}
                count={items.length}
                onMove={(to) => onChange(move(items, i, to))}
                onRemove={() => onChange(items.filter((_, j) => j !== i))}
                removeLabel={`Remove ${itemName.toLowerCase()} ${i + 1}`}
                canRemove={items.length > min}
              />
            </div>
            <div className="space-y-4 p-4">
              {renderItem(item, (path, value) => onChange(items.map((x, j) => (j === i ? setIn(x, path, value) : x))), i)}
            </div>
          </div>
        );
      })}
      {listError && (
        <p role="alert" className="text-[13px] text-xa-red">
          {listError}
        </p>
      )}
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-xa-line-strong px-4 text-[13px] font-semibold text-xa-ink hover:border-white/30 hover:bg-white/5"
        >
          <Plus className="size-4" />
          Add {itemName.toLowerCase()}
        </button>
      )}
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* Images                                                               */
/* ------------------------------------------------------------------ */

/** Picks a picture and uploads it straight away; the field holds the uploaded address. */
function useUpload(onDone: (url: string) => void) {
  const [busy, setBusy] = React.useState(false);
  async function pick(file: File) {
    const problem = validateImage(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    try {
      onDone(await uploadToCloudinary(file, "site"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return { busy, pick };
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  aspect = "aspect-[16/9]",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  aspect?: string;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const { busy, pick } = useUpload(onChange);
  return (
    <Field id={id} label={label} error={error} hint={hint} optional={optional}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          aria-label={value ? `Replace ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-dashed border-xa-line-strong bg-[#101010] transition-colors hover:border-white/30 sm:w-64",
            aspect,
          )}
        >
          {value ? (
            <Image src={value} alt="" fill sizes="256px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-xa-muted">
              <ImagePlus className="size-6" />
              Add a picture
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="size-6 animate-spin text-white" />
            </span>
          )}
        </button>
        <div className="flex gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-xa-line-strong px-3 text-[13px] font-semibold text-xa-ink hover:bg-white/5"
          >
            <RefreshCw className="size-3.5" />
            {value ? "Replace" : "Choose picture"}
          </button>
          {value && optional && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-xa-muted hover:bg-white/5 hover:text-xa-red"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) pick(file);
        }}
      />
    </Field>
  );
}

/** Small round client photos with name and role (shown as a tooltip on the site). */
export function PeopleField({
  id,
  label,
  hint,
  people,
  onChange,
  errors,
  max,
}: {
  id: string;
  label: string;
  hint?: string;
  people: Person[];
  onChange: (people: Person[]) => void;
  errors: Record<string, string>;
  max: number;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-xa-ink">{label}</legend>
      {hint && <p className="text-[13px] leading-relaxed text-xa-muted">{hint}</p>}
      <ul className="space-y-2">
        {people.map((p, i) => (
          <PersonRow
            key={i}
            id={`${id}-${i}`}
            person={p}
            index={i}
            count={people.length}
            errors={{ name: errors[`${id}.${i}.name`], role: errors[`${id}.${i}.role`], image: errors[`${id}.${i}.image`] }}
            onChange={(next) => onChange(people.map((x, j) => (j === i ? next : x)))}
            onMove={(to) => onChange(move(people, i, to))}
            onRemove={() => onChange(people.filter((_, j) => j !== i))}
          />
        ))}
      </ul>
      {people.length < max && (
        <button
          type="button"
          onClick={() => onChange([...people, { name: "", role: "", image: "" }])}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-xa-ink hover:bg-white/8"
        >
          <Plus className="size-4" />
          Add photo
        </button>
      )}
    </fieldset>
  );
}

function PersonRow({
  id,
  person,
  index,
  count,
  errors,
  onChange,
  onMove,
  onRemove,
}: {
  id: string;
  person: Person;
  index: number;
  count: number;
  errors: { name?: string; role?: string; image?: string };
  onChange: (p: Person) => void;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const { busy, pick } = useUpload((image) => onChange({ ...person, image }));
  return (
    <li className="rounded-xl border border-xa-line bg-[#0f0f0f] p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          aria-label={person.image ? `Replace photo ${index + 1}` : `Add photo ${index + 1}`}
          aria-invalid={errors.image ? true : undefined}
          className={cn(
            "relative size-12 shrink-0 overflow-hidden rounded-full border border-dashed bg-[#101010]",
            errors.image ? "border-xa-red" : "border-xa-line-strong",
          )}
        >
          {person.image ? (
            <Image src={person.image} alt="" fill sizes="48px" className="object-cover" />
          ) : (
            <ImagePlus className="m-auto size-4 text-xa-muted" />
          )}
          {busy && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="size-4 animate-spin text-white" />
            </span>
          )}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) pick(file);
          }}
        />
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
          <input
            {...fieldA11y(`${id}-name`, errors.name)}
            aria-label={`Name ${index + 1}`}
            placeholder="Name"
            value={person.name}
            onChange={(e) => onChange({ ...person, name: e.target.value })}
            className={cn(inputClass, "h-10 text-sm")}
          />
          <input
            {...fieldA11y(`${id}-role`, errors.role)}
            aria-label={`Role ${index + 1}`}
            placeholder="Role or company (optional)"
            value={person.role}
            onChange={(e) => onChange({ ...person, role: e.target.value })}
            className={cn(inputClass, "h-10 text-sm")}
          />
        </div>
        <RowButtons
          index={index}
          count={count}
          onMove={onMove}
          onRemove={onRemove}
          removeLabel={`Remove photo ${index + 1}`}
          canRemove
        />
      </div>
      {(errors.image || errors.name) && (
        <p role="alert" className="mt-2 text-[13px] text-xa-red">
          {errors.image ?? errors.name}
        </p>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Keywords                                                             */
/* ------------------------------------------------------------------ */

export function KeywordsField({
  id,
  label,
  hint,
  items,
  onChange,
  max,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  max: number;
  error?: string;
}) {
  const [draft, setDraft] = React.useState("");
  function add(raw: string) {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...items];
    for (const p of parts) if (!next.some((x) => x.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p.slice(0, 60));
    onChange(next);
    setDraft("");
  }
  return (
    <Field id={id} label={label} hint={hint} error={error} optional>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-xa-line-strong bg-[#101010] px-2 py-1.5 focus-within:border-xa-accent">
        {items.map((k) => (
          <span key={k} className="inline-flex items-center gap-1 rounded-full bg-white/8 py-0.5 pr-1 pl-2.5 text-xs font-medium text-xa-ink">
            {k}
            <button
              type="button"
              onClick={() => onChange(items.filter((x) => x !== k))}
              aria-label={`Remove ${k}`}
              className="flex size-5 items-center justify-center rounded-full hover:bg-white/10"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => {
            if (e.target.value.includes(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && items.length) {
              onChange(items.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          placeholder={items.length ? "" : "Type a keyword and press Enter"}
          className="h-7 min-w-32 flex-1 bg-transparent px-1 text-sm text-xa-ink outline-none placeholder:text-[#8a857e]"
        />
      </div>
    </Field>
  );
}
