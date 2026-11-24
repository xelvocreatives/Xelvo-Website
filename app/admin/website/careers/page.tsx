import { CareersEditor } from "@/components/admin/website/page-editors";
import { PageSeoCard } from "@/components/admin/website/seo-kit";
import { getSiteDoc } from "@/lib/site/store";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · Careers page" };

export default async function WebsiteCareersPage() {
  const [content, seo] = await Promise.all([getSiteDoc("careers"), getSiteDoc("seo")]);
  return (
    <div className="space-y-10">
      <CareersEditor initial={content} />
      <PageSeoCard page="careers" value={seo.pages.careers} siteUrl={getSiteUrl()} fallbackImage={seo.shareImage} />
    </div>
  );
}
