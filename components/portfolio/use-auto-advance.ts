"use client";

import * as React from "react";

/**
 * Advances an index on a timer while the element is on screen. Stops for
 * reduced motion, while paused (hover), and when the tab is hidden.
 */
export function useAutoAdvance({
  count,
  ref,
  paused,
  interval,
  delay = 0,
}: {
  count: number;
  ref: React.RefObject<HTMLElement | null>;
  paused?: boolean;
  interval: number;
  delay?: number;
}) {
  const [index, setIndexState] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  // Bumped on manual navigation so the timer restarts from a full interval.
  const [epoch, setEpoch] = React.useState(0);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  React.useEffect(() => {
    if (count < 2 || !visible || paused || reduced) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        if (!document.hidden) setIndexState((i) => (i + 1) % count);
      }, interval);
      if (!document.hidden) setIndexState((i) => (i + 1) % count);
    }, epoch === 0 ? delay + interval : interval);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
    };
  }, [count, visible, paused, reduced, interval, delay, epoch]);

  // Keep the index valid if the image list shrinks (e.g. admin removes one).
  React.useEffect(() => {
    if (index >= count) setIndexState(0);
  }, [count, index]);

  const setIndex = React.useCallback((i: number) => {
    setIndexState(i);
    setEpoch((e) => e + 1);
  }, []);

  return { index: Math.min(index, Math.max(count - 1, 0)), setIndex };
}
