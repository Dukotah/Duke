"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * HowItWorks — the websites-first narrative, told in three steps.
 *
 * HERO EFFECT for this viewport (ELEVATED_DESIGN_PLAYBOOK §3 HowItWorks):
 * self-drawing copper SVG connectors between the steps + staggered step reveal.
 *
 * Desktop: a horizontal, viewBox-based SVG (no fixed px → CLS 0) whose copper
 * path segments draw themselves between the step nodes via framer-motion
 * `pathLength`. Steps fade/rise in on a `staggerChildren` cascade so each card
 * arrives roughly as its incoming connector finishes drawing.
 *
 * Mobile: the SVG is dropped entirely (cheaper, no janky path render on phones)
 * in favor of a static CSS vertical dashed copper line behind the stacked steps.
 *
 * Reduced motion: full strokes + all cards render instantly — still composed,
 * still on-brand sitting perfectly still.
 *
 * once:true everywhere → reveals never re-fire (no re-draw CLS).
 */

const steps = [
  {
    number: "01",
    title: "We design & launch",
    body: "We craft your site, write the copy, wire up the forms, and ship it — fast. You approve the look; we handle the build, the hosting, and the launch end to end.",
  },
  {
    number: "02",
    title: "We host, secure & update",
    body: "Your site lives on managed hosting we own. Updates, backups, security patches, uptime monitoring — folded into one flat monthly plan, never an hourly surprise.",
  },
  {
    number: "03",
    title: "We keep improving it",
    body: "A website is never finished. We tune performance, refresh content, add pages, and fold in IT, security, and AI as your business grows — handled, for life.",
  },
];

// Step cascade. The container staggers children; each step fades + rises.
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Self-drawing connector segment (desktop SVG). Draws from 0 → full length.
const connectorVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.3, ease: [0.65, 0, 0.35, 1] },
      opacity: { duration: 0.25 },
    },
  },
};

export default function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-ink-0 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center sm:mb-20"
        >
          <span
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.22em] text-copper-bright"
            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
          >
            How it works
          </span>
          <h2
            className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            One partner, the whole way through
          </h2>
          <p
            className="text-pretty text-lg leading-relaxed text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            From the first pixel to the thousandth update — your website is
            handled, for life.
          </p>
        </motion.div>

        {/* Steps + connectors */}
        <motion.ol
          variants={reduce ? undefined : containerVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, amount: 0.3 }}
          className="relative grid gap-12 md:grid-cols-3 md:gap-8"
        >
          {/* Desktop: self-drawing horizontal copper connectors (viewBox → CLS 0).
              Sits behind the step nodes, spanning the two gaps between three
              circles. Hidden on mobile in favor of the CSS dashed line below. */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute left-0 top-7 hidden w-full md:block"
            style={{ height: "2px" }}
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            {/* gap 1: between step 01 and 02 (center ~16.6% → ~50%) */}
            <motion.line
              x1="20"
              y1="0.5"
              x2="46"
              y2="0.5"
              stroke="var(--copper)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
              variants={reduce ? undefined : connectorVariants}
              initial={reduce ? false : "hidden"}
            />
            {/* gap 2: between step 02 and 03 (center ~50% → ~83.3%) */}
            <motion.line
              x1="54"
              y1="0.5"
              x2="80"
              y2="0.5"
              stroke="var(--copper)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
              variants={reduce ? undefined : connectorVariants}
              initial={reduce ? false : "hidden"}
            />
          </svg>

          {/* Mobile: static CSS vertical dashed copper line behind the stack.
              Cheaper than animating an SVG path on phones; runs the full height
              between the first and last step nodes. */}
          <span
            aria-hidden="true"
            className="absolute left-7 top-7 bottom-7 w-px md:hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, var(--copper) 0 6px, transparent 6px 12px)",
              opacity: 0.5,
            }}
          />

          {steps.map((s) => (
            <motion.li
              key={s.number}
              variants={reduce ? undefined : stepVariants}
              className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
            >
              {/* Step number node */}
              <div
                className="surface-2 relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full md:mb-6"
                style={{ borderColor: "var(--copper-dim)" }}
              >
                <span
                  className="text-base font-bold text-copper-bright"
                  style={{
                    fontFamily: "var(--font-mono, var(--font-heading))",
                  }}
                >
                  {s.number}
                </span>
              </div>

              {/* Copy */}
              <div className="md:max-w-xs">
                <h3
                  className="mb-2 text-lg font-bold text-warm sm:text-xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-warm-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
