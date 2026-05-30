"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How much does a new website cost?",
    a: "Most small business websites built with Copper Bay Tech fall in the $1,500–$4,000 range depending on complexity. You'll get a flat-fee quote upfront — no surprises. We don't do hourly billing for project work.",
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
    q: "Do you only work with businesses in Sonoma County?",
    a: "We prioritize local Sonoma County businesses because in-person support matters for IT work. That said, web development and remote IT support are available to clients throughout California.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Common questions
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Straight answers
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            What most people want to know before reaching out.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-[#18181B]/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-[#FAFAF9] hover:bg-[#F4F4F2] transition-colors"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
              >
                <span
                  className="text-base font-semibold text-[#18181B] pr-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.q}
                </span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#18181B]/8 flex items-center justify-center" aria-hidden="true">
                  {open === i ? (
                    <Minus size={12} color="#18181B" />
                  ) : (
                    <Plus size={12} color="#18181B" />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p
                      className="px-6 py-5 text-sm text-[#3F3F46]/70 leading-relaxed border-t border-[#18181B]/8 bg-white"
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
