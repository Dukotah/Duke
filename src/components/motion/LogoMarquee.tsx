"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "./hooks";

type LogoMarqueeProps = {
  children: ReactNode;
  /** Loop duration in seconds (default 40). Higher = slower. */
  duration?: number;
  /** Scroll left→right instead of right→left. */
  reverse?: boolean;
  /** Gap between items (CSS length, default "3rem"). */
  gap?: string;
  /** Pause the scroll while hovered (default true). */
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless infinite logo/proof marquee. Renders the row twice and translates
 * the track -50% via a CSS keyframe (transform-only → GPU, no CLS), with mask-
 * faded edges. Pauses on hover (desktop).
 *
 * Reduced motion: the track does NOT scroll — it becomes a static, normally
 * wrapping row of the (single) set of items, edge mask kept. Pass ONE row of
 * items as children; do NOT pre-duplicate.
 *
 * The keyframes are injected once via a scoped <style> so this primitive is
 * self-contained (no dependency on a global CSS layer).
 */
export default function LogoMarquee({
  children,
  duration = 40,
  reverse = false,
  gap = "3rem",
  pauseOnHover = true,
  className,
}: LogoMarqueeProps) {
  const reduce = useReducedMotion();

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
    maskImage:
      "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
  };

  // Reduced motion → static, wrapping single row (still edge-masked).
  if (reduce) {
    return (
      <div className={className} style={{ overflow: "hidden", ...maskStyle }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const row: React.CSSProperties = {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap,
    paddingRight: gap,
  };

  return (
    <div
      className={`cbt-logomarquee${pauseOnHover ? " cbt-logomarquee--pause" : ""} ${className ?? ""}`}
      style={{ overflow: "hidden", ...maskStyle }}
    >
      <style>{`
        @keyframes cbt-marquee-scroll { to { transform: translateX(-50%); } }
        .cbt-logomarquee__track {
          display: flex;
          width: max-content;
          animation: cbt-marquee-scroll var(--cbt-marquee-dur, 40s) linear infinite;
          animation-direction: var(--cbt-marquee-dir, normal);
          will-change: transform;
        }
        .cbt-logomarquee--pause:hover .cbt-logomarquee__track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .cbt-logomarquee__track { animation: none; }
        }
      `}</style>
      <div
        className="cbt-logomarquee__track"
        style={
          {
            "--cbt-marquee-dur": `${duration}s`,
            "--cbt-marquee-dir": reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div style={row}>{children}</div>
        {/* Duplicate set for the seamless loop; hidden from a11y. */}
        <div style={row} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
