import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Web Design Santa Rosa CA | Custom Websites | Copper Bay Tech",
  description:
    "Custom website design for Santa Rosa businesses. Fast, mobile-first, built to convert. Local web designer serving Santa Rosa and all of Sonoma County.",
  keywords:
    "web design Santa Rosa, website design Santa Rosa CA, web developer Santa Rosa, small business website Santa Rosa",
  alternates: { canonical: "https://copperbaytech.com/web-design-santa-rosa" },
  openGraph: {
    title: "Web Design Santa Rosa | Copper Bay Tech",
    description: "Custom websites for Santa Rosa small businesses.",
    url: "https://copperbaytech.com/web-design-santa-rosa",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "Web Design Santa Rosa",
  description: "Custom website design for Santa Rosa small businesses.",
  url: "https://copperbaytech.com/web-design-santa-rosa",
  areaServed: { "@type": "City", name: "Santa Rosa", containedInPlace: { "@type": "State", name: "California" } },
});

const includes = [
  "Custom-coded — no Squarespace, no Wix, no WordPress themes",
  "90+ Google PageSpeed score, mobile-first",
  "Local SEO targeting Santa Rosa search queries",
  "Google Business Profile setup for Santa Rosa",
  "Contact form with spam filtering",
  "Flat fee quoted upfront — no hourly billing",
  "Live in 2–3 weeks",
  "30 days post-launch support included",
];

const industries = [
  "Restaurants & food service",
  "Home services (contractors, plumbers, electricians)",
  "Health & wellness practitioners",
  "Retail shops",
  "Professional services (law, insurance, accounting)",
  "Real estate agents & brokers",
  "Nonprofits",
  "Trades & skilled services",
];

export default function WebDesignSantaRosa() {
  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={breadcrumbSchema([{name:"Home",url:"https://copperbaytech.com"},{name:"Web Design",url:"https://copperbaytech.com/web-design-sonoma-county"},{name:"Web Design Santa Rosa"}])} />
      <Nav />
      <main className="theme-dark min-h-screen bg-ink-0 text-white">
        {/* Hero */}
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-ink-0 pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <pattern id="topo-sr" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#DDAA75" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#DDAA75" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#DDAA75" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo-sr)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(221,170,117,0.15)", color: "#DDAA75", border: "1px solid rgba(221,170,117,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Santa Rosa, CA · Web Design
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Web design for<br />
              <span style={{ color: "#DDAA75" }}>Santa Rosa businesses.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Custom-coded websites that load fast, look great on mobile, and rank for Santa Rosa search terms. Built to turn visitors into leads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-bold text-ink-0 bg-copper hover:bg-copper-bright"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                See Pricing
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink-0 to-transparent" />
        </section>

        {/* What's included */}
        <section className="py-24 bg-ink-0">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>Every site includes</p>
                <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  What Santa Rosa businesses get.
                </h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} color="#DDAA75" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-bold text-ink-0 bg-copper hover:bg-copper-bright"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Get a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>Industries we work with</p>
                <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>Who we build for in Santa Rosa.</h3>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((ind) => (
                    <div key={ind} className="bg-ink-1 rounded-lg p-3 border border-hairline text-sm text-zinc-400" style={{ fontFamily: "var(--font-body)" }}>
                      {ind}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why local matters */}
        <section className="py-24 bg-ink-1">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>Why local matters</p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                A Santa Rosa website built for Santa Rosa customers.
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                When someone in Santa Rosa searches for your type of business, you want to show up. That means local SEO signals, location-specific content, and Google Business Profile optimization — all built in.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Local SEO targeting", body: "We write content and structure metadata around Santa Rosa search terms — not generic keywords that you'll never rank for." },
                { label: "Google Business Profile", body: "We set up and optimize your GBP listing so you show up in the local map pack when nearby customers search." },
                { label: "On-site when needed", body: "We're based in Sonoma County. If you need a meeting, a photo shoot, or on-site review — we can be there." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-ink-2 p-6 border border-hairline">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{item.label}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-ink-0">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              &ldquo;Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we&apos;ve already gotten three new inquiries through the site.&rdquo;
            </p>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Maria T.</p>
            <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Owner, Petaluma Home Staging Co.</p>
            <p className="mt-5 text-[11px] italic text-white/30" style={{ fontFamily: "var(--font-body)" }}>
              Representative example — illustrates the kind of work and results we aim for, not a verified quote from a specific named client.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-ink-1">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Ready to get started?
            </h2>
            <p className="text-lg text-zinc-400 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute consultation. We&apos;ll look at your current situation and tell you exactly what we&apos;d build.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-bold text-ink-0 bg-copper hover:bg-copper-bright"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/web-design-sonoma-county"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
