import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ShieldCheck, Key, Users, Database, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cybersecurity for Small Businesses in Sonoma County | Copper Bay Tech",
  description:
    "Threat assessments, password management, phishing training, backups, and HIPAA compliance for Sonoma County small businesses. Local cybersecurity help from Copper Bay Tech.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do small businesses really get hacked?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — and more often than large companies in relative terms. Small businesses are attractive targets because they tend to have weaker defenses. Ransomware, phishing, and business email compromise are the most common threats we see in Sonoma County. Most attacks exploit simple gaps: weak passwords, unpatched software, or untrained staff.",
      },
    },
    {
      "@type": "Question",
      name: "What does a cybersecurity assessment involve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We review your network, devices, user accounts, email configuration, backup systems, and software update practices. You get a prioritized list of findings — not a 100-page report full of jargon — with clear next steps organized by risk level. Most assessments take a few hours and can be done remotely.",
      },
    },
    {
      "@type": "Question",
      name: "Are you able to help with HIPAA compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We work with healthcare providers, medical offices, and other covered entities in Sonoma County to address the technical safeguard requirements of HIPAA: access controls, audit logs, encryption, backup and recovery, and business associate agreements for your technology vendors.",
      },
    },
    {
      "@type": "Question",
      name: "How much does cybersecurity help cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A one-time security assessment typically runs $400–$900 depending on scope. Ongoing security monitoring and management can be added to an IT support retainer. We give you a flat-fee quote before any work starts.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity for Small Businesses",
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
    "Cybersecurity assessments, password management, phishing training, backup strategy, and HIPAA compliance support for Sonoma County small businesses.",
};

const services = [
  {
    icon: ShieldCheck,
    title: "Threat Assessment",
    desc: "We audit your network, accounts, and software for the vulnerabilities attackers actually exploit — and give you a plain-English action plan.",
  },
  {
    icon: Key,
    title: "Password & Access Management",
    desc: "Business password manager setup, multi-factor authentication rollout, and account access reviews so only the right people have access to the right things.",
  },
  {
    icon: Users,
    title: "Phishing & Social Engineering Training",
    desc: "Short, practical training for your staff on recognizing phishing emails, suspicious links, and impersonation scams — the #1 cause of breaches.",
  },
  {
    icon: Database,
    title: "Backup & Ransomware Recovery",
    desc: "Automated offsite backups with tested restore procedures. If ransomware hits, you have options beyond paying the attackers.",
  },
  {
    icon: FileCheck,
    title: "HIPAA Compliance Support",
    desc: "Technical safeguard implementation for medical offices and covered entities: encryption, access controls, audit logging, and BAA coordination.",
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    desc: "If you think something has already happened — a breach, ransomware, compromised email — we help you contain it, assess the damage, and recover.",
  },
];

const riskItems = [
  "Reused or weak passwords across multiple accounts",
  "No multi-factor authentication on email or banking",
  "Staff clicking phishing links (it happens to everyone)",
  "Backups that haven't been tested or don't exist",
  "Unpatched Windows or macOS devices on your network",
  "No documentation of who has access to what",
];

export default function CybersecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#18181B] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Cybersecurity
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Protect your business before{" "}
              <span style={{ color: "#F97316" }}>something goes wrong</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Small businesses in Sonoma County are targeted by ransomware, phishing, and data breaches every day. We help you close the gaps — without enterprise-level complexity or cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a security assessment <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white/80 border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                (707) 239-6725
              </a>
            </div>
          </div>
        </section>

        {/* Common risks */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2
                  className="text-3xl font-bold text-[#18181B] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The gaps attackers look for
                </h2>
                <p className="text-[#3F3F46]/60 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  Most breaches aren&rsquo;t sophisticated. They exploit simple, fixable problems that most small businesses don&rsquo;t know they have.
                </p>
                <div className="space-y-3">
                  {riskItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5 text-[#F97316]" />
                      <span className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FAFAF9] rounded-2xl p-8 border border-[#18181B]/8">
                <h3
                  className="text-xl font-bold text-[#18181B] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  What we do about it
                </h3>
                <div className="space-y-3">
                  {[
                    "Identify every gap before an attacker does",
                    "Prioritize fixes by actual risk — not theoretical ones",
                    "Train your staff so they become your first line of defense",
                    "Put automated safeguards in place so protection doesn't depend on memory",
                    "Test your backups so you know recovery actually works",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle size={16} className="shrink-0 mt-0.5 text-[#F97316]" />
                      <span className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Cybersecurity services
            </h2>
            <p className="text-[#3F3F46]/60 mb-12 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              Practical security built for small businesses — not enterprise compliance theater.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqJsonLd.mainEntity.map((item) => (
                <div key={item.name} className="bg-[#FAFAF9] rounded-2xl p-6 border border-[#18181B]/8">
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {item.acceptedAnswer.text}
                  </p>
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
              Don&rsquo;t wait for a breach to find out where you&rsquo;re vulnerable
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              A security assessment takes a few hours and costs far less than a breach. Serving Sonoma County businesses from Santa Rosa.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a security assessment <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
