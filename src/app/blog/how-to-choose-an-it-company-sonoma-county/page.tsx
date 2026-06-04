import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, faqSchema } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "lucide-react";

const blogSchema = blogPostingSchema({
  title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
  description:
    "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
  url: "https://copperbaytech.com/blog/how-to-choose-an-it-company-sonoma-county",
  datePublished: "2026-04-01",
});

export const metadata: Metadata = {
  title: "How to Choose an IT Company in Sonoma County | Copper Bay Tech",
  description:
    "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={faqSchema([
        { q: "How do I choose an IT company for my small business?", a: "Look for local presence, transparent flat-fee pricing, no long-term contracts, and a track record with businesses your size. Avoid companies that lock you into multi-year agreements or charge hourly for basic issues." },
        { q: "What questions should I ask an IT company before hiring them?", a: "Ask about response time guarantees, how they bill (hourly vs. flat), whether they have experience in your industry, what their onboarding process looks like, and for references from similar businesses." },
        { q: "Should I hire a local IT company or a national MSP?", a: "Local IT companies offer on-site support and understand the regional business environment. National MSPs may have more resources but often lack the personal attention small businesses need. For Sonoma County businesses, a local provider is usually the better fit." },
        { q: "What is a fair price for IT support for a small business?", a: "Fair pricing for small business IT support is typically $75–$150 per user per month for managed services, or $100–$175/hour for break-fix. Beware of companies charging more without clear deliverables." },
      ])} />
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
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              IT Support
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How to Choose an IT Company in Sonoma County (Without Getting Burned)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              5 min read · May 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div
              className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                Most small businesses hire their first IT vendor after something breaks. A server goes down, ransomware hits a neighboring business and panic sets in, or a key employee quits and nobody knows the WiFi password. That&apos;s a bad time to be evaluating vendors.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. They should be able to explain things in plain English
              </h2>
              <p className="mb-6">
                A good IT partner doesn&apos;t hide behind acronyms. If you ask &ldquo;why do I need this?&rdquo; and the answer is a wall of jargon, that&apos;s a red flag. You&apos;re paying for clarity and outcomes, not technical theater. Ask a simple question in your first call and see if you get a simple answer.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. Local presence matters — especially for IT support
              </h2>
              <p className="mb-6">
                There&apos;s a real difference between a company that can dispatch someone to your Petaluma office in an hour and a remote helpdesk that submits a ticket on your behalf. For networking issues, hardware problems, and staff training, in-person support changes the equation completely. Ask whether they work locally and whether they&apos;ll show up when it counts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. Watch out for vendors who lock you in
              </h2>
              <p className="mb-6">
                Some IT companies build their business on making you dependent. They&apos;ll hold your passwords, refuse to document your setup, and make switching painful. A trustworthy vendor gives you complete documentation of your infrastructure, stores credentials in a shared tool you control, and doesn&apos;t treat your own systems as leverage.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Ask how they handle billing
              </h2>
              <p className="mb-6">
                Surprise invoices are one of the most common complaints about IT vendors. &ldquo;We worked an extra 3 hours, here&apos;s a bill&rdquo; is not a partnership — it&apos;s a liability. Look for vendors who offer flat-fee projects or clearly defined retainers with agreed scope. You should know what you&apos;re paying before work starts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                5. A free consultation shouldn&apos;t feel like a sales pitch
              </h2>
              <p className="mb-6">
                The first call should feel like a conversation, not a close. A good IT partner will ask questions, tell you honestly what they see, and give you something useful — even if you don&apos;t hire them. If the first call is all about their service tiers and pricing packages before they&apos;ve even heard your situation, that tells you something.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Look for someone local, clear, transparent about pricing, and more interested in understanding your situation than closing a deal. Those vendors exist — and they&apos;re worth the effort to find.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                Talk to Copper Bay Tech <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "How do I choose an IT company for my small business?", a: "Look for local presence, transparent flat-fee pricing, no long-term contracts, and a track record with businesses your size. Avoid companies that lock you into multi-year agreements or charge hourly for basic issues." },
                { q: "What questions should I ask an IT company before hiring them?", a: "Ask about response time guarantees, how they bill (hourly vs. flat), whether they have experience in your industry, what their onboarding process looks like, and for references from similar businesses." },
                { q: "Should I hire a local IT company or a national MSP?", a: "Local IT companies offer on-site support and understand the regional business environment. National MSPs may have more resources but often lack the personal attention small businesses need. For Sonoma County businesses, a local provider is usually the better fit." },
                { q: "What is a fair price for IT support for a small business?", a: "Fair pricing for small business IT support is typically $75–$150 per user per month for managed services, or $100–$175/hour for break-fix. Beware of companies charging more without clear deliverables." },
              ].map((item) => (
                <div key={item.q} className="border border-[#18181B]/10 rounded-xl p-6 bg-white">
                  <p className="text-base font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <span className="text-[#F97316] mr-2">Q.</span>{item.q}
                  </p>
                  <p className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Looking for a local IT company in Sonoma County?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              No contracts, flat fees, real local support. Let&apos;s talk about what your business actually needs.
            </p>
            <Link href="/it-support-sonoma-county" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              Learn About Our IT Support <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
