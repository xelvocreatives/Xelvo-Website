import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from("Project")
      .select("*")
      .eq("isFeatured", true)
      .order("createdAt", { ascending: false })
      .limit(4);

    if (error) throw error;

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}
