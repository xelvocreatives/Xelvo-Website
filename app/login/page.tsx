import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeaturedProjects } from "@/lib/data";
import { LoginForm } from "@/components/admin/login-form";
import BrandLogo from "@/public/images/brand-logo.png";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in · Xelvo admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  // The studio's own work frames the sign-in (public images, already on the site).
  const projects = (await getFeaturedProjects(4)).filter((p) => p.imageUrl);

  return (
    <div className="xa grid min-h-dvh bg-xa-ground text-xa-ink lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <aside className="hidden min-h-dvh flex-col border-r border-xa-line bg-[#0e0e0e] lg:flex" aria-hidden>
        {projects.length > 0 && (
          <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 p-2">
            {projects.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className={`relative overflow-hidden rounded-[14px] ${projects.length === 1 ? "col-span-2 row-span-2" : projects.length === 3 && i === 0 ? "row-span-2" : projects.length === 2 ? "row-span-2" : ""}`}
              >
                <Image src={p.imageUrl!} alt="" fill sizes="30vw" className="object-cover" priority={i === 0} />
              </div>
            ))}
          </div>
        )}
        <div className="px-10 pt-6 pb-10">
          <p className="max-w-md text-[28px] leading-tight font-bold tracking-[-0.02em] text-white">
            Your studio, your work, your clients.
          </p>
          <p className="mt-2 text-[15px] text-white/70">Manage your website&apos;s projects, reviews, leads and hiring.</p>
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Image src={BrandLogo} alt="Xelvo Creatives" height={32} className="h-8 w-auto" priority />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-xa-muted transition-colors hover:text-xa-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to website
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[30px] leading-tight font-bold tracking-[-0.02em]">Welcome back</h1>
          <p className="mt-2 mb-8 text-[15px] text-xa-muted">Sign in to manage your website.</p>
          <LoginForm />
          <p className="mt-6 text-[13px] leading-relaxed text-xa-muted">
            Forgot your password? Ask your developer to set a new one for you.
          </p>
        </div>
      </main>
    </div>
  );
}
