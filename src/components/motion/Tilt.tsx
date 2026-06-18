"use client";

import { useRef, type ReactNode } from "react";
import { useIsTouch, usePrefersReducedMotion } from "./useInView";

type TiltProps = {
  children: ReactNode;
  /** Max rotation in degrees (default 8). */
  max?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Subtle 3D tilt toward the cursor. Compositor-only (writes --flow-rx/--flow-ry
 * CSS vars), disabled on touch + reduced-motion. Wrap a card; the CSS class
 * applies the perspective transform. Use `.flow-tilt-layer` on inner content
 * to lift it toward the viewer.
 */
export default function Tilt({ children, max = 8, className, style }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = touch || reduced;

  const onMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--flow-ry", `${px * max}deg`);
    el.style.setProperty("--flow-rx", `${-py * max}deg`);
    el.dataset.flowTilting = "true";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.dataset.flowTilting = "false";
    el.style.setProperty("--flow-rx", "0deg");
    el.style.setProperty("--flow-ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`flow-tilt ${className ?? ""}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
