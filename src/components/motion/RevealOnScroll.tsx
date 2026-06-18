"use client";

import { motion, type Variants } from "framer-motion";
import { type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "./hooks";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealOnScrollProps = {
  children: ReactNode;
  /** Entry direction (default "up"). */
  direction?: Direction;
  /** Delay before this element animates in, seconds (default 0). */
  delay?: number;
  /** Travel distance in px before settling (default 16). */
  distance?: number;
  /** Animation duration, seconds (default 0.5). */
  duration?: number;
  /** Render as a different element (default "div"). */
  as?: ElementType;
  /** Fraction visible before firing (default 0.2). */
  amount?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Fade + slide a block into view on scroll. Uses framer-motion `whileInView`
 * with `once: true` (premium look = reveal on enter, never re-animate → CLS 0).
 *
 * Reduced motion: renders instantly at final state (no transform, no fade) —
 * the content is always present in markup, so it never blocks the LCP and the
 * static result still looks finished.
 *
 * Stagger a list by mapping with an incrementing `delay` (e.g. i * 0.08).
 */
export default function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  distance = 16,
  duration = 0.5,
  as,
  amount = 0.2,
  className,
  style,
}: RevealOnScrollProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion(as ?? "div");

  if (reduce) {
    const StaticTag = (as ?? "div") as ElementType;
    return (
      <StaticTag className={className} style={style}>
        {children}
      </StaticTag>
    );
  }

  const offset = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  }[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <MotionTag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}
