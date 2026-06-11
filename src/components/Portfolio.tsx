"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, ShieldCheck, Cloud } from "lucide-react";
import { BOOKING_URL } from "@/config/site";

/**
 * ⚠️ PLACEHOLDER PORTFOLIO — NO REAL PROJECT SCREENSHOTS YET.
 *
 * This grid is real infrastructure built to hold real work later, but every
 * entry below is a CLEARLY-LABELED sample. Each tile shows a styled mockup
 * frame (gradient placeholder) with a visible "Preview" tag, NOT a screenshot
 * of an actual client's site. The titles are generic project *types* — there
 * are NO invented client names and NO claimed results.
 *
 * HOW TO DROP IN REAL SCREENSHOTS (do this before launch):
 *   1. Export each screenshot and place the file in /public
 *      (e.g. /public/portfolio/petaluma-staging.jpg).
 *   2. In the PROJECTS array below, set `image` to that path
 *      (e.g. image: "/portfolio/petaluma-staging.jpg").
 *   3. Optionally set `url` to the live site so the tile links out.
 *   4. Once a tile has a real, client-APPROVED screenshot, drop its `sample`
 *      flag (or remove it) so the "Preview" tag disappears for that tile.
 *
 * Presenting placeholder mockups as if they were genuine client deliverables
 * would be misleading advertising (FTC 16 CFR Part 465 / California false-
 * advertising law) — keep the "Preview" markers until the work is real.
 */

type Project = {
  title: string;
  category: string;
  icon: typeof Globe;
  /** Set to a /public path once a real, client-approved screenshot exists. */
  image?: string;
  /** Live site URL, if the project is public and the client has approved linking. */
  url?: string;
  /** A subtle gradient for the placeholder frame while no `image` is set. */
  gradient: string;
  /** Leave true until this tile holds a real, approved screenshot. */
  sample: boolean;
  /** Optional one-liner shown below the title. */
  description?: string;
};

const PROJECTS: Project[] = [
  /**
   * Self-showcase entry — this is a truthful, first-party example.
   * copperbaytech.com is built and maintained by Copper Bay Tech on the same
   * custom Next.js + Tailwind stack used for client sites. The OG image at
   * /public/og-image.png is the real brand asset; no screenshot is fabricated.
   * `sample` is false because this is not a placeholder — it's real work.
   *
   * HOW TO ADD CLIENT PROJECTS:
   *   1. Export a screenshot and save it under /public/portfolio/<name>.jpg
   *   2. Add an entry below with `image` pointing to that path and `sample: false`
   *   3. Set `url` to the live site if the client has approved linking
   */
  {
    title: "copperbaytech.com — this site",
    category: "Web Development",
    icon: Globe,
    image: "/og-image.png",
    url: "https://copperbaytech.com",
    gradient: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
    sample: false,
    description: "Built with the same custom stack we build for clients — Next.js, Tailwind, edge-deployed, Lighthouse 95+.",
  },
  // Sample entries below are hidden until real client screenshots are added.
  // Drop in an `image` path and set `sample: false` to publish a tile.
  {
    title: "Service business website rebuild",
    category: "Web Development",
    icon: Globe,
    gradient: "linear-gradient(135deg, #18181B 0%, #3F3F46 100%)",
    sample: true,
  },
  {
    title: "Small-office security assessment",
    category: "Cybersecurity",
    icon: ShieldCheck,
    gradient: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    sample: true,
  },
  {
    title: "Cloud migration & staff onboarding",
    category: "IT Support & Cloud",
    icon: Cloud,
    gradient: "linear-gradient(135deg, #292524 0%, #44403C 100%)",
    sample: true,
  },
  {
    title: "Booking-driven local landing page",
    category: "Web Development",
    icon: Globe,
    gradient: "linear-gradient(135deg, #1C1917 0%, #57534E 100%)",
    sample: true,
  },
  {
    title: "Managed backup & monitoring setup",
    category: "IT Support & Cloud",
    icon: Cloud,
    gradient: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
    sample: true,
  },
  {
    title: "Phishing-resistant login rollout",
    category: "Cybersecurity",
    icon: ShieldCheck,
    gradient: "linear-gradient(135deg, #0C0A09 0%, #292524 100%)",
    sample: true,
  },
];

export default function Portfolio() {
  const reduce = useReducedMotion();
  // Render only tiles that have a real image — either the self-showcase (which
  // uses the brand OG image) or client projects with an approved screenshot.
  // Sample-only tiles without an image stay hidden so the section never shows
  // empty gradient placeholders on a sales page. The self-showcase entry above
  // always satisfies this filter, so the section is always present.
  const liveProjects = PROJECTS.filter((p) => p.image);
  if (liveProjects.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Work
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A look at what we build.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-[#3F3F46]/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Starting with this site — built on the same custom stack we deliver
            for every client. Client project screenshots are added as work is
            approved for publication.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveProjects.map((p, i) => {
            const Icon = p.icon;
            const Wrapper = p.url ? "a" : "div";
            return (
              <motion.div
                key={p.title}
                initial={reduce ? false : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.08 }}
              >
                <Wrapper
                  {...(p.url ? { href: p.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block overflow-hidden rounded-2xl border border-[#18181B]/10 bg-white transition-shadow hover:shadow-lg"
                >
                  {/* Thumbnail / mockup frame */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- swap for next/image once real assets exist
                      <img
                        src={p.image}
                        alt={`${p.title} — ${p.category}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: p.gradient }}
                        aria-hidden="true"
                      >
                        <Icon size={40} className="text-white/25" />
                      </div>
                    )}

                    {/* "Preview" tag — keep until a real, approved screenshot is in place */}
                    {p.sample && (
                      <span
                        className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#18181B]/70 backdrop-blur"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Preview
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p
                        className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold-on-light"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {p.category}
                      </p>
                      <p
                        className="text-base font-semibold leading-snug text-[#18181B]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {p.title}
                      </p>
                      {p.description && (
                        <p
                          className="mt-1.5 text-xs leading-relaxed text-[#3F3F46]/55"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {p.description}
                        </p>
                      )}
                    </div>
                    {p.url && (
                      <ArrowUpRight
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-[#3F3F46]/40 transition-colors group-hover:text-[#F97316]"
                      />
                    )}
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href={BOOKING_URL}
            className="inline-flex items-center gap-2 rounded-md bg-[#F97316] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ea6c0a]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a free consultation <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
