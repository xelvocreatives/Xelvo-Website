import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, MessageSquareText, SearchX } from "lucide-react";
import { getAllInquiries } from "@/lib/data";
import { LEAD_STATUS_ORDER, formatDate, statusInfo, timeAgo } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/kit/page-header";
import { FilterTabs } from "@/components/admin/kit/filter-tabs";
import { SearchBox } from "@/components/admin/kit/search-box";
import { StatusPill } from "@/components/admin/kit/status-pill";
import { XaAvatar } from "@/components/admin/kit/avatar";
import { EmptyState } from "@/components/admin/kit/empty-state";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const all = await getAllInquiries();

  const query = q.trim().toLowerCase();
  const matchesQuery = (text: (string | null)[]) =>
    !query || text.some((t) => t?.toLowerCase().includes(query));

  const searched = all.filter((l) => matchesQuery([l.name, l.email, l.company, l.service, l.message, l.phone]));
  const activeStatus = status === "all" || LEAD_STATUS_ORDER.includes(status) ? status : "all";
  const leads = activeStatus === "all" ? searched : searched.filter((l) => l.status === activeStatus);

  const tabs = [
    { value: "all", label: "All", count: searched.length },
    ...LEAD_STATUS_ORDER.map((s) => ({
      value: s,
      label: statusInfo("lead", s).label,
      count: searched.filter((l) => l.status === s).length,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Leads"
        description="People who contacted you through the website. Reply, then move each lead along as the conversation goes."
      />

      <div className="mb-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs basePath="/admin/inquiries" tabs={tabs} active={activeStatus} query={q} />
        <Suspense>
          <SearchBox placeholder="Search name, email, company…" />
        </Suspense>
      </div>

      {all.length === 0 ? (
        <EmptyState
          icon={<MessageSquareText />}
          title="No leads yet"
          description="When someone fills in the contact form on your website, they'll appear here."
        />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="Nothing matches"
          description={query ? `No leads match “${q}” here. Try another word or a different status.` : "No leads with this status right now."}
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-xa-line bg-xa-panel">
          {leads.map((lead) => {
            const isNew = lead.status === "new";
            return (
              <li key={lead.id} className="border-b border-xa-line last:border-b-0">
                <Link
                  href={`/admin/inquiries/${lead.id}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-4 transition-colors hover:bg-white/[0.03] sm:px-5 md:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_120px_110px_auto]"
                >
                  <XaAvatar name={lead.name} />
                  <div className="min-w-0">
                    <p className={cn("flex items-center gap-2 truncate text-[15px] text-xa-ink", isNew ? "font-bold" : "font-semibold")}>
                      {isNew && <span className="size-2 shrink-0 rounded-full bg-xa-accent" aria-label="New" />}
                      <span className="truncate">{lead.name}</span>
                    </p>
                    <p className="truncate text-sm text-xa-muted">{lead.company || lead.email}</p>
                  </div>
                  <p className="col-start-2 truncate text-sm text-xa-muted md:col-start-auto md:text-xa-ink/80">
                    {lead.service || "General enquiry"}
                  </p>
                  <p className="hidden text-sm text-xa-muted md:block" title={formatDate(lead.createdAt, true)}>
                    {timeAgo(lead.createdAt)}
                  </p>
                  <div className="col-start-3 row-span-2 row-start-1 flex flex-col items-end gap-2 md:col-start-auto md:row-span-1 md:row-start-auto md:block">
                    <StatusPill kind="lead" status={lead.status} />
                    <span className="text-xs text-xa-muted md:hidden">{timeAgo(lead.createdAt)}</span>
                  </div>
                  <ChevronRight className="hidden size-4 text-xa-faint transition-transform group-hover:translate-x-0.5 group-hover:text-xa-muted md:block" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
