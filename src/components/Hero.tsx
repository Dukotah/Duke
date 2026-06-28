"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  MeshGradient,
  MagneticCTA,
  RevealOnScroll,
  useReducedMotion,
} from "@/components/motion";
import { track } from "@/lib/analytics";

// Second-line words reveal one at a time over a copper gradient-clip. Kept in
// markup (real text), so the headline is still server-rendered for LCP and the
// stagger is the only thing the client adds.
const LINE_TWO = ["Handled", "for", "life."];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-0 md:min-h-screen">
      {/* Flagship background — drifting copper mesh + cursor spotlight (desktop).
          position:absolute / aria-hidden → CLS 0, never blocks the headline LCP.
          Mobile: orbs only (blur halved), spotlight off. RM: perfectly still. */}
      <MeshGradient spotlight blur={80} />

      {/* Bottom fade into the next (dark) section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-ink-0 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-20 sm:pt-32 sm:pb-28">
        {/* Eyebrow */}
        <RevealOnScroll
          as="p"
          direction="up"
          distance={10}
          duration={0.5}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-copper-bright opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-copper-bright" />
          </span>
          A website that brings you customers
        </RevealOnScroll>

        {/*
          THE LCP. The <h1> text is fully present in server-rendered markup and
          paints first as plain warm text — it never waits on the mesh or any
          animation. The second line's per-word reveal and the copper
          gradient-clip are layered on after paint; under reduced motion the
          words simply appear (clip kept, animation dropped).
        */}
        <h1
          className="max-w-4xl text-balance text-[2.6rem] font-bold leading-[1.05] tracking-tight text-warm sm:text-6xl md:text-7xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="block">More customers.</span>
          <span className="mt-1 block text-balance">
            {LINE_TWO.map((word, i) => (
              <motion.span
                key={word}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.5 + i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-[0.28em] inline-block bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Self-drawing copper hairline — the "handled" gesture, one connector
            drawn by hand. Renders complete instantly under reduced motion. */}
        <svg
          aria-hidden
          width="220"
          height="8"
          viewBox="0 0 220 8"
          fill="none"
          className="mt-6 block"
        >
          <motion.path
            d="M1 5 Q 80 1 219 4"
            stroke="var(--copper)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: reduce ? 0 : 1.2,
              delay: reduce ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>

        <RevealOnScroll
          as="p"
          direction="up"
          delay={reduce ? 0 : 0.15}
          distance={12}
          className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2 md:text-xl"
          style={{ fontFamily: "var(--font-body)" }}
        >
          We build you a site that gets found and gets the phone ringing — then
          run the hosting, updates, security and improvements for good. You run
          your business; we bring you the customers.
        </RevealOnScroll>

        {/* CTAs. The primary is reachable and clickable the instant it paints —
            the magnetic drift / shine is pure enhancement on capable pointers. */}
        <RevealOnScroll
          as="div"
          direction="up"
          delay={reduce ? 0 : 0.25}
          distance={12}
          className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <MagneticCTA
            as="link"
            href="/audit"
            onClick={() => track("cta_start_audit", { location: "hero" })}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-4 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 motion-safe:max-md:active:scale-[0.97]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start a free audit
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </MagneticCTA>

          <Link
            href="/work"
            onClick={() => track("cta_see_work", { location: "hero" })}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-4 text-base font-semibold text-warm underline-offset-4 transition-colors duration-200 hover:text-copper-bright hover:underline focus-visible:outline-none focus-visible:underline motion-safe:max-md:active:scale-[0.97]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See our work
            <ArrowRight size={16} aria-hidden className="opacity-70" />
          </Link>
        </RevealOnScroll>

        {/* Trust metric — the one copper line that anchors scale before the ask. */}
        <RevealOnScroll
          as="p"
          direction="up"
          delay={reduce ? 0 : 0.35}
          distance={10}
          className="mt-12 text-sm text-warm-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="font-semibold text-copper-bright">
            Trusted by 42 Sonoma County businesses
          </span>
          <span className="mx-2 text-warm-3" aria-hidden>
            ·
          </span>
          <span>websites, handled for life</span>
        </RevealOnScroll>
      </div>
    </section>
  );
}
