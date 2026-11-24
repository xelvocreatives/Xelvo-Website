import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, MessageSquareText, Plus, Quote, Star } from "lucide-react";
import { getAllProjects, getAllTestimonials, getNeedsReply } from "@/lib/data";
import { greeting, pluralize, showsOn, timeAgo, todayLabel } from "@/lib/admin-format";
import { XaButton } from "@/components/admin/kit/button";
import { XaAvatar } from "@/components/admin/kit/avatar";
import { SectionHeading } from "@/components/admin/kit/page-header";
import { EmptyState } from "@/components/admin/kit/empty-state";
import { ContactButtons } from "@/components/admin/contact-buttons";
import { ProjectTile } from "@/components/admin/project-tile";

export const dynamic = "force-dynamic";
export const metadata = { title: "Home" };

type ReplyItem = {
  id: string;
  kind: "lead" | "application";
  name: string;
  email: string;
  phone: string | null;
  about: string;
  createdAt: string;
};

export default async function AdminHome() {
  const [{ leads, applications }, projects, testimonials] = await Promise.all([
    getNeedsReply(),
    getAllProjects(),
    getAllTestimonials(),
  ]);

  const waiting: ReplyItem[] = [
    ...leads.map((l) => ({
      id: l.id,
      kind: "lead" as const,
      name: l.name,
      email: l.email,
      phone: l.phone,
      about: [l.service, l.company].filter(Boolean).join(" · ") || "General enquiry",
      createdAt: l.createdAt,
    })),
    ...applications.map((a) => ({
      id: a.id,
      kind: "application" as const,
      name: a.fullName,
      email: a.email,
      phone: a.whatsapp,
      about: `Applied for ${a.position}`,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const featured = projects.filter((p) => p.isFeatured);
  // The wall never leaves empty cells: 1, 2, 3 or 5 tiles (4 projects show 3).
  const ordered = [...featured, ...projects.filter((p) => !p.isFeatured)];
  const wallSize = ordered.length >= 5 ? 5 : ordered.length === 4 ? 3 : ordered.length;
  const wall = ordered.slice(0, wallSize);
  const wallGrid =
    wallSize >= 5
      ? "sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
      : wallSize === 3
        ? "sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2"
        : wallSize === 2
          ? "sm:grid-cols-2"
          : "";
  const hero = wallSize >= 3;

  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm font-medium text-xa-muted">{todayLabel()}</p>
        <h1 className="mt-1 text-[30px] leading-tight font-bold tracking-[-0.02em] text-xa-ink sm:text-[38px]">
          {greeting()}
        </h1>
        <p className="mt-2 text-[15px] text-xa-muted">
          {waiting.length > 0
            ? `${pluralize(waiting.length, "person is", "people are")} waiting for a reply.`
            : "Everyone has a reply. Here's your studio at a glance."}
        </p>
      </header>

      {/* Needs your reply */}
      <section aria-labelledby="reply-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="reply-heading" className="flex items-center gap-2.5 text-lg font-bold text-xa-ink">
            Needs your reply
            {waiting.length > 0 && (
              <span className="rounded-full bg-xa-accent px-2 py-0.5 text-xs font-bold text-xa-on-accent tabular-nums">
                {waiting.length}
              </span>
            )}
          </h2>
        </div>

        {waiting.length === 0 ? (
          <div className="flex items-center gap-4 rounded-2xl border border-xa-line bg-xa-panel px-5 py-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-xa-green/12 text-xa-green">
              <CheckCircle2 className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-xa-ink">You&apos;re all caught up</p>
              <p className="text-sm text-xa-muted">New leads and job applications will appear here first.</p>
            </div>
          </div>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {waiting.map((item) => {
              const href = item.kind === "lead" ? `/admin/inquiries/${item.id}` : `/admin/careers/${item.id}`;
              return (
                <li
                  key={`${item.kind}-${item.id}`}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-xa-line bg-xa-panel p-4 transition-colors duration-200 hover:border-xa-accent/40"
                >
                  <div className="flex items-start gap-3">
                    <XaAvatar name={item.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={href}
                          className="truncate font-bold text-xa-ink after:absolute after:inset-0 after:rounded-2xl"
                        >
                          {item.name}
                        </Link>
                        <span className="size-2 shrink-0 rounded-full bg-xa-accent" aria-label="New" />
                      </div>
                      <p className="truncate text-sm text-xa-muted">{item.about}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-xa-muted">
                      {item.kind === "lead" ? (
                        <MessageSquareText className="size-3.5" aria-hidden />
                      ) : (
                        <Briefcase className="size-3.5" aria-hidden />
                      )}
                      {item.kind === "lead" ? "Lead" : "Job application"} · {timeAgo(item.createdAt)}
                    </span>
                    <div className="relative z-10">
                      <ContactButtons
                        compact
                        name={item.name}
                        email={item.email}
                        phone={item.phone}
                        whatsappMessage={
                          item.kind === "lead"
                            ? `Hi ${item.name}, thank you for contacting Xelvo Creatives. I'd love to hear more about your project.`
                            : `Hi ${item.name}, I'm reaching out from Xelvo Creatives about your job application.`
                        }
                        emailSubject={item.kind === "lead" ? "Your enquiry with Xelvo Creatives" : "Your application at Xelvo Creatives"}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Portfolio wall */}
      <section aria-labelledby="portfolio-heading">
        <SectionHeading
          title="Your portfolio"
          meta={
            projects.length > 0
              ? `${pluralize(projects.length, "project")} · ${featured.length} on the home page`
              : undefined
          }
          action={
            <XaButton asChild variant="primary" size="sm">
              <Link href="/admin/projects?new=1">
                <Plus />
                Add project
              </Link>
            </XaButton>
          }
        />

        {projects.length === 0 ? (
          <EmptyState
            icon={<Plus />}
            title="Add your first project"
            description="Projects appear on your website. Add a cover image, a name and a short story about the work."
            action={
              <XaButton asChild variant="primary">
                <Link href="/admin/projects?new=1">Add project</Link>
              </XaButton>
            }
          />
        ) : (
          <div className={`grid grid-cols-1 gap-3 ${wallGrid}`}>
            {wall.map((project, index) => (
              <Link
                key={project.id}
                href={`/admin/projects?edit=${project.id}`}
                aria-label={`Edit ${project.title}`}
                className={hero && index === 0 ? "block sm:col-span-2 lg:row-span-2" : "block"}
              >
                <ProjectTile
                  project={project}
                  size={(hero && index === 0) || wallSize === 1 ? "lg" : "md"}
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 640px" : undefined}
                  className={hero && index > 0 ? "lg:aspect-auto lg:h-full lg:min-h-[164px]" : ""}
                />
              </Link>
            ))}
          </div>
        )}
        {projects.length > wall.length && (
          <Link
            href="/admin/projects"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-xa-muted hover:text-xa-ink"
          >
            See all {projects.length} projects
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </section>

      {/* Testimonials */}
      <section aria-labelledby="testimonials-heading">
        <SectionHeading
          title="Client testimonials"
          meta={testimonials.length > 0 ? showsOn(testimonials.length, 9, "the website") : undefined}
          action={
            <XaButton asChild variant="secondary" size="sm">
              <Link href="/admin/testimonials">Manage</Link>
            </XaButton>
          }
        />
        {testimonials.length === 0 ? (
          <EmptyState
            icon={<Quote />}
            title="No testimonials yet"
            description="Kind words from clients build trust on your website. Add the first one."
            action={
              <XaButton asChild variant="primary">
                <Link href="/admin/testimonials?new=1">Add testimonial</Link>
              </XaButton>
            }
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {testimonials.slice(0, 4).map((t) => (
              <li key={t.id}>
                <Link
                  href={`/admin/testimonials?edit=${t.id}`}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-xa-line bg-xa-panel p-5 transition-colors hover:border-white/20"
                >
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={i < t.rating ? "size-3.5 fill-xa-accent text-xa-accent" : "size-3.5 text-xa-faint"}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-xa-ink/85">“{t.text}”</p>
                  <div className="flex items-center gap-3">
                    <XaAvatar name={t.clientName} src={t.imageUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-xa-ink">{t.clientName}</p>
                      <p className="truncate text-xs text-xa-muted">{t.company}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
