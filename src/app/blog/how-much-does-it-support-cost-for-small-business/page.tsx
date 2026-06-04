import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogEmailCapture from "@/components/BlogEmailCapture";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How Much Does IT Support Cost for a Small Business? | Copper Bay Tech",
  description:
    "Hourly? Retainer? Break-fix? Here's what IT support actually costs for small businesses in Sonoma County — and how to avoid overpaying.",
  openGraph: {
    url: "https://copperbaytech.com/blog/how-much-does-it-support-cost-for-small-business",
  },
};

const models = [
  {
    name: "Break-fix / hourly",
    cost: "$100–$175/hr",
    good: "You call when something breaks. Low commitment.",
    bad: "No incentive for the vendor to prevent problems. Expensive when things go wrong. No predictable budget.",
  },
  {
    name: "Monthly retainer",
    cost: "$250–$1,500/mo",
    good: "Predictable cost. Vendor is incentivized to keep things running. You get proactive support.",
    bad: "You pay whether you need it or not. Scope needs to be clearly defined.",
  },
  {
    name: "Per-device / per-user",
    cost: "$50–$150/device/mo",
    good: "Scales with your team. Clear pricing model.",
    bad: "Can add up fast for larger teams. Variable month to month.",
  },
  {
    name: "Flat-fee project",
    cost: "$800–$5,000+",
    good: "Clear scope and price. Great for one-time work like network setup or cloud migration.",
    bad: "Doesn't cover ongoing support after delivery.",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How Much Does IT Support Cost for a Small Business?", description: "Hourly? Retainer? Break-fix? Here's what IT support actually costs for small businesses in Sonoma County — and how to avoid overpaying.", url: "https://copperbaytech.com/blog/how-much-does-it-support-cost-for-small-business", datePublished: "2026-05-15" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "IT Support Cost Small Business" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              IT Support
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How Much Does IT Support Cost for a Small Business in Sonoma County?
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read · May 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
              &quot;What does IT support cost?&quot; is one of the most Googled questions by small business owners — and one of the hardest to answer honestly. The range is enormous, and vendors aren&apos;t exactly incentivized to give you a straight number upfront. Here&apos;s a plain-English breakdown.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The four pricing models
            </h2>

            <div className="space-y-5 mb-10">
              {models.map((m) => (
                <div key={m.name} className="rounded-xl border border-[#18181B]/10 p-6 bg-[#FAFAF9]">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{m.name}</h3>
                    <span className="text-sm font-semibold text-[#F97316] whitespace-nowrap" style={{ fontFamily: "var(--font-heading)" }}>{m.cost}</span>
                  </div>
                  <p className="text-sm text-[#16A34A] mb-1"><strong>Good:</strong> {m.good}</p>
                  <p className="text-sm text-[#DC2626]"><strong>Watch out:</strong> {m.bad}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What most Sonoma County small businesses actually pay
            </h2>
            <p className="mb-6 text-[#3F3F46]/70">
              A 1–5 person business with basic IT needs (network, a few workstations, cloud tools) typically pays <strong className="text-[#18181B]">$250–$500/month</strong> on a retainer, or $100–$150/hr on a break-fix basis. A 10–30 person business with more infrastructure complexity is usually in the <strong className="text-[#18181B]">$500–$1,500/month</strong> range.
            </p>
            <p className="mb-6 text-[#3F3F46]/70">
              One-time projects — like setting up a new office network, migrating to Google Workspace, or doing a security audit — typically run <strong className="text-[#18181B]">$800–$3,000</strong> flat.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Red flags that cost you money
            </h2>
            <ul className="space-y-3 mb-8 text-[#3F3F46]/70">
              {[
                "Vendors who won't give you a price until after a long discovery process — usually means they're sizing you up, not scoping the work.",
                "Hourly billing with no cap — one bad month could cost you $2,000+ with no warning.",
                "All-in MSP contracts that bundle services you don't need — you're paying for enterprise-tier monitoring for a 4-person office.",
                "No documentation of your setup — means you're hostage to the vendor.",
              ].map((flag, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              How to figure out what you actually need
            </h2>
            <p className="mb-6 text-[#3F3F46]/70">
              Start with a free consultation. Any reputable IT firm should be able to assess your situation, tell you what they&apos;d recommend, and give you a flat price — all in a 30-minute call. If the first call is all pitch and no information, that&apos;s a sign.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
              <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>The bottom line</p>
              <p className="text-sm text-[#3F3F46]/60">
                Most small businesses in Sonoma County can get solid IT support for $250–$750/month. Anything more than that should come with clear justification. Anything less and you should ask what&apos;s not included.
              </p>
            </div>

            <BlogEmailCapture />

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Get a Free IT Assessment <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
