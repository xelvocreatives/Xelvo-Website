import { cn } from "@/lib/utils";
import { toneClasses } from "../kit/status-pill";

export type PostState = "draft" | "scheduled" | "published";

/** Draft, scheduled (published with a future date) or live. */
export function postState(post: { status: string; publishedAt: string | null }, now = Date.now()): PostState {
  if (post.status !== "published") return "draft";
  return post.publishedAt && new Date(post.publishedAt).getTime() > now ? "scheduled" : "published";
}

const LOOK: Record<PostState, { label: string; tone: keyof typeof toneClasses }> = {
  draft: { label: "Draft", tone: "neutral" },
  scheduled: { label: "Scheduled", tone: "blue" },
  published: { label: "Published", tone: "green" },
};

export function PostStatusPill({
  post,
  className,
}: {
  post: { status: string; publishedAt: string | null };
  className?: string;
}) {
  const look = LOOK[postState(post)];
  const tone = toneClasses[look.tone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        tone.pill,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden />
      {look.label}
    </span>
  );
}
