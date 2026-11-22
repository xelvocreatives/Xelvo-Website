export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-10" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded-full bg-white/[0.06]" />
        <div className="h-9 w-72 max-w-full rounded-lg bg-white/[0.08]" />
        <div className="h-4 w-96 max-w-full rounded-full bg-white/[0.05]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-32 rounded-2xl border border-xa-line bg-xa-panel" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="aspect-[4/3] rounded-[14px] bg-xa-panel sm:col-span-2" />
        <div className="aspect-[4/3] rounded-[14px] bg-xa-panel" />
        <div className="aspect-[4/3] rounded-[14px] bg-xa-panel" />
      </div>
    </div>
  );
}
