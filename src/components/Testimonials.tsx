"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — NOT REAL CUSTOMER QUOTES.
 *
 * These are illustrative samples kept here for reference ONLY. The section
 * does NOT render while only sample content exists (see SHOW_REAL_REVIEWS
 * below). Disclosed-fake proof is worse than no proof at all on a sales page.
 *
 * HOW TO ENABLE THIS SECTION (three steps):
 *   1. Replace each entry in REAL_TESTIMONIALS below with a genuine,
 *      client-approved quote. Use their real name + business name.
 *   2. Get written permission from each client (email/text is fine).
 *   3. Flip SHOW_REAL_REVIEWS to `true`. The section appears automatically.
 *
 * Legal note: publishing fabricated endorsements as genuine violates the FTC's
 * rule on fake/AI-generated reviews (16 CFR Part 465) and California's
 * unfair-competition / false-advertising laws.
 */

type Testimonial = {
  quote: string;
  author: string;
  business: string;
  location: string;
};

/**
 * Replace the empty array with real, client-approved testimonials, then
 * set SHOW_REAL_REVIEWS to `true` to make the section appear.
 */
const REAL_TESTIMONIALS: Testimonial[] = [
  // Example shape — replace with real quotes:
  // {
  //   quote: "...",
  //   author: "Jane Smith",
  //   business: "Smith Plumbing",
  //   location: "Petaluma",
  // },
];

/**
 * Set to `true` once every entry in REAL_TESTIMONIALS is a genuine,
 * client-approved quote. The section renders only when this is true AND
 * REAL_TESTIMONIALS has at least one entry.
 */
const SHOW_REAL_REVIEWS = false;

export default function Testimonials() {
  // Do not render while only sample/placeholder content exists.
  // Disclosed-fake proof signals inauthenticity to prospects and risks legal
  // exposure. This section lights up automatically once real reviews are added:
  // populate REAL_TESTIMONIALS and flip SHOW_REAL_REVIEWS to true above.
  if (!SHOW_REAL_REVIEWS || REAL_TESTIMONIALS.length === 0) return null;

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
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-on-light"
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
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {REAL_TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-[#18181B]/10 bg-[#FAFAF9] p-7"
            >
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
                  {t.business} &mdash; {t.location}, Sonoma County
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
