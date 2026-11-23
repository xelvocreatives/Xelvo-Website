import { BlogPageEditor } from "@/components/admin/website/page-editors";
import { PageSeoCard } from "@/components/admin/website/seo-kit";
import { getSiteDoc } from "@/lib/site/store";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · Blog page" };

export default async function WebsiteBlogPage() {
  const [content, seo] = await Promise.all([getSiteDoc("blogPage"), getSiteDoc("seo")]);
  return (
    <div className="space-y-10">
      <BlogPageEditor initial={content} />
      <PageSeoCard page="blog" value={seo.pages.blog} siteUrl={getSiteUrl()} fallbackImage={seo.shareImage} />
      <p className="text-sm text-xa-muted">Each article has its own Google settings in the article editor, under “Link and search”.</p>
    </div>
  );
}
