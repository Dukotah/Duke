import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone, AlertTriangle, DollarSign, Wifi } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";

export const metadata: Metadata = {
  title: "IT Support for Small Business | Sonoma County | Copper Bay Tech",
  description:
    "Managed IT support for Sonoma County small businesses. Networks, workstations, cloud, and a direct line — not a ticket queue. Month-to-month, no contracts.",
  openGraph: {
    title: "IT Support for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Local managed IT support for Petaluma, Santa Rosa, and the greater North Bay. Month-to-month retainers, flat-fee projects.",
    url: "https://copperbaytech.com/it-support",
  },
  alternates: {
    canonical: "https://copperbaytech.com/it-support-sonoma-county",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed IT Support",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Managed IT support for Sonoma County small businesses. Networks, workstations, cloud migration, and ongoing support.",
  offers: {
    "@type": "Offer",
    priceRange: "$550 – $2,200",
    priceCurrency: "USD",
  },
};

const included = [
  "Network setup, management, and troubleshooting",
  "Workstation setup and ongoing support",
  "Wi-Fi optimization for offices and retail spaces",
  "Cloud migration — Google Workspace, Microsoft 365, Dropbox",
  "Process automation and AI tool integrations",
  "Staff onboarding and training",
  "Vendor coordination (ISP, hardware, software)",
  "Direct line to a real person — not a ticket queue",
];

const painPoints = [
  {
    Icon: AlertTriangle,
    title: "The single point of failure",
    desc: "Most small businesses have one person who \"knows computers.\" When that person is unavailable — or leaves — everything stops. A managed support partner means your operations never depend on a single person's availability.",
  },
  {
    Icon: DollarSign,
    title: "The break-fix trap",
    desc: "Hourly IT is financially incentivized to fix slowly, not prevent. Every hour a problem lingers is billable time. A flat-rate retainer aligns incentives: we get paid the same whether your systems run perfectly or not — so prevention is the whole point.",
  },
  {
    Icon: Wifi,
    title: "The productivity leak",
    desc: "Slow Wi-Fi, aging workstations, and cloud tools nobody manages are quietly costing hours every week. Staff works around problems instead of reporting them. The real cost of poor IT isn't the repair bill — it's the compounding lost time.",
  },
];

const retainerTiers = [
  {
    name: "Starter",
    price: "$550/mo",
    problem: "Your first IT safety net",
    desc: "Ideal for solo operators and 2–3 person shops: someone to call when things go wrong, monthly check-in to catch issues early, and priority scheduling so you're not waiting a week for a callback.",
  },
  {
    name: "Core",
    price: "$1,200/mo",
    problem: "Proactive — not reactive",
    desc: "For 4–10 person teams ready to stop putting out fires. Proactive monitoring, faster response, quarterly infrastructure reviews, and a point of contact who knows your setup cold.",
    featured: true,
  },
  {
    name: "Growth",
    price: "Custom",
    problem: "Complex infrastructure, covered",
    desc: "For 11+ person businesses with servers, multiple locations, or compliance requirements. Custom scope, dedicated support hours, and full vendor coordination.",
  },
];

export default function ITSupportPage() {
  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Do I need to sign a long-term contract?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. All retainer plans are month-to-month with 30 days notice to cancel. No lock-in, no penalties.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What's the difference between break-fix and a retainer?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Break-fix means you call when something goes wrong and pay hourly. A retainer means we're proactively monitoring and maintaining your systems — and we're motivated to prevent problems, not just fix them.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How quickly do you respond when something breaks?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Retainer clients get same-day response during business hours for urgent issues. We give you a direct line — not a ticket queue.",
                  },
                },
              ],
            }),
          }}
        />
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              IT Support
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT that just works —
              <br />
              <span style={{ color: "#F97316" }}>every single day.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Local managed IT support for Sonoma County small businesses. We handle your network, workstations, cloud tools, and day-to-day tech so you can focus on running your business. Month-to-month — no long-term contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation <ArrowRight size={15} />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} /> {PHONE}
              </a>
            </div>
            {/* Urgent fast path */}
            <p className="mt-6 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
              Server down or site offline?{" "}
              <a href={PHONE_HREF} className="text-[#F97316] hover:underline font-semibold">
                Call or text {PHONE}
              </a>{" "}
              for same-day response.
            </p>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why most small business IT fails
            </h2>
            <p className="text-[#3F3F46]/60 mb-10 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              It&apos;s not bad luck — it&apos;s structural. Three patterns show up in almost every small business we work with.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {painPoints.map((p) => (
                <div key={p.title} className="bg-white rounded-xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#18181B]/8 flex items-center justify-center mb-4">
                    <p.Icon size={20} color="#18181B" />
                  </div>
                  <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's covered */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              What we cover
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#16A34A" />
                  <span className="text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Retainer tiers */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Monthly retainer plans
            </h2>
            <p className="text-[#3F3F46]/60 mb-8 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              Priced by the problem you need solved, not just headcount. Cancel anytime with 30 days notice — no lock-in, no penalties.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {retainerTiers.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-xl p-6 ${t.featured ? "bg-[#18181B] text-white shadow-xl" : "bg-white border border-[#18181B]/10 shadow-sm"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${t.featured ? "text-[#F97316]" : "text-[#3F3F46]/50"}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {t.name}
                  </p>
                  <p className={`text-2xl font-bold mb-1 ${t.featured ? "text-white" : "text-[#18181B]"}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {t.price}
                  </p>
                  <p className={`text-xs font-semibold mb-3 ${t.featured ? "text-[#F97316]" : "text-gold-on-light"}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {t.problem}
                  </p>
                  <p className={`text-sm leading-relaxed ${t.featured ? "text-white/70" : "text-[#3F3F46]/60"}`} style={{ fontFamily: "var(--font-body)" }}>
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Stop putting up with IT that doesn&apos;t work.
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute IT assessment. We&apos;ll review your current setup and tell you exactly what we&apos;d fix and what it would cost.
            </p>
            <Link
              href={BOOKING_URL}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a free consultation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
