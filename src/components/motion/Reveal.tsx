"use client";

import { type ElementType, type ReactNode } from "react";
import { useInView } from "./useInView";

type Direction = "up" | "down" | "left" | "right" | "scale";

type RevealProps = {
  children: ReactNode;
  /** Entry direction (default "up"). */
  direction?: Direction;
  /** Stagger delay in ms before this element animates in. */
  delay?: number;
  /** Render as a different element (default "div"). */
  as?: ElementType;
  /** Re-animate on every entry (default once). */
  repeat?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Fade/slide a block into view on scroll. Pure CSS transition driven by a
 * data-attribute the IntersectionObserver toggles — honors reduced-motion via
 * the global guard in globals.css (content shows instantly, no jank).
 *
 * Stagger a list by mapping with incrementing `delay` (e.g. i * 80).
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  as: Tag = "div",
  repeat = false,
  className,
  style,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ repeat });

  return (
    <Tag
      ref={ref}
      data-flow-reveal={inView ? "in" : direction}
      className={className}
      style={{ ...style, ["--flow-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
