"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"];
// Big photos are scaled down in the browser before upload, so allow large
// originals; GIFs are uploaded as-is and must fit Cloudinary's 10 MB limit.
const MAX_ORIGINAL_MB = 40;
const MAX_GIF_MB = 10;

export function validateImage(file: File): string | null {
  if (!ACCEPT.includes(file.type)) return "Use a JPG, PNG, WebP or GIF image.";
  const mb = file.size / 1024 / 1024;
  if (file.type === "image/gif" && mb > MAX_GIF_MB) return `GIFs can be up to ${MAX_GIF_MB} MB.`;
  if (mb > MAX_ORIGINAL_MB) return `That image is ${mb.toFixed(0)} MB. Use one under ${MAX_ORIGINAL_MB} MB.`;
  return null;
}

/** The current image to show: a newly picked file wins over the saved URL. */
export function usePreviewUrl(file: File | null, savedUrl: string | null | undefined) {
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return objectUrl ?? savedUrl ?? null;
}

export function ImagePicker({
  id,
  previewUrl,
  onPick,
  onRemove,
  error,
  shape = "wide",
  emptyLabel = "Add an image",
}: {
  id: string;
  previewUrl: string | null;
  onPick: (file: File) => void;
  onRemove?: () => void;
  error?: string | null;
  shape?: "wide" | "round";
  emptyLabel?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function take(files: FileList | null) {
    const file = files?.[0];
    if (file) onPick(file);
  }

  const round = shape === "round";

  return (
    <div className={cn("flex gap-4", round ? "items-center" : "flex-col")}>
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
          take(e.dataTransfer.files);
        }}
        aria-label={previewUrl ? "Replace image" : emptyLabel}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className={cn(
          "group relative flex shrink-0 items-center justify-center overflow-hidden border border-dashed transition-colors duration-200",
          round ? "size-24 rounded-full" : "aspect-[16/9] w-full rounded-xl",
          dragging
            ? "border-xa-accent bg-xa-accent/8"
            : error
              ? "border-xa-red/60 bg-xa-red/5"
              : "border-xa-line-strong bg-[#101010] hover:border-white/30",
          previewUrl && "border-solid",
        )}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt="Selected image preview"
              fill
              sizes={round ? "96px" : "(max-width: 768px) 100vw, 560px"}
              className="object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              {round ? <RefreshCw className="size-5" aria-label="Change photo" /> : "Click or drop to replace"}
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-center text-xa-muted">
            <ImagePlus className={round ? "size-6" : "size-7"} aria-hidden />
            {!round && (
              <>
                <span className="text-sm font-semibold text-xa-ink">{emptyLabel}</span>
                <span className="text-xs">Drag a file here or click to browse</span>
              </>
            )}
          </span>
        )}
      </button>

      <div className={cn("flex flex-wrap items-center gap-2", round ? "flex-col items-start" : "")}>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT.join(",")}
          className="sr-only"
          onChange={(e) => {
            take(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-xa-line-strong bg-xa-raised px-3.5 text-[13px] font-semibold text-xa-ink transition-colors hover:border-white/25"
        >
          {previewUrl ? <RefreshCw className="size-3.5" aria-hidden /> : <ImagePlus className="size-3.5" aria-hidden />}
          {previewUrl ? (round ? "Change photo" : "Replace image") : round ? "Add photo" : "Choose image"}
        </button>
        {previewUrl && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-xa-muted transition-colors hover:bg-white/5 hover:text-xa-red"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
