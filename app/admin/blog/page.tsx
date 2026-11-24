import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, Plus, SearchX } from "lucide-react";
import { getAllPostsAdmin } from "@/lib/data";
import { formatDate } from "@/lib/admin-format";
import { PageHeader } from "@/components/admin/kit/page-header";
import { FilterTabs } from "@/components/admin/kit/filter-tabs";
import { SearchBox } from "@/components/admin/kit/search-box";
import { EmptyState } from "@/components/admin/kit/empty-state";
import { XaButton } from "@/components/admin/kit/button";
import { PostStatusPill, postState, type PostState } from "@/components/admin/blog/post-status";
import { PostRowActions } from "@/components/admin/blog/post-row-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

const TABS: { value: "all" | PostState; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Drafts" },
];

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const all = await getAllPostsAdmin();

  const query = q.trim().toLowerCase();
  const searched = all.filter(
    (p) => !query || [p.title, p.category, p.excerpt, ...p.tags].some((t) => t?.toLowerCase().includes(query)),
  );
  const active = TABS.some((t) => t.value === status) ? status : "all";
  const list = active === "all" ? searched : searched.filter((p) => postState(p) === active);
  const tabs = TABS.map((t) => ({
    value: t.value,
    label: t.label,
    count: t.value === "all" ? searched.length : searched.filter((p) => postState(p) === t.value).length,
  }));

  return (
    <>
      <PageHeader
        title="Blog"
        description="Write articles for your website. Save drafts, publish straight away, or schedule them for later."
        actions={
          <XaButton asChild variant="primary">
            <Link href="/admin/blog/new">
              <Plus />
              New article
            </Link>
          </XaButton>
        }
      />

      {all.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No articles yet"
          description="Share your thinking on branding and marketing. Articles appear on your Blog page and the Home page."
          action={
            <XaButton asChild variant="primary">
              <Link href="/admin/blog/new">
                <Plus />
                Write your first article
              </Link>
            </XaButton>
          }
        />
      ) : (
        <>
          <div className="mb-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs basePath="/admin/blog" tabs={tabs} active={active} query={q} />
            <Suspense>
              <SearchBox placeholder="Search title, category, tag…" />
            </Suspense>
          </div>

          {list.length === 0 ? (
            <EmptyState
              icon={<SearchX />}
              title="Nothing matches"
              description={query ? `No articles match “${q}” here.` : "No articles with this status yet."}
            />
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-xa-line bg-xa-panel">
              {list.map((p) => {
                const state = postState(p);
                const when =
                  state === "draft"
                    ? `Edited ${formatDate(p.updatedAt)}`
                    : state === "scheduled"
                      ? `Goes live ${formatDate(p.publishedAt!, true)}`
                      : `Published ${formatDate(p.publishedAt!)}`;
                return (
                  <li key={p.id} className="relative flex items-center gap-4 border-b border-xa-line px-4 py-3.5 last:border-b-0 hover:bg-white/[0.03] sm:px-5">
                    <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg bg-[#101010] ring-1 ring-xa-line sm:w-32">
                      {p.coverImage ? (
                        <Image src={p.coverImage} alt="" fill sizes="128px" className="object-cover" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xa-faint">
                          <FileText className="size-5" aria-hidden />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="line-clamp-2 text-[15px] leading-snug font-semibold text-xa-ink after:absolute after:inset-0"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 truncate text-sm text-xa-muted">
                        {[p.category || "No category", `${p.readingMinutes} min read`, when].join(" · ")}
                      </p>
                    </div>
                    <PostStatusPill post={p} className="hidden sm:inline-flex" />
                    <div className="relative z-10">
                      <PostRowActions id={p.id} title={p.title} slug={p.slug} live={state === "published"} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
}
