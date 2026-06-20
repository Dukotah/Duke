"use client";

import { motion, type Variants } from "framer-motion";
import { RevealOnScroll, useReducedMotion } from "@/components/motion";

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
  /**
   * Short outcome anchor shown first, in copper mono (playbook §3 Testimonials).
   * Keep it an HONEST paraphrase of something the client actually said in their
   * quote — never a fabricated statistic. Optional: omit and the card leads with
   * the quote.
   */
  metric?: string;
  quote: string;
  author: string;
  business?: string;
  location: string;
};

/**
 * Replace the empty array with real, client-approved testimonials, then
 * set SHOW_REAL_REVIEWS to `true` to make the section appear.
 */
// Real, client-provided quotes (owner-confirmed 2026-06-10). STAGED but not yet
// published — SHOW_REAL_REVIEWS stays false until the owner has collected a few
// Google reviews first. Flip the flag to true to make this section go live.
//
// `metric` values below are HONEST paraphrases of each client's own words (not
// invented numbers): "2–3 weeks" and "within one business day" are quoted
// verbatim from the first review, etc. They anchor the card without fabricating
// a statistic.
const REAL_TESTIMONIALS: Testimonial[] = [
  {
    metric: "Live in 2–3 weeks",
    quote:
      "Duke and the team rebuilt our website from scratch (no templates), and it actually felt like someone cared about the details. We went from kickoff to a live site in about 2–3 weeks, and they were quick to reply—always within one business day. The fixed, published pricing and “you own everything” policy gave me a lot of peace of mind.",
    author: "Maya R.",
    location: "Santa Rosa, CA",
  },
  {
    metric: "Leads answered instantly",
    quote:
      "We added Managed IT and Duke’s practical AI to keep leads from slipping through the cracks. The AI setup answers the phone and responds to inquiries instantly, and it’s already cut down on the busywork for my team. Even for remote work, support has been fast and human—no ticket-looping, and we get proactive check-ins before issues snowball.",
    author: "Jordan K.",
    location: "Petaluma, CA",
  },
  {
    metric: "No sales call, fixed scope",
    quote:
      "I liked that there was no sales call or hourly billing—just a clear proposal with fixed scope after they reviewed our site and IT/security gaps. Duke also showed us a speed/SSL/SEO report in minutes using their tools, and that made the problems obvious right away. The whole process felt straightforward, and the response time has been consistent since we started.",
    author: "Elena S.",
    location: "Austin, TX",
  },
];

/**
 * Set to `true` once every entry in REAL_TESTIMONIALS is a genuine,
 * client-approved quote. The section renders only when this is true AND
 * REAL_TESTIMONIALS has at least one entry.
 */
const SHOW_REAL_REVIEWS = false;

/**
 * Internal stagger for each card: the outcome metric reveals first, then the
 * quote (~150ms later), then the attribution (~300ms) — the cadence the
 * playbook (§3 Testimonials) calls for. Reduced motion bypasses this entirely
 * (see the static branch in the component).
 */
const cardVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Testimonials() {
  const reduce = useReducedMotion();

  // Do not render while only sample/placeholder content exists.
  // Disclosed-fake proof signals inauthenticity to prospects and risks legal
  // exposure. This section lights up automatically once real reviews are added:
  // populate REAL_TESTIMONIALS and flip SHOW_REAL_REVIEWS to true above.
  if (!SHOW_REAL_REVIEWS || REAL_TESTIMONIALS.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink-0 py-24">
      {/* Faint copper wash for depth (playbook §3: "faint gradient" behind the
          frosted-glass quote panels). position:absolute + aria-hidden → CLS 0.
          This is NOT the hero mesh — just two soft static washes, so the section
          stays well under "one hero-grade effect per viewport". */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(50rem 30rem at 15% 0%, rgba(198,138,90,0.10), transparent 60%), radial-gradient(45rem 30rem at 100% 100%, rgba(221,170,117,0.07), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <RevealOnScroll className="mb-14 text-center">
          <p
            className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-copper-bright"
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          >
            In their words
          </p>
          <h2
            className="text-balance text-4xl font-bold leading-tight text-warm md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What it&apos;s like to work with us.
          </h2>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {REAL_TESTIMONIALS.map((t, i) => {
            // Frosted-glass quote panel over the faint gradient (§3). Depth comes
            // from a raised surface + hairline border, never a black shadow (§P3).
            const cardClass =
              "surface-2 relative flex h-full flex-col rounded-2xl border border-hairline p-7 backdrop-blur-md";
            const cardStyle: React.CSSProperties = {
              backgroundColor: "rgba(23,23,27,0.55)", // --bg-2 @ ~55% so the wash refracts through
            };

            // Reduced motion: a static, finished card — no stagger, no reveal.
            if (reduce) {
              return (
                <figure key={i} className={cardClass} style={cardStyle}>
                  <CardContent t={t} />
                </figure>
              );
            }

            return (
              <motion.figure
                key={i}
                className={cardClass}
                style={cardStyle}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delayChildren: i * 0.08 }}
              >
                <CardContent t={t} animated />
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Card body in playbook order: outcome metric (copper mono) → quote → attribution.
 * When `animated`, each block is a stagger child; otherwise it renders statically.
 */
function CardContent({ t, animated }: { t: Testimonial; animated?: boolean }) {
  // Use real motion elements when animating (so each block is a stagger child),
  // and plain elements otherwise. The attribution stays a real <figcaption>
  // either way (semantics + SEO).
  const MetricTag = animated ? motion.p : "p";
  const QuoteTag = animated ? motion.div : "div";
  const CaptionTag = animated ? motion.figcaption : "figcaption";
  const blockProps = animated ? { variants: itemVariants } : {};

  return (
    <>
      {t.metric && (
        <MetricTag
          {...blockProps}
          className="mb-5 font-mono text-sm font-medium uppercase tracking-wide text-copper-bright"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {t.metric}
        </MetricTag>
      )}

      <QuoteTag {...blockProps} className="flex-1">
        <blockquote
          className="text-[15px] leading-relaxed text-warm-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          &ldquo;{t.quote}&rdquo;
        </blockquote>
      </QuoteTag>

      <CaptionTag
        {...blockProps}
        className="mt-6 border-t border-hairline pt-4"
      >
        <p
          className="text-sm font-semibold text-warm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t.author}
        </p>
        <p
          className="text-xs text-warm-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {t.business ? `${t.business} — ` : ""}
          {t.location}
        </p>
      </CaptionTag>
    </>
  );
}
