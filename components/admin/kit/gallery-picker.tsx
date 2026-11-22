"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImage } from "./image-picker";
import { SortableGrid } from "./sortable-grid";

/** One image in the gallery: either already saved (url) or newly picked (file). */
export type GalleryItem = { id: string; url: string; file?: File };

let counter = 0;
const newId = () => `g${Date.now().toString(36)}${(counter++).toString(36)}`;

export function galleryFromUrls(urls: string[]): GalleryItem[] {
  return urls.map((url) => ({ id: newId(), url }));
}

/**
 * Several images for one project: add many at once (or drop them), drag to
 * reorder, remove. The first image is the cover.
 */
export function GalleryPicker({
  id,
  items,
  onChange,
  max,
  error,
  onError,
}: {
  id: string;
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  max: number;
  error?: string | null;
  onError: (message: string | null) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  // Free the browser memory held by previews of picked files.
  const urlsRef = React.useRef(items);
  React.useEffect(() => {
    urlsRef.current = items;
  }, [items]);
  React.useEffect(
    () => () => urlsRef.current.forEach((i) => i.file && URL.revokeObjectURL(i.url)),
    [],
  );

  function add(files: FileList | null) {
    if (!files?.length) return;
    const room = max - items.length;
    const picked = [...files];
    const problems: string[] = [];
    const accepted: GalleryItem[] = [];
    for (const file of picked) {
      const problem = validateImage(file);
      if (problem) problems.push(`${file.name}: ${problem}`);
      else if (accepted.length < room) accepted.push({ id: newId(), url: URL.createObjectURL(file), file });
    }
    if (picked.length - problems.length > room) problems.push(`A project can have up to ${max} images.`);
    onError(problems.length ? problems.join(" ") : null);
    if (accepted.length) onChange([...items, ...accepted]);
  }

  function remove(item: GalleryItem) {
    if (item.file) URL.revokeObjectURL(item.url);
    onChange(items.filter((i) => i.id !== item.id));
  }

  const full = items.length >= max;

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <SortableGrid
          items={items}
          onReorder={onChange}
          itemLabel={(item) => `image ${items.indexOf(item) + 1}`}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          renderItem={(item, handle, index) => (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#101010] ring-1 ring-xa-line">
              <Image
                src={item.url}
                alt={`Image ${index + 1}`}
                fill
                sizes="200px"
                className="object-cover"
                unoptimized={item.url.startsWith("blob:")}
              />
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-xa-accent px-2 py-0.5 text-[11px] font-bold text-xa-on-accent">
                  Cover
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-1.5">
                {items.length > 1 && handle}
                <button
                  type="button"
                  onClick={() => remove(item)}
                  aria-label={`Remove image ${index + 1}`}
                  className="flex size-9 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-xa-red/80"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {!full && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(e.dataTransfer.files);
          }}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-center transition-colors duration-200",
            items.length === 0 ? "aspect-[16/9]" : "py-6",
            dragging
              ? "border-xa-accent bg-xa-accent/8"
              : error
                ? "border-xa-red/60 bg-xa-red/5"
                : "border-xa-line-strong bg-[#101010] hover:border-white/30",
          )}
        >
          <ImagePlus className="size-6 text-xa-muted" aria-hidden />
          <span className="text-sm font-semibold text-xa-ink">
            {items.length === 0 ? "Add images" : "Add more images"}
          </span>
          <span className="text-xs text-xa-muted">
            Drag files here or click to browse · {items.length}/{max}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
