import { Hero } from "../components/Hero";
import { TrustMetrics } from "../components/TrustMetrics";
import { ValueProposition } from "../components/ValueProposition";
import { Services } from "../components/Services";
import { Framework } from "../components/Framework";
import { CaseStudies } from "../components/CaseStudies";
import { ClientFeedback } from "../components/ClientFeedback";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { SEO } from "../components/SEO";
import { Header } from "../components/Header";
import { Analytics } from "../components/Analytics";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("Project")
    .select("*")
    .eq("isFeatured", true)
    .order("createdAt", { ascending: false })
    .limit(4);

  const { data: testimonials } = await supabase
    .from("Testimonial")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(9);

  return (
    <>
      <SEO />
      <Analytics />
      <div
        className="min-h-screen w-full"
        style={{
          background: "#111111",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <Header />
        <Hero />
        <TrustMetrics />
        <ValueProposition />
        <Services />
        <Framework />
        <CaseStudies projects={projects || []} />
        <ClientFeedback testimonials={testimonials || []} />
        <FAQ />
        <FinalCTA />
        <ContactSection />
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
