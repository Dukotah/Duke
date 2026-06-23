import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight, CheckCircle2, Clock, Star, Zap, Search, Smartphone } from "lucide-react";
import Problem from "@/components/Problem";
import WhyUs from "@/components/WhyUs";

export const metadata: Metadata = {
  title: "Web Design Sonoma County | Custom Websites | Copper Bay Tech",
  description:
    "Custom-coded websites for Sonoma County small businesses. No templates, no page builders — fast, mobile-first, built to convert. Serving Petaluma, Santa Rosa, Sebastopol.",
  keywords:
    "web design Sonoma County, web design Petaluma, web design Santa Rosa, custom website small business North Bay, website development Sonoma County",
  alternates: { canonical: "https://copperbaytech.com/web-design-sonoma-county" },
  openGraph: {
    title: "Web Design Sonoma County | Copper Bay Tech",
    description:
      "Custom websites for Sonoma County businesses. Fast, mobile-first, built to convert.",
    url: "https://copperbaytech.com/web-design-sonoma-county",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "Web Design & Development",
  description:
    "Custom-coded business websites for Sonoma County small businesses. No templates, no page builders.",
  url: "https://copperbaytech.com/web-design-sonoma-county",
  areaServed: "Sonoma County, CA",
});

const deliverables = [
  { icon: Zap, label: "Fast load times", body: "Custom-coded in Next.js — no bloated page builders. Most sites score 90+ on Google PageSpeed." },
  { icon: Smartphone, label: "Mobile-first", body: "Over 60% of your traffic is on a phone. We design for that first, desktop second." },
  { icon: Search, label: "Local SEO built in", body: "Schema markup, Google Business Profile setup, and location-targeted content baked in from day one." },
  { icon: Star, label: "No templates", body: "Every site is designed and coded from scratch for your business. No Squarespace. No Wix. No WordPress themes." },
  { icon: Clock, label: "2–3 week turnaround", body: "We set a launch date before we start and hold to it. Most business sites are live in under three weeks." },
  { icon: CheckCircle2, label: "Flat-fee pricing", body: "You get a quote upfront and that's the number. No hourly billing, no surprise invoices at the end." },
];

const process = [
  { step: "01", title: "Discovery call", body: "We spend 30 minutes learning your business, your customers, and what you want visitors to do when they land on the site." },
  { step: "02", title: "Design & copy", body: "We send you a design mockup and page copy for review before a single line of code is written." },
  { step: "03", title: "Build & test", body: "Once you approve the direction, we build it out — fully coded, tested on real devices across browsers." },
  { step: "04", title: "Launch & hand off", body: "We push the site live, set up hosting, domain, and email, and walk you through how to request changes going forward." },
];

const faqs = [
  {
    q: "What does a website cost?",
    a: "Most small business websites fall in the $2,500–$4,500 range depending on the number of pages and complexity. You'll get a flat-fee quote before any work starts — no hourly billing.",
  },
  {
    q: "How long does it take?",
    a: "Most sites go live in 2–3 weeks. Complex projects with custom functionality can take 4–6 weeks. We agree on a timeline upfront and stick to it.",
  },
  {
    q: "Do you use WordPress or Squarespace?",
    a: "No. We custom-code every site. This means faster load times, better security, easier SEO, and no dependency on plugin ecosystems that break over time.",
  },
  {
    q: "Will I be able to make updates myself?",
    a: "Yes. We build a simple editing layer so you can update text and images without touching code. Structural changes (new pages, layout edits) we handle for you — usually same-day.",
  },
  {
    q: "Do you work with businesses outside Petaluma and Santa Rosa?",
    a: "Web work is fully remote, so we work with businesses across Sonoma County and beyond. IT support is prioritized locally, but web clients can be anywhere in California.",
  },
];

export default function WebDesignSonomaCounty() {
  return (
    <>
      <JsonLd schema={[schema, faqSchema(faqs)]} />
      <JsonLd schema={breadcrumbSchema([{name:"Home",url:"https://copperbaytech.com"},{name:"Web Design",url:"https://copperbaytech.com/web-design-sonoma-county"},{name:"Web Design Sonoma County"}])} />
      <Nav />
      <main className="theme-dark min-h-screen bg-ink-0 text-white">
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-ink-0 pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <pattern id="topo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#DDAA75" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#DDAA75" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#DDAA75" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(221,170,117,0.15)", color: "#DDAA75", border: "1px solid rgba(221,170,117,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Sonoma County · Web Design
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Web design for<br />
              <span style={{ color: "#DDAA75" }}>Sonoma County businesses.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Custom-coded websites that load fast, look sharp on every device, and are built to turn visitors into leads. No templates, no page builders, no surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-bold text-ink-0 bg-copper hover:bg-copper-bright transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold border border-hairline text-white hover:border-copper-dim transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
              Serving Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Windsor · Healdsburg
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink-0 to-transparent" />
        </section>

        <Problem />

        {/* What you get */}
        <section className="py-24 bg-ink-1">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>What&apos;s included</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What every site gets.
              </h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                These aren&apos;t upsells — they&apos;re table stakes. Every Copper Bay Tech site ships with all of this.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliverables.map((d) => (
                <div key={d.label} className="bg-ink-2 rounded-xl p-6 border border-hairline">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(221,170,117,0.1)" }}>
                    <d.icon size={20} color="#DDAA75" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{d.label}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study pull */}
        <section className="py-24 bg-ink-0">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>Client Result</p>
            <blockquote>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                &ldquo;Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we&apos;ve already gotten three new inquiries through the site.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-copper-bright" style={{ fontFamily: "var(--font-heading)" }}>MT</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Maria T.</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Owner, Petaluma Home Staging Co.</p>
                </div>
              </footer>
              <p className="mt-6 text-[11px] italic text-white/30" style={{ fontFamily: "var(--font-body)" }}>
                Representative example — illustrates the kind of work and results we aim for, not a verified quote from a specific named client.
              </p>
            </blockquote>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: "8s → 1.4s", label: "Load time" },
                { value: "8", label: "New inquiries in 6 weeks" },
                { value: "11 days", label: "Time to launch" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>{m.value}</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-ink-1">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4" style={{ fontFamily: "var(--font-heading)" }}>How it works</p>
              <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>From call to live site in under three weeks.</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {process.map((p) => (
                <div key={p.step} className="flex gap-5">
                  <span className="text-4xl font-bold text-white/10 leading-none flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>{p.step}</span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{p.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WhyUs />

        {/* FAQ */}
        <section className="py-24 bg-ink-0">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>Common questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="bg-ink-1 rounded-xl border border-hairline p-6">
                  <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.q}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-ink-1">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Ready for a website that actually works?
            </h2>
            <p className="text-lg text-zinc-400 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Schedule a free 30-minute call. We&apos;ll look at your current site (if you have one), talk through what you need, and give you a quote — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-bold text-ink-0 bg-copper hover:bg-copper-bright transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold border border-hairline text-white hover:border-copper-dim transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
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
