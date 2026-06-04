"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Cloud, ChevronDown, ChevronUp } from "lucide-react";

type Case = {
  tag: string;
  client: string;
  title: string;
  icon: typeof Globe;
  situation: string;
  what: string[];
  outcome: string;
  quote: string;
  author: string;
  role: string;
  metrics: { label: string; value: string }[];
};

/**
 * ⚠️ ILLUSTRATIVE SAMPLE CASE STUDIES — NOT VERIFIED CLIENT RESULTS.
 *
 * These entries are representative examples written to show the *kind* of work
 * and outcomes we deliver. They are NOT real, named-client engagements and the
 * quotes are NOT real customer endorsements. Attributions use role +
 * business-type + town (no invented personal or business names) and every card
 * carries a visible "Representative example" marker.
 *
 * Before this goes live in production you MUST replace each entry with a real,
 * client-APPROVED case study and quote. Publishing fabricated endorsements or
 * specific results as if they were genuine violates the FTC's rule on
 * fake/AI-generated reviews (16 CFR Part 465) and California's
 * unfair-competition / false-advertising laws.
 *
 * To make these real:
 *   1. Document an actual engagement (situation / what we did / outcome).
 *   2. Get the client's written approval to publish their quote + attribution.
 *   3. Replace the copy below and flip SHOW_SAMPLE_MARKER to `false`.
 */

// Flip to `false` once every case below is a real, client-approved engagement.
const SHOW_SAMPLE_MARKER = true;

const cases: Case[] = [
  {
    tag: "Web Development",
    client: "Home staging business — Petaluma",
    title: "From invisible to booked out — a full website rebuild",
    icon: Globe,
    situation:
      "A thriving home staging business was held back by an embarrassing website. It took 8 seconds to load on mobile, half the contact form submissions went straight to spam, and the design hadn't been touched since 2018 — leads were lost before they ever got in touch.",
    what: [
      "Rebuilt the site from scratch — custom-coded in Next.js, no page builders",
      "Implemented proper spam filtering and tested form delivery end-to-end",
      "Optimized images and eliminated render-blocking scripts — load time dropped from 8s to under 1.5s",
      "Set up Google Business Profile and local SEO targeting Petaluma and surrounding areas",
    ],
    outcome:
      "In an engagement like this, a new site can go live in around 11 days and start surfacing inquiries within weeks — often more than a slow, outdated site generated in a year.",
    quote:
      "Our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — and we started getting new inquiries through the site.",
    author: "Owner, home-staging business",
    role: "Petaluma, Sonoma County",
    metrics: [
      { label: "Load time", value: "8s → 1.4s" },
      { label: "New inquiries in 6 weeks", value: "8" },
      { label: "Days to launch", value: "11" },
    ],
  },
  {
    tag: "Cybersecurity",
    client: "Insurance practice — Santa Rosa",
    title: "Security audit finds two critical vulnerabilities — fixed same day",
    icon: ShieldCheck,
    situation:
      "A firm handling sensitive client financial data had no real sense of its security posture. The router was years old, nobody knew the firmware version, and staff were sharing passwords for key business tools — with no security review since setup.",
    what: [
      "Ran a full network security audit — scanned ports, checked firmware versions, reviewed access controls",
      "Found two open ports that should have been closed and firmware that was 4 years out of date",
      "Updated router firmware and closed the open ports same day",
      "Implemented a password manager across the team and set up MFA on all critical accounts",
      "Provided a written security summary and remediation log for their records",
    ],
    outcome:
      "In an engagement like this, critical issues are typically resolved within hours of discovery, leaving the business with a documented security baseline and a simple quarterly checklist to maintain it.",
    quote:
      "I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we'd had for years. Fixed it same day, no drama.",
    author: "Principal, insurance practice",
    role: "Santa Rosa, Sonoma County",
    metrics: [
      { label: "Vulnerabilities found", value: "2 critical" },
      { label: "Time to fix", value: "Same day" },
      { label: "Firmware lag", value: "4 years behind" },
    ],
  },
  {
    tag: "IT Support & Cloud",
    client: "Dental practice — Sebastopol",
    title: "Full office cloud migration — zero downtime, staff up and running in a day",
    icon: Cloud,
    situation:
      "A 12-person office was running everything off a local server that was aging out. The main worries: data loss, downtime during a migration, and staff struggling to adapt to a new system in the middle of a busy patient schedule.",
    what: [
      "Audited existing data, software, and workflows before touching anything",
      "Migrated file storage, calendaring, and communication to Google Workspace",
      "Ran an in-office training session for all 12 staff — hands-on, not a manual",
      "Kept the old server live as a fallback for 2 weeks post-migration",
      "Set up automated backups with monthly restore tests built into the retainer",
    ],
    outcome:
      "In an engagement like this, the migration can be completed over a weekend with staff logging in Monday without issue — leaving the business with predictable monthly IT costs and a direct line when anything comes up.",
    quote:
      "We moved our whole office to the cloud and it was seamless. They handled everything — setup, staff training, the works. Our team was up and running in a day.",
    author: "Office manager, dental practice",
    role: "Sebastopol, Sonoma County",
    metrics: [
      { label: "Staff trained", value: "12 people" },
      { label: "Downtime", value: "Zero" },
      { label: "Migration window", value: "1 weekend" },
    ],
  },
];

export default function CaseStudies() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="case-studies" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Client Results
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl font-bold text-[#18181B] leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What clients say.<br />
              <span className="text-[#3F3F46]/40">What actually happened.</span>
            </h2>
            <p
              className="text-[#3F3F46]/60 max-w-xs text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Representative examples of the work we do for Sonoma County businesses. Click any case to read the full story.
            </p>
          </div>
          {SHOW_SAMPLE_MARKER && (
            <p
              className="mt-4 max-w-xl text-xs text-[#3F3F46]/40"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Illustrative samples shown during launch — replaced with real,
              client-approved case studies before going live.
            </p>
          )}
        </motion.div>

        <div className="space-y-4">
          {cases.map((c, i) => {
            const Icon = c.icon;
            const isOpen = expanded === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-[#18181B]/10 overflow-hidden"
              >
                {SHOW_SAMPLE_MARKER && (
                  <span
                    className="absolute right-4 top-3 z-10 rounded-full bg-[#18181B]/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3F3F46]/45"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Representative example
                  </span>
                )}
                {/* Summary row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full flex items-center gap-5 px-6 py-6 text-left bg-[#FAFAF9] hover:bg-[#F4F4F2] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(249,115,22,0.1)" }}
                  >
                    <Icon size={20} color="#F97316" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest text-[#F97316]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {c.tag}
                      </span>
                      <span className="text-[#18181B]/20 text-xs">·</span>
                      <span
                        className="text-xs text-[#3F3F46]/50"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {c.client}
                      </span>
                    </div>
                    <p
                      className="text-base font-semibold text-[#18181B] truncate"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {c.title}
                    </p>
                  </div>
                  {/* Metrics preview */}
                  <div className="hidden md:flex items-center gap-6 flex-shrink-0 mr-4">
                    {c.metrics.slice(0, 2).map((m) => (
                      <div key={m.label} className="text-right">
                        <p
                          className="text-sm font-bold text-[#18181B]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {m.value}
                        </p>
                        <p
                          className="text-xs text-[#3F3F46]/40"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <span className="text-[#3F3F46]/40 flex-shrink-0">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-8 border-t border-[#18181B]/8 bg-white grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-2"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              The Situation
                            </p>
                            <p
                              className="text-sm text-[#3F3F46]/70 leading-relaxed"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {c.situation}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-3"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              What We Did
                            </p>
                            <ul className="space-y-2">
                              {c.what.map((w, j) => (
                                <li key={j} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                                  <span
                                    className="text-sm text-[#3F3F46]/70 leading-relaxed"
                                    style={{ fontFamily: "var(--font-body)" }}
                                  >
                                    {w}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-2"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              The Outcome
                            </p>
                            <p
                              className="text-sm text-[#3F3F46]/70 leading-relaxed"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {c.outcome}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {/* Metrics */}
                          <div className="rounded-xl bg-[#18181B] p-5">
                            <p
                              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              By the Numbers
                            </p>
                            <div className="space-y-3">
                              {c.metrics.map((m) => (
                                <div key={m.label}>
                                  <p
                                    className="text-xl font-bold text-white"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                  >
                                    {m.value}
                                  </p>
                                  <p
                                    className="text-xs text-white/40"
                                    style={{ fontFamily: "var(--font-body)" }}
                                  >
                                    {m.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quote */}
                          <blockquote className="rounded-xl bg-[#FAFAF9] border border-[#18181B]/8 p-5">
                            <p
                              className="text-sm text-[#3F3F46]/70 leading-relaxed italic mb-4"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              &ldquo;{c.quote}&rdquo;
                            </p>
                            <footer>
                              <p
                                className="text-sm font-semibold text-[#18181B]"
                                style={{ fontFamily: "var(--font-heading)" }}
                              >
                                {c.author}
                              </p>
                              <p
                                className="text-xs text-[#3F3F46]/40"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {c.role}
                              </p>
                            </footer>
                          </blockquote>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Become the next case study <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
