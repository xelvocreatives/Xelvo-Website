import { SiteEditor } from "@/components/admin/website/page-editors";
import { getSiteDoc } from "@/lib/site/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website · Contact & social" };

export default async function WebsiteContactPage() {
  return <SiteEditor initial={await getSiteDoc("site")} />;
}
