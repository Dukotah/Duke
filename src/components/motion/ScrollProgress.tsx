"use client";

import { useEffect, useRef } from "react";

/**
 * Slim fixed scroll-progress bar for the top of every page. Writes the 0→1
 * scroll fraction to a CSS var (--flow-progress) and lets CSS scale the bar,
 * so the JS only touches one inline style per frame (rAF-throttled, passive).
 * Reduced-motion: still updates (it's informational, not decorative) but the
 * global guard removes the transition so it tracks instantly.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      barRef.current?.style.setProperty("--flow-progress", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flow-scroll-progress" aria-hidden="true">
      <div ref={barRef} className="flow-scroll-progress__bar" />
    </div>
  );
}
