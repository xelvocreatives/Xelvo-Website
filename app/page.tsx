import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { Hero } from "../components/Hero";
import { TrustMetrics } from "../components/TrustMetrics";
import { ValueProposition } from "../components/ValueProposition";
import { Services } from "../components/Services";
import { Framework } from "../components/Framework";
import { CaseStudies } from "../components/CaseStudies";
import { ClientFeedback } from "../components/ClientFeedback";
import { BlogHighlights } from "../components/BlogHighlights";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { Header } from "../components/Header";
import { JsonLd, SiteAnalytics } from "@/components/site/site-analytics";
import { getFeaturedProjects, getLatestPosts, getLatestTestimonials } from "@/lib/data";
import { getHomeContent, getSiteDoc } from "@/lib/site/store";
import { organizationJsonLd, pageMetadata } from "@/lib/site/seo";
import { HOME_SECTION_INFO, whatsappLink, type HomeSectionId } from "@/lib/site/schema";

export const dynamic = "force-dynamic";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home");
}

export default async function Home() {
  const { layout, sections } = await getHomeContent();
  const shown = new Set(layout.filter((s) => s.visible).map((s) => s.id));

  // Only fetch what visible sections need.
  const [projects, testimonials, posts, orgLd, site] = await Promise.all([
    shown.has("featured") ? getFeaturedProjects(sections.featured.count) : [],
    shown.has("testimonials") ? getLatestTestimonials(sections.testimonials.count) : [],
    shown.has("blog") ? getLatestPosts(3) : [],
    organizationJsonLd(),
    getSiteDoc("site"),
  ]);

  // A button pointing at a hidden section (e.g. #contact) would do nothing,
  // so send visitors to WhatsApp, email or phone from Contact & social instead.
  const contactFallback =
    whatsappLink(site.whatsapp) || (site.email ? `mailto:${site.email}` : "") || (site.phone ? `tel:${site.phone.replace(/[^\d+]/g, "")}` : "");
  const link = (href: string) => {
    const id = (Object.keys(HOME_SECTION_INFO) as HomeSectionId[]).find((k) => href === `#${HOME_SECTION_INFO[k].anchor}`);
    return id && !shown.has(id) && contactFallback ? contactFallback : href;
  };

  // Sections appear in the order the owner arranged in Admin → Website.
  const render: Record<HomeSectionId, () => ReactNode> = {
    hero: () => <Hero content={{ ...sections.hero, cta: { ...sections.hero.cta, href: link(sections.hero.cta.href || "#contact") } }} />,
    metrics: () => <TrustMetrics content={sections.metrics} />,
    about: () => <ValueProposition content={sections.about} />,
    services: () => <Services content={{ ...sections.services, cta: { ...sections.services.cta, href: link(sections.services.cta.href || "#contact") } }} />,
    framework: () => <Framework content={sections.framework} />,
    featured: () => <CaseStudies projects={projects} content={sections.featured} />,
    testimonials: () => <ClientFeedback testimonials={testimonials} content={sections.testimonials} />,
    blog: () => <BlogHighlights posts={posts} content={sections.blog} />,
    faq: () => <FAQ content={sections.faq} />,
    cta: () => <FinalCTA content={{ ...sections.cta, href: sections.cta.href && link(sections.cta.href) }} />,
    contact: () => <ContactSection content={sections.contact} />,
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <SiteAnalytics />
      <div
        className="min-h-screen w-full"
        style={{
          background: "#111111",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <Header />
        {layout
          .filter((s) => s.visible)
          .map((s) => (
            <Fragment key={s.id}>{render[s.id]()}</Fragment>
          ))}
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
