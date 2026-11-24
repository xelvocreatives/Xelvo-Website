import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { InsightNote } from "@/components/admin/insight-note";
import { getApplication } from "@/lib/data";
import { formatDate, timeAgo } from "@/lib/admin-format";
import { PageHeader } from "@/components/admin/kit/page-header";
import { StatusPill } from "@/components/admin/kit/status-pill";
import { XaAvatar } from "@/components/admin/kit/avatar";
import { EmptyState } from "@/components/admin/kit/empty-state";
import { XaButton } from "@/components/admin/kit/button";
import { ContactButtons } from "@/components/admin/contact-buttons";
import { StatusControl } from "@/components/admin/status-control";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const app = await getApplication((await params).id);
  return { title: app ? `${app.fullName} · Application` : "Application not found" };
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getApplication(id);

  if (!app) {
    return (
      <EmptyState
        className="mt-10"
        icon={<Briefcase />}
        title="This application doesn't exist"
        description="It may have been deleted, or the link is wrong."
        action={
          <XaButton asChild variant="secondary">
            <Link href="/admin/careers">Back to all applications</Link>
          </XaButton>
        }
      />
    );
  }

  const where = app.locationType === "remote" ? "Remote" : `On-site${app.locationDetail ? ` · ${app.locationDetail}` : ""}`;
  const details = [
    { icon: Briefcase, label: "Role", value: app.position },
    { icon: TrendingUp, label: "Experience", value: app.experience },
    { icon: MapPin, label: "Work preference", value: where },
    { icon: Mail, label: "Email", value: app.email, href: `mailto:${app.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: app.whatsapp },
    { icon: CalendarDays, label: "Applied", value: formatDate(app.createdAt, true) },
  ];
  const cvName = decodeURIComponent(app.resumeUrl.split("/").pop() ?? "CV");
  const cvType = cvName.split(".").pop()?.toUpperCase() ?? "File";

  return (
    <>
      <PageHeader
        back={{ href: "/admin/careers", label: "All applications" }}
        leading={<XaAvatar name={app.fullName} size="lg" className="hidden sm:inline-flex" />}
        title={app.fullName}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusPill kind="application" status={app.status} />
            <span>{app.position}</span>
            <span>Applied {timeAgo(app.createdAt)}</span>
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex min-w-0 items-center gap-4"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-xa-accent/12 text-[#ff8a3d]">
                  <FileText className="size-6" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-bold text-xa-ink group-hover:underline">
                    Open CV
                    <ExternalLink className="size-3.5 text-xa-muted" aria-hidden />
                  </span>
                  <span className="block truncate text-sm text-xa-muted">{cvType} · opens in a new tab</span>
                </span>
              </a>
              <ContactButtons
                name={app.fullName}
                email={app.email}
                phone={app.whatsapp}
                whatsappMessage={`Hi ${app.fullName}, I'm reaching out from Xelvo Creatives about your application for the ${app.position} role.`}
                emailSubject={`Your ${app.position} application at Xelvo Creatives`}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-xa-muted">About them</h2>
            <p className="max-w-[68ch] text-[17px] leading-[1.7] whitespace-pre-line text-xa-ink">{app.bio}</p>
          </section>

          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-xa-muted">Why they want to join</h2>
            <p className="max-w-[68ch] text-[17px] leading-[1.7] whitespace-pre-line text-xa-ink">{app.motivation}</p>
          </section>

          <InsightNote text={app.aiInsight} source="application" />
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-xa-line bg-xa-panel p-4">
            <h2 className="mb-3 px-1 text-sm font-semibold text-xa-muted">Where is this application?</h2>
            <StatusControl kind="application" id={app.id} status={app.status} />
          </section>

          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-xa-muted">Details</h2>
            <dl className="space-y-4">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-xa-faint" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-xs text-xa-muted">{label}</dt>
                    <dd className="text-sm font-medium break-words text-xa-ink">
                      {href ? (
                        <a href={href} className="hover:text-xa-accent hover:underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <div className="px-1">
            <DeleteRecordButton kind="application" id={app.id} name={app.fullName} />
          </div>
        </aside>
      </div>
    </>
  );
}
