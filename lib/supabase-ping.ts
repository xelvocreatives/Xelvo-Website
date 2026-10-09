/**
 * Single source of truth for "is Supabase awake?".
 *
 * Shared by GET /api/health and the in-process keep-alive scheduler
 * (lib/keep-alive.ts), so both probe the database in exactly the same way.
 *
 * Talks to the Supabase REST API directly rather than through the app's own
 * HTTP endpoint: no deployment URL is involved, so this keeps working after a
 * domain change or a move to another host.
 */

export const HEALTH_TABLE = process.env.HEALTH_CHECK_TABLE || "Project";

/** Identifies keep-alive traffic in the Supabase logs. */
export const PING_USER_AGENT = "xelvo-keepalive/1";

export type PingResult = {
  ok: boolean;
  table: string;
  latencyMs: number;
  error?: string;
};

export async function pingSupabase(timeoutMs = 8000): Promise<PingResult> {
  const startedAt = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      ok: false,
      table: HEALTH_TABLE,
      latencyMs: 0,
      error: "Missing Supabase environment variables",
    };
  }

  // HEAD + limit=0: PostgREST plans and runs the query against Postgres but
  // returns no rows. Row Level Security may permit nothing, which is fine -
  // the request still reaches the database, and that is what counts as
  // activity for the free-tier idle timer.
  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(
    HEALTH_TABLE,
  )}?select=id&limit=0`;

  try {
    const response = await fetch(endpoint, {
      method: "HEAD",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        // Tags the request in the Supabase log explorer, so keep-alive pings
        // are filterable apart from ordinary app traffic.
        "User-Agent": PING_USER_AGENT,
        "x-client-info": PING_USER_AGENT,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    const latencyMs = Date.now() - startedAt;

    if (!response.ok) {
      return {
        ok: false,
        table: HEALTH_TABLE,
        latencyMs,
        error: describeStatus(response.status),
      };
    }

    return { ok: true, table: HEALTH_TABLE, latencyMs };
  } catch (err) {
    return {
      ok: false,
      table: HEALTH_TABLE,
      latencyMs: Date.now() - startedAt,
      error:
        err instanceof Error
          ? err.name === "TimeoutError"
            ? `Supabase did not respond within ${timeoutMs}ms`
            : err.message
          : "Unknown error",
    };
  }
}

function describeStatus(status: number): string {
  switch (status) {
    case 401:
    case 403:
      return `Supabase rejected the anon key (HTTP ${status})`;
    case 404:
      return `Table "${HEALTH_TABLE}" not found (HTTP 404) - check HEALTH_CHECK_TABLE`;
    default:
      return `Supabase returned HTTP ${status}`;
  }
}
