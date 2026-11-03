import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { rangeLabel } from "@/config/pricing";
import { Globe, Server, ShieldCheck, MapPin, User, Receipt, CalendarOff, ArrowRight } from "lucide-react";
import { BOOKING_URL } from "@/config/site";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

export const metadata: Metadata = {
  title: "IT Services for Sonoma County Businesses | Copper Bay Tech",
  description:
    "Web development, IT support, and cybersecurity for small businesses in Petaluma, Santa Rosa, Sebastopol, Rohnert Park, and across Sonoma County. Local, flat-fee, no contracts.",
  keywords:
    "IT services Sonoma County, small business IT Petaluma, web development Santa Rosa, cybersecurity North Bay, managed IT support Sonoma County",
  openGraph: {
    title: "IT Services for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Web development, IT support, and cybersecurity. Serving all of Sonoma County.",
    url: "https://copperbaytech.com/services",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://copperbaytech.com/services",
  },
};

const services = [
  {
    slug: "web-development",
    Icon: Globe,
    title: "Web Development",
    tagline: "Websites that load fast, rank locally, and convert visitors.",
    desc: "Custom-built with React and Next.js. No templates, no page builders. Every site includes performance optimization, local SEO foundations, SSL, analytics, and 30 days of post-launch support.",
    bullets: [
      "Sub-2 second load times",
      "Mobile-first responsive design",
      "Local SEO built in from day one",
      "Flat-fee proposals, no hourly billing",
    ],
    range: rangeLabel("web"),
    cta: "See web development",
  },
  {
    slug: "it-support",
    Icon: Server,
    title: "IT Support & Managed Services",
    tagline: "Your outsourced IT department — folded in, without the overhead.",
    desc: "Flat-rate monthly support covering workstations, servers, network, cloud accounts, and helpdesk. No surprise invoices. No waiting two days for a callback. Just reliable support from someone who knows your setup.",
    bullets: [
      "Unlimited helpdesk for covered users",
      "Remote and on-site support (Sonoma County)",
      "Network monitoring and patch management",
      "New employee setup and offboarding",
    ],
    range: rangeLabel("it"),
    cta: "See IT support",
  },
  {
    slug: "cybersecurity",
    Icon: ShieldCheck,
    title: "Cybersecurity",
    tagline: "Practical protection, handled as part of keeping you online.",
    desc: "Security assessments, endpoint protection, backup and disaster recovery, employee training, and email security hardening. Designed for businesses with 2–50 employees who want real protection without enterprise complexity.",
    bullets: [
      "Free IT Security Risk Assessment",
      "Ransomware protection + tested backups",
      "Phishing simulation and employee training",
      "HIPAA, PCI-DSS, and CCPA compliance support",
    ],
    range: rangeLabel("cybersecurity"),
    cta: "See cybersecurity",
  },
];

const whyUs = [
  {
    Icon: MapPin,
    title: "Actually local",
    desc: "Local to Sonoma County. On-site support across the North Bay within the same day for most clients.",
  },
  {
    Icon: User,
    title: "One point of contact",
    desc: "You talk to the same person every time — not a ticketing system or a different tech each call.",
  },
  {
    Icon: Receipt,
    title: "Flat-fee pricing",
    desc: "No hourly billing. You know what you'll pay before work starts. No surprises on your invoice.",
  },
  {
    Icon: CalendarOff,
    title: "No long-term contracts",
    desc: "Month-to-month for support and maintenance. We earn your business every month, not just at signing.",
  },
];

export default function ServicesPage() {
  return (
    <div className="theme-dark">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-0 px-6 pt-32 pb-20">
        {/* Quiet ambient copper glow — position:absolute, aria-hidden → CLS 0,
            never blocks the headline LCP. No spotlight (kept calm on this page). */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, var(--copper-glow), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <RevealOnScroll
            as="p"
            direction="up"
            distance={10}
            duration={0.5}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serving Sonoma County Since 2022
          </RevealOnScroll>
          <h1
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-warm md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Technology that works for your business —{" "}
            <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
              not the other way around.
            </span>
          </h1>
          <RevealOnScroll
            as="p"
            direction="up"
            delay={0.15}
            distance={12}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2 md:text-xl"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Copper Bay Tech builds and looks after websites for small
            businesses across Sonoma County — with IT support and cybersecurity
            folded in. Local to the North Bay. Flat fees. No long-term contracts.
            Real humans who pick up the phone.
          </RevealOnScroll>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-ink-0 px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-6">
          {services.map((service, i) => (
            <RevealOnScroll key={service.slug} delay={i * 0.08}>
              <SpotlightCard radius={20}>
                <div className="p-8 md:p-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {/* Icon */}
                    <span
                      className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-hairline bg-ink-3"
                      aria-hidden
                    >
                      <service.Icon size={26} className="text-copper-bright" />
                    </span>
                    <div className="flex-1">
                      <h2
                        className="mb-1 text-2xl font-bold text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {service.title}
                      </h2>
                      <p
                        className="mb-4 font-semibold text-copper-bright"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {service.tagline}
                      </p>
                      <p
                        className="mb-6 leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {service.desc}
                      </p>
                      <ul className="mb-6 space-y-2.5">
                        {service.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-center gap-2.5 text-sm text-warm-2"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-copper" />{" "}
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-6">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-copper-bright underline-offset-4 transition-colors hover:text-copper hover:underline focus-visible:outline-none focus-visible:underline"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {service.cta}
                          <ArrowRight size={15} aria-hidden />
                        </Link>
                        <span
                          className="text-sm text-warm-3"
                          style={{ fontFamily: "var(--font-mono, var(--font-body))" }}
                        >
                          Starting at {service.range}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Why local */}
      <section className="bg-ink-1 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <RevealOnScroll className="mb-12">
            <h2
              className="mb-4 text-balance text-3xl font-bold text-warm md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why Sonoma County businesses work with Copper Bay Tech
            </h2>
            <p
              className="max-w-2xl text-lg leading-relaxed text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              There are national IT and web firms that will take your money. Here&apos;s why local
              matters.
            </p>
          </RevealOnScroll>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-hairline bg-ink-2 p-6 text-center">
                  <span
                    className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-ink-3"
                    aria-hidden
                  >
                    <item.Icon size={20} className="text-copper" />
                  </span>
                  <h3
                    className="mb-2 font-bold text-warm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-warm-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Areas served */}
      <section className="bg-ink-0 px-6 py-16">
        <RevealOnScroll className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-4 text-2xl font-bold text-warm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serving all of Sonoma County
          </h2>
          <p
            className="mb-6 text-base text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Sonoma · Windsor · Healdsburg ·
            Cotati · Bodega Bay · Cloverdale · Guerneville
          </p>
          <p
            className="text-sm text-warm-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Remote work is available everywhere. On-site visits are available throughout the North
            Bay.
          </p>
        </RevealOnScroll>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-1 px-6 py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, var(--copper-glow), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <RevealOnScroll className="relative z-10 mx-auto max-w-3xl text-center">
          <h2
            className="mb-4 text-balance text-3xl font-bold text-warm md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not sure where to start?
          </h2>
          <p
            className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book a free 30-minute consultation. We&apos;ll learn about your business and tell you
            exactly where the biggest risks and opportunities are — whether or not you hire us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticCTA
              as="link"
              href={BOOKING_URL}
              shine
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-3 font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a free consultation
              <ArrowRight size={16} aria-hidden />
            </MagneticCTA>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-semibold text-warm-2 underline-offset-4 transition-colors hover:text-warm hover:underline focus-visible:outline-none focus-visible:underline"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              See pricing estimates
              <ArrowRight size={14} aria-hidden className="opacity-70" />
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />
    </div>
  );
}
