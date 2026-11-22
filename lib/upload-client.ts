import { getUploadSignature } from "@/app/actions/uploads";
import type { UploadKind } from "@/lib/cloudinary";

/*
 * Browser-side upload to Cloudinary. Only the resulting URL is sent to our
 * server actions, so form submissions stay tiny regardless of file size.
 */

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // Cloudinary free-plan file limit
const MAX_IMAGE_EDGE = 2560; // px; larger photos are scaled down first
const RESIZE_ABOVE_BYTES = 3 * 1024 * 1024;

/**
 * Scales big photos down in the browser before upload: faster uploads, and
 * camera/design exports over 10 MB still go through. GIF/SVG are left alone.
 */
async function prepareImage(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // Browser can't decode it; let Cloudinary try.
  }

  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= RESIZE_ABOVE_BYTES) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.9),
  );
  return blob && blob.size < file.size ? blob : file;
}

export async function uploadToCloudinary(
  file: File,
  kind: UploadKind,
): Promise<string> {
  const body: Blob = kind === "resume" ? file : await prepareImage(file);

  if (body.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `File is too large (${(body.size / 1024 / 1024).toFixed(1)} MB). The maximum is 10 MB.`,
    );
  }

  const signature = await getUploadSignature(kind);
  if (!signature.ok) throw new Error(signature.error);

  const form = new FormData();
  form.append("file", body, file.name);
  for (const [key, value] of Object.entries(signature.fields)) {
    form.append(key, value);
  }

  let response: Response;
  try {
    response = await fetch(signature.uploadUrl, { method: "POST", body: form });
  } catch {
    throw new Error("Upload failed. Check your internet connection and try again.");
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || "Upload failed. Please try again.");
  }
  return json.secure_url as string;
}
