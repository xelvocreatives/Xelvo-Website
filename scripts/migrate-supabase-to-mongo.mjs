// One-time copy: Supabase (Postgres + Storage)  ->  MongoDB + Cloudinary.
//
// Usage:
//   node --env-file=.env scripts/migrate-supabase-to-mongo.mjs --dry-run
//   node --env-file=.env scripts/migrate-supabase-to-mongo.mjs
//
// Safe to re-run: documents are matched by their old Supabase id (legacyId)
// and files get a fixed Cloudinary public_id, so nothing is duplicated.
// Supabase is only READ, never modified.

import { createHash } from "node:crypto";
import { setServers } from "node:dns";
import { MongoClient, ObjectId } from "mongodb";

if (process.env.MONGODB_DNS_SERVERS) {
  setServers(process.env.MONGODB_DNS_SERVERS.split(",").map((s) => s.trim()));
}

const DRY_RUN = process.argv.includes("--dry-run");

const env = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name} in .env`);
    process.exit(1);
  }
  return value;
};

const SUPABASE_URL = env("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const SUPABASE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const MONGODB_URI = env("MONGODB_URI");
const MONGODB_DB = process.env.MONGODB_DB || "xelvo";
const CLOUD_NAME = env("CLOUDINARY_CLOUD_NAME");
const CLOUD_KEY = env("CLOUDINARY_API_KEY");
const CLOUD_SECRET = env("CLOUDINARY_API_SECRET");

// --- Supabase (read-only, via REST) ----------------------------------------

async function fetchTable(table) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*&order=createdAt.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error(
      `Supabase ${table}: HTTP ${res.status} ${await res.text()}` +
        (res.status >= 500 ? " (is the project paused?)" : ""),
    );
  }
  return res.json();
}

// --- Cloudinary --------------------------------------------------------------

function sign(params) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + CLOUD_SECRET).digest("hex");
}

const isSupabaseFile = (url) =>
  typeof url === "string" && url.includes(".supabase.co/storage/");

/** Copies a Supabase Storage file to Cloudinary (Cloudinary fetches it by URL). */
async function rehost(url, { folder, publicId, resourceType }) {
  if (!isSupabaseFile(url)) return url; // already elsewhere (or empty)
  if (DRY_RUN) return `[would upload] ${folder}/${publicId}`;

  const params = {
    folder,
    overwrite: "false",
    public_id: publicId,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const body = new FormData();
  body.append("file", url);
  for (const [k, v] of Object.entries(params)) body.append(k, String(v));
  body.append("api_key", CLOUD_KEY);
  body.append("signature", sign(params));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body },
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message || `Cloudinary HTTP ${res.status}`);
  }
  return json.secure_url;
}

// --- Table definitions -------------------------------------------------------

const dates = (row) => ({
  createdAt: new Date(row.createdAt),
  updatedAt: new Date(row.updatedAt || row.createdAt),
});

const TABLES = [
  {
    table: "Project",
    collection: "projects",
    file: { field: "imageUrl", folder: "xelvo/projects", resourceType: "image" },
    map: (r) => ({
      title: r.title,
      description: r.description,
      imageUrl: r.imageUrl ?? null,
      category: r.category,
      isFeatured: Boolean(r.isFeatured),
    }),
  },
  {
    table: "Testimonial",
    collection: "testimonials",
    file: {
      field: "imageUrl",
      folder: "xelvo/testimonials",
      resourceType: "image",
    },
    map: (r) => ({
      clientName: r.clientName,
      company: r.company,
      rating: Number(r.rating),
      text: r.text,
      socialPlatform: r.socialPlatform ?? null,
      socialLink: r.socialLink ?? null,
      imageUrl: r.imageUrl ?? null,
    }),
  },
  {
    table: "Inquiry",
    collection: "inquiries",
    map: (r) => ({
      name: r.name,
      email: r.email,
      phone: r.phone ?? null,
      company: r.company ?? null,
      service: r.service ?? null,
      message: r.message,
      status: r.status || "new",
      aiInsight: r.aiInsight ?? null,
    }),
  },
  {
    table: "Application",
    collection: "applications",
    file: { field: "resumeUrl", folder: "xelvo/resumes", resourceType: "auto" },
    map: (r) => ({
      fullName: r.fullName,
      email: r.email,
      whatsapp: r.whatsapp,
      position: r.position,
      experience: r.experience,
      locationType: r.locationType,
      locationDetail: r.locationDetail ?? null,
      resumeUrl: r.resumeUrl,
      bio: r.bio,
      motivation: r.motivation,
      status: r.status || "new",
      aiInsight: r.aiInsight ?? null,
    }),
  },
];

// --- Run ---------------------------------------------------------------------

const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
await client.connect();
const db = client.db(MONGODB_DB);
console.log(`${DRY_RUN ? "[DRY RUN] " : ""}Supabase -> MongoDB "${MONGODB_DB}"\n`);

const summary = [];
let failures = 0;

try {
  for (const def of TABLES) {
    const rows = await fetchTable(def.table);
    const col = db.collection(def.collection);
    let copied = 0;
    let filesMoved = 0;

    for (const row of rows) {
      const doc = { ...def.map(row), ...dates(row), legacyId: String(row.id) };

      if (def.file && doc[def.file.field]) {
        // Reuse an earlier upload on re-runs.
        const existing = await col.findOne({ legacyId: doc.legacyId });
        const previous = existing?.[def.file.field];
        if (previous && !isSupabaseFile(previous)) {
          doc[def.file.field] = previous;
        } else {
          try {
            const before = doc[def.file.field];
            doc[def.file.field] = await rehost(before, {
              folder: def.file.folder,
              publicId: `${def.collection}-${row.id}`,
              resourceType: def.file.resourceType,
            });
            if (doc[def.file.field] !== before) filesMoved += 1;
          } catch (err) {
            failures += 1;
            console.warn(
              `  ! ${def.table} ${row.id}: file not moved (${err.message}); keeping the Supabase URL`,
            );
          }
        }
      }

      if (!DRY_RUN) {
        await col.updateOne(
          { legacyId: doc.legacyId },
          { $set: doc, $setOnInsert: { _id: new ObjectId() } },
          { upsert: true },
        );
      }
      copied += 1;
    }

    if (!DRY_RUN) {
      await col.createIndex({ createdAt: -1 });
      await col.createIndex({ legacyId: 1 }, { unique: true, sparse: true });
      if (def.collection === "projects") {
        await col.createIndex({ isFeatured: 1, createdAt: -1 });
      }
    }

    summary.push({
      table: def.table,
      rows: rows.length,
      copied,
      filesMoved,
      inMongo: DRY_RUN ? "-" : await col.countDocuments(),
    });
  }
} finally {
  await client.close();
}

console.table(summary);
if (failures) {
  console.warn(`\n${failures} file(s) could not be moved - see warnings above. Re-run to retry.`);
  process.exitCode = 1;
} else {
  console.log(DRY_RUN ? "\nDry run OK. Run again without --dry-run to copy." : "\nDone.");
}
