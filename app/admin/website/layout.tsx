import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/kit/page-header";
import { XaButton } from "@/components/admin/kit/button";
import { WebsiteTabs } from "@/components/admin/website/website-tabs";

export const metadata = { title: "Website" };

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Website"
        description="Change the words, pictures and order of your website, and how it appears on Google. Saved changes go live straight away."
        actions={
          <XaButton asChild variant="secondary">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink />
              View website
            </a>
          </XaButton>
        }
      />
      <WebsiteTabs />
      {children}
    </>
  );
}
