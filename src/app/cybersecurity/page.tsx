import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Check, Phone, ShieldAlert } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

export const metadata: Metadata = {
  title: "Cybersecurity for Small Business | Sonoma County | Copper Bay Tech",
  description:
    "Cybersecurity audits, infrastructure hardening, and incident response planning for Sonoma County small businesses. Protect your data before something goes wrong.",
  openGraph: {
    title: "Cybersecurity for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Security audits and hardening for Petaluma, Santa Rosa, and North Bay businesses. Plain-English reports, prioritized fixes.",
    url: "https://copperbaytech.com/cybersecurity",
  },
  alternates: {
    canonical: "https://copperbaytech.com/cybersecurity-small-business",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity Audit & Hardening",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Cybersecurity audits, infrastructure hardening, and incident response planning for Sonoma County small businesses.",
  offers: {
    "@type": "Offer",
    priceRange: "$600 – $2,000",
    priceCurrency: "USD",
  },
};

const auditIncludes = [
  "Network vulnerability scan and external exposure assessment",
  "Email security review (phishing risk, SPF/DKIM/DMARC)",
  "Password and access control audit",
  "Backup verification — do your backups actually work?",
  "Software and firmware update status",
  "Staff phishing awareness assessment",
  "Plain-English report with prioritized action items",
  "30-minute results walkthrough call",
];

const threats = [
  { title: "Ransomware", desc: "Encrypts your files and demands payment. The average small business attack costs $200k+ in downtime and recovery." },
  { title: "Phishing", desc: "Fake emails trick staff into giving up credentials. Over 90% of breaches start with a phishing email." },
  { title: "Credential theft", desc: "Reused passwords and no MFA mean one breach exposes everything. Most businesses don't find out for months." },
  { title: "Compliance gaps", desc: "HIPAA, PCI, and data privacy laws apply to most small businesses. Non-compliance can mean fines even if nothing goes wrong." },
];

export default function CybersecurityPage() {
  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main className="theme-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does a security audit take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most audits are completed in 3–5 business days. You get a plain-English report with prioritized action items and a 30-minute walkthrough call.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need a security audit if I'm a small business?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — small businesses are the #1 ransomware target precisely because they're assumed to have weak security. An audit typically costs $600–$1,200 and can prevent a $200,000+ incident.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What happens after the audit?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You get a clear list of what to fix, in priority order, with estimated costs. We can implement the fixes for you or hand you the report to act on yourself — your choice.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Hero — protection framed as part of websites, handled for life */}
        <section className="relative overflow-hidden bg-ink-0 pt-32 pb-20">
          {/* Atmospheric copper glow — position:absolute, aria-hidden → CLS 0,
              never blocks the headline LCP. Single soft orb, blur-only. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-10%] h-[28rem] w-[28rem] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, var(--copper-glow), transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Cybersecurity — part of being handled
            </RevealOnScroll>

            <RevealOnScroll
              as="h1"
              direction="up"
              distance={12}
              className="mb-6 max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-warm md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Protect what you&apos;ve built
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                before something breaks it.
              </span>
            </RevealOnScroll>

            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              distance={12}
              className="mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Keeping your site and data safe is part of keeping your site
              handled for life. A Copper Bay Tech security audit identifies your
              real risks, explains them in plain English, and gives you a
              prioritized fix list — not a 40-page report you&apos;ll never read.
            </RevealOnScroll>

            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.2}
              distance={12}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                shine
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-3 text-sm font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={15} aria-hidden />
              </MagneticCTA>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline bg-ink-2 px-6 py-3 text-sm font-semibold text-warm transition-colors duration-200 hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} aria-hidden /> {PHONE}
              </a>
            </RevealOnScroll>
          </div>
        </section>

        {/* Threats — spotlight cards on the dark canvas */}
        <section className="bg-ink-0 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll className="mb-10">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                The risk
              </p>
              <h2
                className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What you&apos;re actually up against
              </h2>
            </RevealOnScroll>
            <div className="grid gap-6 sm:grid-cols-2">
              {threats.map((t, i) => (
                <RevealOnScroll key={t.title} delay={i * 0.08} className="h-full">
                  <SpotlightCard radius={16} className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-hairline bg-ink-3"
                          aria-hidden
                        >
                          <ShieldAlert size={17} className="text-copper-bright" />
                        </span>
                        <h3
                          className="font-bold text-warm"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {t.title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Audit includes — raised surface checklist */}
        <section className="bg-ink-1 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll className="mb-8">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                What you get
              </p>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What a security audit includes
              </h2>
              <p
                className="max-w-xl text-pretty text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Flat fee:{" "}
                <span
                  className="font-semibold tabular-nums text-copper-bright"
                  style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                >
                  $600–$2,000
                </span>{" "}
                depending on business size. Completed in 3–5 business days.
              </p>
            </RevealOnScroll>
            <ul className="grid gap-4 sm:grid-cols-2">
              {auditIncludes.map((item, i) => (
                <RevealOnScroll as="li" key={item} delay={i * 0.05}>
                  <span className="surface-2 flex items-start gap-3 rounded-xl p-4">
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-copper"
                      aria-hidden
                    />
                    <span
                      className="text-sm text-warm-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </span>
                  </span>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink-0 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Don&apos;t wait for a breach to find out where you&apos;re exposed.
              </h2>
              <p
                className="mx-auto mb-8 max-w-xl text-pretty text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book a free 15-minute call. We&apos;ll ask a few questions and
                tell you whether a full audit makes sense for your situation — no
                pressure.
              </p>
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                shine
                className="inline-flex items-center gap-2 rounded-lg bg-copper px-8 py-4 font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
