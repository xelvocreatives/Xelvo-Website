import { PortfolioPageEditor } from "@/components/admin/website/page-editors";
import { PageSeoCard } from "@/components/admin/website/seo-kit";
import { getSiteDoc } from "@/lib/site/store";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · Portfolio page" };

export default async function WebsitePortfolioPage() {
  const [content, seo] = await Promise.all([getSiteDoc("portfolio"), getSiteDoc("seo")]);
  return (
    <div className="space-y-10">
      <PortfolioPageEditor initial={content} />
      <PageSeoCard page="portfolio" value={seo.pages.portfolio} siteUrl={getSiteUrl()} fallbackImage={seo.shareImage} />
    </div>
  );
}
