import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CaseStudies } from "@/components/CaseStudies";
import { SEO } from "@/components/SEO";
import { ScrollToTop } from "@/components/ScrollToTop";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("Project")
    .select("*")
    .eq("isFeatured", false)
    .order("createdAt", { ascending: false });

  if (!projects) return null;

  return (
    <>
      <SEO />
      <div
        className="min-h-screen w-full"
        style={{
          background: "#111111",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <Header />
        <div className="pt-20">
          {" "}
          {/* Add padding for header */}
          <div className="max-w-[1280px] mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Projects
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Explore our portfolio of successful brand transformations and
              creative solutions.
            </p>
          </div>
          <CaseStudies projects={projects} />
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
