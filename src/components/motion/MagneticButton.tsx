"use client";

import Link from "next/link";
import { useRef, type ElementType, type ReactNode } from "react";
import { useIsTouch, usePrefersReducedMotion } from "./useInView";

type MagneticButtonProps = {
  children: ReactNode;
  /**
   * Render element. Pass a string tag ("a" / "button" / "div") or the literal
   * "link" to render a Next.js <Link>. A component reference can also be passed,
   * but ONLY from a Client Component — passing one from a Server Component
   * crosses the RSC boundary and throws. Server callers should use as="link".
   */
  as?: ElementType | "link";
  /** Pull strength 0–1 (default 0.3). */
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
  // Allow href/onClick/etc. to pass through to the rendered element.
  [key: string]: unknown;
};

/**
 * Magnetic wrapper: the element drifts toward the cursor and springs back on
 * leave. Compositor-only (--flow-tx/--flow-ty). Disabled on touch + reduced
 * motion (renders as a plain element). Pair with `.flow-shine` for a CTA.
 *
 * Usage: <MagneticButton as="link" href="/x" className="flow-magnetic ...">…
 * (include `flow-magnetic` in className so the transform applies.)
 */
export default function MagneticButton({
  children,
  as: Component = "div",
  strength = 0.3,
  className,
  style,
  ...rest
}: MagneticButtonProps) {
  // Resolve the string sentinel "link" to Next's <Link> on the client so server
  // callers never have to pass a component reference across the RSC boundary.
  const Tag: ElementType = Component === "link" ? Link : Component;
  const ref = useRef<HTMLElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = touch || reduced;

  const onMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.setProperty("--flow-tx", `${x}px`);
    el.style.setProperty("--flow-ty", `${y}px`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--flow-tx", "0px");
    el.style.setProperty("--flow-ty", "0px");
  };

  return (
    <Tag
      ref={ref}
      className={`flow-magnetic ${className ?? ""}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
