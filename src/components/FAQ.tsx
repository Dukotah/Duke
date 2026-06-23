"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import JsonLd, { faqSchema } from "@/components/JsonLd";

const faqs = [
  {
    q: "How much does a new website cost?",
    a: "Most small business websites built with Copper Bay Tech fall in the $2,500–$4,500 range, with larger or e-commerce builds up to $7,500. You'll get a flat-fee quote upfront — no surprises. We don't do hourly billing for project work.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "No long-term contracts for project work. Ongoing IT support and security monitoring are month-to-month retainers — cancel anytime with 30 days notice.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most business websites are live in 2–3 weeks. Complex projects or those requiring custom functionality may take 4–6 weeks. We set a timeline before we start and stick to it.",
  },
  {
    q: "We already have a website. Can you just fix or improve it?",
    a: "Absolutely. Whether it's a speed problem, a broken form, an outdated design, or SEO work — we can usually assess your existing site and give you a clear improvement plan within 24 hours.",
  },
  {
    q: "Do you work with businesses outside Sonoma County?",
    a: "Yes — we work with small businesses across the U.S. Web design, cybersecurity, and remote IT support are fully remote, so where you're located doesn't matter. We're based in Sonoma County, CA, so North Bay clients also get on-site, in-person support when hands-on IT work calls for it.",
  },
  {
    q: "What does IT support actually include?",
    a: "It depends on your needs. We offer network setup and management, workstation support, cloud migration, software configuration, vendor coordination, and staff training. Retainer clients get a direct line — not a ticket queue.",
  },
  {
    q: "How do I get started?",
    a: "Fill out the contact form or call/text (707) 239-6725. We'll schedule a free 30-minute call to understand your situation and tell you exactly what we'd recommend. No obligation.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="py-24 bg-ink-0">
      <JsonLd schema={faqSchema(faqs)} />
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Common questions
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Straight answers
          </h2>
          <p
            className="text-lg text-zinc-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            What most people want to know before reaching out.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.05 }}
              className="border border-hairline rounded-xl overflow-hidden"
            >
              <button
                id={`faq-trigger-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-ink-1 hover:bg-ink-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span
                  className="text-base font-semibold text-white pr-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.q}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center">
                  {open === i ? (
                    <Minus size={12} color="#DDAA75" />
                  ) : (
                    <Plus size={12} color="#DDAA75" />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p
                      id={`faq-panel-${i}`}
                      aria-labelledby={`faq-trigger-${i}`}
                      className="px-6 py-5 text-sm text-zinc-300 leading-relaxed border-t border-hairline bg-ink-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
