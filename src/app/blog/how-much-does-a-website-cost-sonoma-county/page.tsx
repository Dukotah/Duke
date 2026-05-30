import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How Much Does a Website Cost in Sonoma County? (2026) | Copper Bay Tech",
  description:
    "Real pricing for small business websites in Sonoma County. What you should expect to pay, what drives costs up, and how to avoid getting ripped off.",
  keywords: "website cost Sonoma County, how much does a website cost, web design pricing Petaluma Santa Rosa",
  alternates: { canonical: "https://copperbaytech.com/blog/how-much-does-a-website-cost-sonoma-county" },
};

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Web Development
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How Much Does a Website Cost in Sonoma County? (2026)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read · May 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 leading-relaxed mb-8">
                The honest answer is: it depends — but that's a cop-out, and you deserve better. Here's what website projects actually cost in Sonoma County in 2026, broken down by who's building it and what you're getting.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The four tiers you'll encounter
              </h2>

              <div className="space-y-6 mb-10">
                {[
                  {
                    tier: "DIY tools (Squarespace, Wix, GoDaddy)",
                    range: "$0 – $300/year",
                    honest: "You get what you pay for. These tools look fine until you try to do anything specific — add a booking form, rank locally, load fast on mobile. The template-lock is real, and the ongoing subscription cost adds up. Most businesses outgrow these within a year.",
                  },
                  {
                    tier: "Freelancers and template shops",
                    range: "$500 – $1,500",
                    honest: "Usually WordPress with a premium theme. Can look good. The problem is what's underneath: slow plugins, theme bloat, security vulnerabilities that pile up over time. You'll pay a developer $100/hour to fix things that shouldn't break.",
                  },
                  {
                    tier: "Local web design shops (Sonoma County)",
                    range: "$2,500 – $6,000",
                    honest: "This is the right range for a small business that wants something that actually works. At this price point you can get custom design, clean code, proper local SEO, and a partner who picks up the phone. Quality varies significantly — ask to see the code, not just the portfolio.",
                  },
                  {
                    tier: "Agency with a full team",
                    range: "$8,000 – $30,000+",
                    honest: "Appropriate for complex applications, e-commerce at scale, or enterprise requirements. For a local services business, you're paying for overhead — account managers, project managers, layers between you and the person building your site. Not necessary for most.",
                  },
                ].map((t) => (
                  <div key={t.tier} className="border border-[#18181B]/10 rounded-xl p-6 bg-[#FAFAF9]">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <h3 className="text-base font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{t.tier}</h3>
                      <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>{t.range}</span>
                    </div>
                    <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{t.honest}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What drives costs up
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                Within any tier, these factors push the price higher:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "More pages — a 15-page site costs more than a 5-page site",
                  "E-commerce or online booking integration",
                  "Custom photography or content writing",
                  "Rush timelines (most developers charge a rush fee)",
                  "Complex forms, calculators, or interactive features",
                  "Multilingual content",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Red flags to watch for when getting quotes
              </h2>
              <ul className="space-y-2 mb-8">
                {[
                  "Hourly billing with no cap — your final cost is unlimited",
                  "\"Maintenance\" fees that lock you into a recurring payment with no clear scope",
                  "No mention of page speed, mobile performance, or SEO in the proposal",
                  "They show you templates and call it \"custom design\"",
                  "You can't easily get your own files and hosting access if you leave",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What Copper Bay Tech charges
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                Most small business websites we build fall between <strong>$2,500 and $4,500</strong> flat. That includes custom design and code (no templates), mobile-first build, local SEO setup, Google Business Profile configuration, contact form with spam filtering, and hosting setup.
              </p>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                You get a specific quote before any work starts. If you go ahead, that number doesn't change.
              </p>

              <div className="bg-[#18181B] rounded-xl p-6 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Want an exact number for your project?</p>
                <p className="text-white/60 text-sm mb-5" style={{ fontFamily: "var(--font-body)" }}>Free 30-minute call. We'll look at what you need and give you a flat-fee quote.</p>
                <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Get a Quote <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
