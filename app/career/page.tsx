import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CareersHero } from "@/components/CareersHero";
import { WhatWeValue } from "@/components/WhatWeValue";
import { CareersForm } from "@/components/CareersForm";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteAnalytics } from "@/components/site/site-analytics";
import { getSiteDoc } from "@/lib/site/store";
import { pageMetadata } from "@/lib/site/seo";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("careers");
}

export default async function CareerPage() {
  const content = await getSiteDoc("careers");
  return (
    <>
      <SiteAnalytics />
      <div
        className="min-h-screen w-full bg-[#111111]"
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <Header />
        <main>
          <CareersHero content={content.hero} />
          {content.values.show && <WhatWeValue content={content.values} />}
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent my-12" />
          <CareersForm content={content.form} />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
