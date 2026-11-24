import { SeoEditor } from "@/components/admin/website/page-editors";
import { PageSeoCard } from "@/components/admin/website/seo-kit";
import { SectionHeading } from "@/components/admin/kit/page-header";
import { getSiteDoc } from "@/lib/site/store";
import { getSiteUrl } from "@/lib/site-url";
import { SEO_PAGE_IDS } from "@/lib/site/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · SEO & Google" };

export default async function WebsiteSeoPage() {
  const seo = await getSiteDoc("seo");
  const { pages, ...settings } = seo;
  const siteUrl = getSiteUrl();
  return (
    <div className="space-y-10">
      <SeoEditor initial={settings} />
      <section className="space-y-4">
        <SectionHeading title="Your pages on Google" meta="Each main page has its own title, description and share picture. Blog articles have theirs in the article editor." />
        {SEO_PAGE_IDS.map((id) => (
          <PageSeoCard key={id} page={id} value={pages[id]} siteUrl={siteUrl} fallbackImage={seo.shareImage} />
        ))}
      </section>
    </div>
  );
}
