import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getFeaturedProjects(4));
}
