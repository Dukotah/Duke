"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, MapPin, Zap } from "lucide-react";

const trust = [
  { icon: MapPin, label: "Sonoma County local" },
  { icon: Zap, label: "Sub-1.5s load times" },
  { icon: ShieldCheck, label: "Security-first builds" },
];

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  return (
    <section className="grain relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--ink-900)]">
      {/* Aurora / mesh glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="aurora animate-drift"
          style={{
            top: "-10%",
            left: "-5%",
            width: "44vw",
            height: "44vw",
            background:
              "radial-gradient(circle, rgba(232,133,58,0.30), transparent 65%)",
          }}
        />
        <div
          className="aurora animate-float"
          style={{
            bottom: "-15%",
            right: "-8%",
            width: "40vw",
            height: "40vw",
            background:
              "radial-gradient(circle, rgba(245,166,35,0.18), transparent 65%)",
          }}
        />
        <div
          className="aurora animate-pulse-glow"
          style={{
            top: "30%",
            right: "20%",
            width: "26vw",
            height: "26vw",
            background:
              "radial-gradient(circle, rgba(207,111,44,0.16), transparent 70%)",
          }}
        />
      </div>

      {/* Topographic contour lines (the "bay") */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#f5a623" strokeWidth="0.8" />
              <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#f5a623" strokeWidth="0.5" />
              <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#f5a623" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      {/* Fine grid overlay for a "technical / engineered" texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="eyebrow inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full glass-dark text-[var(--copper-300)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--copper-400)] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--copper-400)]" />
          </span>
          Sonoma County · North Bay California
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="text-[2.75rem] leading-[1.04] sm:text-6xl md:text-7xl font-bold text-white mb-7"
        >
          Built for local business.
          <br />
          <span className="text-gradient-copper">Built to last.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Custom websites, IT support, and cybersecurity for Sonoma County
          businesses. Enterprise-grade thinking — without the enterprise price tag.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="btn-copper group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold"
          >
            Get a Free Consultation
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-base font-semibold text-white glass-dark transition-colors hover:bg-white/[0.09]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See Our Services
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {trust.map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-2 text-sm text-white/55"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <t.icon size={15} className="text-[var(--copper-400)]" />
              {t.label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <span className="w-1 h-2 rounded-full bg-[var(--copper-400)] animate-[bob_1.6s_ease-in-out_infinite]" />
        </span>
      </motion.a>

      {/* Bottom fade into linen */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--linen)] to-transparent" />
    </section>
  );
}
