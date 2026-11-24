import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HighlightedText } from "./site/highlighted-text";
import type { HomeSections } from "@/lib/site/schema";
import { articleDate } from "./blog/blog-format";
import type { PostSummary } from "@/types";

/**
 * Home page "Latest from the blog". Renders nothing until an article is
 * published, so the Home page never shows an empty section.
 */
export function BlogHighlights({ posts, content }: { posts: PostSummary[]; content: HomeSections["blog"] }) {
  if (posts.length === 0) return null;
  const [lead, ...rest] = posts;

  return (
    <section id="blog" aria-labelledby="blog-heading" className="mx-auto max-w-[1280px] px-4 py-20">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <h2 id="blog-heading" className="text-3xl font-bold text-white lg:text-[40px]">
          <HighlightedText value={content.title} />
        </h2>
        {content.description && <p className="text-base text-[#B9B9B9] lg:text-[18px]">{content.description}</p>}
      </div>

      <div className={rest.length ? "grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]" : "mx-auto max-w-3xl"}>
        {/* Newest article, large */}
        <article className="group relative">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8">
            {lead.coverImage && (
              <Image
                src={lead.coverImage}
                alt={lead.coverAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
              />
            )}
          </div>
          <h3 className="mt-5 text-2xl leading-snug font-bold text-balance text-white lg:text-[28px]">
            <Link href={`/blog/${lead.slug}`} className="after:absolute after:inset-0 after:rounded-2xl">
              {lead.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-white/65">{lead.excerpt}</p>
          <p className="mt-3 text-sm text-white/55">
            {[lead.category, `${lead.readingMinutes} min read`, articleDate(lead.publishedAt, "short")].filter(Boolean).join(" · ")}
          </p>
        </article>

        {rest.length > 0 && (
          <ul className="flex flex-col gap-6">
            {rest.map((p) => (
              <li key={p.id} className="group relative grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] gap-5 border-t border-white/8 pt-6 first:border-t-0 first:pt-0">
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#0b0b0b] ring-1 ring-white/8">
                  {p.coverImage && (
                    <Image
                      src={p.coverImage}
                      alt={p.coverAlt}
                      fill
                      sizes="(max-width: 1024px) 45vw, 260px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg leading-snug font-bold text-balance text-white">
                    <Link href={`/blog/${p.slug}`} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60 max-sm:hidden">{p.excerpt}</p>
                  <p className="mt-2 text-sm text-white/55">
                    {[p.category, `${p.readingMinutes} min read`, articleDate(p.publishedAt, "short")].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/40"
        >
          {content.buttonLabel}
          <ArrowRight className="size-[18px]" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
