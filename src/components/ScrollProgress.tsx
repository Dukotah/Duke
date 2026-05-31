"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A slim copper reading-progress bar pinned to the very top of the viewport.
 * Sits above the nav (z-60) and tracks how far down the page you've scrolled.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, background: "var(--grad-copper)" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left shadow-[0_0_12px_rgba(232,133,58,0.6)]"
    />
  );
}
