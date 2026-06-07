"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe, ShieldCheck, Cloud } from "lucide-react";

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
};

const PROJECTS: Project[] = [
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
  // Only render tiles backed by a real, client-approved screenshot. Until those
  // exist, show nothing rather than a wall of empty gradient "Preview" frames —
  // they read as unfinished and undercut credibility on a sales page. Drop an
  // `image` onto any project (see the header note) and the section returns
  // automatically.
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
            Project previews across web, IT, and security. Screenshots of live
            client work are on the way.
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
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-md bg-[#F97316] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ea6c0a]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start your project <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
