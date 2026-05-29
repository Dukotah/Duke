"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Free Consultation",
    body: "We learn your situation — your current setup, what's frustrating you, and what you actually need. No obligation, no sales pitch.",
  },
  {
    number: "02",
    title: "Clear Proposal",
    body: "You get a flat-fee or retainer proposal in plain English. No surprise invoices, no scope creep without conversation.",
  },
  {
    number: "03",
    title: "Ongoing Partnership",
    body: "You get a real person — not a ticket number. We're reachable, we show up, and we stay involved as your business grows.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F5F4F0]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1C3A5E] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How it works
          </h2>
          <p
            className="text-lg text-[#1A1A1A]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Simple, transparent, and built around your schedule.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-[#1C3A5E]/15" />

          {steps.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                style={{ backgroundColor: "#1C3A5E" }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#C8A96E", fontFamily: "var(--font-heading)" }}
                >
                  {s.number}
                </span>
              </div>
              <h3
                className="text-xl font-bold text-[#1C3A5E] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-[#1A1A1A]/60 leading-relaxed text-sm max-w-xs mx-auto"
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
