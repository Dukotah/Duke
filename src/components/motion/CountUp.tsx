"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePrefersReducedMotion } from "./useInView";

type CountUpProps = {
  /** Final value. */
  to: number;
  /** Starting value (default 0). */
  from?: number;
  /** Duration ms (default 1600). */
  duration?: number;
  /** Decimal places (default 0). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Thousands separator (default true). */
  separator?: boolean;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Animated count-up that starts when scrolled into view. rAF-driven, eased,
 * reduced-motion shows the final value instantly. `decimals`/`prefix`/`suffix`
 * cover money, percentages, "+", "x", etc.
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1600,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = true,
  className,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let raf = 0;

    if (reduced) {
      // Defer out of the effect body (no synchronous setState) — snap to final.
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(from + (to - from) * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, from, to, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: separator,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
