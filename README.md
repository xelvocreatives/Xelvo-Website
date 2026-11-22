This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# xelvo-creative

## Stack

- **Database:** MongoDB Atlas (`lib/db/`). Every read goes through [`lib/data.ts`](lib/data.ts).
- **File storage:** Cloudinary. Images and CVs upload **straight from the browser** with a
  short-lived server signature ([`lib/upload-client.ts`](lib/upload-client.ts),
  [`app/actions/uploads.ts`](app/actions/uploads.ts)), so file size is never limited by
  Vercel's 4.5 MB request cap. Photos larger than 2560 px are scaled down in the browser first.
- **Admin auth:** Auth.js (NextAuth v5) with 1–2 admin accounts defined in env vars
  ([`auth.ts`](auth.ts), [`lib/admin-credentials.ts`](lib/admin-credentials.ts)).
  [`proxy.ts`](proxy.ts) guards `/admin` pages and every admin server action checks the
  session itself ([`lib/auth-guard.ts`](lib/auth-guard.ts)).

## Environment Variables

Copy the template and fill in the real values:

```bash
cp .env.example .env
```

`.env*` is gitignored except `.env.example`, which documents every variable.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | yes | Atlas connection string (`mongodb+srv://...`) |
| `MONGODB_DB` | no | Database name (default `xelvo`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | Uploads |
| `AUTH_SECRET` | yes | Signs admin session cookies |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` | yes | First admin |
| `ADMIN_EMAIL_2` / `ADMIN_PASSWORD_HASH_2` | no | Optional second admin |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical public origin |
| `HEALTH_CHECK_SECRET` | no | If set, `/api/health` requires `Authorization: Bearer <value>` |
| `CRON_SECRET` | no | Set on Vercel so the daily cron can call `/api/health` |
| `MONGODB_DNS_SERVERS` | local only | e.g. `8.8.8.8,1.1.1.1` if you get `querySrv ECONNREFUSED`. Not needed on Vercel |

### Admin accounts

```bash
node scripts/hash-password.mjs   # prints ADMIN_PASSWORD_HASH="scrypt:..."
```

Paste the printed line into `.env` (and Vercel). To change a password, generate a new
hash and redeploy. Generate `AUTH_SECRET` with
`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

### One-time setup in the dashboards

- **Atlas → Network Access:** allow `0.0.0.0/0` (Vercel IPs change). Use a strong DB password.
- **Cloudinary → Settings → Security:** enable **"Allow delivery of PDF and ZIP files"**,
  otherwise CV links return `401`.

## Data migration from Supabase

[`scripts/migrate-supabase-to-mongo.mjs`](scripts/migrate-supabase-to-mongo.mjs) copied
all projects, testimonials, inquiries and applications into MongoDB and moved their files
to Cloudinary. It only reads from Supabase and is safe to re-run (documents are matched
by their old id). Needs the old `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

```bash
node --env-file=.env scripts/migrate-supabase-to-mongo.mjs --dry-run
node --env-file=.env scripts/migrate-supabase-to-mongo.mjs
```

## Database Keep-Alive

Atlas pauses a free cluster after **30 days with zero connections**. Three layers keep it awake:

1. **Vercel Cron** ([`vercel.json`](vercel.json)) calls `/api/health` daily. Set
   `CRON_SECRET` in Vercel if `HEALTH_CHECK_SECRET` is set.
2. **GitHub Actions** ([`.github/workflows/database-keepalive.yml`](.github/workflows/database-keepalive.yml))
   does the same daily as a backup. Set the repo variable `HEALTH_CHECK_URL` and, if used,
   the secret `HEALTH_CHECK_SECRET`.
3. **In-process timer** ([`lib/keep-alive.ts`](lib/keep-alive.ts)) for hosts that keep a
   Node process running (VPS, Hostinger). Inert on Vercel.

Even if the database is unreachable, the public pages still render (with empty project
and testimonial sections) instead of crashing.

## Health Endpoint

`GET /api/health` pings MongoDB and returns `200` with
`{"status":"ok","database":"reachable",...}`, or `503` with an `error` field when the
database is unreachable. Responses are never cached. If `HEALTH_CHECK_SECRET` and/or
`CRON_SECRET` is set, callers must send `Authorization: Bearer <one of them>`.
