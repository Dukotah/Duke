import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight, PhoneCall, Zap, Star, FileText, MessageCircle, RefreshCw, Search, Wrench, TrendingUp } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";

export const metadata: Metadata = {
  title: "AI for Small Business | Copper Bay Tech | Sonoma County",
  description:
    "Practical AI integration for Sonoma County small businesses. An AI receptionist that answers every call, instant lead response, automated reviews, and the busywork handled — set up and supported locally.",
  keywords:
    "AI for small business, AI integration Sonoma County, AI receptionist Petaluma, AI automation small business North Bay, AI chatbot Santa Rosa, missed call text back",
  alternates: { canonical: "https://copperbaytech.com/ai-integration-small-business" },
  openGraph: {
    title: "AI for Small Business | Copper Bay Tech",
    description: "Practical AI that answers calls, responds to leads, and handles the busywork — set up and supported locally in Sonoma County.",
    url: "https://copperbaytech.com/ai-integration-small-business",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "AI Integration for Small Business",
  description:
    "Done-for-you AI integration for small businesses: AI receptionist, instant lead response, automated reviews, quoting, and workflow automation — set up and supported locally.",
  url: "https://copperbaytech.com/ai-integration-small-business",
  areaServed: "Sonoma County, CA",
});

const services = [
  { icon: PhoneCall, label: "AI receptionist", body: "Answers every call and website chat 24/7, in your business's voice. It books appointments, takes messages, and answers the questions you get asked fifty times a day — so you stop losing the leads that call after hours." },
  { icon: Zap, label: "Instant lead response", body: "The first business to reply usually wins the job. New web form? Missed call? The customer gets a personal text or email back in seconds — not the next morning, by which point they've already called someone else." },
  { icon: Star, label: "Review & reputation engine", body: "Automatically asks happy customers for a Google review at the right moment, and drafts a thoughtful reply to every review that comes in. More five-star reviews, less time spent chasing them." },
  { icon: FileText, label: "Quotes & email drafts", body: "Turns a few notes into a polished quote or estimate, and drafts replies to routine emails for you to approve and send. The writing gets done in minutes instead of after dinner." },
  { icon: MessageCircle, label: "Business knowledge assistant", body: "Trained on your own pricing, policies, and FAQs — so your team (and your customers) get fast, accurate answers without digging through binders or interrupting you." },
  { icon: RefreshCw, label: "Workflow automation", body: "Connects the tools you already use and kills the copy-paste busywork: lead into CRM, invoice into accounting, appointment onto the calendar. The handoffs happen on their own." },
];

const stats = [
  { label: "78%", body: "of customers buy from the business that responds to them first" },
  { label: "21×", body: "more likely to convert a lead when you reply within 5 minutes vs. 30" },
  { label: "62%", body: "of calls to small businesses go unanswered during a busy day" },
  { label: "24/7", body: "your AI keeps answering — nights, weekends, and the lunch rush" },
];

const steps = [
  { icon: Search, label: "1. Find the leak", body: "We spend an hour on where time and leads actually slip away — missed calls, slow quotes, the inbox that never empties. No jargon, no upsell." },
  { icon: Wrench, label: "2. Build & connect", body: "We set up the AI on your real phone number, website, and tools — trained on your business, tested against your actual questions before it ever talks to a customer." },
  { icon: TrendingUp, label: "3. Tune & support", body: "We watch the first weeks of real conversations, fix the rough edges, and keep it sharp. You own the system; we keep it running on a simple monthly plan." },
];

const faqs = [
  {
    q: "Will this sound like a robot to my customers?",
    a: "No — that's the whole point of doing it right. We train it on how you actually talk, the questions you actually get, and your real prices and policies. It hands off to a human the moment something is outside its lane, and you approve the tone before it goes live. Most customers just experience a business that finally answers.",
  },
  {
    q: "I'm not technical. Is this going to be a headache?",
    a: "You don't touch the technical side at all. We set it up, connect it to your phone, website, and tools, and support it. If you can answer a few questions about your business, you can use this. That's exactly the gap we exist to fill for local businesses.",
  },
  {
    q: "Is my business too small for AI?",
    a: "Small is exactly who this helps most. When you're a team of one to ten, every missed call and every after-hours lead is real money walking out the door. AI gives a small shop the always-on front desk that used to require hiring someone.",
  },
  {
    q: "What about my customers' data and privacy?",
    a: "We use reputable AI providers, keep your data scoped to your business, and don't train public models on your customer information. If you handle health or payment data, we set it up with that in mind and document what's stored where — the same way we handle our security work.",
  },
  {
    q: "How much does it cost?",
    a: "Most setups run a one-time build fee of $1,500–$4,000 depending on how many pieces you want connected, plus a monthly plan starting around $200 that covers the AI usage, monitoring, and tuning. We'll quote it precisely after the first conversation — and start with the one thing that'll pay for itself fastest.",
  },
  {
    q: "What if it makes a mistake?",
    a: "We design it to do less, well. It sticks to what it knows, escalates to a human when unsure, and never invents prices or promises. We monitor real conversations in the early weeks and keep refining — you're never handing your customers to a black box.",
  },
];

export default function AiIntegrationSmallBusiness() {
  return (
    <>
      <JsonLd schema={[schema, faqSchema(faqs)]} />
      <JsonLd schema={breadcrumbSchema([{name:"Home",url:"https://copperbaytech.com"},{name:"Services"},{name:"AI Integration"}])} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <pattern id="topoAi" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topoAi)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Sonoma County · AI Integration
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              An employee that<br />
              <span style={{ color: "#F97316" }}>never clocks out.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every missed call is a customer who calls the next business on the list. We set up practical AI — built for your shop, supported locally — that answers the phone, replies to leads in seconds, and handles the busywork. No hype, no hiring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={16} />
              </Link>
              <Link
                href="/tools/missed-call-calculator"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                What are missed calls costing you?
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
              Serving Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Windsor · Healdsburg
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
        </section>

        {/* The reality */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-8" style={{ fontFamily: "var(--font-heading)" }}>Why speed wins the job</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center bg-white rounded-xl p-6 border border-[#18181B]/8">
                  <p className="text-3xl font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.label}</p>
                  <p className="text-xs text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-4" style={{ fontFamily: "var(--font-heading)" }}>What we put to work</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                AI that earns its keep.
              </h2>
              <p className="text-lg text-[#3F3F46]/60 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Pick the one that fixes your biggest leak first. Add the rest as you grow.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.label} className="rounded-xl p-6 border border-[#18181B]/8 bg-[#FAFAF9]">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                    <s.icon size={20} color="#F97316" />
                  </div>
                  <h3 className="text-base font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.label}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-4" style={{ fontFamily: "var(--font-heading)" }}>How we roll it out</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>
                Start small. Prove it. Grow.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.label} className="rounded-xl p-8 bg-white border border-[#18181B]/8">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ backgroundColor: "rgba(249,115,22,0.1)" }}>
                    <s.icon size={22} color="#F97316" />
                  </div>
                  <h3 className="text-lg font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.label}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Client Result</p>
            <blockquote>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                &ldquo;We were missing calls every time the crew was out on a job. Now the AI answers, books the estimate, and texts me the details. We booked three jobs in the first week that would&apos;ve gone to voicemail and never called back.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>MT</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Mark T.</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Owner, Petaluma Plumbing &amp; Heating</p>
                </div>
              </footer>
            </blockquote>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: "3 jobs", label: "Booked in week one" },
                { value: "< 1 min", label: "Average response time" },
                { value: "0", label: "Missed after-hours leads" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>{m.value}</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>Common questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#18181B]/8 p-6">
                  <h3 className="text-base font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.q}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Stop losing the call.
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              One free conversation. We&apos;ll find where leads are slipping away and show you the single AI piece that&apos;ll pay for itself fastest. No pressure, no jargon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={16} />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                Call {PHONE}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
