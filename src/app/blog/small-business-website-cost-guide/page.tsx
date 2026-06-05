import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How Much Does a Business Website Cost in 2026? A Plain-English Guide | Copper Bay Tech",
  description:
    "DIY builders, freelancers, agencies, custom dev — the honest price ranges, what drives costs up, and what you should expect to pay in Sonoma County.",
  openGraph: {
    url: "https://copperbaytech.com/blog/small-business-website-cost-guide",
  },
};

const tiers = [
  {
    label: "DIY Website Builders",
    range: "$0 – $50 / month",
    examples: "Squarespace, Wix, Webflow (template)",
    pros: "Cheapest upfront cost, launch in a day",
    cons: "Template look, limited customization, poor performance at scale, you own the maintenance",
    fit: "Solo operators, side projects, early-stage businesses with no budget",
  },
  {
    label: "Freelance Developer",
    range: "$500 – $2,500 one-time",
    examples: "Upwork, local freelancer, referral hire",
    pros: "Affordable, often faster than agencies",
    cons: "Quality varies wildly, limited support after launch, may disappear",
    fit: "Small businesses with simple needs and limited budgets",
  },
  {
    label: "Marketing / Design Agency",
    range: "$5,000 – $50,000+",
    examples: "Full-service regional or national agencies",
    pros: "Full creative team, strategy included",
    cons: "High cost, slow process, often over-engineered for small businesses",
    fit: "Mid-size companies with marketing budgets and complex needs",
  },
  {
    label: "Custom Development (Small Studio / Consultant)",
    range: "$2,500 – $8,000",
    examples: "Local dev shops, specialized consultants",
    pros: "Built for your specific needs, better performance, ongoing relationship",
    cons: "Requires clear scope and good communication",
    fit: "Growing small businesses that need something that actually performs",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How Much Does a Business Website Cost in 2026? A Plain-English Guide", description: "DIY builders, freelancers, agencies, custom dev — the honest price ranges, what drives costs up, and what you should expect to pay in Sonoma County.", url: "https://copperbaytech.com/blog/small-business-website-cost-guide", datePublished: "2026-06-15" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Business Website Cost Guide 2026" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Web Development
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How Much Does a Business Website Cost in 2026? A Plain-English Guide
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              6 min read · June 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              Website pricing is genuinely confusing because the range is enormous. You can spend $0 or $100,000 and technically have &quot;a website&quot; either way. Here&apos;s an honest breakdown of what you&apos;re actually buying at each price point.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The honest price ranges
            </h2>

            <div className="space-y-5 mb-10">
              {tiers.map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-xl border border-[#18181B]/10 p-6 bg-[#FAFAF9]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <h3
                      className="font-bold text-[#18181B]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {tier.label}
                    </h3>
                    <span
                      className="text-sm font-semibold text-[#F97316]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {tier.range}
                    </span>
                  </div>
                  <p className="text-xs text-[#3F3F46]/50 mb-3">{tier.examples}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-green-700 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Pros</p>
                      <p className="text-[#3F3F46]/60">{tier.pros}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-red-700 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Cons</p>
                      <p className="text-[#3F3F46]/60">{tier.cons}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#3F3F46]/50 mt-3">
                    <strong className="text-[#3F3F46]/70">Best for:</strong> {tier.fit}
                  </p>
                </div>
              ))}
            </div>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What drives the cost up
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "E-commerce — adding a shop, checkout, and inventory management adds significant complexity",
                "Custom features — booking systems, member portals, API integrations, custom calculators",
                "Content writing — if you need someone to write your pages, that's a separate cost ($75–$200 per page from a professional)",
                "Photography and video — stock photos are cheap; custom photography adds $500–$3,000",
                "Ongoing changes — most fixed-fee projects don't include unlimited future edits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">{item}</span>
                </li>
              ))}
            </ul>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What drives the cost down
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "A clear, documented scope before work starts — scope creep is the #1 budget killer",
                "Fast feedback — projects stall when clients take weeks to review drafts",
                "Existing brand assets — if you have a logo, colors, and fonts already, that's a meaningful head start",
                "Content ready to go — providing your own copy and images eliminates a major cost center",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">{item}</span>
                </li>
              ))}
            </ul>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why the cheapest option often costs more
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              A $500 freelancer website that loads in 8 seconds, doesn&apos;t rank on Google, and breaks when you try to update it isn&apos;t saving you money — it&apos;s costing you customers every day it&apos;s live. The math changes quickly when you factor in the revenue a good website should be generating.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              The other hidden cost is rebuilding. Most businesses that buy the cheapest option find themselves rebuilding 18–24 months later, paying twice. A well-built site from the start, even at higher upfront cost, often works out cheaper over 3–5 years.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What to expect in Sonoma County
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              For a professional small business website — 5–10 pages, clean design, mobile-optimized, Google-ready — expect to pay $2,500–$5,000 from a local developer or small studio. That includes design, development, basic SEO setup, and a handoff so you can manage it yourself going forward.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              E-commerce, booking systems, or custom integrations push that into the $5,000–$8,000 range. Anything significantly above that for a small business should prompt questions about whether you&apos;re paying for complexity you actually need.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p
                className="text-sm font-semibold mb-2 text-[#F97316]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Want an instant estimate?
              </p>
              <p className="text-sm text-white/70 mb-4">
                Our pricing estimator gives you a ballpark in under 2 minutes based on what you actually need — no email required.
              </p>
              <Link
                href="/tools/website-cost-estimator"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Use the Pricing Estimator <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
