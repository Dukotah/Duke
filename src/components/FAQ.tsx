"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How much does a new website cost?",
    a: "Most small business websites run between $1,500 and $4,500 depending on complexity — number of pages, whether you need a contact form, booking integration, e-commerce, etc. We give you a fixed quote before any work starts, so there are no surprises.",
  },
  {
    q: "Do I need to sign a long-term contract?",
    a: "No. Project work (websites, one-time setups) is a flat fee with no ongoing commitment. For ongoing IT support, we work month-to-month — you stay because it's working, not because you're locked in.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most sites are live within 2–3 weeks of our kickoff call. The biggest factor is how quickly you can provide content (logo, photos, copy). If you need help with that, we can handle it.",
  },
  {
    q: "We already have a website. Can you just fix or improve it?",
    a: "Yes. We can work with what you have — speed improvements, mobile fixes, SEO, security hardening — or rebuild from scratch if it makes more sense. We'll give you an honest recommendation after a quick look.",
  },
  {
    q: "Do you only work with businesses in Sonoma County?",
    a: "Sonoma County is our focus, and most of our clients are in Petaluma, Santa Rosa, and the surrounding area. That said, we work remotely with clients across the North Bay and beyond when the fit is right.",
  },
  {
    q: "What does IT support actually include?",
    a: "It depends on what you need. For most small businesses that means: setting up and managing your network, keeping computers updated and secure, handling cloud storage and backups, troubleshooting day-to-day issues, and being someone you can call when something breaks.",
  },
  {
    q: "How do I get started?",
    a: "Just reach out through the contact form below or call/text (707) 239-6725. We'll have a short conversation about what you're working with, and give you an honest take on what would help — no pitch, no pressure.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#FAFAF9]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Common questions
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Straight answers to what most people want to know before reaching out.
          </p>
        </motion.div>

        <div className="divide-y divide-[#18181B]/8">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span
                  className="text-base font-semibold text-[#18181B]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {faq.q}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#18181B]/5 flex items-center justify-center transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  <Plus size={14} className="text-[#18181B]" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pb-5 text-[#3F3F46]/70 leading-relaxed"
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
