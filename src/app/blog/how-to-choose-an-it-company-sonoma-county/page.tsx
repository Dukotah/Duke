import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Choose an IT Company in Sonoma County | Copper Bay Tech",
  description:
    "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
  alternates: {
    canonical: "/blog/how-to-choose-an-it-company-sonoma-county",
  },
  openGraph: {
    title: "How to Choose an IT Company in Sonoma County | Copper Bay Tech",
    description:
      "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
    type: "article",
    publishedTime: "2026-05-01",
    authors: ["Copper Bay Tech"],
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
  description:
    "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
  datePublished: "2026-05-01",
  author: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  publisher: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  url: "https://copperbaytech.com/blog/how-to-choose-an-it-company-sonoma-county",
};

export default function Article() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
                Most small businesses hire their first IT vendor after something breaks. A server goes down, ransomware hits a neighboring business and panic sets in, or a key employee quits and nobody knows the WiFi password. That's a bad time to be evaluating vendors.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. They should be able to explain things in plain English
              </h2>
              <p className="mb-6">
                A good IT partner doesn't hide behind acronyms. If you ask "why do I need this?" and the answer is a wall of jargon, that's a red flag. You're paying for clarity and outcomes, not technical theater. Ask a simple question in your first call and see if you get a simple answer.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. Local presence matters — especially for IT support
              </h2>
              <p className="mb-6">
                There's a real difference between a company that can dispatch someone to your Petaluma office in an hour and a remote helpdesk that submits a ticket on your behalf. For networking issues, hardware problems, and staff training, in-person support changes the equation completely. Ask whether they work locally and whether they'll show up when it counts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. Watch out for vendors who lock you in
              </h2>
              <p className="mb-6">
                Some IT companies build their business on making you dependent. They'll hold your passwords, refuse to document your setup, and make switching painful. A trustworthy vendor gives you complete documentation of your infrastructure, stores credentials in a shared tool you control, and doesn't treat your own systems as leverage.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Ask how they handle billing
              </h2>
              <p className="mb-6">
                Surprise invoices are one of the most common complaints about IT vendors. "We worked an extra 3 hours, here's a bill" is not a partnership — it's a liability. Look for vendors who offer flat-fee projects or clearly defined retainers with agreed scope. You should know what you're paying before work starts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                5. A free consultation shouldn't feel like a sales pitch
              </h2>
              <p className="mb-6">
                The first call should feel like a conversation, not a close. A good IT partner will ask questions, tell you honestly what they see, and give you something useful — even if you don't hire them. If the first call is all about their service tiers and pricing packages before they've even heard your situation, that tells you something.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Look for someone local, clear, transparent about pricing, and more interested in understanding your situation than closing a deal. Those vendors exist — and they're worth the effort to find.
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
      </main>
      <Footer />
    </>
  );
}
