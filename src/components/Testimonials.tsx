"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — NOT REAL CUSTOMER QUOTES.
 *
 * These are illustrative samples so the section looks complete during build.
 * Before this goes live in production you MUST replace each entry with a real,
 * client-APPROVED quote. Publishing fabricated endorsements as if they were
 * genuine violates the FTC's rule on fake/AI-generated reviews (16 CFR Part
 * 465) and California's unfair-competition / false-advertising laws.
 *
 * How to make these real, fast:
 *   1. Send the happy client the draft quote below.
 *   2. Get a one-line "yes, you can use this" in writing (email/text is fine).
 *   3. Replace `quote`, and switch `author` to their real name + business.
 *
 * Until then these use role + town attribution (no invented names) and the
 * `Sample` flag drives a small visual marker so nobody mistakes them for live
 * testimonials.
 */
const PLACEHOLDER_TESTIMONIALS = [
  {
    quote:
      "Our old site took eight seconds to load and half our contact forms vanished into spam. They rebuilt the whole thing in under two weeks — it's fast now, and we're actually getting inquiries through it.",
    author: "Owner, home-services business",
    location: "Petaluma",
  },
  {
    quote:
      "We used to wait days for our old IT guy to call back. Now I send one message and get an answer the same hour. For a small office, that responsiveness is everything.",
    author: "Office manager, professional-services firm",
    location: "Santa Rosa",
  },
  {
    quote:
      "The audit found two open ports and four-year-old router firmware we had no idea about. Fixed the same day, with a written report I could actually understand. Worth every penny.",
    author: "Principal, insurance practice",
    location: "Sebastopol",
  },
];

// Flip to `false` once every quote above is a real, client-approved testimonial.
const SHOW_SAMPLE_MARKER = true;

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#F97316]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            In their words
          </p>
          <h2
            className="text-4xl font-bold leading-tight text-[#18181B] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What it&apos;s like to work with us.
          </h2>
          {SHOW_SAMPLE_MARKER && (
            <p
              className="mx-auto mt-4 max-w-md text-xs text-[#3F3F46]/40"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Sample copy shown during launch — replaced with named, client-approved quotes.
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLACEHOLDER_TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-[#18181B]/10 bg-[#FAFAF9] p-7"
            >
              {SHOW_SAMPLE_MARKER && (
                <span
                  className="absolute right-4 top-4 rounded-full bg-[#18181B]/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3F3F46]/45"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Sample
                </span>
              )}
              <div className="mb-4 flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} className="fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <blockquote
                className="flex-1 text-[15px] leading-relaxed text-[#3F3F46]/80"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-[#18181B]/[0.08] pt-4">
                <p
                  className="text-sm font-semibold text-[#18181B]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.author}
                </p>
                <p
                  className="text-xs text-[#3F3F46]/45"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.location}, Sonoma County
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
