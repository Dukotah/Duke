import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import PricingEstimator from "@/components/PricingEstimator";
import Comparison from "@/components/Comparison";
import { ArrowRight, Globe, Server, ShieldCheck, Check, Phone, Sparkles, Calculator } from "lucide-react";
import { PRICING } from "@/config/pricing";

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

const tiers = [
  {
    icon: Globe,
    label: "Web Design",
    tagline: "Your digital front door, done right.",
    price: PRICING.web.range,
    priceNote: PRICING.web.note,
    href: "/web-design-sonoma-county",
    tiers: [
      { label: "Starter · up to 5 pages", price: "$2,500" },
      { label: "Business · up to 10 pages", price: "$4,500" },
      { label: "Premium · 10–20 pages, e-commerce", price: "$7,500+" },
    ],
    includes: [
      "Custom-coded in Next.js — no templates",
      "Mobile-first, 90+ PageSpeed score",
      "Contact form with spam filtering",
      "Local SEO setup & schema markup",
      "Google Business Profile configuration",
      "Domain, hosting & email setup",
      "30 days of post-launch support",
    ],
    addons: [
      { label: "E-commerce / booking integration", price: "+ $500–$1,500" },
      { label: "Monthly maintenance retainer", price: "$95/mo" },
    ],
    cta: "Get a Fixed-Price Quote",
    ctaHref: "/#contact",
  },
  {
    icon: Server,
    label: "IT Support",
    tagline: "IT that just works, every day.",
    price: PRICING.it.range,
    priceNote: PRICING.it.note,
    href: "/it-support-sonoma-county",
    featured: true,
    tiers: [
      { label: "1–5 users", price: "$550/mo" },
      { label: "6–10 users", price: "$1,200/mo" },
      { label: "11–20 users", price: "$2,200/mo" },
    ],
    includes: [
      "Direct line — no ticket queue",
      "Network setup & management",
      "Workstation & device support",
      "Cloud migration & storage",
      "Staff onboarding & training",
      "MFA & password manager rollout",
      "Monthly check-in call",
      "No long-term contract",
    ],
    addons: [
      { label: "Security audit (one-time)", price: "+ $750" },
      { label: "Cloud migration (per user)", price: "+ $75–$150" },
      { label: "Process automation build-out", price: "Quoted separately" },
    ],
    cta: "Get My Free IT Estimate",
    ctaHref: "/schedule",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity",
    tagline: "Find the gaps before attackers do.",
    price: PRICING.cybersecurity.range,
    priceNote: PRICING.cybersecurity.note,
    href: "/cybersecurity-small-business",
    tiers: [
      { label: "Audit with IT support plan", price: "$750" },
      { label: "Standalone audit", price: "$1,200" },
    ],
    includes: [
      "Full network & device scan",
      "Open port & firmware audit",
      "Account access controls review",
      "MFA & password audit",
      "Critical issues fixed same day",
      "Written remediation report",
      "90-day follow-up check",
      "HIPAA / PCI baseline mapping (if applicable)",
    ],
    addons: [
      { label: "Ongoing monthly monitoring", price: "+ $200/mo" },
      { label: "Incident response plan document", price: "+ $400" },
    ],
    cta: "Book a Free Security Call",
    ctaHref: "/schedule",
  },
  {
    icon: Sparkles,
    label: "AI Integration",
    tagline: "An employee that never clocks out.",
    price: PRICING.ai.range,
    priceNote: PRICING.ai.note,
    href: "/ai-integration-small-business",
    includes: [
      "AI receptionist for calls & website chat",
      "Instant lead response & missed-call text-back",
      "Automated review requests & replies",
      "Quote & routine-email drafting",
      "Knowledge assistant trained on your business",
      "Connected to the tools you already use",
      "Tested before it ever talks to a customer",
      "Monitoring & tuning included",
    ],
    addons: [
      { label: "Monthly plan (AI usage + tuning)", price: "from $200/mo" },
      { label: "Extra automations / integrations", price: "Quoted separately" },
    ],
    cta: "Book a Free AI Demo",
    ctaHref: "/schedule",
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
];

export default function Pricing() {
  return (
    <>
      <JsonLd schema={pricingSchema} />
      <JsonLd schema={faqSchema(faqs)} />
      <Nav />
      <main className="bg-[#FAFAF9]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#18181B] pt-36 pb-28">
          {/* ambient texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <span
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F97316]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Sparkles size={13} />
              Transparent Pricing
            </span>
            <h1
              className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Flat fees.
              <br />
              <span style={{ color: "#F97316" }}>No surprises.</span>
            </h1>
            <p
              className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/60 md:text-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We quote a number before any work starts, and that&apos;s the number you pay. No hourly
              billing, no change-order padding, no hidden fees.
            </p>

            <Link
              href="/tools/website-cost-estimator"
              className="group mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-[#F97316]/50 hover:text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Calculator size={15} color="#F97316" />
              Try the instant website cost estimator
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* guarantee strip */}
            <ul className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
              {guarantees.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 text-sm text-white/75"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F97316]/20">
                    <Check size={12} color="#F97316" strokeWidth={3} />
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="relative -mt-16 pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
              {tiers.map((t) => (
                <div
                  key={t.label}
                  className={`group relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                    t.featured
                      ? "bg-[#18181B] text-white shadow-[0_30px_60px_-15px_rgba(24,24,27,0.45)] ring-1 ring-[#F97316]/40 xl:-mt-4 xl:mb-4 xl:scale-[1.03]"
                      : "border border-[#18181B]/[0.07] bg-white shadow-[0_10px_30px_-12px_rgba(24,24,27,0.12)] hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(24,24,27,0.2)]"
                  }`}
                >
                  {t.featured && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#F97316] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Most popular
                    </span>
                  )}

                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${
                      t.featured ? "bg-[#F97316]/15 ring-1 ring-[#F97316]/25" : "bg-[#18181B]/[0.05] ring-1 ring-[#18181B]/[0.06]"
                    }`}
                  >
                    <t.icon size={26} color="#F97316" strokeWidth={1.75} />
                  </div>

                  <p
                    className={`mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
                      t.featured ? "text-[#F97316]" : "text-[#18181B]/50"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.label}
                  </p>

                  <p
                    className={`mb-6 text-[15px] leading-relaxed ${t.featured ? "text-white/65" : "text-[#3F3F46]/70"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {t.tagline}
                  </p>

                  <div className={`mb-7 border-b pb-7 ${t.featured ? "border-white/10" : "border-[#18181B]/[0.08]"}`}>
                    <span
                      className={`text-[2.1rem] font-bold leading-none tracking-tight ${t.featured ? "text-white" : "text-[#18181B]"}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.price}
                    </span>
                    <p
                      className={`mt-2 text-xs uppercase tracking-wide ${t.featured ? "text-white/45" : "text-[#3F3F46]/45"}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.priceNote}
                    </p>

                    {t.tiers && t.tiers.length > 0 && (
                      <div className={`mt-5 space-y-2 border-t pt-4 ${t.featured ? "border-white/10" : "border-[#18181B]/[0.08]"}`}>
                        {t.tiers.map((tier) => (
                          <div key={tier.label} className="flex items-baseline justify-between gap-3">
                            <span
                              className={`text-[13px] ${t.featured ? "text-white/70" : "text-[#3F3F46]/75"}`}
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {tier.label}
                            </span>
                            <span
                              className={`whitespace-nowrap text-[13px] font-semibold ${t.featured ? "text-white" : "text-[#18181B]"}`}
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {tier.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <ul className="mb-7 flex-1 space-y-3">
                    {t.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                            t.featured ? "bg-[#F97316]/20" : "bg-[#F97316]/12"
                          }`}
                        >
                          <Check size={12} color="#F97316" strokeWidth={3} />
                        </span>
                        <span
                          className={`text-[15px] leading-snug ${t.featured ? "text-white/85" : "text-[#3F3F46]"}`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {t.addons.length > 0 && (
                    <div className={`mb-7 rounded-2xl p-5 ${t.featured ? "bg-white/[0.06]" : "bg-[#FAFAF9]"}`}>
                      <p
                        className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${t.featured ? "text-white/45" : "text-[#18181B]/45"}`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Common add-ons
                      </p>
                      <div className="space-y-2.5">
                        {t.addons.map((a) => (
                          <div key={a.label} className="flex items-start justify-between gap-3">
                            <span
                              className={`text-[13px] leading-snug ${t.featured ? "text-white/65" : "text-[#3F3F46]/75"}`}
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {a.label}
                            </span>
                            <span
                              className={`whitespace-nowrap text-[13px] font-semibold ${t.featured ? "text-[#F97316]" : "text-[#18181B]"}`}
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {a.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={t.ctaHref}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${
                      t.featured
                        ? "bg-[#F97316] text-white shadow-lg shadow-[#F97316]/25 hover:bg-[#ea6c0a] focus-visible:ring-offset-[#18181B]"
                        : "bg-[#18181B] text-white hover:bg-[#0d0d0f] focus-visible:ring-offset-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.cta}
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href={t.href}
                    className={`mt-4 text-center text-xs font-medium underline-offset-4 transition-colors hover:underline ${
                      t.featured ? "text-white/45 hover:text-white/80" : "text-[#3F3F46]/45 hover:text-[#18181B]"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Learn more about {t.label} →
                  </Link>
                </div>
              ))}
            </div>

            <p
              className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-[#3F3F46]/55"
              style={{ fontFamily: "var(--font-body)" }}
            >
              All prices are estimates. You&apos;ll get a specific quote before any work starts. No
              billing begins until you approve it in writing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mb-14 text-center">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-on-light"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pricing FAQ
              </p>
              <h2
                className="text-balance text-4xl font-bold tracking-tight text-[#18181B] md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Questions, answered
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#18181B]/[0.07] bg-[#FAFAF9] p-7 transition-colors hover:border-[#F97316]/30"
                >
                  <h3
                    className="mb-2.5 flex items-start gap-3 text-lg font-bold text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="mt-0.5 text-[#F97316]">Q.</span>
                    {f.q}
                  </h3>
                  <p
                    className="pl-7 text-[15px] leading-relaxed text-[#3F3F46]/75"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#18181B] py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2
              className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Not sure what you need?
            </h2>
            <p
              className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/60"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tell us what&apos;s going on. We&apos;ll recommend the right starting point and give you a
              clear number — free, no obligation.
            </p>
            <div className="mt-11 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#F97316]/25 transition-all duration-200 hover:bg-[#ea6c0a] hover:shadow-xl hover:shadow-[#F97316]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 px-8 py-4 text-base font-semibold text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={16} />
                Call (707) 239-6725
              </a>
            </div>
          </div>
        </section>
        <PricingEstimator />
        <Comparison />
      </main>
      <Footer />
    </>
  );
}
