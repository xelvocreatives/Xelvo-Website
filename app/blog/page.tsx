import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { HighlightedText } from "@/components/site/highlighted-text";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { getSiteDoc } from "@/lib/site/store";
import { pageMetadata } from "@/lib/site/seo";
import { getBlogFeed } from "@/lib/data";
import { articleDate, blogHref } from "@/components/blog/blog-format";
import { cn } from "@/lib/utils";
import type { PostSummary } from "@/types";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog");
}

const PAGE = 8;

function Meta({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <p className={cn("text-sm text-white/60", className)}>
      {[post.category, `${post.readingMinutes} min read`].filter(Boolean).join(" · ")}
      <span className="lg:hidden"> · {articleDate(post.publishedAt, "short")}</span>
    </p>
  );
}

/** Dateline on the journal spine (desktop). */
function Dateline({ iso, offset = false }: { iso: string | null; offset?: boolean }) {
  // Later rows start with a divider and pt-10; the offset keeps date and dot level with the cover top.
  return (
    <div className={cn("relative hidden lg:block", offset && "pt-10")}>
      <time
        dateTime={iso ?? undefined}
        className="sticky top-28 block pt-1 pr-6 text-right text-[13px] leading-snug font-medium text-white/55 tabular-nums"
      >
        {articleDate(iso, "short")}
      </time>
      <span
        className={cn("absolute -right-[5px] size-[9px] rounded-full bg-[#111111] ring-1 ring-white/30", offset ? "top-[3.125rem]" : "top-2.5")}
        aria-hidden
      />
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; show?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category?.trim() || undefined;
  const q = sp.q?.trim().slice(0, 80) || undefined;
  const show = Math.min(Math.max(Number(sp.show) || PAGE, PAGE), 200);
  const [{ posts, total, categories, allCount }, content] = await Promise.all([
    getBlogFeed({ category, q, limit: show }),
    getSiteDoc("blogPage"),
  ]);
  const [lead, ...rest] = posts;
  const filtered = Boolean(category || q);

  return (
    <div className="min-h-screen w-full bg-[#111111] font-sans">
      <SiteAnalytics />
      <Header />
      <main className="mx-auto w-full max-w-[1120px] px-4 pt-28 pb-24 sm:px-6">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="flex items-baseline gap-3 text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-white sm:text-6xl">
            <span>
              <HighlightedText value={content.title} />
            </span>
            {allCount > 0 && (
              <span className="text-base font-medium tracking-normal text-white/55 tabular-nums sm:text-lg">
                {allCount} {allCount === 1 ? "article" : "articles"}
              </span>
            )}
          </h1>
          {content.description && (
            <p className="max-w-lg text-[15px] leading-relaxed text-white/65 sm:text-right">{content.description}</p>
          )}
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 border-b border-white/8 pb-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <ul className="flex w-max gap-2">
              {[{ name: "All", value: undefined as string | undefined, count: allCount }, ...categories.map((c) => ({ name: c.name, value: c.name, count: c.count }))].map((c) => {
                const active = (category ?? "").toLowerCase() === (c.value ?? "").toLowerCase();
                return (
                  <li key={c.name}>
                    <Link
                      href={blogHref({ category: c.value, q })}
                      scroll={false}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                        active
                          ? "bg-[linear-gradient(135deg,#E69700,#FF6600)] text-[#160a00]"
                          : "border border-white/12 text-white/70 hover:border-white/30 hover:text-white",
                      )}
                    >
                      {c.name}
                      <span className={cn("tabular-nums", active ? "text-[#160a00]/70" : "text-white/40")}>{c.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <form action="/blog" role="search" className="relative w-full md:w-72">
            {category && <input type="hidden" name="category" value={category} />}
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/45" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search articles"
              aria-label="Search articles"
              className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pr-4 pl-11 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/25"
            />
          </form>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-lg font-semibold text-white">
              {filtered ? "No articles match that." : "Our first articles are on their way."}
            </p>
            <p className="mt-2 text-white/60">
              {filtered ? (
                <Link href="/blog" className="text-[#FF8A3D] underline-offset-4 hover:underline">
                  See all articles
                </Link>
              ) : (
                <>
                  Meanwhile,{" "}
                  <Link href="/#contact" className="text-[#FF8A3D] underline-offset-4 hover:underline">
                    tell us about your project
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="relative lg:grid lg:grid-cols-[132px_minmax(0,1fr)]">
            {/* The journal spine: one hairline down the whole feed; datelines sit on it. */}
            <span
              className="absolute top-2 bottom-0 left-[132px] hidden w-px bg-[linear-gradient(to_bottom,rgb(255_255_255/0.22),rgb(255_255_255/0.05))] lg:block"
              aria-hidden
            />

            {lead && (
              <>
                <Dateline iso={lead.publishedAt} />
                <article className="group relative mb-14 lg:pl-10">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8 lg:aspect-[2/1]">
                    {lead.coverImage && (
                      <Image
                        src={lead.coverImage}
                        alt={lead.coverAlt}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 900px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                  <h2 className="mt-6 text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-balance text-white sm:text-[40px]">
                    <Link href={`/blog/${lead.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
                      {lead.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[68ch] text-[17px] leading-relaxed text-white/70">{lead.excerpt}</p>
                  <Meta post={lead} className="mt-4" />
                </article>
              </>
            )}

            {rest.map((post) => (
              <div key={post.id} className="contents">
                <Dateline iso={post.publishedAt} offset />
                <article className="group relative mb-10 grid gap-5 border-t border-white/8 pt-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-8 lg:pl-10">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.coverAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="flex flex-col md:pt-1">
                    <h2 className="text-[22px] leading-snug font-bold tracking-[-0.01em] text-balance text-white sm:text-2xl">
                      <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-white/65">{post.excerpt}</p>
                    <Meta post={post} className="mt-4" />
                  </div>
                </article>
              </div>
            ))}

            {total > posts.length && (
              <>
                <div className="hidden lg:block" />
                <div className="pt-4 text-center lg:pl-10">
                  <Link
                    href={blogHref({ category, q, show: show + PAGE })}
                    scroll={false}
                    className="inline-flex h-12 items-center rounded-full border border-white/15 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white/40"
                  >
                    Load more articles
                  </Link>
                  <p className="mt-3 text-sm text-white/50 tabular-nums">
                    Showing {posts.length} of {total}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
