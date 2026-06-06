import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import { PRICING } from "@/config/pricing";
import { ArrowRight, Check } from "lucide-react";

// Map a service label to its pricing.ts key so each page can emit a price range.
const PRICE_KEY: Record<string, keyof typeof PRICING> = {
  "Web Design": "web",
  "IT Support": "it",
  "Cybersecurity": "cybersecurity",
  "AI Integration": "ai",
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
  const patternId = `topo-${service}-${city}`.toLowerCase().replace(/[^a-z]/g, "");
  const priceKey = PRICE_KEY[service];
  const offer = priceKey ? { low: PRICING[priceKey].low, high: PRICING[priceKey].high } : undefined;
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
      <main>
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}>
              {heroEyebrow ?? `${city}, CA · ${service}`}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              {service} for<br />
              <span style={{ color: "#F97316" }}>{city} businesses.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {heroBlurb}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                Get a Free Assessment <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]" style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}>
                See Pricing
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
        </section>

        {/* Intro — local context */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6 space-y-5">
            {intro.map((p, i) => (
              <p key={i} className="text-[#3F3F46]/75 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{p}</p>
            ))}
          </div>
        </section>

        {/* Includes + industries */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>What&apos;s included</p>
                <h2 className="text-3xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>{includesTitle}.</h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} color="#F97316" className="flex-shrink-0 mt-0.5" aria-hidden={true} />
                      <span className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Industries we support</p>
                <h2 className="text-2xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>{industriesTitle}.</h2>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((ind) => (
                    <div key={ind} className="bg-white rounded-lg p-3 border border-[#18181B]/8 text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>{ind}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                {service} in {city} — common questions
              </h2>
              <div className="space-y-6">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.q}</h3>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nearby / hub cross-links */}
        <section className="py-12 bg-[#FAFAF9] border-t border-[#18181B]/8">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-[#3F3F46]/60" style={{ fontFamily: "var(--font-body)" }}>
              Also serving{" "}
              {nearby.map((n, i) => (
                <span key={n.href}>
                  <Link href={n.href} className="text-[#F97316] font-semibold hover:underline">{n.label}</Link>
                  {i < nearby.length - 1 ? (i === nearby.length - 2 ? ", and " : ", ") : "."}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Worried about {service.toLowerCase()}? Let&apos;s talk.
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>{ctaBlurb}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                Get a Free Assessment <ArrowRight size={16} />
              </Link>
              <a href="tel:+17072396725" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]" style={{ border: "2px solid rgba(255,255,255,0.3)", fontFamily: "var(--font-heading)" }}>
                Call (707) 239-6725
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
