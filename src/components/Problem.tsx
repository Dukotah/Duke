"use client";

import { motion } from "framer-motion";
import { Gauge, WifiOff, HelpCircle } from "lucide-react";

const problems = [
  {
    icon: Gauge,
    title: "Your website is losing you customers",
    body: "A site that loads slowly or looks broken on a phone sends visitors straight to your competitor. Most local business sites fail this test.",
  },
  {
    icon: WifiOff,
    title: "Your network was set up and forgotten",
    body: "If the last time someone looked at your Wi-Fi or firewall was years ago, you're running on trust — not security.",
  },
  {
    icon: HelpCircle,
    title: "You don't know if your data is safe",
    body: "Backups that were never tested, old passwords, and unpatched software are the most common causes of small business data loss.",
  },
];

export default function Problem() {
  return (
    <section className="py-24 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="eyebrow text-gradient-copper mb-4">The reality check</p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Most local businesses are one IT problem
            <br className="hidden md:block" /> away from a bad week.
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            These aren&apos;t rare edge cases. They&apos;re the default state for businesses
            that haven&apos;t had a dedicated tech partner.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-premium p-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.16), rgba(232,133,58,0.12))", border: "1px solid rgba(232,133,58,0.2)" }}
              >
                <p.icon size={22} color="var(--copper-600)" />
              </div>
              <h3
                className="text-lg font-semibold text-[#18181B] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {p.title}
              </h3>
              <p
                className="text-[#3F3F46]/60 leading-relaxed text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 text-[#3F3F46]/50 text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          We fix that — without the enterprise price tag.
        </motion.p>
      </div>
    </section>
  );
}
