import { Lightbulb } from "lucide-react";

// Fallback lines the website writes when nothing stood out; not worth showing.
const GENERIC = ["standard lead review.", "standard application review needed."];

/** Removes the emoji the website prefixes to its automatic hints. */
function clean(text: string): string {
  return text.replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}️‍\s]+/u, "").trim();
}

/**
 * The automatic one-line hint saved with a lead or application (urgency,
 * budget interest, seniority...). Hidden when it is only the generic fallback.
 */
export function InsightNote({ text, source }: { text: string | null; source: "message" | "application" }) {
  if (!text || GENERIC.includes(text.trim().toLowerCase())) return null;
  const hint = clean(text);
  if (!hint) return null;

  return (
    <section className="flex gap-4 rounded-2xl border border-xa-line bg-xa-panel p-5 sm:p-6">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/6 text-xa-muted">
        <Lightbulb className="size-[18px]" aria-hidden />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-xa-ink">Quick read</h2>
        <p className="mt-1 text-[15px] leading-relaxed text-xa-ink/85">{hint}</p>
        <p className="mt-2 text-xs text-xa-muted">
          An automatic hint based on words in the {source}. Use your own judgement.
        </p>
      </div>
    </section>
  );
}
