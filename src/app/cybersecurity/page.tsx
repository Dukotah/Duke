import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone, ShieldAlert } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";

export const metadata: Metadata = {
  title: "Cybersecurity for Small Business | Sonoma County | Copper Bay Tech",
  description:
    "Cybersecurity audits, infrastructure hardening, and incident response planning for Sonoma County small businesses. Protect your data before something goes wrong.",
  openGraph: {
    title: "Cybersecurity for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Security audits and hardening for Petaluma, Santa Rosa, and North Bay businesses. Plain-English reports, prioritized fixes.",
    url: "https://copperbaytech.com/cybersecurity",
  },
  alternates: {
    canonical: "https://copperbaytech.com/cybersecurity-small-business",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity Audit & Hardening",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Cybersecurity audits, infrastructure hardening, and incident response planning for Sonoma County small businesses.",
  offers: {
    "@type": "Offer",
    priceRange: "$600 – $2,000",
    priceCurrency: "USD",
  },
};

const auditIncludes = [
  "Network vulnerability scan and external exposure assessment",
  "Email security review (phishing risk, SPF/DKIM/DMARC)",
  "Password and access control audit",
  "Backup verification — do your backups actually work?",
  "Software and firmware update status",
  "Staff phishing awareness assessment",
  "Plain-English report with prioritized action items",
  "30-minute results walkthrough call",
];

const threats = [
  { title: "Ransomware", desc: "Encrypts your files and demands payment. The average small business attack costs $200k+ in downtime and recovery." },
  { title: "Phishing", desc: "Fake emails trick staff into giving up credentials. Over 90% of breaches start with a phishing email." },
  { title: "Credential theft", desc: "Reused passwords and no MFA mean one breach exposes everything. Most businesses don't find out for months." },
  { title: "Compliance gaps", desc: "HIPAA, PCI, and data privacy laws apply to most small businesses. Non-compliance can mean fines even if nothing goes wrong." },
];

export default function CybersecurityPage() {
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
                  name: "How long does a security audit take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most audits are completed in 3–5 business days. You get a plain-English report with prioritized action items and a 30-minute walkthrough call.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need a security audit if I'm a small business?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes — small businesses are the #1 ransomware target precisely because they're assumed to have weak security. An audit typically costs $600–$1,200 and can prevent a $200,000+ incident.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What happens after the audit?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You get a clear list of what to fix, in priority order, with estimated costs. We can implement the fixes for you or hand you the report to act on yourself — your choice.",
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
              Cybersecurity
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Protect what you&apos;ve built
              <br />
              <span style={{ color: "#F97316" }}>before something breaks it.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most small businesses don&apos;t think about security until they&apos;re in crisis. A Copper Bay Tech security audit identifies your real risks, explains them in plain English, and gives you a prioritized fix list — not a 40-page report you&apos;ll never read.
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
          </div>
        </section>

        {/* Threats */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              What you&apos;re actually up against
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {threats.map((t) => (
                <div key={t.title} className="p-6 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert size={18} color="#F97316" />
                    <h3 className="font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{t.title}</h3>
                  </div>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audit includes */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What a security audit includes
            </h2>
            <p className="text-[#3F3F46]/60 mb-8 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              Flat fee: $600–$2,000 depending on business size. Completed in 3–5 business days.
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {auditIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#18181B]/8 shadow-sm">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#16A34A" />
                  <span className="text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Don&apos;t wait for a breach to find out where you&apos;re exposed.
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Book a free 15-minute call. We&apos;ll ask a few questions and tell you whether a full audit makes sense for your situation — no pressure.
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
