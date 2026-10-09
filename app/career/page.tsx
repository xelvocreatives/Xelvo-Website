import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CareersHero } from "@/components/CareersHero";
import { WhatWeValue } from "@/components/WhatWeValue";
import { CareersForm } from "@/components/CareersForm";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SEO } from "@/components/SEO";
import { Analytics } from "@/components/Analytics";

export const metadata = {
  title: "Careers | Xelvo Creatives",
  description:
    "Join the pool of talented minds at Xelvo Creatives. We value creativity, craft, and meaningful work.",
};

export default function CareerPage() {
  return (
    <>
      <SEO />
      <Analytics />
      <div
        className="min-h-screen w-full bg-[#111111]"
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <Header />
        <main>
          <CareersHero />
          <WhatWeValue />
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent my-12" />
          <CareersForm />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
