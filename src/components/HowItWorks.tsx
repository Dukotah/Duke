"use client";

import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "30-Minute Call",
    body: "We assess your current setup and document what we find — website, IT, and security gaps included. No obligation, no sales pitch.",
  },
  {
    number: "02",
    title: "Flat-Fee Proposal",
    body: "Within 48 hours you receive a written proposal with fixed pricing in plain English. No hourly billing surprises, no scope creep without your sign-off.",
  },
  {
    number: "03",
    title: "Ongoing Partnership",
    body: "You get Duke directly — not a ticket system. Calls back same day, on-site when needed, and proactively ahead of issues before they cost you.",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How it works
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Simple, transparent, and built around your schedule.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-[#18181B]/15" />

          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                style={{ backgroundColor: "#18181B" }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                >
                  {s.number}
                </span>
              </div>
              <h3
                className="text-xl font-bold text-[#18181B] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-[#3F3F46]/60 leading-relaxed text-sm max-w-xs mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
