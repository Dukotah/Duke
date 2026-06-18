"use client";

import { type ElementType, type ReactNode } from "react";

type GradientBorderProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Wraps content with an animated conic gradient ring that fades in on
 * hover/focus-within (rotates via the @property --flow-angle keyframe). Give the
 * wrapper a matching border-radius (e.g. rounded-2xl) so the ring follows it.
 * Reduced-motion stops the rotation (ring still appears, static).
 */
export default function GradientBorder({
  children,
  as: Tag = "div",
  className,
  style,
}: GradientBorderProps) {
  return (
    <Tag className={`flow-gradient-border ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}
