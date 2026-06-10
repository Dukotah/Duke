"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Globe, Server, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const aiHighlights = [
  "Answers every call & chat 24/7",
  "Replies to leads in seconds",
  "Books appointments for you",
  "Handles the busywork",
];

const tiers = [
  {
    icon: Globe,
    tier: "Start here",
    headline: "Your digital front door, done right.",
    items: [
      "Custom-coded business websites",
      "No templates, no page builders",
      "Mobile-first, fast-loading",
      "Local SEO optimization",
      "Google Business Profile setup",
      "Domain, hosting & email setup",
    ],
    cta: "Start with a website",
  },
  {
    icon: Server,
    tier: "Grow with confidence",
    headline: "IT that just works, every day.",
    items: [
      "Network setup & management",
      "Workstations, Wi-Fi, printers",
      "Cloud migration & storage",
      "Process & workflow automation",
      "AI agent integrations",
      "Staff onboarding & support",
    ],
    cta: "Get IT support",
    featured: true,
  },
  {
    icon: ShieldCheck,
    tier: "Stay protected",
    headline: "Protect what you've built.",
    items: [
      "Cybersecurity audits & reporting",
      "Infrastructure hardening",
      "Incident response planning",
      "Custom web application development",
      "Compliance baseline (PCI, HIPAA)",
      "Ongoing security monitoring",
    ],
    cta: "Talk security",
  },
];

export default function Services() {
  const reduce = useReducedMotion();
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            One partner, from launch to locked-down.
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            From your first website to a hardened security posture — we grow with you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.1 }}
              className={`rounded-xl p-8 flex flex-col ${
                t.featured
                  ? "bg-[#18181B] text-white shadow-xl"
                  : "bg-[#FAFAF9] border border-[#18181B]/5"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
                  t.featured ? "bg-white/10" : "bg-[#18181B]/8"
                }`}
              >
                <t.icon size={22} color={t.featured ? "#F97316" : "#18181B"} />
              </div>

              <p
                className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                  t.featured ? "text-[#F97316]" : "text-[#18181B]/50"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.tier}
              </p>

              <h3
                className={`text-xl font-bold mb-4 ${
                  t.featured ? "text-white" : "text-[#18181B]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.headline}
              </h3>

              <ul className="flex-1 space-y-2 mb-8">
                {t.items.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2 text-sm ${
                      t.featured ? "text-white/80" : "text-[#3F3F46]/60"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        t.featured ? "bg-[#F97316]" : "bg-[#18181B]"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${
                  t.featured
                    ? "bg-[#F97316] text-[#18181B] hover:bg-[#ea6c0a] focus-visible:ring-offset-[#18181B]"
                    : "bg-[#18181B] text-white hover:bg-[#0d0d0f] focus-visible:ring-offset-white"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.cta}
              </a>

              {t.tier === "Start here" && (
                <Link
                  href="/tools/website-cost-estimator"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B]/70 transition-colors hover:text-[#18181B] mt-2"
                  style={{ border: "1px solid rgba(24,24,27,0.2)", fontFamily: "var(--font-heading)" }}
                >
                  What should your website cost?
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Featured: AI Integration */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15 }}
          className="relative mt-6 overflow-hidden rounded-xl bg-[#18181B] p-8 md:p-10 shadow-xl ring-1 ring-[#F97316]/30"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#F97316]/70 to-transparent"
          />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span
                className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] text-[#F97316]"
                style={{ backgroundColor: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", fontFamily: "var(--font-heading)" }}
              >
                <Sparkles size={12} /> New · AI Integration
              </span>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Put AI to work — an employee that never clocks out.
              </h3>
              <p
                className="text-white/65 leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Practical AI, built for your shop and supported locally. It answers the phone, replies to
                leads instantly, and clears the busywork — no hype, no hiring. Works as a standalone setup
                or an add-on to your IT plan.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {aiHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-white/80"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 lg:items-end lg:flex-shrink-0">
              <Link
                href="/ai-integration-small-business"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] transition-colors hover:bg-[#ea6c0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Explore AI for your business
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/tools/missed-call-calculator"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                style={{ border: "1px solid rgba(255,255,255,0.2)", fontFamily: "var(--font-heading)" }}
              >
                What are missed calls costing you?
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
