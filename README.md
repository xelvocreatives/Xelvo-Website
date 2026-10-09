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

## Environment Variables

Copy the template and fill in the real values:

```bash
cp .env.example .env.local
```

`.env*` is gitignored. Every variable the app reads is documented in
[`.env.example`](.env.example) — keep that file updated when adding a new one.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public key, guarded by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only key; bypasses RLS |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical public origin |
| `HEALTH_CHECK_TABLE` | no | Table probed by `/api/health` (default `Project`) |
| `HEALTH_CHECK_SECRET` | no | If set, `/api/health` requires `Authorization: Bearer <value>` |

### Changing domain or hosting provider

Set the same variables on the new host — nothing is hardcoded. `NEXT_PUBLIC_SITE_URL`
is the only URL-dependent value, and on Vercel, Railway and Render even that is
auto-detected from the platform's own variables by
[`lib/site-url.ts`](lib/site-url.ts).

## Supabase Keep-Alive

Free-tier Supabase projects pause after **7 days** of inactivity. This repo
ships three independent ways to prevent that - pick the one that matches the
host. All three run the same probe
([`lib/supabase-ping.ts`](lib/supabase-ping.ts)): a `HEAD ... ?select=id&limit=0`
against the Supabase REST API, which reaches Postgres without reading rows.

### Option 1 - In-process timer (recommended on Hostinger / VPS)

[`instrumentation.ts`](instrumentation.ts) starts a timer inside the running
server via [`lib/keep-alive.ts`](lib/keep-alive.ts). **No cron, no git, no
GitHub, no deployment URL** - the app keeps its own database awake.

```env
KEEPALIVE_ENABLED="true"          # default: on in production, off in dev
KEEPALIVE_INTERVAL_MINUTES="5"    # clamped to 1-720
KEEPALIVE_URL=""                  # empty = loopback (recommended)
```

Each tick performs a real `GET /api/health`, so it appears in the access log.
The default target is `http://127.0.0.1:$PORT/api/health` - loopback needs no
DNS and is unaffected by a domain change. If that call fails, it falls back to
a direct Supabase ping so the database still gets its activity.

Confirm it is live by looking for this in the server logs after `npm start`:

```
[keep-alive] Scheduled GET http://127.0.0.1:3000/api/health every 5 minute(s); first ping in 10s.
[keep-alive] #1 GET http://127.0.0.1:3000/api/health -> 200 (284ms)
```

The first ping lands 10 seconds after boot, so you do not have to wait a full
interval to know it works. `GET /api/health` also reports live counters:

```json
"keepAlive": { "running": true, "pings": 3, "failures": 0,
               "lastPingAt": "...", "lastLatencyMs": 284 }
```

If it reports `"running": false`, the `reason` field says why - the two usual
causes are `KEEPALIVE_ENABLED` not being `"true"` and the server not having
been restarted since `instrumentation.ts` was added (the hook is registered
only at startup, so a hot reload will not pick it up).

Requires a host that keeps the Node process running - true for Hostinger
Node.js hosting, a VPS, Railway, Render or Docker. **Not** true for serverless
platforms like Vercel, where timers freeze between requests; use Option 2 or 3
there.

Safeguards: skipped during `next build`, skipped on the edge runtime, survives
dev hot-reloads without stacking timers, runs on one PM2 worker only
(`NODE_APP_INSTANCE`), skips a tick if the previous ping is still in flight,
and uses `unref()` so it never blocks a graceful shutdown.

### Option 2 - Hostinger hPanel cron job

hPanel -> **Advanced -> Cron Jobs**. Schedules are UTC. Either hit the
endpoint:

```bash
curl -fsS https://your-domain.com/api/health
```

...or skip the app entirely and ping Supabase straight from the server, which
survives any domain change:

```bash
curl -fsS -I -H "apikey: YOUR_ANON_KEY"   "https://your-project-ref.supabase.co/rest/v1/Project?select=id&limit=0"
```

Add `-H "Authorization: Bearer YOUR_HEALTH_CHECK_SECRET"` to the first form if
`HEALTH_CHECK_SECRET` is set. Cron availability and the minimum interval depend
on the plan - check the Cron Jobs page in your own hPanel.

### Option 3 - External monitor or GitHub Actions

An uptime service (cron-job.org, UptimeRobot) pointed at
`https://your-domain.com/api/health` needs no repo and adds alerting.
[`.github/workflows/supabase-keepalive.yml`](.github/workflows/supabase-keepalive.yml)
does the same from GitHub Actions; it only runs once the repo is pushed to
GitHub, so it is inert (and safe to delete) on a non-git deployment.

## Health Endpoint

`GET /api/health`

```json
{
  "status": "ok",
  "database": "reachable",
  "table": "Project",
  "origin": "https://your-domain.com",
  "latencyMs": 142,
  "checkedAt": "2026-10-09T13:03:01.596Z"
}
```

Returns `503` with an `error` field when Supabase is unreachable, so an uptime
monitor registers a real failure. Responses are never cached.

If `HEALTH_CHECK_SECRET` is set, callers must send
`Authorization: Bearer <secret>` or get `401` - including your browser, which
cannot send that header. Leave it empty to make the endpoint publicly
checkable.
