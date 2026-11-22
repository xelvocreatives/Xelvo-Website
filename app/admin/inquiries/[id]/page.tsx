import Link from "next/link";
import { Building2, CalendarDays, Mail, Phone } from "lucide-react";
import { InsightNote } from "@/components/admin/insight-note";
import { getInquiry } from "@/lib/data";
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
  const lead = await getInquiry((await params).id);
  return { title: lead ? `${lead.name} · Lead` : "Lead not found" };
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getInquiry(id);

  if (!lead) {
    return (
      <EmptyState
        className="mt-10"
        icon={<Mail />}
        title="This lead doesn't exist"
        description="It may have been deleted, or the link is wrong."
        action={
          <XaButton asChild variant="secondary">
            <Link href="/admin/inquiries">Back to all leads</Link>
          </XaButton>
        }
      />
    );
  }

  const details = [
    { icon: Mail, label: "Email", value: lead.email, href: `mailto:${lead.email}` },
    lead.phone && { icon: Phone, label: "Phone", value: lead.phone, href: `tel:${lead.phone.replace(/[^\d+]/g, "")}` },
    lead.company && { icon: Building2, label: "Company", value: lead.company },
    { icon: CalendarDays, label: "Received", value: formatDate(lead.createdAt, true) },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader
        back={{ href: "/admin/inquiries", label: "All leads" }}
        leading={<XaAvatar name={lead.name} size="lg" className="hidden sm:inline-flex" />}
        title={lead.name}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <StatusPill kind="lead" status={lead.status} />
            <span>{lead.service || "General enquiry"}</span>
            <span>Received {timeAgo(lead.createdAt)}</span>
          </span>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-xa-muted">Reply to {lead.name.split(" ")[0]}</h2>
            <ContactButtons
              showCall
              name={lead.name}
              email={lead.email}
              phone={lead.phone}
              whatsappMessage={`Hi ${lead.name}, thank you for contacting Xelvo Creatives about ${lead.service || "your project"}. I'd love to hear more about what you have in mind.`}
              emailSubject={`Your ${lead.service || "project"} enquiry with Xelvo Creatives`}
            />
          </section>

          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
            <h2 className="mb-3 text-sm font-semibold text-xa-muted">Their message</h2>
            <p className="max-w-[68ch] text-[17px] leading-[1.7] whitespace-pre-line text-xa-ink">{lead.message}</p>
          </section>

          <InsightNote text={lead.aiInsight} source="message" />
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-xa-line bg-xa-panel p-4">
            <h2 className="mb-3 px-1 text-sm font-semibold text-xa-muted">Where is this lead?</h2>
            <StatusControl kind="lead" id={lead.id} status={lead.status} />
          </section>

          <section className="rounded-2xl border border-xa-line bg-xa-panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-xa-muted">Details</h2>
            <dl className="space-y-4">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-xa-faint" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-xs text-xa-muted">{label}</dt>
                    <dd className="truncate text-sm font-medium text-xa-ink">
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
            <DeleteRecordButton kind="lead" id={lead.id} name={lead.name} />
          </div>
        </aside>
      </div>
    </>
  );
}
