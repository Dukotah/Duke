"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./useInView";

type RotatingWordProps = {
  /** Words to cycle through. */
  words: string[];
  /** ms each word stays before swapping (default 2200). */
  interval?: number;
  /** Class applied to the active word (e.g. "flow-text-gradient"). */
  className?: string;
};

/**
 * Cross-fading rotating headline word. All words are stacked in an inline-grid
 * so the layout never shifts (width = widest word). Reduced-motion shows only
 * the first word, statically. Keep the words similar length for best result.
 *
 * Usage in a headline: We build <RotatingWord words={["websites","IT","..."]}
 * className="flow-text-gradient" /> for you.
 */
export default function RotatingWord({
  words,
  interval = 2200,
  className,
}: RotatingWordProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduced, words.length, interval]);

  if (reduced) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className="flow-word-stack" aria-live="polite">
      {words.map((w, i) => (
        <span
          key={w}
          className={`flow-word ${className ?? ""}`}
          data-flow-word={i === index ? "in" : "out"}
          aria-hidden={i !== index}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
