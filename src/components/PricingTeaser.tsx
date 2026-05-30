"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Foundation",
    range: "$1.5k – $4k",
    tag: "Websites",
    items: ["Custom-coded site", "Mobile-first", "Local SEO"],
  },
  {
    name: "Core Operations",
    range: "$800 – $2.5k/mo",
    tag: "IT Support",
    items: ["Network & cloud", "Automation", "Staff support"],
    featured: true,
  },
  {
    name: "Security & Dev",
    range: "$600 – $12k+",
    tag: "Cyber + Apps",
    items: ["Security audits", "Custom apps", "Compliance"],
  },
];

export default function PricingTeaser() {
  return (
    <section id="pricing" className="py-24 bg-[#FAFAF9]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transparent Pricing
          </p>
          <h2
            className="text-4xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What might it cost?
          </h2>
          <p
            className="text-[#3F3F46]/60 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            All flat-fee. No hourly billing surprises. Here&apos;s a rough guide — answer
            4 quick questions for a personalized estimate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-xl p-7 flex flex-col ${
                t.featured
                  ? "bg-[#18181B] text-white shadow-xl"
                  : "bg-white border border-[#18181B]/8"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-3 self-start ${
                  t.featured ? "bg-[#F97316]/20 text-[#F97316]" : "bg-[#18181B]/8 text-[#18181B]/50"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.tag}
              </span>
              <p
                className={`text-sm font-semibold mb-1 ${t.featured ? "text-white/60" : "text-[#3F3F46]/50"}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.name}
              </p>
              <p
                className={`text-3xl font-black mb-5 ${t.featured ? "text-white" : "text-[#18181B]"}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.range}
              </p>
              <ul className="space-y-2 flex-1">
                {t.items.map(item => (
                  <li
                    key={item}
                    className={`flex items-center gap-2 text-sm ${t.featured ? "text-white/70" : "text-[#3F3F46]/60"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.featured ? "bg-[#F97316]" : "bg-[#18181B]"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#18181B] hover:bg-[#111113] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get a Personalized Estimate <ArrowRight size={15} />
          </Link>
          <p className="text-[#3F3F46]/40 text-xs mt-3" style={{ fontFamily: "var(--font-body)" }}>
            4 questions · no email required · instant ballpark
          </p>
        </div>
      </div>
    </section>
  );
}
