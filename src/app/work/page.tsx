import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import { ArrowRight, Globe, ShieldCheck, Cloud } from "lucide-react";
import { BOOKING_URL } from "@/config/site";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

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
 * quotes are NOT real customer endorsements.
 *
 * The case-study section does NOT render while only sample content exists
 * (see SHOW_REAL_CASES below). Disclosed-fake proof signals inauthenticity
 * to prospects and risks legal exposure (FTC 16 CFR Part 465, CA false-
 * advertising law).
 *
 * HOW TO ENABLE REAL CASE STUDIES:
 *   1. Document an actual engagement (situation / what we did / outcome).
 *   2. Get the client's written approval to publish their quote + attribution.
 *   3. Replace the sample entries in the `projects` array below.
 *   4. Flip SHOW_REAL_CASES to `true`. The section appears automatically.
 */

/**
 * Set to `true` once every entry in `projects` below is a real, client-approved
 * case study. The detailed case-study section renders only when this is true.
 */
const SHOW_REAL_CASES = false;

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
      <main className="theme-dark">
        {/* Hero — dark canvas, rationed copper. One quiet accent line; the
            headline is the LCP (plain warm text, no animation gate). */}
        <section className="relative overflow-hidden bg-ink-0 pt-32 pb-16">
          {/* Ambient copper wash — position:absolute, aria-hidden → CLS 0. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 15% 0%, rgba(192,122,62,0.16), transparent 60%), radial-gradient(50% 45% at 90% 10%, rgba(219,147,85,0.10), transparent 60%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-6 inline-block rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Client Work
            </RevealOnScroll>
            <h1
              className="mb-6 text-balance text-5xl font-bold leading-tight text-warm md:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The kind of work<br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                we do.
              </span>
            </h1>
            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              className="mx-auto max-w-2xl text-pretty text-lg text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every project starts with a real problem. Here&apos;s what we build and what changes.
            </RevealOnScroll>
          </div>
        </section>

        {/* Case studies — only rendered when SHOW_REAL_CASES is true.
            Populate `projects` with real, approved engagements and flip the flag. */}
        {SHOW_REAL_CASES && (
          <section className="bg-ink-1 py-24">
            <div className="mx-auto max-w-5xl space-y-16 px-6">
              {projects.map((p, i) => (
                <RevealOnScroll
                  key={p.client}
                  direction="up"
                  distance={24}
                  className={`grid items-start gap-12 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  {/* Left: detail */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-copper-dim"
                        style={{ backgroundColor: "rgba(192,122,62,0.12)" }}
                      >
                        <p.icon size={20} className="text-copper-bright" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>{p.tag}</p>
                        <p className="text-xs text-warm-3" style={{ fontFamily: "var(--font-heading)" }}>{p.client}</p>
                      </div>
                    </div>
                    <h2 className="mb-4 text-2xl font-bold leading-tight text-warm" style={{ fontFamily: "var(--font-heading)" }}>{p.headline}</h2>
                    <p className="mb-6 text-sm leading-relaxed text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{p.summary}</p>
                    <div className="mb-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-warm-3" style={{ fontFamily: "var(--font-heading)" }}>What We Did</p>
                      <ul className="space-y-2">
                        {p.what.map((w) => (
                          <li key={w} className="flex items-start gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-copper" />
                            <span className="text-sm text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={p.service} className="inline-flex items-center gap-2 text-sm font-semibold text-copper-bright underline-offset-4 transition-colors hover:text-copper hover:underline focus-visible:outline-none focus-visible:underline" style={{ fontFamily: "var(--font-heading)" }}>
                      Learn about {p.serviceLabel} <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Right: metrics + quote */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-hairline bg-ink-2 p-6">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>By the Numbers</p>
                      <div className="space-y-4">
                        {p.metrics.map((m) => (
                          <div key={m.label}>
                            <p className="text-3xl font-bold tabular-nums text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>{m.value}</p>
                            <p className="text-xs text-warm-3" style={{ fontFamily: "var(--font-body)" }}>{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <SpotlightCard radius={16} lift={false} className="p-6">
                      <blockquote className="relative">
                        <p className="mb-4 text-sm italic leading-relaxed text-warm-2" style={{ fontFamily: "var(--font-body)" }}>
                          &ldquo;{p.quote}&rdquo;
                        </p>
                        <p className="text-xs font-semibold text-warm" style={{ fontFamily: "var(--font-heading)" }}>{p.author}</p>
                      </blockquote>
                    </SpotlightCard>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>
        )}

        {/* Holding state — shown while case studies are being collected */}
        {!SHOW_REAL_CASES && (
          <section className="bg-ink-1 py-24">
            <RevealOnScroll className="mx-auto max-w-2xl px-6 text-center">
              <p
                className="mb-6 text-base leading-relaxed text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Detailed case studies are being prepared with client approval. In the
                meantime, the portfolio section below shows real work — starting with
                this site, built on the same custom stack used for every client.
              </p>
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-7 py-3 text-sm font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={15} aria-hidden />
              </MagneticCTA>
            </RevealOnScroll>
          </section>
        )}

        {/* CTA */}
        <section className="bg-ink-0 py-24">
          <RevealOnScroll className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-6 text-balance text-4xl font-bold text-warm md:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
              {SHOW_REAL_CASES ? "Become the next case study." : "Ready to get started?"}
            </h2>
            <p className="mb-10 text-lg text-warm-2" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute call. Tell us what&apos;s going on and we&apos;ll tell you honestly what we&apos;d do.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-3.5 text-base font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg border border-hairline px-8 py-3.5 text-base font-semibold text-warm transition-colors hover:border-copper-dim hover:text-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow" style={{ fontFamily: "var(--font-heading)" }}>
                See Pricing
              </Link>
            </div>
          </RevealOnScroll>
        </section>
        <Portfolio />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
