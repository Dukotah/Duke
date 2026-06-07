"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { PRICING } from "@/config/pricing";
import { track } from "@/lib/analytics";

const trustSignals = [
  "Custom websites",
  "Managed IT support",
  "Cybersecurity",
];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#18181B]">
      {/* Topographic line pattern */}
      <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
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

      {/* Ambient glow accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-28 pb-24 text-center">
        <motion.div
          // Start mostly-visible (not from 0) and finish fast so the headline is
          // legible almost immediately — a slow fade from black read as a
          // sluggish, brownish first impression. Respect reduced-motion.
          initial={reduceMotion ? false : { opacity: 0.7, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span
            className="mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              backgroundColor: "rgba(200,169,110,0.12)",
              color: "#F97316",
              border: "1px solid rgba(200,169,110,0.28)",
              fontFamily: "var(--font-heading)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping motion-reduce:animate-none rounded-full bg-[#F97316] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F97316]" />
            </span>
            Sonoma County · North Bay California
          </span>

          <h1
            className="mb-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for local business.
            <br />
            <span className="bg-gradient-to-r from-[#F97316] to-[#fbb46a] bg-clip-text text-transparent">
              Built to last.
            </span>
          </h1>

          <p
            className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 md:text-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Custom websites, IT support, and cybersecurity for Sonoma County
            businesses. Enterprise-grade thinking — without the enterprise price tag.
          </p>

          {/* Price transparency — our biggest differentiator: every local competitor
              hides pricing behind a call. We publish it. Numbers from config/pricing.ts. */}
          <p
            className="mx-auto mb-9 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm font-semibold text-white/85 sm:text-base"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span>Websites from <span className="text-[#F97316]">{PRICING.web.startingAt}</span></span>
            <span aria-hidden className="text-white/30">·</span>
            <span>Managed IT from <span className="text-[#F97316]">{PRICING.it.startingAt}{PRICING.it.unit}</span></span>
            <span aria-hidden className="text-white/30">·</span>
            <span className="font-medium text-white/55">Prices published, no hourly billing</span>
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={BOOKING_URL}
              onClick={() => track("cta_book_call", { location: "hero" })}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#F97316]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea6c0a] hover:shadow-xl hover:shadow-[#F97316]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Free Call
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#contact"
              onClick={() => track("cta_message", { location: "hero" })}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Send a Message
            </a>
          </div>

          {/* Lowest-friction conversion for local buyers: tap to call. */}
          <p
            className="mt-5 text-sm text-white/55"
            style={{ fontFamily: "var(--font-body)" }}
          >
            or call{" "}
            <a
              href={PHONE_HREF}
              onClick={() => track("cta_call_phone", { location: "hero" })}
              className="font-semibold text-white underline-offset-4 transition-colors hover:text-[#F97316] hover:underline focus-visible:outline-none focus-visible:underline"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {PHONE}
            </a>
          </p>

          {/* Above-the-fold trust signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustSignals.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm text-white/55"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <svg className="h-4 w-4 text-[#F97316]" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade into the page */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
    </section>
  );
}
