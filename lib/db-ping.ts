import { getDb } from "@/lib/db/mongo";

/**
 * Single source of truth for "is the database awake?".
 *
 * Shared by GET /api/health and the in-process keep-alive scheduler
 * (lib/keep-alive.ts). A real connection + command counts as activity for
 * MongoDB Atlas's free-cluster idle timer (paused after 30 days with zero
 * connections).
 */

export type PingResult = {
  ok: boolean;
  database: string;
  latencyMs: number;
  error?: string;
};

export async function pingDatabase(timeoutMs = 8000): Promise<PingResult> {
  const startedAt = Date.now();
  const database = process.env.MONGODB_DB || "xelvo";

  try {
    await Promise.race([
      getDb().then((db) => db.command({ ping: 1 })),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`MongoDB did not respond within ${timeoutMs}ms`)),
          timeoutMs,
        ),
      ),
    ]);
    return { ok: true, database, latencyMs: Date.now() - startedAt };
  } catch (err) {
    return {
      ok: false,
      database,
      latencyMs: Date.now() - startedAt,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
