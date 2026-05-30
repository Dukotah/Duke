import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

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
    priceRange: "$800 – $2,500",
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

const retainerTiers = [
  {
    name: "Starter",
    price: "$250/mo",
    desc: "1–2 person businesses. Monthly check-in, email support, and priority scheduling for issues.",
  },
  {
    name: "Core",
    price: "$500/mo",
    desc: "3–10 person teams. Proactive monitoring, faster response, and quarterly infrastructure reviews.",
    featured: true,
  },
  {
    name: "Growth",
    price: "Custom",
    desc: "11+ person businesses with complex infrastructure. Custom scope, dedicated support hours.",
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
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free IT Assessment <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} /> (707) 239-6725
              </a>
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
              Cancel anytime with 30 days notice. No lock-in, no penalties.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {retainerTiers.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-xl p-6 ${t.featured ? "bg-[#18181B] text-white shadow-xl" : "bg-white border border-[#18181B]/10 shadow-sm"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${t.featured ? "text-[#F97316]" : "text-[#3F3F46]/50"}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {t.name}
                  </p>
                  <p className={`text-2xl font-bold mb-3 ${t.featured ? "text-white" : "text-[#18181B]"}`} style={{ fontFamily: "var(--font-heading)" }}>
                    {t.price}
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
              Stop putting up with IT that doesn't work.
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute IT assessment. We'll review your current setup and tell you exactly what we'd fix and what it would cost.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Free Assessment <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
