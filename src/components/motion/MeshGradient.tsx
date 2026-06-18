"use client";

import { useEffect, useRef } from "react";
import { useHoverCapable, useReducedMotion } from "./hooks";

type MeshGradientProps = {
  /** Add the cursor-following copper spotlight (desktop only). Default true. */
  spotlight?: boolean;
  /** Orb blur radius in px (default 80; halved automatically on coarse pointers). */
  blur?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * The flagship hero background (playbook §4): three drifting CSS radial orbs —
 * copper (top-left), copper-bright (bottom-right), warm off-white (center) —
 * over the near-black canvas, plus an optional large soft copper spotlight that
 * follows the cursor so the field feels alive and reactive. NO images, NO
 * WebGL/canvas → LCP-safe.
 *
 * Render as the FIRST child of a `position: relative` section, BEFORE the
 * content. It is `position: absolute`, `aria-hidden`, `pointer-events: none` →
 * zero layout impact (CLS 0).
 *
 * Mobile (coarse pointer): cursor spotlight OFF, blur halved — the orbs keep
 * their gentle keyframe drift only.
 * Reduced motion: no drift, no spotlight — a perfectly still mesh that still
 * looks finished (the test of a good fallback).
 */
export default function MeshGradient({
  spotlight = true,
  blur = 80,
  className,
  style,
}: MeshGradientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hoverCapable = useHoverCapable();
  const reduce = useReducedMotion();
  const spotlightOn = spotlight && hoverCapable && !reduce;
  const effectiveBlur = hoverCapable ? blur : Math.round(blur / 2);

  // rAF-throttled cursor spotlight: write --mx/--my on the hero element.
  useEffect(() => {
    if (!spotlightOn) return;
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      lastX = e.clientX - r.left;
      lastY = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${lastX}px`);
        el.style.setProperty("--my", `${lastY}px`);
        raf = 0;
      });
    };
    host.addEventListener("mousemove", onMove);
    return () => {
      host.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [spotlightOn]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "var(--bg-0)",
        zIndex: 0,
        ...style,
      }}
    >
      <style>{`
        @keyframes cbt-orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(3%,4%)} }
        @keyframes cbt-orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-4%,-3%)} }
        @keyframes cbt-orb-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(2%,-2%)} }
        @media (prefers-reduced-motion: reduce) {
          .cbt-orb { animation: none !important; }
        }
      `}</style>

      {/* Orb 1 — copper, top-left */}
      <span
        className="cbt-orb"
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "55%",
          height: "55%",
          background: "radial-gradient(circle, rgba(192,122,62,0.40), transparent 70%)",
          filter: `blur(${effectiveBlur}px)`,
          mixBlendMode: "screen",
          animation: reduce ? "none" : "cbt-orb-a 22s ease-in-out infinite",
        }}
      />
      {/* Orb 2 — copper-bright, bottom-right */}
      <span
        className="cbt-orb"
        style={{
          position: "absolute",
          bottom: "-18%",
          right: "-12%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(219,147,85,0.22), transparent 70%)",
          filter: `blur(${effectiveBlur}px)`,
          mixBlendMode: "screen",
          animation: reduce ? "none" : "cbt-orb-b 26s ease-in-out infinite",
        }}
      />
      {/* Orb 3 — warm off-white, center */}
      <span
        className="cbt-orb"
        style={{
          position: "absolute",
          top: "30%",
          left: "35%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(244,241,236,0.10), transparent 70%)",
          filter: `blur(${effectiveBlur}px)`,
          mixBlendMode: "screen",
          animation: reduce ? "none" : "cbt-orb-c 30s ease-in-out infinite",
        }}
      />

      {/* Cursor spotlight (desktop only) — sits above orbs, below content. */}
      {spotlightOn && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle 600px at var(--mx, 50%) var(--my, 30%), var(--copper-glow), transparent 80%)",
            mixBlendMode: "screen",
          }}
        />
      )}
    </div>
  );
}
