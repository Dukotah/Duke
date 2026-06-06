import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { Phone, CalendarDays, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How We Work | Copper Bay Tech | Sonoma County Web & IT",
  description:
    "A straightforward look at how Copper Bay Tech works: free assessment, flat-fee proposal, build, launch, and 30 days of post-launch support — no hourly billing surprises.",
  keywords: [
    "how we work",
    "web design process Sonoma County",
    "IT consulting process",
    "flat fee web design",
    "Copper Bay Tech process",
    "Sonoma County small business tech",
  ],
  alternates: { canonical: "https://copperbaytech.com/process" },
  openGraph: {
    title: "How We Work | Copper Bay Tech",
    description:
      "Flat-fee proposals, honest timelines, and 30 days of post-launch support. No hourly billing, no surprises.",
    url: "https://copperbaytech.com/process",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const steps = [
  {
    number: "01",
    title: "Free 30-minute call",
    duration: "Day 1",
    body: "We start with a no-pressure conversation — you tell us what you have, what's broken, and what you actually need. We ask real questions and give you an honest read on whether we’re the right fit. No sales pitch. If we’re not the best option for your situation, we’ll say so.",
  },
  {
    number: "02",
    title: "Flat-fee proposal — up front",
    duration: "Within 2 business days",
    body: "After the call we send a written scope and a single fixed price. You’ll see exactly what’s included, what’s out of scope, and what the timeline looks like. We don’t bill by the hour, so the number on the proposal is the number you pay. No change-order games, no scope creep surprises.",
  },
  {
    number: "03",
    title: "We build it",
    duration: "1–3 weeks (most projects)",
    body: "Once you approve the proposal and put down a deposit, we get to work. Most small-business websites are live in two to three weeks. Larger web applications, IT infrastructure projects, or cybersecurity audits with remediation take longer — we’ll give you a realistic timeline in the proposal, not a best-case one. You’ll get milestone check-ins and can reach us by phone or email throughout.",
  },
  {
    number: "04",
    title: "Launch",
    duration: "On the agreed date",
    body: "We handle the technical launch: DNS, SSL, performance checks, and a walkthrough so you know how to use what we built. The remaining balance is due at launch. We don’t disappear the moment the site goes live — that’s when the support window starts.",
  },
  {
    number: "05",
    title: "30 days of post-launch support",
    duration: "Included with every project",
    body: "Every engagement includes 30 days of post-launch support at no extra charge. If something breaks, behaves unexpectedly, or you realize you need a small adjustment, we fix it. After 30 days, ongoing maintenance and IT support are available on a flat monthly retainer — no contracts required.",
  },
];

const goodFit = [
  "You want a site built right the first time, not the cheapest thing that exists",
  "You value knowing the final price before work starts",
  "You’re a small or mid-size Sonoma County business that wants a real local partner",
  "You’re okay with a 2–3 week timeline in exchange for quality custom work",
  "You want someone who can also handle your network, security, or IT questions down the road",
  "You prefer direct communication — phone, text, or email — over a ticketing system",
];

const notFit = [
  "Your primary goal is finding the absolute lowest price (we aren’t competing on that)",
  "You want to manage the project hour by hour and approve every small decision",
  "You need a full site designed, built, and launched in under a week",
  "You’re looking for a large agency with a team of 20+ specialists",
  "You want a DIY website builder with a monthly subscription plan",
];

export default function ProcessPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* ── Hero ── */}
        <section className="bg-[#18181B] py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How we work
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No hourly billing.
              <br />
              No surprises.
            </h1>
            <p
              className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most of our clients have been burned before — by a contractor who
              disappeared mid-project, a bill that tripled because of &ldquo;extra
              hours,&rdquo; or a template that looked great in the demo and fell apart
              in practice. Here&apos;s exactly what working with us looks like, start
              to finish.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <CalendarDays size={16} />
                Book a free 30-min call
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold text-white/80 border border-white/20 hover:border-white/50 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={16} />
                {PHONE}
              </a>
            </div>
          </div>
        </section>

        {/* ── Process Steps ── */}
        <section className="py-24 bg-white px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-0">
              {steps.map((step, idx) => (
                <div
                  key={step.number}
                  className="relative grid md:grid-cols-[7rem_1fr] gap-6 md:gap-12 pb-16 last:pb-0"
                >
                  {/* Vertical connector line between steps */}
                  {idx < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block absolute left-[3.25rem] top-16 bottom-0 w-px bg-[#18181B]/10"
                    />
                  )}

                  {/* Step number bubble */}
                  <div className="flex md:flex-col items-start gap-3 md:gap-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#18181B] text-[#F97316] font-bold text-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                      aria-hidden="true"
                    >
                      {step.number}
                    </div>
                    <span
                      className="md:mt-3 text-xs font-medium text-[#3F3F46]/40 uppercase tracking-widest leading-tight"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.duration}
                    </span>
                  </div>

                  {/* Step content */}
                  <div className="pt-1">
                    <h2
                      className="text-xl font-bold text-[#18181B] mb-3 leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.title}
                    </h2>
                    <p
                      className="text-[#3F3F46]/65 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fit / Not-a-fit ── */}
        <section className="py-24 bg-[#F9F9F9] px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Honest counter-signaling
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#18181B] leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Are we the right fit?
              </h2>
              <p
                className="mt-4 text-[#3F3F46]/60 max-w-xl mx-auto leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                We work best with a specific kind of client. Being honest about
                that upfront saves everyone&apos;s time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Good fit */}
              <div className="bg-white rounded-2xl p-8 border border-[#18181B]/8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 size={22} className="text-[#F97316] flex-shrink-0" />
                  <h3
                    className="text-lg font-bold text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    We&apos;re probably a great fit if&hellip;
                  </h3>
                </div>
                <ul className="space-y-4">
                  {goodFit.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span
                        className="text-sm text-[#3F3F46]/70 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not a fit */}
              <div className="bg-white rounded-2xl p-8 border border-[#18181B]/8">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle size={22} className="text-[#3F3F46]/40 flex-shrink-0" />
                  <h3
                    className="text-lg font-bold text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    We&apos;re probably not the right fit if&hellip;
                  </h3>
                </div>
                <ul className="space-y-4">
                  {notFit.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3F3F46]/25 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span
                        className="text-sm text-[#3F3F46]/55 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 bg-[#18181B] px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to get started?
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The first step is a 30-minute conversation — and it&apos;s free.
            </h2>
            <p
              className="text-white/55 leading-relaxed mb-10 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              No commitment, no hard sell. Tell us where you are and what you need,
              and we&apos;ll give you an honest picture of what&apos;s possible and what
              it costs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <CalendarDays size={16} />
                Book a free call
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-md text-sm font-semibold text-white/80 border border-white/20 hover:border-white/50 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Send a message instead
              </Link>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
