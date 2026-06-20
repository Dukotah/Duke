import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Check, Phone } from "lucide-react";
import { PRICING, rangeLabel } from "@/config/pricing";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import {
  MeshGradient,
  RevealOnScroll,
  SpotlightCard,
  MagneticCTA,
} from "@/components/motion";

export const metadata: Metadata = {
  title: "Custom Web Development for Sonoma County Businesses | Copper Bay Tech",
  description:
    "Hand-coded, fast-loading websites for Sonoma County small businesses. No templates, no page builders. Local SEO included. Flat-fee pricing starting at $2,500.",
  openGraph: {
    title: "Custom Web Development | Copper Bay Tech — Sonoma County",
    description:
      "Custom websites built for Petaluma, Santa Rosa, Sebastopol, and the greater North Bay. Fast, mobile-first, and built to rank locally.",
    url: "https://copperbaytech.com/web-development",
  },
  alternates: {
    canonical: "https://copperbaytech.com/web-design-sonoma-county",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Web Development",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Hand-coded, fast-loading websites for Sonoma County small businesses. No templates. Local SEO included.",
  offers: {
    "@type": "Offer",
    priceRange: rangeLabel("web"),
    priceCurrency: "USD",
  },
};

const included = [
  "Custom-coded — no WordPress, no templates, no drag-and-drop builders",
  "Mobile-first design that looks great on every screen size",
  "Fast load times (we optimize for Core Web Vitals)",
  "Local SEO setup — meta tags, schema, Google Business Profile",
  "Contact forms, booking integrations, and CTAs built to convert",
  "Domain, hosting, and email setup included",
  "Flat-fee pricing — you know the cost before we start",
  "Delivered in 2–3 weeks, not months",
];

const faqs = [
  {
    q: "How much does a website cost?",
    a: `Most small business websites fall between ${PRICING.web.startingAt} and $7,500 depending on complexity. You get a flat-fee proposal before we start — no surprises, no hourly billing.`,
  },
  {
    q: "How long does it take?",
    a: "Most projects are live in 2–3 weeks. We set a timeline upfront and stick to it.",
  },
  {
    q: "Do you work with businesses outside Sonoma County?",
    a: "Yes — web development is fully remote. We prioritize local clients but work with businesses throughout California.",
  },
  {
    q: "Can you redesign my existing site?",
    a: "Absolutely. We'll assess what you have and give you a clear plan and price within 24 hours.",
  },
];

const pricingTiers = [
  {
    tier: "Business Site",
    price: "$2,500 – $4,500",
    desc: "5–8 pages, contact form, local SEO, Google Business Profile setup. Ideal for service businesses, consultants, and local shops.",
  },
  {
    tier: "Growth Site",
    price: "$4,500 – $7,500",
    desc: "Everything in Business, plus booking integrations, blog, multiple service pages, and conversion-focused copywriting.",
    popular: true,
  },
  {
    tier: "Custom Web App",
    price: "$7,500+",
    desc: "Portals, dashboards, custom tools, e-commerce, and complex integrations. Scoped per project after discovery.",
  },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* The whole page renders on the dark canvas; warm text on near-black. */}
      <main className="theme-dark bg-ink-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does it take to build a website?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most small business websites are live in 2–3 weeks. Complex projects with custom functionality may take 4–6 weeks. We set a timeline before we start and stick to it.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you use WordPress or website builders?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Every website we build is custom-coded — no WordPress, no Squarespace, no drag-and-drop builders. This means faster load times, better security, and full control over your site.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What happens if I need changes after launch?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Small updates are quick and affordable. Larger changes are scoped and priced upfront. Many clients add a monthly retainer for ongoing updates and support.",
                  },
                },
              ],
            }),
          }}
        />

        {/* ── Hero — flagship mesh background + handled headline ─────────────── */}
        <section className="relative overflow-hidden bg-ink-0 pt-32 pb-20 sm:pt-36 sm:pb-28">
          {/* Drifting copper mesh + cursor spotlight. position:absolute /
              aria-hidden → CLS 0, never blocks the headline LCP. */}
          <MeshGradient spotlight blur={80} />
          {/* Bottom fade into the next (dark) section. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-ink-0 to-transparent"
          />

          <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-copper-bright opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-copper-bright" />
              </span>
              Web Development
            </RevealOnScroll>

            {/* THE LCP — present in server-rendered markup, paints first as warm
                text. The copper clip on the middle line never blocks paint. */}
            <h1
              className="max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-warm sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Custom-coded, fast-loading,
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                built to rank in Sonoma County.
              </span>
              <br />
              No templates.
            </h1>

            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.15}
              distance={12}
              className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2 md:text-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Custom-coded, fast-loading, and built to rank locally. No templates.
              No page builders. Just a professional website that converts visitors
              into customers — delivered in weeks, not months.
            </RevealOnScroll>

            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.25}
              distance={12}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-7 py-3.5 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticCTA>

              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline bg-ink-2 px-6 py-3.5 text-base font-semibold text-warm transition-colors duration-200 hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} aria-hidden /> {PHONE}
              </a>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── What's included ───────────────────────────────────────────────── */}
        <section className="bg-ink-0 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-8 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What every project includes
              </h2>
            </RevealOnScroll>
            <ul className="grid gap-4 sm:grid-cols-2">
              {included.map((item, i) => (
                <RevealOnScroll
                  as="li"
                  key={item}
                  delay={i * 0.05}
                  className="flex items-start gap-3 rounded-xl border border-hairline bg-ink-1 p-4"
                >
                  <Check size={16} className="mt-0.5 flex-shrink-0 text-copper" aria-hidden />
                  <span className="text-sm text-warm-2" style={{ fontFamily: "var(--font-body)" }}>
                    {item}
                  </span>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Pricing — spotlight cards, deferred below value-proof ─────────── */}
        <section className="bg-ink-0 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Transparent, flat-fee pricing
              </h2>
              <p className="mb-4 max-w-xl text-warm-2" style={{ fontFamily: "var(--font-body)" }}>
                You&apos;ll get a fixed price before we start. No hourly billing, no scope creep surprises.
              </p>
              <p className="mb-8 text-sm text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
                Not sure which tier fits your project?{" "}
                <Link
                  href="/tools/website-cost-estimator"
                  className="font-medium text-copper-bright underline-offset-4 hover:text-copper hover:underline"
                >
                  Try our free website cost estimator
                </Link>{" "}
                to get a ballpark in under two minutes.
              </p>
            </RevealOnScroll>

            <div className="grid gap-6 sm:grid-cols-3">
              {pricingTiers.map((p, i) => (
                <RevealOnScroll key={p.tier} delay={i * 0.08} className="h-full">
                  <SpotlightCard
                    radius={20}
                    className={`h-full ${p.popular ? "surface-featured" : ""}`}
                    style={p.popular ? { border: "1px solid var(--copper)" } : undefined}
                  >
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.18em] text-copper"
                          style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                        >
                          {p.tier}
                        </p>
                        {p.popular && (
                          <span
                            className="rounded-full border border-copper-dim px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-copper-bright"
                            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                          >
                            Most popular
                          </span>
                        )}
                      </div>
                      <p
                        className="mb-3 text-2xl font-bold tabular-nums text-warm"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        {p.price}
                      </p>
                      <p
                        className="text-sm leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="bg-ink-0 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-8 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common questions
              </h2>
            </RevealOnScroll>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <RevealOnScroll
                  key={faq.q}
                  delay={i * 0.06}
                  className="rounded-xl border border-hairline bg-ink-1 p-6"
                >
                  <p
                    className="mb-2 font-semibold text-warm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.q}
                  </p>
                  <p
                    className="text-sm leading-relaxed text-warm-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {faq.a}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA band — build your plan / free audit path ──────────────────── */}
        <section className="relative overflow-hidden bg-ink-1 py-20">
          <MeshGradient spotlight={false} blur={70} />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready for a website that actually works?
              </h2>
              <p
                className="mx-auto mb-8 max-w-xl text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Free 30-minute consultation. We&apos;ll review your current site, tell you what we&apos;d build, and give you a flat-fee quote — no obligation.
              </p>
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              delay={0.1}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                shine
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-4 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticCTA>
              <Link
                href="/audit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-4 text-base font-semibold text-warm underline-offset-4 transition-colors duration-200 hover:text-copper-bright hover:underline focus-visible:outline-none focus-visible:underline"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Start a free audit
                <ArrowRight size={15} aria-hidden className="opacity-70" />
              </Link>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
