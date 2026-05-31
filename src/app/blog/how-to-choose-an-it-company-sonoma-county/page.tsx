import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Choose an IT Company in Sonoma County | Copper Bay Tech",
  description:
    "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
};

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <section className="grain relative pt-32 pb-8 bg-[var(--ink-900)] overflow-hidden">
          <div
            className="aurora animate-drift"
            style={{ top: "-40%", left: "20%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,133,58,0.18), transparent 65%)" }}
          />
          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="eyebrow inline-block mb-4 px-3 py-1.5 rounded-md glass-dark text-[var(--copper-300)]">
              IT Support
            </span>
            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-[1.1]"
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
                Most small businesses hire their first IT vendor after something breaks. A server goes down, ransomware hits a neighboring business and panic sets in, or a key employee quits and nobody knows the WiFi password. That&rsquo;s a bad time to be evaluating vendors.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. They should be able to explain things in plain English
              </h2>
              <p className="mb-6">
                A good IT partner doesn&rsquo;t hide behind acronyms. If you ask &ldquo;why do I need this?&rdquo; and the answer is a wall of jargon, that&rsquo;s a red flag. You&rsquo;re paying for clarity and outcomes, not technical theater. Ask a simple question in your first call and see if you get a simple answer.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. Local presence matters — especially for IT support
              </h2>
              <p className="mb-6">
                There&rsquo;s a real difference between a company that can dispatch someone to your Petaluma office in an hour and a remote helpdesk that submits a ticket on your behalf. For networking issues, hardware problems, and staff training, in-person support changes the equation completely. Ask whether they work locally and whether they&rsquo;ll show up when it counts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. Watch out for vendors who lock you in
              </h2>
              <p className="mb-6">
                Some IT companies build their business on making you dependent. They&rsquo;ll hold your passwords, refuse to document your setup, and make switching painful. A trustworthy vendor gives you complete documentation of your infrastructure, stores credentials in a shared tool you control, and doesn&rsquo;t treat your own systems as leverage.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Ask how they handle billing
              </h2>
              <p className="mb-6">
                Surprise invoices are one of the most common complaints about IT vendors. &ldquo;We worked an extra 3 hours, here&rsquo;s a bill&rdquo; is not a partnership — it&rsquo;s a liability. Look for vendors who offer flat-fee projects or clearly defined retainers with agreed scope. You should know what you&rsquo;re paying before work starts.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                5. A free consultation shouldn&rsquo;t feel like a sales pitch
              </h2>
              <p className="mb-6">
                The first call should feel like a conversation, not a close. A good IT partner will ask questions, tell you honestly what they see, and give you something useful — even if you don&rsquo;t hire them. If the first call is all about their service tiers and pricing packages before they&rsquo;ve even heard your situation, that tells you something.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[var(--linen)] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Look for someone local, clear, transparent about pricing, and more interested in understanding your situation than closing a deal. Those vendors exist — and they&rsquo;re worth the effort to find.
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
                className="btn-copper inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
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
