import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, ShieldCheck, FileCheck, Lock, Globe, Database, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support for Healthcare & Medical Offices in Sonoma County | Copper Bay Tech",
  description:
    "HIPAA-compliant IT support, EHR setup, secure email, and patient-facing websites for medical offices in Sonoma County. Copper Bay Tech, Santa Rosa CA.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support for Healthcare & Medical Offices",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    telephone: "+17072396725",
    email: "duke@copperbaytech.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santa Rosa",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  areaServed: "Sonoma County, CA",
  description:
    "HIPAA-compliant IT infrastructure, EHR support, secure business email, backups, and patient-facing websites for medical and healthcare practices in Sonoma County.",
};

const painPoints = [
  { problem: "EHR system running slow or crashing during patient visits", solution: "We optimize your network and workstations to keep clinical software running reliably — and fix it fast when it doesn't." },
  { problem: "Staff sending PHI over regular email", solution: "We implement encrypted email and train staff on HIPAA-compliant communication practices so you stay protected and compliant." },
  { problem: "No formal backup or disaster recovery plan", solution: "Automated, encrypted backups of patient data with tested recovery procedures and documentation for your HIPAA risk analysis." },
  { problem: "Website that doesn't build trust or rank locally", solution: "A clean, professional website with online appointment booking, provider bios, and the local SEO that helps patients find you." },
];

const services = [
  { icon: ShieldCheck, title: "HIPAA Compliance Support", desc: "Technical safeguard implementation: access controls, audit logging, encryption, and BAA coordination for your tech vendors." },
  { icon: FileCheck, title: "EHR & Practice Management Support", desc: "Setup, troubleshooting, and staff training for EHR systems including Epic, Athenahealth, eClinicalWorks, and others." },
  { icon: Lock, title: "Secure Email & Communication", desc: "Microsoft 365 or Google Workspace with HIPAA-compliant configuration, encrypted messaging, and staff training." },
  { icon: Database, title: "Backup & Recovery", desc: "Encrypted backups of all clinical and administrative data, with documented recovery procedures for your risk analysis." },
  { icon: Globe, title: "Patient-Facing Websites", desc: "Professional medical websites with online booking integrations, provider profiles, and accessibility compliance." },
  { icon: CheckCircle, title: "Ongoing Managed IT", desc: "Flat-fee monthly support so you have a local IT partner to call — not a ticket queue — when something needs attention." },
];

export default function HealthcarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Nav />
      <main>
        <section className="bg-[#18181B] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Industries
            </Link>
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Healthcare & Medical
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              HIPAA-compliant IT for{" "}
              <span style={{ color: "#F97316" }}>medical practices</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Healthcare IT has higher stakes than most industries. We work with medical offices, therapy practices, and specialty clinics across Sonoma County to keep their systems secure, their data protected, and their staff focused on patients — not IT problems.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talk to us <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Common challenges we solve
            </h2>
            <div className="space-y-6">
              {painPoints.map(({ problem, solution }) => (
                <div key={problem} className="bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#F97316] shrink-0" style={{ fontFamily: "var(--font-heading)" }}>Problem:</span>
                    <p className="text-sm font-medium text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{problem}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={15} className="shrink-0 mt-0.5 text-[#F97316]" />
                    <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Healthcare IT services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#FAFAF9] rounded-2xl p-6 border border-[#18181B]/8">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HIPAA note */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-2xl p-8 border border-[#18181B]/8">
              <h3 className="text-xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                A note on HIPAA
              </h3>
              <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                We are not attorneys and do not provide legal compliance advice. We handle the technical safeguard side of HIPAA — the infrastructure, access controls, encryption, and backup requirements that fall under your Security Rule obligations. For policy documentation and legal guidance, we recommend working with a healthcare compliance attorney alongside your IT work.
              </p>
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
              Protect your patients and your practice
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Local IT support for Sonoma County medical offices. Call (707) 239-6725 or send us a message.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
