"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  return (
    <section className="py-24 bg-ink-1">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Most local businesses are one IT problem
            <br className="hidden md:block" /> away from a bad week.
          </h2>
          <p
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
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
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
              className="bg-ink-2 rounded-xl p-8 border border-hairline"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p.icon size={22} color="#DDAA75" />
              </div>
              <h3
                className="text-lg font-semibold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {p.title}
              </h3>
              <p
                className="text-zinc-400 leading-relaxed text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 text-zinc-400 text-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          We fix that — without the enterprise price tag.
        </motion.p>
      </div>
    </section>
  );
}
