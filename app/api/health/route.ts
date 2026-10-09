import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { pingSupabase } from "@/lib/supabase-ping";
import { getKeepAliveStatus } from "@/lib/keep-alive";

// Never cache: every call must actually reach Supabase, otherwise the
// keep-alive ping is useless.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Optional protection: if HEALTH_CHECK_SECRET is set, the caller must send
  // `Authorization: Bearer <secret>`. Leave it unset to keep the endpoint
  // public, which is normal for a health check and lets a browser or an
  // uptime monitor call it with no configuration.
  const secret =
    process.env.HEALTH_CHECK_SECRET || process.env.CRON_SECRET || null;

  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pingSupabase();

  return NextResponse.json(
    {
      status: result.ok ? "ok" : "error",
      database: result.ok ? "reachable" : "unreachable",
      table: result.table,
      origin: getSiteUrl(),
      latencyMs: result.latencyMs,
      checkedAt: new Date().toISOString(),
      keepAlive: getKeepAliveStatus(),
      ...(result.error ? { error: result.error } : {}),
    },
    {
      status: result.ok ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
