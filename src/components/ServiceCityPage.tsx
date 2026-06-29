import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import { PRICING } from "@/config/pricing";
import { SERVICE_CITIES, SERVICE_META } from "@/config/serviceCities";
import { ArrowRight, Check } from "lucide-react";
import { MeshGradient, RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

// Map a service label to its pricing.ts key so each page can emit a price range.
const PRICE_KEY: Record<string, keyof typeof PRICING> = {
  "Web Design": "web",
  "IT Support": "it",
  "Cybersecurity": "cybersecurity",
  "AI Integration": "ai",
  "Custom Software": "custom",
};

// Map a service label to its serviceCities key (for the cross-service block).
const SERVICE_TO_CITYKEY: Record<string, "web" | "it" | "cyber" | "custom"> = {
  "Web Design": "web",
  "IT Support": "it",
  "Cybersecurity": "cyber",
  "Custom Software": "custom",
};

/**
 * Reusable template for "{service} in {city}" landing pages — the local
 * service × city matrix. Driven entirely by props so a new page is a small
 * data file, not a 190-line copy.
 *
 * ⚠️ SEO guardrail: only create these with genuinely UNIQUE local content
 * (real local industries, named pain points, city-specific FAQs). Near-identical
 * clones across towns are "doorway pages" and get demoted — especially on a
 * young domain. Quality per page beats quantity of pages.
 *
 * Emits Service + BreadcrumbList + FAQPage schema. No testimonials here — never
 * embed an attributed quote that isn't a real, approved client review.
 *
 * Visual system: dark canvas + rationed copper (ELEVATED_DESIGN_PLAYBOOK). This
 * is a server component for LCP/SEO; the dark look is all CSS tokens + the
 * shared, guard-railed motion primitives (each ships its own mobile + RM branch),
 * so any change here multiplies cleanly across ~35 generated pages.
 */
export interface ServiceCityPageProps {
  service: string; // e.g. "Cybersecurity"
  city: string; // e.g. "Santa Rosa"
  canonical: string; // full URL
  /** Breadcrumb parent — the canonical service hub. */
  hub: { href: string; label: string };
  heroEyebrow?: string;
  /** One-line hero subhead. */
  heroBlurb: string;
  /** 1–2 paragraphs of genuinely city-specific context. */
  intro: string[];
  includesTitle?: string;
  includes: string[];
  industriesTitle?: string;
  industries: string[];
  /** Visible FAQ — also emitted as FAQPage schema, so keep them real + local. */
  faqs: { q: string; a: string }[];
  /** Cross-links to sibling pages (nearby cities / the hub). */
  nearby: { href: string; label: string }[];
  ctaBlurb?: string;
}

export default function ServiceCityPage({
  service,
  city,
  canonical,
  hub,
  heroEyebrow,
  heroBlurb,
  intro,
  includesTitle = `What ${city} businesses get`,
  includes,
  industriesTitle = `Who we help in ${city}`,
  industries,
  faqs,
  nearby,
  ctaBlurb = "Free 30-minute call. We'll tell you honestly what we'd fix first and what it would cost — no pressure.",
}: ServiceCityPageProps) {
  const priceKey = PRICE_KEY[service];
  const offer = priceKey ? { low: PRICING[priceKey].low, high: PRICING[priceKey].high } : undefined;
  // Auto cross-link the OTHER services available in this same city.
  const cityEntry = SERVICE_CITIES[city];
  const currentKey = SERVICE_TO_CITYKEY[service];
  const otherServices = cityEntry
    ? (["web", "it", "cyber", "custom"] as const)
        .filter((k) => k !== currentKey && cityEntry[k])
        .map((k) => ({ href: `/${SERVICE_META[k].prefix}-${cityEntry.slug}`, label: SERVICE_META[k].label }))
    : [];
  return (
    <>
      <JsonLd
        schema={serviceSchema({
          name: `${service} in ${city}`,
          description: `${service} services for ${city}, California small businesses from Copper Bay Tech.`,
          url: canonical,
          areaServed: { "@type": "City", name: city, containedInPlace: { "@type": "State", name: "California" } },
          offer,
        })}
      />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", url: "https://copperbaytech.com" },
          { name: hub.label, url: `https://copperbaytech.com${hub.href}` },
          { name: `${service} ${city}` },
        ])}
      />
      {faqs.length > 0 && <JsonLd schema={faqSchema(faqs)} />}
      <Nav />
      <main className="theme-dark">
        {/* Hero — template-level hero effect: shared copper mesh-gradient + cursor
            spotlight (desktop), orbs-only on mobile, perfectly still under RM.
            The <h1> is the LCP: plain warm text, present in markup, paints before
            any motion. */}
        <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-ink-0 pt-16">
          <MeshGradient spotlight blur={80} />

          <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-6 inline-block rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {heroEyebrow ?? `${city}, CA · ${service}`}
            </RevealOnScroll>
            <h1
              className="mb-6 text-balance text-[2.6rem] font-bold leading-[1.08] tracking-tight text-warm sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {service} for
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                {city} businesses.
              </span>
            </h1>
            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              distance={12}
              className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2 md:text-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {heroBlurb}
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.2}
              distance={12}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-3.5 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Assessment <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-hairline bg-ink-2 px-8 py-3.5 text-base font-semibold text-warm transition-colors duration-200 hover:border-copper-dim hover:text-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See Pricing
              </Link>
            </RevealOnScroll>
          </div>
        </section>

        {/* Intro — local context */}
        <section className="bg-ink-0 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Link href="/" className="transition-colors hover:text-copper-bright">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={hub.href} className="transition-colors hover:text-copper-bright">{hub.label}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-warm-2">{service} in {city}</span>
            </nav>
            <RevealOnScroll className="space-y-5">
              {intro.map((p, i) => (
                <p key={i} className="leading-relaxed text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{p}</p>
              ))}
            </RevealOnScroll>
          </div>
        </section>

        {/* Includes + industries */}
        <section className="bg-ink-1 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid items-start gap-16 md:grid-cols-2">
              <RevealOnScroll>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-copper" style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}>What&apos;s included</p>
                <h2 className="mb-6 text-3xl font-bold text-warm" style={{ fontFamily: "var(--font-heading)" }}>{includesTitle}.</h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-copper" aria-hidden={true} />
                      <span className="text-sm leading-relaxed text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-copper" style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}>Industries we support</p>
                <h2 className="mb-6 text-2xl font-bold text-warm" style={{ fontFamily: "var(--font-heading)" }}>{industriesTitle}.</h2>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((ind) => (
                    <div key={ind} className="rounded-lg border border-hairline bg-ink-2 p-3 text-sm text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{ind}</div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="bg-ink-0 py-20">
            <div className="mx-auto max-w-3xl px-6">
              <RevealOnScroll
                as="h2"
                className="mb-8 text-3xl font-bold text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {service} in {city} — common questions
              </RevealOnScroll>
              <div className="space-y-6">
                {faqs.map((f, i) => (
                  <RevealOnScroll key={f.q} delay={Math.min(i * 0.06, 0.3)}>
                    <h3 className="mb-2 font-bold text-warm" style={{ fontFamily: "var(--font-heading)" }}>{f.q}</h3>
                    <p className="text-sm leading-relaxed text-warm-2" style={{ fontFamily: "var(--font-body)" }}>{f.a}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other services we offer in this same city (matrix-driven cross-sell) */}
        {otherServices.length > 0 && (
          <section className="border-t border-hairline bg-ink-1 py-14">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <RevealOnScroll>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper" style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}>More for {city} businesses</p>
                <h2 className="mb-7 text-2xl font-bold text-warm md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Other services we offer in {city}.
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {otherServices.map((s) => (
                    <Link key={s.href} href={s.href} className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-ink-2 px-5 py-3 text-sm font-semibold text-warm transition-colors hover:border-copper-dim hover:text-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {s.label} in {city} <ArrowRight size={14} aria-hidden={true} />
                    </Link>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </section>
        )}

        {/* Nearby / hub cross-links */}
        <section className="border-t border-hairline bg-ink-0 py-12">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm text-warm-3" style={{ fontFamily: "var(--font-body)" }}>
              Also serving{" "}
              {nearby.map((n, i) => (
                <span key={n.href}>
                  <Link href={n.href} className="font-semibold text-copper-bright underline-offset-4 hover:underline">{n.label}</Link>
                  {i < nearby.length - 1 ? (i === nearby.length - 2 ? ", and " : ", ") : "."}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-hairline bg-ink-0 py-24">
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll
              as="h2"
              className="mb-6 text-balance text-4xl font-bold text-warm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Worried about {service.toLowerCase()}? Let&apos;s talk.
            </RevealOnScroll>
            <RevealOnScroll
              as="p"
              delay={0.1}
              className="mb-10 text-lg text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {ctaBlurb}
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              delay={0.2}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-8 py-3.5 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Assessment <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center rounded-lg border border-hairline bg-ink-2 px-8 py-3.5 text-base font-semibold text-warm transition-colors duration-200 hover:border-copper-dim hover:text-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Call (707) 239-6725
              </a>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
