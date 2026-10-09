/**
 * In-process Supabase keep-alive.
 *
 * Started once from instrumentation.ts when the server boots. Works on any
 * host that keeps a Node process running (Hostinger Node.js hosting, a VPS,
 * Railway, Render, Docker) - no git, no GitHub Actions, no external cron, and
 * no deployment URL to keep in sync.
 *
 * It does NOT work on serverless platforms such as Vercel, where functions
 * are frozen between requests and timers stop with them. Use a platform cron
 * there instead.
 *
 * Each tick calls GET /api/health over HTTP, so the ping is visible in the
 * access log as a real request. The default target is loopback
 * (http://127.0.0.1:$PORT/api/health): no DNS, no public routing and no
 * domain dependency, so it keeps working after a domain change. Override with
 * KEEPALIVE_URL to hit the public URL instead.
 *
 * If that HTTP call fails (wrong port, route not yet listening), it falls
 * back to a direct Supabase ping, so the database still gets its activity
 * instead of the keep-alive silently doing nothing.
 */

import { pingSupabase } from "./supabase-ping";

const DEFAULT_INTERVAL_MINUTES = 5;
const FIRST_RUN_DELAY_MS = 10_000; // let the server finish booting
const HTTP_TIMEOUT_MS = 10_000;

type KeepAliveState = {
  timer: NodeJS.Timeout | null;
  inFlight: boolean;
  intervalMinutes: number;
  startedAt: string;
  pings: number;
  failures: number;
  lastPingAt: string | null;
  lastLatencyMs: number | null;
  lastOk: boolean | null;
  lastError: string | null;
  lastTarget: string | null;
};

// Held on globalThis so the counters survive dev hot-reloads and stay
// readable from a route handler in a separate bundle.
const globalForKeepAlive = globalThis as typeof globalThis & {
  __xelvoKeepAlive?: KeepAliveState;
};

export function startKeepAlive(): void {
  if (globalForKeepAlive.__xelvoKeepAlive?.timer) return; // already running

  if (!isEnabled()) {
    console.log(
      `[keep-alive] Disabled (KEEPALIVE_ENABLED=${
        process.env.KEEPALIVE_ENABLED === undefined
          ? "unset"
          : `"${process.env.KEEPALIVE_ENABLED}"`
      }, NODE_ENV=${process.env.NODE_ENV}). Set KEEPALIVE_ENABLED="true" to run it here.`,
    );
    return;
  }

  // Under PM2 cluster mode every worker boots this file; only one should
  // ping. NODE_APP_INSTANCE is set by PM2 ("0", "1", ...).
  const instance = process.env.NODE_APP_INSTANCE;
  if (instance && instance !== "0") return;

  const intervalMinutes = resolveIntervalMinutes();

  const state: KeepAliveState = {
    timer: null,
    inFlight: false,
    intervalMinutes,
    startedAt: new Date().toISOString(),
    pings: 0,
    failures: 0,
    lastPingAt: null,
    lastLatencyMs: null,
    lastOk: null,
    lastError: null,
    lastTarget: null,
  };

  const run = async () => {
    if (state.inFlight) return; // previous ping still outstanding
    state.inFlight = true;

    const url = resolvePingUrl();
    const startedAt = Date.now();

    try {
      const secret =
        process.env.HEALTH_CHECK_SECRET || process.env.CRON_SECRET || null;

      const response = await fetch(url, {
        headers: secret ? { Authorization: `Bearer ${secret}` } : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
      });

      const latencyMs = Date.now() - startedAt;
      state.pings += 1;
      state.lastPingAt = new Date().toISOString();
      state.lastLatencyMs = latencyMs;
      state.lastTarget = url;

      if (response.ok) {
        state.lastOk = true;
        state.lastError = null;
        console.log(
          `[keep-alive] #${state.pings} GET ${url} -> ${response.status} (${latencyMs}ms)`,
        );
        return;
      }

      state.lastOk = false;
      state.failures += 1;
      state.lastError =
        response.status === 401
          ? "401 Unauthorized - HEALTH_CHECK_SECRET does not match what the endpoint expects"
          : `HTTP ${response.status} from ${url}`;
      console.warn(`[keep-alive] #${state.pings} ${state.lastError}`);
    } catch (err) {
      // The endpoint was unreachable. Fall back to a direct Supabase ping so
      // the database still registers activity.
      state.pings += 1;
      state.failures += 1;
      state.lastPingAt = new Date().toISOString();
      state.lastOk = false;
      state.lastError = `${
        err instanceof Error ? err.message : "Unknown error"
      } (target ${url})`;

      console.warn(
        `[keep-alive] #${state.pings} could not reach ${url}: ${state.lastError}. Falling back to a direct Supabase ping.`,
      );

      const fallback = await pingSupabase();
      state.lastTarget = "supabase (fallback)";
      state.lastLatencyMs = fallback.latencyMs;
      state.lastOk = fallback.ok;

      if (fallback.ok) {
        console.log(
          `[keep-alive] Fallback ping ok - Supabase awake (${fallback.latencyMs}ms).`,
        );
      } else {
        state.lastError += ` | fallback also failed: ${fallback.error}`;
        console.warn(`[keep-alive] Fallback ping failed: ${fallback.error}`);
      }
    } finally {
      state.inFlight = false;
    }
  };

  const firstRun = setTimeout(run, FIRST_RUN_DELAY_MS);
  // Do not hold the event loop open or block a graceful shutdown.
  firstRun.unref?.();

  state.timer = setInterval(run, intervalMinutes * 60_000);
  state.timer.unref?.();

  globalForKeepAlive.__xelvoKeepAlive = state;

  console.log(
    `[keep-alive] Scheduled GET ${resolvePingUrl()} every ${intervalMinutes} minute(s); first ping in ${
      FIRST_RUN_DELAY_MS / 1000
    }s.`,
  );
}

/** Live counters for GET /api/health. Read-only, no side effects. */
export function getKeepAliveStatus() {
  const state = globalForKeepAlive.__xelvoKeepAlive;

  if (!state?.timer) {
    return {
      running: false,
      reason: isEnabled()
        ? "Timer not started - the server has not rebooted since instrumentation.ts was added."
        : `Disabled (KEEPALIVE_ENABLED="${process.env.KEEPALIVE_ENABLED ?? ""}", NODE_ENV=${process.env.NODE_ENV}).`,
    };
  }

  return {
    running: true,
    intervalMinutes: state.intervalMinutes,
    startedAt: state.startedAt,
    pings: state.pings,
    failures: state.failures,
    lastPingAt: state.lastPingAt,
    lastLatencyMs: state.lastLatencyMs,
    lastOk: state.lastOk,
    lastTarget: state.lastTarget,
    target: resolvePingUrl(),
    ...(state.lastError ? { lastError: state.lastError } : {}),
  };
}

/**
 * Target for the periodic self-call.
 *
 * Defaults to loopback rather than the public domain: it needs no DNS, is
 * immune to a domain change, and still shows up as a real GET /api/health in
 * the access log. Set KEEPALIVE_URL to use the public URL instead.
 */
function resolvePingUrl(): string {
  const explicit = process.env.KEEPALIVE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "").endsWith("/api/health")
      ? explicit.replace(/\/+$/, "")
      : `${explicit.replace(/\/+$/, "")}/api/health`;
  }

  return `http://127.0.0.1:${process.env.PORT || 3000}/api/health`;
}

function isEnabled(): boolean {
  const flag = process.env.KEEPALIVE_ENABLED?.trim().toLowerCase();

  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;

  // Default: production only, so local dev is not noisy.
  return process.env.NODE_ENV === "production";
}

function resolveIntervalMinutes(): number {
  const raw = Number(process.env.KEEPALIVE_INTERVAL_MINUTES);

  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_INTERVAL_MINUTES;

  // Clamp: under a minute is pointless load, over a day misses the 7-day
  // pause window with no margin.
  return Math.min(Math.max(raw, 1), 720);
}
