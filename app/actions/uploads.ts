"use server";

import { isAdmin, UNAUTHORIZED } from "@/lib/auth-guard";
import {
  getCloudinaryConfig,
  signParams,
  UPLOAD_TARGETS,
  type UploadKind,
} from "@/lib/cloudinary";

export type UploadSignature =
  | {
      ok: true;
      uploadUrl: string;
      fields: Record<string, string>;
    }
  | { ok: false; error: string };

/**
 * Returns everything the browser needs for one signed upload to Cloudinary.
 * The signature is valid for about an hour and only for this folder/format.
 */
export async function getUploadSignature(
  kind: UploadKind,
): Promise<UploadSignature> {
  const target = UPLOAD_TARGETS[kind as UploadKind];
  if (!target) return { ok: false, error: "Unknown upload type." };
  if (target.adminOnly && !(await isAdmin())) {
    return { ok: false, error: UNAUTHORIZED };
  }

  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const params: Record<string, string | number> = {
      folder: target.folder,
      timestamp: Math.floor(Date.now() / 1000),
    };
    if (target.allowedFormats) params.allowed_formats = target.allowedFormats;

    return {
      ok: true,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${target.resourceType}/upload`,
      fields: {
        ...Object.fromEntries(
          Object.entries(params).map(([k, v]) => [k, String(v)]),
        ),
        api_key: apiKey,
        signature: signParams(params, apiSecret),
      },
    };
  } catch (error) {
    console.error("Upload signature error:", error);
    return { ok: false, error: "File uploads are not configured." };
  }
}
