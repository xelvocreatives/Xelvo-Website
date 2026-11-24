import * as React from "react";
import { GradientText } from "@/components/ui/GradientText";
import type { Highlighted } from "@/lib/site/schema";

/** Turns typed line breaks into <br>, optionally only from a breakpoint up. */
function withBreaks(text: string, keyPrefix: string, breakClassName?: string) {
  return text.split("\n").flatMap((line, i) =>
    i === 0 ? [line] : [<br key={`${keyPrefix}-${i}`} className={breakClassName} />, line],
  );
}

/**
 * A line of owner-written text where the chosen words show in the brand
 * gradient, exactly like the hand-built headings did before.
 */
export function HighlightedText({
  value,
  gradientClassName,
  breakClassName,
}: {
  value: Highlighted;
  gradientClassName?: string;
  /** e.g. "hidden sm:block" to break lines only on larger screens. */
  breakClassName?: string;
}) {
  const { text, highlight } = value;
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return <>{withBreaks(text, "t", breakClassName)}</>;

  const before = text.slice(0, at);
  const after = text.slice(at + highlight.length);
  return (
    <>
      {withBreaks(before, "b", breakClassName)}
      <GradientText className={gradientClassName}>{withBreaks(highlight, "h", breakClassName)}</GradientText>
      {withBreaks(after, "a", breakClassName)}
    </>
  );
}
