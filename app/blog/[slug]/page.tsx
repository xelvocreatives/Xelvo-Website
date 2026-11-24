import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { ReadingProgress, TableOfContents } from "@/components/blog/article-chrome";
import { ShareButtons } from "@/components/blog/share-buttons";
import { articleDate } from "@/components/blog/blog-format";
import { getPostBySlugForPreview, getPublishedPost, getRelatedPosts } from "@/lib/data";
import { isAdmin } from "@/lib/auth-guard";
import { absoluteUrl } from "@/lib/site-url";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

/** Live post, or (for a signed-in admin with ?preview=1) a draft/scheduled one. */
async function loadPost(slug: string, preview: boolean): Promise<{ post: Post; isPreview: boolean } | null> {
  const live = await getPublishedPost(slug);
  if (live) return { post: live, isPreview: false };
  if (preview && (await isAdmin())) {
    const draft = await getPostBySlugForPreview(slug);
    if (draft) return { post: draft, isPreview: true };
  }
  return null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadPost(slug, (await searchParams).preview === "1");
  if (!found) return { title: "Article not found | Xelvo Creatives" };
  const { post, isPreview } = found;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title: `${title} | Xelvo Creatives`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: isPreview ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const found = await loadPost(slug, (await searchParams).preview === "1");
  if (!found) notFound();
  const { post, isPreview } = found;
  const related = isPreview ? [] : await getRelatedPosts(post, 3);
  const url = absoluteUrl(`/blog/${post.slug}`);
  const showToc = post.headings.length >= 2;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Xelvo Creatives" },
    mainEntityOfPage: url,
    keywords: post.tags.join(", ") || undefined,
  };

  return (
    <div className="min-h-screen w-full bg-[#111111] font-sans">
      <SiteAnalytics />
      <Header />
      <ReadingProgress targetId="article-body" />
      {!isPreview && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}

      <main className="mx-auto w-full max-w-[1120px] px-4 pt-28 pb-24 sm:px-6 lg:pt-32">
        {isPreview && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-4 py-3 text-sm text-[#bfdbfe]">
            <Eye className="size-4 shrink-0" aria-hidden />
            Preview: only you can see this. It isn&apos;t live on the website yet.
          </div>
        )}

        <article>
          {/* Header, body and footer share one left edge: 820px column, or the 1040px grid when the contents rail shows. */}
          <header className={showToc ? "mx-auto max-w-[820px] xl:max-w-[1040px] [&>*]:max-w-[820px]" : "mx-auto max-w-[820px]"}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All articles
            </Link>
            <h1 className="mt-6 text-[32px] leading-[1.1] font-bold tracking-[-0.025em] text-balance text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && !post.excerptAuto && <p className="mt-5 text-lg leading-relaxed text-white/70 sm:text-xl">{post.excerpt}</p>}
            <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/60">
              {[
                <span key="author" className="font-semibold text-white/85">{post.author}</span>,
                post.publishedAt && <time key="date" dateTime={post.publishedAt}>{articleDate(post.publishedAt)}</time>,
                post.category && (
                  <Link key="cat" href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-white">
                    {post.category}
                  </Link>
                ),
                <span key="read">{post.readingMinutes} min read</span>,
              ]
                .filter(Boolean)
                .map((item, i, all) => (
                  // The separator trails its item, so a wrapped line never starts with a dot.
                  <span key={i} className="whitespace-nowrap">
                    {item}
                    {i < all.length - 1 && <span aria-hidden className="ml-2.5">·</span>}
                  </span>
                ))}
            </p>
          </header>

          {post.coverImage && (
            <div className="relative mx-auto mt-10 aspect-[16/9] max-w-[1040px] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8">
              <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(max-width: 1100px) 100vw, 1040px" className="object-cover" />
            </div>
          )}

          <div
            className={
              showToc
                ? "mx-auto mt-12 grid max-w-[820px] gap-12 xl:max-w-[1040px] xl:grid-cols-[minmax(0,1fr)_220px]"
                : "mx-auto mt-12 max-w-[820px]"
            }
          >
            <div className="min-w-0">
              <div
                id="article-body"
                className="article-body max-w-[68ch]"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              <footer className="mt-14 max-w-[68ch] space-y-6 border-t border-white/8 pt-8">
                {post.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2" aria-label="Tags">
                    {post.tags.map((t) => (
                      <li key={t}>
                        <Link
                          href={`/blog?q=${encodeURIComponent(t)}`}
                          className="inline-flex h-8 items-center rounded-full border border-white/12 px-3 text-[13px] font-medium text-white/70 hover:border-white/30 hover:text-white"
                        >
                          #{t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white">Share this article</p>
                  <ShareButtons title={post.title} url={url} />
                </div>
              </footer>
            </div>

            {showToc && (
              <aside className="hidden xl:block">
                <div className="sticky top-28">
                  <TableOfContents headings={post.headings} />
                </div>
              </aside>
            )}
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="read-next" className="mx-auto mt-20 max-w-[1040px]">
            <h2 id="read-next" className="mb-6 text-2xl font-bold text-white">
              Read next
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="group relative">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8">
                    {r.coverImage && (
                      <Image
                        src={r.coverImage}
                        alt={r.coverAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 340px"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 text-lg leading-snug font-bold text-balance text-white">
                    <Link href={`/blog/${r.slug}`} className="after:absolute after:inset-0">
                      {r.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    {[r.category, `${r.readingMinutes} min read`].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto mt-20 flex max-w-[1040px] flex-col items-start justify-between gap-6 rounded-3xl border border-white/8 bg-[#0b0b0b] p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Building a brand that lasts?</h2>
            <p className="mt-2 text-white/65">Tell us where you are. We&apos;ll show you where Shariah-compliant design can take you.</p>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-[10px] px-7 py-4 text-[16px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #FF6600 0%, #FF7700 100%)",
              boxShadow: "0 4px 20px rgba(255, 102, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            Start a project
            <ArrowUpRight className="size-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
