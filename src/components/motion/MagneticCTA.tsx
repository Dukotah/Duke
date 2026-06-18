"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, type ElementType, type ReactNode } from "react";
import { useHoverCapable, useReducedMotion } from "./hooks";

type MagneticCTAProps = {
  children: ReactNode;
  /**
   * Render element. Pass a tag string ("a" | "button"), the literal "link" to
   * render a Next.js <Link>, or omit for a <button>. Server callers MUST use a
   * string / "link" (never a component reference across the RSC boundary).
   */
  as?: ElementType | "link";
  /** Pull strength 0–1 (default 0.3). */
  strength?: number;
  /** Add the Stripe-style top-left white shine overlay on hover (default true). */
  shine?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // href / onClick / type / etc. pass through to the rendered element.
  [key: string]: unknown;
};

/**
 * Primary-CTA wrapper: magnetic drift toward the cursor (spring) + a Stripe-
 * style 15% white radial overlay that appears top-left on hover (light hitting
 * the button — a brightness shift, NOT a recolor; the copper stays copper).
 *
 * Touch / reduced motion: magnetic is OFF (no pointer; avoids battery + jank)
 * and the element renders as a plain, fully-clickable CTA — the conversion path
 * never depends on any animation completing (playbook P5). The shine is a CSS
 * opacity fade, harmless under reduced motion, but we also gate it off there.
 *
 * Pass your visual styling (bg, padding, radius, copper) via className/style;
 * this only adds the motion + overlay.
 */
export default function MagneticCTA({
  children,
  as = "button",
  strength = 0.3,
  shine = true,
  className,
  style,
  ...rest
}: MagneticCTAProps) {
  const Tag: ElementType = as === "link" ? Link : as;
  const MotionTag = motion(Tag);

  const ref = useRef<HTMLElement>(null);
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const interactive = hoverCapable && !reduce;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });
  // Shine follows the pointer; default origin top-left when idle. `shineO` is
  // its opacity (0 idle → 1 while hovering), so the overlay fades with the
  // pointer presence without relying on child :hover.
  const shineX = useMotionValue(30);
  const shineY = useMotionValue(20);
  const shineO = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const shineBg = useTransform(
    [shineX, shineY],
    ([px, py]: number[]) =>
      `radial-gradient(140px circle at ${px}% ${py}%, rgba(255,255,255,0.18), transparent 70%)`,
  );

  const onMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
    shineX.set(((e.clientX - r.left) / r.width) * 100);
    shineY.set(((e.clientY - r.top) / r.height) * 100);
    shineO.set(1);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    shineX.set(30);
    shineY.set(20);
    shineO.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        x: interactive ? sx : 0,
        y: interactive ? sy : 0,
      }}
      className={className}
      {...rest}
    >
      {/* Content above the shine. */}
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        {children}
      </span>
      {shine && interactive && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: shineBg,
            opacity: shineO,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
    </MotionTag>
  );
}
