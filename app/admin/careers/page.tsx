import { Suspense } from "react";
import Link from "next/link";
import { Briefcase, ChevronRight, SearchX } from "lucide-react";
import { getAllApplications } from "@/lib/data";
import { APPLICATION_STATUS_ORDER, formatDate, statusInfo, timeAgo } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/kit/page-header";
import { FilterTabs } from "@/components/admin/kit/filter-tabs";
import { SearchBox } from "@/components/admin/kit/search-box";
import { StatusPill } from "@/components/admin/kit/status-pill";
import { XaAvatar } from "@/components/admin/kit/avatar";
import { EmptyState } from "@/components/admin/kit/empty-state";

export const dynamic = "force-dynamic";
export const metadata = { title: "Job applications" };

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const all = await getAllApplications();

  const query = q.trim().toLowerCase();
  const searched = all.filter(
    (a) =>
      !query ||
      [a.fullName, a.email, a.position, a.experience, a.locationDetail, a.whatsapp].some((t) =>
        t?.toLowerCase().includes(query),
      ),
  );
  const activeStatus = status === "all" || APPLICATION_STATUS_ORDER.includes(status) ? status : "all";
  const applications = activeStatus === "all" ? searched : searched.filter((a) => a.status === activeStatus);

  const tabs = [
    { value: "all", label: "All", count: searched.length },
    ...APPLICATION_STATUS_ORDER.map((s) => ({
      value: s,
      label: statusInfo("application", s).label,
      count: searched.filter((a) => a.status === s).length,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Job applications"
        description="People who applied through the Careers page. Open one to read it, view the CV and reply."
      />

      <div className="mb-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs basePath="/admin/careers" tabs={tabs} active={activeStatus} query={q} />
        <Suspense>
          <SearchBox placeholder="Search name, role, city…" />
        </Suspense>
      </div>

      {all.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No applications yet"
          description="When someone applies on your Careers page, their application will appear here."
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title="Nothing matches"
          description={
            query
              ? `No applications match “${q}” here. Try another word or a different status.`
              : "No applications with this status right now."
          }
        />
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-xa-line bg-xa-panel">
          {applications.map((app) => {
            const isNew = app.status === "new";
            const where = app.locationType === "remote" ? "Remote" : app.locationDetail || "On-site";
            return (
              <li key={app.id} className="border-b border-xa-line last:border-b-0">
                <Link
                  href={`/admin/careers/${app.id}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-4 transition-colors hover:bg-white/[0.03] sm:px-5 md:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,1.1fr)_120px_120px_auto]"
                >
                  <XaAvatar name={app.fullName} />
                  <div className="min-w-0">
                    <p className={cn("flex items-center gap-2 text-[15px] text-xa-ink", isNew ? "font-bold" : "font-semibold")}>
                      {isNew && <span className="size-2 shrink-0 rounded-full bg-xa-accent" aria-label="New" />}
                      <span className="truncate">{app.fullName}</span>
                    </p>
                    <p className="truncate text-sm text-xa-muted">{app.position}</p>
                  </div>
                  <p className="col-start-2 truncate text-sm text-xa-muted md:col-start-auto md:text-xa-ink/80">
                    {app.experience} · {where}
                  </p>
                  <p className="hidden text-sm text-xa-muted md:block" title={formatDate(app.createdAt, true)}>
                    {timeAgo(app.createdAt)}
                  </p>
                  <div className="col-start-3 row-span-2 row-start-1 flex flex-col items-end gap-2 md:col-start-auto md:row-span-1 md:row-start-auto md:block">
                    <StatusPill kind="application" status={app.status} />
                    <span className="text-xs text-xa-muted md:hidden">{timeAgo(app.createdAt)}</span>
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
