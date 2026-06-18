"use client";

import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";

type SelfDrawingLineProps = {
  /** The <svg> markup containing path(s)/line(s) to draw. */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Wraps an inline <svg>; when it scrolls into view, every drawable element
 * marked with `data-flow-draw` animates its stroke from invisible to drawn.
 * The wrapper measures each path's length and sets --flow-len so the dash math
 * is exact regardless of geometry. Reduced-motion shows the line fully drawn.
 *
 * Mark the path(s) you want drawn: <path data-flow-draw d="…" /> (no length
 * needed — it's computed). Give the path a stroke + fill="none".
 */
export default function SelfDrawingLine({
  children,
  className,
  style,
}: SelfDrawingLineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Measure path lengths once mounted + observe entry. Single owned ref.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const drawables = node.querySelectorAll<SVGGeometryElement>("[data-flow-draw]");
    drawables.forEach((el) => {
      if (typeof el.getTotalLength === "function") {
        el.style.setProperty("--flow-len", String(el.getTotalLength()));
      }
    });

    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Toggle the draw state when it enters view.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    node
      .querySelectorAll<SVGGeometryElement>("[data-flow-draw]")
      .forEach((el) => el.setAttribute("data-flow-draw", inView ? "in" : ""));
  }, [inView]);

  return (
    <div ref={wrapRef} className={className} style={style}>
      {children}
    </div>
  );
}

/** Convenience props type for a drawable path. */
export type DrawPathProps = SVGProps<SVGPathElement> & { "data-flow-draw"?: string };
