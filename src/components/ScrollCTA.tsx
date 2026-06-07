"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function ScrollCTA() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.25 && !dismissed) setVisible(true);
      else if (scrolled <= 0.25) setVisible(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={reduce ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg"
        >
          <div className="bg-[#18181B] text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                Get a free site assessment
              </p>
              <p className="text-xs text-white/50 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                Honest feedback, no pitch. Takes 15 minutes.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/#contact"
                onClick={() => setDismissed(true)}
                className="inline-flex items-center gap-1.5 bg-[#F97316] hover:bg-[#ea6c0a] transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Let&apos;s talk <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 text-white/30 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
