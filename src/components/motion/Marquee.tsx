"use client";

import { type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Loop duration in seconds (default 40). Higher = slower. */
  duration?: number;
  /** Scroll right-to-left reversed. */
  reverse?: boolean;
  /** Gap between items (CSS length, default "3rem"). */
  gap?: string;
  className?: string;
};

/**
 * Seamless infinite marquee/ticker for logo walls and proof strips. Renders the
 * children twice and translates the track -50% (CSS keyframe). Edge-faded via a
 * mask. Pauses on hover. Reduced-motion: the global guard stops the animation
 * and makes it a normal horizontally-scrollable strip.
 *
 * Pass a single fragment/row of items as children; do NOT pre-duplicate.
 */
export default function Marquee({
  children,
  duration = 40,
  reverse = false,
  gap = "3rem",
  className,
}: MarqueeProps) {
  return (
    <div className={`flow-marquee ${className ?? ""}`}>
      <div
        className={`flow-marquee__track ${reverse ? "flow-marquee__track--reverse" : ""}`}
        style={{ ["--flow-marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden={false}>
          {children}
        </div>
        {/* Duplicate for the seamless loop; hidden from a11y to avoid dupes. */}
        <div className="flex shrink-0 items-center" style={{ gap, paddingRight: gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
