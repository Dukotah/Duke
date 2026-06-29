import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import PricingEstimator from "@/components/PricingEstimator";
import Comparison from "@/components/Comparison";
import { ArrowRight, Globe, Server, ShieldCheck, Check, Phone, Sparkles, Calculator } from "lucide-react";
import { PRICING, websitePackages, carePlans, addOns } from "@/config/pricing";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Copper Bay Tech — Service Pricing",
  description:
    "Transparent flat-fee pricing for web design, IT support, cybersecurity, and AI integration in Sonoma County.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Web Design & Development",
        description:
          "Custom-coded small business websites. No templates, no page builders. Mobile-first, fast-loading.",
        url: "https://copperbaytech.com/web-design-sonoma-county",
        provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
        areaServed: "Sonoma County, CA",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: PRICING.web.low,
          highPrice: PRICING.web.high,
          offerCount: 3,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Managed IT Support",
        description:
          "Flat monthly fee IT support for Sonoma County small businesses. Network, workstations, cloud, security.",
        url: "https://copperbaytech.com/it-support-sonoma-county",
        provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
        areaServed: "Sonoma County, CA",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: PRICING.it.low,
          highPrice: PRICING.it.high,
          offerCount: 3,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Cybersecurity",
        description:
          "Security audits, infrastructure hardening, incident response, and compliance baseline for small businesses.",
        url: "https://copperbaytech.com/cybersecurity-small-business",
        provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
        areaServed: "Sonoma County, CA",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: PRICING.cybersecurity.low,
          highPrice: PRICING.cybersecurity.high,
          offerCount: 2,
        },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "AI Integration for Small Business",
        description:
          "Practical AI for local businesses — answering calls 24/7, responding to leads, booking appointments.",
        url: "https://copperbaytech.com/ai-integration-small-business",
        provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
        areaServed: "Sonoma County, CA",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Pricing | Web Design, IT Support & Cybersecurity | Copper Bay Tech",
  description:
    "Transparent, flat-fee pricing for web design, IT support, and cybersecurity in Sonoma County. No hourly billing, no surprise invoices. See what things actually cost.",
  keywords:
    "web design pricing Sonoma County, IT support cost small business, cybersecurity audit price, Copper Bay Tech pricing",
  alternates: { canonical: "https://copperbaytech.com/pricing" },
  openGraph: {
    title: "Pricing | Copper Bay Tech",
    description: "Transparent flat-fee pricing for web design, IT support, and cybersecurity.",
    url: "https://copperbaytech.com/pricing",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

// IT / security / AI fold in as care-plan benefits, not headline services — but
// we keep the SEO internal links to each service hub so the link equity stays.
const alsoHandled = [
  {
    icon: Server,
    label: "Managed IT & helpdesk",
    note: "Network, workstations, cloud & support for your team.",
    href: "/it-support-sonoma-county",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity & hardening",
    note: "Audits, monitoring, backups & incident planning.",
    href: "/cybersecurity-small-business",
  },
  {
    icon: Sparkles,
    label: "AI tools & automation",
    note: "Answer calls, reply to leads, clear the busywork.",
    href: "/ai-integration-small-business",
  },
];

const guarantees = [
  "Fixed quote before any work starts",
  "No hourly billing, ever",
  "Month-to-month — cancel anytime",
];

const faqs = [
  {
    q: "Why aren't you cheaper?",
    a: "Because cheap IT and cheap websites are expensive in the long run. A $500 website built on a theme breaks, runs slow, and costs you leads for years. We charge fair prices for work that lasts.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. For project work (web design, one-time audits), we split 50% upfront and 50% on delivery. For larger projects, we can discuss phased payments.",
  },
  {
    q: "What if my needs don't fit these packages?",
    a: "Most don't fit exactly — these are starting points. Tell us what you need and we'll quote it precisely. We don't force you into tiers.",
  },
  {
    q: "Is there a contract for monthly IT support?",
    a: "Month-to-month. 30-day cancellation notice. No long-term commitment required.",
  },
  {
    q: "Do you offer discounts for nonprofits?",
    a: "Yes — 15% off project work for registered 501(c)(3) organizations in Sonoma County. Just mention it when you reach out.",
  },
  {
    q: "Do I own my website and code when it's done?",
    a: "Yes — completely. You own the code, the domain, and all the accounts it runs on, outright. Everything is custom-coded (no proprietary page-builder lock-in), so if you ever want to bring on another developer or take it in-house, it hands off cleanly with documentation. You're buying an asset, not renting a dependency.",
  },
  {
    q: "How much does custom software cost?",
    a: "Custom software is scoped per project. A simple internal tool or automation typically starts around $5,000, a focused business app with logins and a database runs higher, and larger platforms more again — the biggest cost driver is how much the software has to do, not the technology. We give a fixed quote before any work starts. See our custom software development page for a full breakdown.",
  },
  {
    q: "Do you only work with Sonoma County businesses?",
    a: "No. We're based in Santa Rosa and love working on-site across the North Bay, but web design, custom software, cybersecurity, and remote IT are delivered fully remote for clients anywhere in the U.S. You get the same one accountable owner and one-business-day response either way.",
  },
  {
    q: "What happens if I cancel a care plan?",
    a: "Your website and everything we built stays yours — care plans are month-to-month with 30-day notice, never a lock-in. We'll hand off hosting and accounts cleanly so nothing breaks. The care plan covers ongoing hosting, updates, security, and improvements; cancelling just means you take that on yourself or elsewhere.",
  },
];

export default function Pricing() {
  return (
    <>
      <JsonLd schema={pricingSchema} />
      <JsonLd schema={faqSchema(faqs)} />
      <Nav />
      <main className="theme-dark">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink-0 pt-36 pb-28">
          {/* ambient grid texture — copper-neutral, masked to the top */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(var(--text-3) 1px, transparent 1px), linear-gradient(90deg, var(--text-3) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%)",
            }}
          />
          {/* single rationed copper glow orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, var(--copper-glow) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Sparkles size={13} aria-hidden />
              Websites, handled — for life
            </RevealOnScroll>

            <h1
              className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-warm md:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Flat fees.
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                No surprises.
              </span>
            </h1>

            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              distance={12}
              className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2 md:text-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Start with a custom website, then keep it handled for life with one
              calm care plan. We quote a number before any work starts, and
              that&apos;s the number you pay — no hourly billing, no hidden fees.
            </RevealOnScroll>

            <RevealOnScroll as="div" direction="up" delay={0.18} distance={12}>
              <Link
                href="/tools/website-cost-estimator"
                className="group mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-warm-2 transition-colors hover:border-copper-dim hover:text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Calculator size={15} className="text-copper-bright" aria-hidden />
                Try the instant website cost estimator
                <ArrowRight size={15} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </RevealOnScroll>

            {/* guarantee strip */}
            <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
              {guarantees.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 text-sm text-warm-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-copper-dim">
                    <Check size={12} className="text-copper-bright" strokeWidth={3} aria-hidden />
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Website build packages (lead with the product) ───────────── */}
        <section className="relative bg-ink-0 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <RevealOnScroll className="mb-14 text-center">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Start with a website
              </p>
              <h2
                className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                One-time build, no templates.
              </h2>
              <p
                className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Custom-coded, mobile-first and SEO-ready. Pick a starting point —
                you get a fixed quote before any work begins.
              </p>
            </RevealOnScroll>

            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {websitePackages.map((pkg, i) => (
                <RevealOnScroll key={pkg.id} delay={i * 0.08} className="h-full">
                  <SpotlightCard
                    radius={24}
                    className={`h-full ${pkg.popular ? "surface-featured" : ""}`}
                    style={pkg.popular ? { border: "1px solid var(--copper)" } : undefined}
                  >
                    <div className="flex h-full flex-col p-7 sm:p-8">
                      <div className="mb-5 flex items-center justify-between">
                        <span
                          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-ink-3"
                          aria-hidden
                        >
                          <Globe size={20} className="text-copper-bright" />
                        </span>
                        {pkg.popular && (
                          <span
                            className="rounded-full border border-copper-dim px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-copper-bright"
                            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                          >
                            Most popular
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-xl font-bold text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {pkg.name}
                      </h3>
                      <p
                        className="mt-1.5 min-h-[2.75rem] text-sm text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {pkg.tagline}
                      </p>

                      <p className="mt-5 flex items-baseline gap-1.5">
                        {pkg.pricePrefix && (
                          <span
                            className="text-sm font-medium text-warm-3"
                            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                          >
                            {pkg.pricePrefix.trim()}
                          </span>
                        )}
                        <span
                          className="text-3xl font-bold tabular-nums text-warm"
                          style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                        >
                          {pkg.price}
                        </span>
                        <span className="text-sm text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
                          one-time
                        </span>
                      </p>

                      <ul className="mt-6 mb-7 flex-1 space-y-2.5">
                        {pkg.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm text-warm-2"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <Check size={16} className="mt-0.5 flex-shrink-0 text-copper" aria-hidden />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <MagneticCTA
                        as="link"
                        href="/#contact"
                        shine={pkg.popular}
                        className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 ${
                          pkg.popular
                            ? "bg-copper text-ink-0 hover:bg-copper-bright"
                            : "border border-hairline bg-ink-3 text-warm hover:border-copper-dim"
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Get a Fixed-Price Quote
                        <ArrowRight size={15} aria-hidden />
                      </MagneticCTA>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>

            <p
              className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Prefer the deep dive?{" "}
              <Link
                href="/web-design-sonoma-county"
                className="font-semibold text-copper-bright underline-offset-4 hover:underline"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Learn more about web design in Sonoma County
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ── Care plans (monthly — IT/security/AI fold in as benefits) ── */}
        <section className="relative bg-ink-0 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <RevealOnScroll className="mb-14 text-center">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Then keep it handled
              </p>
              <h2
                className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Care plans, for life.
              </h2>
              <p
                className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Hosting, updates, security and improvements — handled monthly so
                your site never goes stale or unsafe. Month-to-month, cancel anytime.
              </p>
            </RevealOnScroll>

            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {carePlans.map((plan, i) => (
                <RevealOnScroll key={plan.id} delay={i * 0.08} className="h-full">
                  <SpotlightCard
                    radius={24}
                    className={`h-full ${plan.popular ? "surface-featured" : ""}`}
                    style={plan.popular ? { border: "1px solid var(--copper)" } : undefined}
                  >
                    <div className="flex h-full flex-col p-7 sm:p-8">
                      <div className="mb-5 flex items-center justify-between">
                        <h3
                          className="text-xl font-bold text-warm"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <span
                            className="rounded-full border border-copper-dim px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-copper-bright"
                            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                          >
                            Most popular
                          </span>
                        )}
                      </div>

                      <p className="flex items-baseline gap-1.5">
                        <span
                          className="text-3xl font-bold tabular-nums text-warm"
                          style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                        >
                          {plan.price}
                        </span>
                        <span className="text-sm text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
                          /mo
                        </span>
                      </p>
                      <p
                        className="mt-2 min-h-[2.75rem] text-sm text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {plan.tagline}
                      </p>

                      <ul className="mt-6 mb-7 flex-1 space-y-2.5">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm text-warm-2"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <Check size={16} className="mt-0.5 flex-shrink-0 text-copper" aria-hidden />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <MagneticCTA
                        as="link"
                        href="/schedule"
                        shine={plan.popular}
                        className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 ${
                          plan.popular
                            ? "bg-copper text-ink-0 hover:bg-copper-bright"
                            : "border border-hairline bg-ink-3 text-warm hover:border-copper-dim"
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Build your plan
                        <ArrowRight size={15} aria-hidden />
                      </MagneticCTA>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>

            {/* Quiet "also handled" — IT / cyber / AI as benefits, with SEO links */}
            <RevealOnScroll className="mt-16">
              <div className="rounded-2xl border border-hairline bg-ink-1 p-7 sm:p-9">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-md">
                    <p
                      className="text-sm font-semibold text-warm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Also handled, on the Fully Managed plan
                    </p>
                    <p
                      className="mt-1.5 text-sm text-warm-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      IT, security and AI aren&rsquo;t add-on services to chase —
                      they come folded into one partner.
                    </p>
                  </div>

                  <ul className="grid flex-1 gap-x-8 gap-y-4 sm:grid-cols-3 lg:max-w-2xl">
                    {alsoHandled.map(({ icon: Icon, label, note, href }) => (
                      <li key={label} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hairline bg-ink-3"
                          aria-hidden
                        >
                          <Icon size={16} className="text-copper" />
                        </span>
                        <span>
                          <Link
                            href={href}
                            className="block text-sm font-semibold text-warm underline-offset-4 transition-colors hover:text-copper-bright hover:underline focus-visible:outline-none focus-visible:underline"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {label}
                          </Link>
                          <span
                            className="mt-0.5 block text-xs leading-relaxed text-warm-3"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {note}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>

            {/* Add-ons (one-time extras) */}
            <RevealOnScroll className="mt-10">
              <div className="rounded-2xl border border-hairline bg-ink-1 p-7 sm:p-9">
                <p
                  className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-copper"
                  style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                >
                  Common add-ons
                </p>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {addOns.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-3 border-t border-hairline pt-4">
                      <span>
                        <span
                          className="block text-sm font-semibold text-warm"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {a.name}
                        </span>
                        <span
                          className="mt-0.5 block text-xs leading-relaxed text-warm-3"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {a.description}
                        </span>
                      </span>
                      <span
                        className="whitespace-nowrap text-sm font-semibold text-copper-bright"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        {a.priceNote === "from" && "from "}
                        {a.price}
                        {a.priceNote && a.priceNote !== "from" && ` ${a.priceNote}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <p
              className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              All prices are estimates. You&apos;ll get a specific quote before any
              work starts. No billing begins until you approve it in writing.
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="bg-ink-1 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <RevealOnScroll className="mb-14 text-center">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Pricing FAQ
              </p>
              <h2
                className="text-balance text-4xl font-bold tracking-tight text-warm md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Questions, answered
              </h2>
            </RevealOnScroll>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <RevealOnScroll key={i} delay={i * 0.05}>
                  <div className="rounded-2xl border border-hairline bg-ink-2 p-7 transition-colors hover:border-copper-dim">
                    <h3
                      className="mb-2.5 flex items-start gap-3 text-lg font-bold text-warm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <span className="mt-0.5 text-copper-bright">Q.</span>
                      {f.q}
                    </h3>
                    <p
                      className="pl-7 text-[15px] leading-relaxed text-warm-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {f.a}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-ink-0 py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, var(--copper-glow) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="text-balance text-4xl font-bold tracking-tight text-warm md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Not sure what you need?
              </h2>
              <p
                className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Tell us what&apos;s going on. We&apos;ll recommend the right starting
                point and give you a clear number — free, no obligation.
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.1} className="mt-11 flex flex-col justify-center gap-4 sm:flex-row">
              <MagneticCTA
                as="link"
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-4 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline px-8 py-4 text-base font-semibold text-warm transition-colors duration-200 hover:border-copper-dim hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={16} aria-hidden />
                Call (707) 239-6725
              </a>
            </RevealOnScroll>
          </div>
        </section>

        <PricingEstimator />
        <Comparison />
      </main>
      <Footer />
    </>
  );
}
