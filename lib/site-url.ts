/**
 * Resolves the public origin of the current deployment.
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_SITE_URL          - explicit, wins everywhere (custom domains)
 *   2. VERCEL_PROJECT_PRODUCTION_URL - Vercel's stable production domain
 *   3. VERCEL_URL                    - Vercel per-deployment URL (previews)
 *   4. RAILWAY_PUBLIC_DOMAIN         - Railway
 *   5. RENDER_EXTERNAL_URL           - Render
 *   6. http://localhost:<PORT>       - local development
 *
 * Because of 2-5, moving hosts or changing domains needs no code change: the
 * platform's own variable is picked up automatically, and a custom domain is
 * one NEXT_PUBLIC_SITE_URL value away.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN,
    process.env.RENDER_EXTERNAL_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value) return normalize(value);
  }

  return `http://localhost:${process.env.PORT || 3000}`;
}

/** Absolute URL for a path, e.g. absoluteUrl("/api/health"). */
export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalize(value: string): string {
  // Platform variables are bare hostnames ("xelvo.vercel.app"); explicit
  // values usually already carry a scheme.
  const withScheme = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`;

  return withScheme.replace(/\/+$/, ""); // drop any trailing slash
}
