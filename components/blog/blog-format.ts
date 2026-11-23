/** Public-site date formatting for articles (Pakistan time, like the admin). */
export function articleDate(iso: string | null, style: "long" | "short" = "long"): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function blogHref(params: { category?: string; q?: string; show?: number }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (params.show) sp.set("show", String(params.show));
  const qs = sp.toString();
  return qs ? `/blog?${qs}` : "/blog";
}
