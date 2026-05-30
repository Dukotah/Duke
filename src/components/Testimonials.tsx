"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we've already gotten three new inquiries through the site.",
    name: "Maria T.",
    business: "Owner, Petaluma Home Staging Co.",
    rating: 5,
  },
  {
    quote:
      "I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we'd had for years. Fixed it same day, no drama.",
    name: "James R.",
    business: "Principal, Santa Rosa Insurance Group",
    rating: 5,
  },
  {
    quote:
      "We moved our whole office to the cloud and it was seamless. Duke handled everything — setup, staff training, the works. Our team was up and running in a day.",
    name: "Sandra K.",
    business: "Office Manager, Sebastopol Family Dental",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-[#F97316] text-[#F97316]" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
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
            What clients say
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Real results from Sonoma County businesses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#FAFAF9] border border-[#18181B]/5 rounded-xl p-8 flex flex-col gap-5"
            >
              <Stars count={t.rating} />
              <p
                className="text-[#3F3F46] leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p
                  className="text-sm font-semibold text-[#18181B]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs text-[#3F3F46]/50 mt-0.5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.business}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
