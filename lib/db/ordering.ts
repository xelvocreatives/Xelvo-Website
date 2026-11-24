import "server-only";
import type { Collection, ObjectId } from "mongodb";

/*
 * Manual ordering for content the admin arranges by drag and drop
 * (projects, testimonials). `order` ascending is the display order everywhere,
 * including the public website.
 */

export type Orderable = { _id: ObjectId; order?: number; createdAt: Date };

/**
 * Data created before ordering existed has no `order`. Number everything once,
 * keeping the sequence visitors already see (newest first).
 */
export async function ensureOrder(col: Collection<Orderable>): Promise<void> {
  if ((await col.countDocuments({ order: { $exists: false } })) === 0) return;

  const unordered = await col.find({ order: { $exists: false } }).sort({ createdAt: -1 }).toArray();
  const ordered = await col.find({ order: { $exists: true } }).sort({ order: 1 }).toArray();
  const sequence = [...unordered, ...ordered];

  await col.bulkWrite(
    sequence.map((doc, index) => ({
      updateOne: { filter: { _id: doc._id }, update: { $set: { order: index } } },
    })),
  );
}

/** Order value that puts a new item first, matching the old "newest first" habit. */
export async function topOrder(col: Collection<Orderable>): Promise<number> {
  await ensureOrder(col);
  const [first] = await col.find().sort({ order: 1 }).limit(1).toArray();
  return first ? (first.order ?? 0) - 1 : 0;
}

/**
 * Saves a complete arrangement. Refuses a list that no longer matches the
 * collection (someone added or deleted in another tab), so nothing is lost.
 */
export async function applyOrder(
  col: Collection<Orderable>,
  ids: ObjectId[],
): Promise<"ok" | "stale"> {
  const unique = new Set(ids.map(String));
  if (unique.size !== ids.length) return "stale";
  if ((await col.countDocuments()) !== ids.length) return "stale";

  const result = await col.bulkWrite(
    ids.map((_id, index) => ({
      updateOne: { filter: { _id }, update: { $set: { order: index } } },
    })),
  );
  return result.matchedCount === ids.length ? "ok" : "stale";
}
