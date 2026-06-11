"use client";

import { motion, useReducedMotion } from "framer-motion";

const stats = [
  {
    value: "< 1 day",
    label: "Average response time",
    sub: "We pick up the phone and reply to emails fast — always within one business day.",
  },
  {
    value: "2–3 wks",
    label: "Typical website launch",
    sub: "From kickoff to live — no month-long waits or endless revision cycles.",
  },
  {
    value: "100%",
    label: "Custom-coded, no templates",
    sub: "Every site is hand-built for your business. No page builders, no shared themes.",
  },
  {
    value: "Nationwide",
    label: "Remote-friendly, locally rooted",
    sub: "Based in Sonoma County, CA — we work remotely across the U.S. and show up on-site in the North Bay when it matters.",
  },
];

export default function Stats() {
  const reduce = useReducedMotion();
  return (
    <section className="py-14 sm:py-16 bg-[#18181B]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What to expect
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What working with us actually looks like
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
              className="bg-[#18181B] px-8 py-10 flex flex-col gap-3"
            >
              <p
                className="text-4xl md:text-5xl font-bold text-[#F97316] leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.value}
              </p>
              <p
                className="text-sm font-semibold text-white/90 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.label}
              </p>
              <p
                className="text-xs text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
