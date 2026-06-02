import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, faqSchema } from "@/components/JsonLd";
import { ArrowRight, ShieldCheck, Lock, Eye, AlertTriangle, FileText, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Cybersecurity for Small Business | Copper Bay Tech | Sonoma County",
  description:
    "Cybersecurity audits, vulnerability assessments, and security hardening for Sonoma County small businesses. Find and fix the gaps before attackers do.",
  keywords:
    "cybersecurity small business, cybersecurity Sonoma County, security audit Petaluma, small business IT security North Bay, HIPAA compliance Sonoma County",
  alternates: { canonical: "https://copperbaytech.com/cybersecurity-small-business" },
  openGraph: {
    title: "Cybersecurity for Small Business | Copper Bay Tech",
    description: "Security audits and hardening for Sonoma County small businesses.",
    url: "https://copperbaytech.com/cybersecurity-small-business",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "Cybersecurity Audits & Hardening",
  description: "Cybersecurity audits, vulnerability assessments, and security hardening for small businesses.",
  url: "https://copperbaytech.com/cybersecurity-small-business",
  areaServed: "Sonoma County, CA",
});

const services = [
  { icon: Eye, label: "Security audit", body: "Full scan of your network, devices, and accounts. We document every vulnerability and prioritize them by actual risk." },
  { icon: Lock, label: "Infrastructure hardening", body: "Close the open ports, update the outdated firmware, enforce MFA, deploy a password manager — the fixes attackers actually exploit." },
  { icon: AlertTriangle, label: "Incident response planning", body: "A written plan for what to do if something goes wrong. Who calls who, what gets shut down, how you recover — before you need it." },
  { icon: ShieldCheck, label: "Compliance baseline", body: "If you handle patient data, payment cards, or financial records, we map your environment to HIPAA or PCI-DSS requirements and close the gaps." },
  { icon: FileText, label: "Written security report", body: "Everything documented in plain English. What we found, what we fixed, and what remains — useful for insurance, auditors, or your own records." },
  { icon: RefreshCw, label: "Ongoing monitoring", body: "Monthly security check-ins, patch monitoring, and alerts when your environment changes in ways that matter." },
];

const threats = [
  { label: "43%", body: "of cyberattacks target small businesses specifically" },
  { label: "60%", body: "of small businesses close within 6 months of a serious breach" },
  { label: "$200K", body: "average cost of a small business cybersecurity incident" },
  { label: "300 days", body: "average time before a breach is even detected" },
];

const faqs = [
  {
    q: "Is my small business really a target?",
    a: "Yes — and you're often easier to hit than large companies. Attackers run automated scans looking for open ports, outdated firmware, and reused passwords. Most small business breaches aren't targeted — they're opportunistic.",
  },
  {
    q: "What does a security audit actually involve?",
    a: "We run network scans, check all device firmware and patch levels, review account access controls, test for open ports, and audit your password and authentication practices. The whole process usually takes 2–4 hours on-site.",
  },
  {
    q: "Do you handle HIPAA compliance?",
    a: "We can establish a HIPAA security baseline — technical safeguards, access controls, audit logging, and documentation. We're not attorneys and can't provide legal compliance opinions, but we handle the technical controls that make up the bulk of HIPAA's security rule.",
  },
  {
    q: "How much does a security audit cost?",
    a: "A standard small business security audit runs $400–$800 depending on size and complexity. Ongoing monitoring is available as a monthly add-on to a retainer.",
  },
  {
    q: "What if you find something serious?",
    a: "We fix critical issues immediately where possible — same-day for most network-level vulnerabilities. You'll have a written remediation report regardless. We don't just identify problems and leave.",
  },
];

export default function CybersecuritySmallBusiness() {
  return (
    <>
      <JsonLd schema={[schema, faqSchema(faqs)]} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topo3" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo3)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Sonoma County · Cybersecurity
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Find the gaps before<br />
              <span style={{ color: "#F97316" }}>attackers do.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most small businesses have no idea what&apos;s exposed on their network. A security audit finds the vulnerabilities and fixes them — before they become a breach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Book a Security Audit <ArrowRight size={16} />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                Free Website Security Check
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
              Serving Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Windsor · Healdsburg
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
        </section>

        {/* Threat reality */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-8" style={{ fontFamily: "var(--font-heading)" }}>The reality for small businesses</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {threats.map((t) => (
                <div key={t.label} className="text-center bg-white rounded-xl p-6 border border-[#18181B]/8">
                  <p className="text-3xl font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{t.label}</p>
                  <p className="text-xs text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>What we cover</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Security that actually protects you.
              </h2>
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

        {/* Case study */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Client Result</p>
            <blockquote>
              <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                &ldquo;I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we&apos;d had for years. Fixed it same day, no drama.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>JR</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>James R.</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Principal, Santa Rosa Insurance Group</p>
                </div>
              </footer>
            </blockquote>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: "2 critical", label: "Vulnerabilities found" },
                { value: "Same day", label: "Time to fix" },
                { value: "4 years", label: "Firmware lag on router" },
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
              Know where you stand.
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              A security audit takes a few hours and gives you a clear picture of your risk — and a path to fix it. Most findings are resolved same day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Book a Security Audit <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                Call (707) 239-6725
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
