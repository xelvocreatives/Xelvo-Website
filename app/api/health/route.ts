import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site-url";
import { pingDatabase } from "@/lib/db-ping";
import { getKeepAliveStatus } from "@/lib/keep-alive";

// Never cache: every call must actually reach the database, otherwise the
// keep-alive ping is useless.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Optional protection: if HEALTH_CHECK_SECRET and/or CRON_SECRET is set, the
  // caller must send `Authorization: Bearer <one of them>`. Vercel Cron sends
  // CRON_SECRET automatically; uptime monitors can use HEALTH_CHECK_SECRET.
  const secrets = [process.env.HEALTH_CHECK_SECRET, process.env.CRON_SECRET]
    .filter(Boolean)
    .map((secret) => `Bearer ${secret}`);

  if (
    secrets.length > 0 &&
    !secrets.includes(request.headers.get("authorization") ?? "")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pingDatabase();

  return NextResponse.json(
    {
      status: result.ok ? "ok" : "error",
      database: result.ok ? "reachable" : "unreachable",
      databaseName: result.database,
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
