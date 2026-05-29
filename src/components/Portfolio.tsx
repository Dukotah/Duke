"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Portfolio() {
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
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our work
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Case studies coming soon. We&apos;re currently heads-down with new clients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl bg-[#18181B] p-12 text-center"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Now Accepting New Clients
          </p>
          <h3
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to be our next success story?
          </h3>
          <p
            className="text-white/60 max-w-lg mx-auto mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We&apos;re selectively taking on new clients in Sonoma County. If you have a
            project in mind — or just want a second opinion on your current setup —
            reach out. No obligation.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start a conversation <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
