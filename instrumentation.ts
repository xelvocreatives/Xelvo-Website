/**
 * Next.js instrumentation hook: runs once per server process at startup.
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 *
 * Used here to start the in-process Supabase keep-alive, so no external cron
 * or scheduler is required on a host that keeps the Node process alive.
 */
export async function register(): Promise<void> {
  // Edge runtime has no long-lived process and no timers worth scheduling.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // `next build` also evaluates this file; do not start timers then.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { startKeepAlive } = await import("./lib/keep-alive");
  startKeepAlive();
}
