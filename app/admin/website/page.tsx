import { HomeBoard } from "@/components/admin/website/home-board";
import { PageSeoCard } from "@/components/admin/website/seo-kit";
import { SectionHeading } from "@/components/admin/kit/page-header";
import { getHomeContent, getSiteDoc } from "@/lib/site/store";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · Home page" };

export default async function WebsiteHomePage() {
  const [{ layout, sections }, seo] = await Promise.all([getHomeContent(), getSiteDoc("seo")]);
  return (
    <div className="space-y-10">
      <section>
        <SectionHeading title="Sections" meta="Edit what each part of the Home page says, show or hide it, and drag to change the order." />
        <HomeBoard layout={layout} sections={sections} />
      </section>
      <PageSeoCard page="home" value={seo.pages.home} siteUrl={getSiteUrl()} fallbackImage={seo.shareImage} />
    </div>
  );
}
