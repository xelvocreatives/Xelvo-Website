import { createClient } from "@/utils/supabase/server";

export async function saveFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const supabase = await createClient();

  // unique filename
  const timestamp = Date.now();
  // sanitize filename
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${timestamp}-${safeName}`;

  try {
    const { error } = await supabase.storage
      .from("uploads")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error("Error saving file:", error);
    return null;
  }
}
