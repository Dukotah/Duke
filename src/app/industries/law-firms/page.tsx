import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, Lock, FolderOpen, Laptop, Globe, ShieldCheck, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Websites for Law Firms in Sonoma County | Copper Bay Tech",
  description:
    "Secure document management, remote access, professional law firm websites, and confidentiality-first IT for attorneys in Sonoma County. Copper Bay Tech.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support & Web Development for Law Firms",
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
    "Secure IT infrastructure, document management, remote access, cybersecurity, and professional websites for law firms and solo attorneys in Sonoma County.",
};

const painPoints = [
  { problem: "Confidential client documents stored without proper access controls", solution: "We set up secure file storage with role-based access so only authorized staff can view sensitive case files." },
  { problem: "Attorneys working remotely without a secure connection", solution: "VPN setup and secure remote desktop configuration so you can access firm files safely from home or court." },
  { problem: "Firm website that doesn't build credibility or generate inquiries", solution: "Professional attorney websites with practice area pages, attorney bios, contact forms, and local SEO to attract clients searching for representation." },
  { problem: "No tested backup of case files and billing records", solution: "Automated, encrypted backups with documented recovery procedures — so a hardware failure or ransomware attack doesn't mean losing client work." },
];

const services = [
  { icon: Lock, title: "Secure Remote Access", desc: "VPN and remote desktop setup so attorneys and staff can work securely from anywhere without compromising client confidentiality." },
  { icon: FolderOpen, title: "Document Management", desc: "Secure cloud or on-premises file storage with access controls, version history, and search — properly configured for legal work." },
  { icon: ShieldCheck, title: "Cybersecurity & Email Security", desc: "Business email with anti-phishing protection, spam filtering, and encryption for confidential client communications." },
  { icon: Laptop, title: "Workstation & IT Support", desc: "Hardware setup, software updates, practice management support (Clio, MyCase, etc.), and helpdesk when things break." },
  { icon: Globe, title: "Law Firm Websites", desc: "Clean, professional sites with practice area pages, attorney profiles, client testimonials, and intake forms." },
  { icon: CheckCircle, title: "Ongoing Managed IT", desc: "Flat-fee monthly IT support so you have a reliable local partner — not a ticket queue — when you need help fast." },
];

export default function LawFirmsPage() {
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
              Law Firms
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT built around{" "}
              <span style={{ color: "#F97316" }}>client confidentiality</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Law firms have unique technology requirements: secure communications, reliable access to case files, and the kind of professional web presence that earns trust before a client ever calls. We work with solo attorneys and small firms across Sonoma County to get all of it right.
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
              Challenges we solve for law firms
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
              Legal IT services
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

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Secure IT for Sonoma County attorneys
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Local support, flat-fee pricing, and a team that understands the sensitivity of legal work. Call (707) 239-6725.
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
