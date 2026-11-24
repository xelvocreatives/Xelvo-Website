import { cn } from "@/lib/utils";
import { statusInfo, type Tone } from "@/lib/admin-format";

export const toneClasses: Record<Tone, { pill: string; dot: string }> = {
  accent: { pill: "bg-xa-accent/14 text-[#ff8a3d]", dot: "bg-xa-accent" },
  blue: { pill: "bg-xa-blue/12 text-xa-blue", dot: "bg-xa-blue" },
  violet: { pill: "bg-xa-violet/12 text-xa-violet", dot: "bg-xa-violet" },
  green: { pill: "bg-xa-green/12 text-xa-green", dot: "bg-xa-green" },
  red: { pill: "bg-xa-red/12 text-xa-red", dot: "bg-xa-red" },
  neutral: { pill: "bg-white/8 text-xa-muted", dot: "bg-xa-muted" },
};

export function StatusPill({
  kind,
  status,
  className,
}: {
  kind: "lead" | "application";
  status: string;
  className?: string;
}) {
  const info = statusInfo(kind, status);
  const tone = toneClasses[info.tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        tone.pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden />
      {info.label}
    </span>
  );
}
