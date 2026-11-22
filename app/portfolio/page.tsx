import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GradientText } from "@/components/ui/GradientText";
import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import { getPortfolioProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio | Xelvo Creatives",
  description:
    "Shariah-compliant branding, social media and campaign work by Xelvo Creatives. See how we help values-led brands stand out in global markets.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio | Xelvo Creatives",
    description: "Branding, social media and campaign work by Xelvo Creatives.",
    type: "website",
  },
};

export default async function PortfolioPage() {
  const projects = (await getPortfolioProjects()).filter((p) => p.images.length > 0);

  return (
    <div className="min-h-screen w-full bg-[#111111] font-sans">
      <Header />
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-28 pb-24 sm:px-6 lg:px-8 lg:pt-32">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="flex items-baseline gap-3 text-4xl leading-[1.05] font-bold tracking-[-0.03em] text-white sm:text-6xl">
            <span>
              Our <GradientText>work</GradientText>
            </span>
            {projects.length > 0 && (
              <span className="text-base font-medium tracking-normal text-white/55 tabular-nums sm:text-lg">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            )}
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-white/65 sm:text-right">
            Shariah-compliant brands we&apos;ve shaped, from identity to campaigns.
          </p>
        </header>

        <PortfolioExperience
          projects={projects.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            images: p.images,
            isFeatured: p.isFeatured,
          }))}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
