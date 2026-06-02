import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import { ArrowRight, Globe, ShieldCheck, Cloud } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Work | Client Projects | Copper Bay Tech",
  description:
    "Representative examples of our work for Sonoma County businesses: website rebuilds, IT migrations, and security assessments — focused on outcomes, not just screenshots.",
  alternates: { canonical: "https://copperbaytech.com/work" },
  openGraph: {
    title: "Our Work | Copper Bay Tech",
    description: "Client projects from Copper Bay Tech — Sonoma County IT and web development.",
    url: "https://copperbaytech.com/work",
    siteName: "Copper Bay Tech",
  },
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

const projects = [
  {
    icon: Globe,
    tag: "Web Development",
    client: "Home staging business — Petaluma",
    headline: "From invisible to booked out",
    summary:
      "A typical home staging business losing leads before anyone could get in touch. The kind of site we often inherit: 8 seconds to load, a contact form going to spam, and a design from 2018.",
    what: [
      "Custom Next.js rebuild — no templates",
      "Load time dropped from 8s to under 1.5s",
      "Contact form rebuilt with verified delivery",
      "Local SEO targeting Petaluma and surrounding areas",
      "Google Business Profile setup and optimization",
    ],
    metrics: [
      { value: "8s → 1.4s", label: "Load time" },
      { value: "8", label: "New inquiries in 6 weeks" },
      { value: "11 days", label: "Launch time" },
    ],
    quote: "Our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — and we started getting new inquiries through the site.",
    author: "Owner, home-staging business — Petaluma",
    service: "/web-design-sonoma-county",
    serviceLabel: "Web Design",
  },
  {
    icon: ShieldCheck,
    tag: "Cybersecurity",
    client: "Insurance practice — Santa Rosa",
    headline: "Security audit finds two critical vulnerabilities — fixed same day",
    summary:
      "A representative firm handling sensitive client financial data that hadn't had a security review since the office was set up. No one knew what firmware version the router was running.",
    what: [
      "Full network security audit — ports, firmware, access controls",
      "Found two open ports and 4-year-old router firmware",
      "Critical issues fixed same day",
      "Password manager deployed across the team",
      "MFA enabled on all critical accounts",
      "Written security report and remediation log",
    ],
    metrics: [
      { value: "2 critical", label: "Vulnerabilities found" },
      { value: "Same day", label: "Time to fix" },
      { value: "4 years", label: "Firmware lag" },
    ],
    quote: "I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we'd had for years. Fixed it same day, no drama.",
    author: "Principal, insurance practice — Santa Rosa",
    service: "/cybersecurity-small-business",
    serviceLabel: "Cybersecurity",
  },
  {
    icon: Cloud,
    tag: "IT Support & Cloud",
    client: "Dental practice — Sebastopol",
    headline: "Full office cloud migration — zero downtime",
    summary:
      "A representative office of around a dozen staff running everything off an aging local server. The usual concerns: data loss, downtime during migration, and staff adapting during a busy patient schedule.",
    what: [
      "Full audit of existing data, software, and workflows",
      "Migration to Google Workspace over one weekend",
      "In-office training session for all 12 staff",
      "Old server kept live as fallback for two weeks",
      "Automated backups with monthly restore tests",
    ],
    metrics: [
      { value: "12", label: "Staff trained" },
      { value: "Zero", label: "Downtime" },
      { value: "1 weekend", label: "Migration window" },
    ],
    quote: "We moved our whole office to the cloud and it was seamless. They handled everything — setup, staff training, the works. Our team was up and running in a day.",
    author: "Office manager, dental practice — Sebastopol",
    service: "/it-support-sonoma-county",
    serviceLabel: "IT Support",
  },
];

export default function Work() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}>
              Client Work
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The kind of work<br />
              <span style={{ color: "#F97316" }}>we do.</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Every project starts with a real problem. Here&apos;s what we build and what changes.
            </p>
            {SHOW_SAMPLE_MARKER && (
              <p className="text-xs text-white/40 max-w-xl mx-auto mt-6" style={{ fontFamily: "var(--font-body)" }}>
                The examples below are representative samples shown during launch — they&apos;ll be replaced with real, client-approved case studies before going live.
              </p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6 space-y-16">
            {projects.map((p, i) => (
              <div key={p.client} className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                {/* Left: detail */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                      <p.icon size={20} color="#F97316" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>{p.tag}</p>
                      <p className="text-xs text-[#3F3F46]/50" style={{ fontFamily: "var(--font-heading)" }}>{p.client}</p>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-[#18181B] mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>{p.headline}</h2>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>{p.summary}</p>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40 mb-3" style={{ fontFamily: "var(--font-heading)" }}>What We Did</p>
                    <ul className="space-y-2">
                      {p.what.map((w) => (
                        <li key={w} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                          <span className="text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={p.service} className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    Learn about {p.serviceLabel} <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right: metrics + quote */}
                <div className="space-y-4">
                  <div className="bg-[#18181B] rounded-2xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>By the Numbers</p>
                    <div className="space-y-4">
                      {p.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{m.value}</p>
                          <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <blockquote className="relative bg-white rounded-2xl border border-[#18181B]/8 p-6">
                    {SHOW_SAMPLE_MARKER && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#18181B]/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3F3F46]/45" style={{ fontFamily: "var(--font-heading)" }}>
                        Representative example
                      </span>
                    )}
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed italic mb-4" style={{ fontFamily: "var(--font-body)" }}>
                      &ldquo;{p.quote}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{p.author}</p>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Become the next case study.
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute call. Tell us what&apos;s going on and we&apos;ll tell you honestly what we&apos;d do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                Get in Touch <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold" style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}>
                See Pricing
              </Link>
            </div>
          </div>
        </section>
        <Portfolio />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
