import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "lucide-react";

const blogSchema = blogPostingSchema({
  title: "How AI Actually Helps a Sonoma County Small Business (2026)",
  description:
    "Practical, non-hype ways small businesses are using AI in 2026 — answering every call, responding to leads in seconds, automating reviews, and clearing the busywork. What works, what to skip, and where to start.",
  url: "https://copperbaytech.com/blog/how-ai-helps-sonoma-county-small-businesses",
  datePublished: "2026-06-02",
});

export const metadata: Metadata = {
  title: "How AI Actually Helps a Sonoma County Small Business (2026) | Copper Bay Tech",
  description:
    "The practical, no-hype ways small businesses use AI in 2026: answer every call, respond to leads instantly, automate reviews, and kill busywork. What works and where to start.",
  keywords:
    "AI for small business, AI small business Sonoma County, AI receptionist Petaluma, AI automation Santa Rosa, missed call text back, small business AI 2026",
  alternates: {
    canonical: "https://copperbaytech.com/blog/how-ai-helps-sonoma-county-small-businesses",
  },
  openGraph: {
    title: "How AI Actually Helps a Sonoma County Small Business (2026) | Copper Bay Tech",
    description:
      "The practical, no-hype ways small businesses use AI in 2026: answer every call, respond to leads instantly, automate reviews, and kill busywork. What works and where to start.",
    url: "https://copperbaytech.com/blog/how-ai-helps-sonoma-county-small-businesses",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "How AI Helps Small Businesses" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              AI &amp; Automation
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How AI Actually Helps a Sonoma County Small Business (2026)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read · June 2026</p>
            <p className="text-sm text-[#3F3F46]/55 mt-1" style={{ fontFamily: "var(--font-body)" }}>Updated June 2, 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-lg text-[#3F3F46]/70 leading-relaxed mb-8">
                Most of what you hear about AI is either breathless hype or doom. For a five-person shop in Petaluma or Santa Rosa, neither is useful. The practical question is simpler: <em>where does AI quietly save you money or win you a customer this week?</em> The answer, for most small businesses, comes down to a handful of unglamorous jobs — answering the phone, replying fast, and clearing repetitive admin. Here&apos;s what actually works in 2026, and what to skip.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. Answering the calls you&apos;re missing
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                This is the big one. When you&apos;re on a job, with a customer, or closed for the night, the phone still rings — and the caller usually just dials the next business on the list. An AI receptionist answers every call and website chat in your business&apos;s voice, around the clock. It can:
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Answer the questions you get asked fifty times a day — hours, pricing ranges, whether you service their area",
                  "Book the appointment or estimate straight onto your calendar",
                  "Take a detailed message and text you the details immediately",
                  "Hand off to a human the moment something is outside its lane",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                The math here is brutal in a good way. If you miss even a handful of calls a week and the average customer is worth a few hundred dollars, the lost revenue adds up fast. You can{" "}
                <Link href="/tools/missed-call-calculator" className="font-semibold text-[#F97316] hover:underline">
                  put your own numbers into our missed-call calculator
                </Link>{" "}
                and see it in about thirty seconds.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. Replying to leads in seconds, not hours
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                The business that responds first usually wins the job — and &ldquo;first&rdquo; now means minutes, not the next morning. AI can fire off a personal, accurate reply the instant a web form comes in or a call gets missed: a text that answers their question, confirms you can help, and offers a time. By the time a slower competitor calls back, you&apos;ve already booked it. This is the single highest-leverage automation for service businesses, and it runs whether you&apos;re asleep or under a sink.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. Getting more reviews (without nagging anyone)
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                Reviews are how local customers choose you, and most happy customers simply never get asked. AI can request a Google review from the right person at the right moment — right after a job wraps — and draft a thoughtful, on-brand reply to every review that comes in, good or bad. More five-star reviews, less time spent chasing them, and nothing falls through the cracks.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Clearing the after-dinner busywork
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                The work that eats your evenings is often the most automatable:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Turning a few notes into a polished quote or estimate in minutes",
                  "Drafting replies to routine emails for you to approve and send",
                  "A knowledge assistant trained on your own prices and policies, so your team gets answers without interrupting you",
                  "Moving a new lead into your CRM, an invoice into accounting, an appointment onto the calendar — without the copy-paste",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What to skip (for now)
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                Not every shiny AI tool earns its place. Be wary of anything that posts to social media on full autopilot, makes promises or quotes prices without a human checking, or stores your customer data somewhere you can&apos;t point to. The rule we use: AI should do a narrow job well, escalate to a person when it&apos;s unsure, and never invent facts. Done right, most of your customers just experience a business that finally answers — not a robot.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Where to start
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                You don&apos;t need to do all of this at once — and you shouldn&apos;t. Start with the one leak that&apos;s costing you the most, prove it pays for itself, then add the next piece:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Find your biggest leak — usually missed calls or slow lead response",
                  "Put one AI piece on it, trained on your real business and tested before it talks to a customer",
                  "Watch the first few weeks of real conversations and tune it",
                  "Add the next automation once the first one is clearly earning its keep",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                We set this up for small businesses across the county — as a standalone{" "}
                <Link href="/ai-integration-small-business" className="font-semibold text-[#F97316] hover:underline">
                  AI integration
                </Link>{" "}
                or as an add-on to ongoing{" "}
                <Link href="/it-support-sonoma-county" className="font-semibold text-[#F97316] hover:underline">
                  IT support
                </Link>
                . You own the system; we build it, connect it, and keep it sharp.
              </p>

              <div className="bg-[#18181B] rounded-xl p-6 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Curious what AI could win back for you?</p>
                <p className="text-white/60 text-sm mb-5" style={{ fontFamily: "var(--font-body)" }}>Free 30-minute call — no jargon, no pressure. We&apos;ll find the one piece that&apos;ll pay for itself fastest.</p>
                <Link href="/ai-integration-small-business" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Explore AI for Small Business <ArrowRight size={14} />
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
