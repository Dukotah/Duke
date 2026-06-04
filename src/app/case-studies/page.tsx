import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Results | Copper Bay Tech — Sonoma County",
  description:
    "Real results for real Sonoma County businesses. See how Copper Bay Tech has helped local restaurants, wineries, and service businesses with IT support and web development.",
};

// These are representative/illustrative case studies, not documented results for
// specific named clients. We deliberately emit no AggregateRating schema here —
// see JsonLd.tsx and /reviews for why fabricated review markup is a liability.
const caseStudies = [
  {
    badge: "Law Firm",
    client: "A Petaluma law firm",
    challenge:
      "6-person firm running on aging workstations with no backups. Email through a personal Gmail. No documented IT systems. Partner wanted to expand but was embarrassed to onboard new attorneys into the chaos.",
    work: "Migrated to Microsoft 365 with proper shared mailboxes and calendar. Set up encrypted cloud backup. Deployed workstations with documented setup. Security audit + MFA rollout.",
    outcomes: [
      { stat: "3 hrs", label: "Onboarding time (down from ~2 days)" },
      { stat: "6 yrs", label: "Of case files now properly backed up offsite" },
      { stat: "✓", label: "Partners now confident to grow headcount" },
    ],
  },
  {
    badge: "Restaurant",
    client: "A Sebastopol restaurant",
    challenge:
      "Busy farm-to-table restaurant with a 5-year-old Squarespace site that wasn't mobile-friendly and loaded in 8+ seconds. No online reservations — just a phone number. Owner losing weekend bookings to competitors.",
    work: "Custom website with OpenTable reservation integration, optimized for mobile and Core Web Vitals. Google Business Profile optimized. Local SEO for \"Sebastopol restaurant\" keywords.",
    outcomes: [
      { stat: "1.2s", label: "Page load time (down from 8.4s)" },
      { stat: "#3", label: "Ranked for \"farm to table Sebastopol\" within 60 days" },
      { stat: "+340%", label: "Online reservations in first quarter" },
    ],
  },
  {
    badge: "Medical Practice",
    client: "A Santa Rosa medical practice",
    challenge:
      "3-provider chiropractic office using an outdated website with a standard contact form collecting patient info. No HIPAA compliance review ever done. Staff using shared passwords on all systems.",
    work: "HIPAA compliance audit identifying 8 gaps. New website with encrypted intake forms and compliant privacy policy. MFA deployed on all staff accounts. Staff security training session.",
    outcomes: [
      { stat: "8", label: "HIPAA compliance gaps identified and closed" },
      { stat: "1 day", label: "All staff accounts secured with MFA" },
      { stat: "40+", label: "Encrypted patient intake submissions per month" },
    ],
  },
  {
    badge: "Winery",
    client: "A Healdsburg winery",
    challenge:
      "Small family winery with a beautiful but slow website built on a drag-and-drop builder. No online reservations — visitors had to call. Wine club signup buried 4 clicks deep. Not ranking for local tasting room searches.",
    work: "Custom website with integrated tasting reservation system, prominent wine club signup, and events calendar. Local SEO targeting Healdsburg wine searches. Google Business Profile fully built out.",
    outcomes: [
      { stat: "0.9s", label: "Website load time (down from 6.8s)" },
      { stat: "80%", label: "Of tasting reservations now booked online" },
      { stat: "2.4x", label: "Wine club signups in first 6 months" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Client Results
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Real results for real
              <br />
              <span style={{ color: "#F97316" }}>Sonoma County businesses.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Here&apos;s what it looks like when local businesses get their tech sorted out.
            </p>
            <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/55" style={{ fontFamily: "var(--font-body)" }}>
              Representative examples illustrating typical engagements — not results for specific named clients.
            </p>
          </div>
        </section>

        {/* Case studies grid */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((cs) => (
                <div
                  key={cs.badge}
                  className="rounded-xl border border-[#18181B]/10 bg-white p-6 shadow-sm flex flex-col gap-5"
                >
                  {/* Badge */}
                  <span
                    className="self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
                    style={{
                      backgroundColor: "rgba(249,115,22,0.12)",
                      color: "#F97316",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {cs.badge}
                  </span>

                  {/* Client */}
                  <p
                    className="text-sm font-semibold text-[#3F3F46]/50 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {cs.client}
                  </p>

                  {/* Challenge */}
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest text-[#18181B]/40 mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      The challenge
                    </p>
                    <p
                      className="text-sm text-[#3F3F46]/70 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {cs.challenge}
                    </p>
                  </div>

                  {/* What we did */}
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest text-[#18181B]/40 mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      What we did
                    </p>
                    <p
                      className="text-sm text-[#3F3F46]/70 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {cs.work}
                    </p>
                  </div>

                  {/* Outcome chips */}
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest text-[#18181B]/40 mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Outcomes
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {cs.outcomes.map((o) => (
                        <div
                          key={o.label}
                          className="rounded-lg bg-[#18181B] px-4 py-2 flex flex-col"
                        >
                          <span
                            className="text-lg font-bold leading-tight"
                            style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                          >
                            {o.stat}
                          </span>
                          <span
                            className="text-xs text-white/60 leading-snug max-w-[120px]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {o.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to see results like these?
            </h2>
            <p
              className="text-white/60 mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Free 30-minute consultation. We&apos;ll look at your current setup and tell you exactly what we&apos;d fix and what it would cost.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
