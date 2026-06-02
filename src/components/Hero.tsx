"use client";

import { motion } from "framer-motion";
import { CALENDLY_URL } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#18181B]">
      {/* Subtle topographic SVG background */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="topo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
              <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
              <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span
            className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              backgroundColor: "rgba(200,169,110,0.15)",
              color: "#F97316",
              border: "1px solid rgba(200,169,110,0.3)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Sonoma County · North Bay California
          </span>

          <h1
            className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for local business.
            <br />
            <span style={{ color: "#F97316" }}>Built to last.</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Custom websites, IT support, and cybersecurity for Sonoma County
            businesses. Enterprise-grade thinking — without the enterprise price tag.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold text-white transition-colors"
              style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
            >
              Book a Free Call
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold transition-colors"
              style={{
                border: "2px solid rgba(255,255,255,0.3)",
                color: "white",
                fontFamily: "var(--font-heading)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              Send a Message
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
    </section>
  );
}
