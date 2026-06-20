"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useHoverCapable, useReducedMotion } from "./hooks";

type SpotlightCardProps = {
  children: ReactNode;
  /** Add the 8px spring Y-lift on hover (default true). */
  lift?: boolean;
  /** Card corner radius in px (default 20). */
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Cursor-spotlight gradient-border card (Linear/Services spec, playbook §3).
 *
 * Desktop (hover-capable): a soft copper radial glow follows the pointer along
 * the card's 1px border, and the card lifts 8px on a spring on hover.
 * Touch: tracking + lift are OFF (no pointer to follow, avoids flicker) — a
 * static copper-dim top-left glow stands in.
 * Reduced motion: no lift, no tracking — a flat copper-dim tint + hairline.
 *
 * Depth comes from the lighter surface + hairline + glow only (no black
 * shadow), and the glow lives in pseudo-layers so it never affects layout (CLS
 * 0). Give inner content `position: relative` if it must layer above the glow.
 */
export default function SpotlightCard({
  children,
  lift = true,
  radius = 20,
  className,
  style,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const interactive = hoverCapable && !reduce;

  const onMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  // Static spotlight origin when not interactive (top-left, copper-dim).
  const baseGlow = interactive
    ? "radial-gradient(560px circle at var(--mx, 30%) var(--my, 30%), var(--copper-glow), transparent 60%)"
    : "radial-gradient(420px circle at 20% 20%, var(--copper-dim), transparent 60%)";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={lift && interactive ? { y: -8 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
      style={{
        position: "relative",
        borderRadius: radius,
        background: "var(--bg-2)",
        border: "1px solid var(--hairline)",
        isolation: "isolate",
        ...style,
      }}
    >
      {/* Glowing gradient border — masked to a 1px ring so it traces the edge. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          padding: "1px",
          background: baseGlow,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Soft interior wash so the glow reads inside the card too. */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: interactive
            ? "radial-gradient(420px circle at var(--mx, 30%) var(--my, 30%), rgba(221,170,117,0.10), transparent 55%)"
            : "radial-gradient(360px circle at 20% 20%, rgba(198,138,90,0.07), transparent 55%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}
