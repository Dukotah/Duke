import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Lock,
  Search,
  Network,
  Users,
  FileText,
  AlertTriangle,
  HardDrive,
  Key,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cybersecurity Audits & Network Security in Sonoma County | Copper Bay Tech",
  description:
    "Copper Bay Tech provides cybersecurity audits, network hardening, and incident response planning for Sonoma County small businesses. Practical security — no fear tactics, just real protection.",
  keywords: [
    "cybersecurity Sonoma County",
    "network security audit Petaluma",
    "small business cybersecurity Santa Rosa",
    "HIPAA compliance North Bay",
    "IT security Sonoma County",
  ],
  openGraph: {
    title: "Cybersecurity Audits & Network Security in Sonoma County | Copper Bay Tech",
    description:
      "Practical cybersecurity for Sonoma County small businesses. Network audits, infrastructure hardening, MFA setup, incident response planning. No fear tactics — just honest risk reduction.",
    type: "website",
  },
};

const included = [
  {
    icon: Search,
    title: "Network security audits",
    body: "A systematic review of your network — open ports, unpatched devices, weak credentials, and misconfigured firewall rules. You get a clear written report, not just a scan output.",
  },
  {
    icon: ShieldCheck,
    title: "Infrastructure hardening",
    body: "Closing the gaps identified in your audit: disabling unnecessary services, applying security configurations, and ensuring your systems present the smallest possible attack surface.",
  },
  {
    icon: HardDrive,
    title: "Firmware & patch management",
    body: "Routers, firewalls, switches, and workstations running outdated firmware are common entry points. We identify what needs updating and ensure it gets done safely.",
  },
  {
    icon: Key,
    title: "MFA & password management",
    body: "Multi-factor authentication deployed across your critical accounts, paired with a password manager your team will actually use. Simple changes that dramatically reduce credential risk.",
  },
  {
    icon: AlertTriangle,
    title: "Incident response planning",
    body: "A written plan for what to do if something goes wrong — ransomware, a data breach, a compromised account. Knowing the steps in advance reduces panic and limits damage.",
  },
  {
    icon: FileText,
    title: "Compliance baseline (PCI, HIPAA)",
    body: "We help you understand which regulations apply to your business and document the controls you already have in place. We don't overstate your compliance posture — just help you make honest progress.",
  },
  {
    icon: Network,
    title: "Ongoing monitoring",
    body: "Retainer clients get periodic check-ins on their security posture — reviewing logs, confirming backups, and staying ahead of new vulnerabilities relevant to your setup.",
  },
  {
    icon: Users,
    title: "Employee offboarding & access control",
    body: "When someone leaves, their access goes with them — accounts, devices, cloud services, shared passwords. We build a checklist for your team and can execute it when the time comes.",
  },
  {
    icon: HardDrive,
    title: "Backup verification",
    body: "A backup that's never been tested is an assumption, not a safety net. We verify that your backups are complete, recent, and actually recoverable before you ever need them.",
  },
];

const auditSteps = [
  {
    number: "01",
    title: "Initial Conversation",
    body: "A free call to understand your business, what data you handle, what systems you use, and where your biggest concerns are. No charge, no commitment.",
  },
  {
    number: "02",
    title: "Network & System Review",
    body: "We review your network configuration, connected devices, cloud accounts, and access controls. We use standard tools and manual review — no invasive testing without your explicit sign-off.",
  },
  {
    number: "03",
    title: "Written Findings Report",
    body: "You receive a plain-English report covering what we found, how serious each issue is, and what we recommend. Prioritized by risk — so you know what to address first.",
  },
  {
    number: "04",
    title: "Remediation",
    body: "We fix what needs fixing — hardening configurations, enabling MFA, updating firmware, revoking old access. Each item is confirmed closed, not just noted.",
  },
  {
    number: "05",
    title: "Ongoing Monitoring",
    body: "Optional retainer to keep your security posture current — periodic reviews, backup checks, and a direct line when something looks off.",
  },
];

const faqs = [
  {
    q: "My business is small. Are we really a target?",
    a: "Small businesses are targeted more often than large ones — not because attackers specifically want your data, but because defenses are typically weaker. Ransomware attacks are automated and indiscriminate: they hit whoever has a vulnerability. The Verizon Data Breach Investigations Report has consistently found that small businesses account for the majority of breach victims. Size isn't protection.",
  },
  {
    q: "What does a cybersecurity audit actually produce?",
    a: "You get a written report in plain English — not a raw scan output or a list of CVE numbers. The report covers what we found, how significant each issue is, and what we recommend. We prioritize findings so you know where to spend time and money first. The audit findings belong to you.",
  },
  {
    q: "Do we need to be HIPAA or PCI compliant?",
    a: "If your business handles credit card payments, PCI DSS applies. If you handle any patient health information — including appointment scheduling — HIPAA applies. We can help you understand which requirements are relevant and document your existing controls. We won't overclaim your compliance status, but we'll help you make honest, documented progress.",
  },
  {
    q: "How is this different from just installing antivirus software?",
    a: "Antivirus covers one threat vector. Most breaches involve something antivirus doesn't address: a phishing email that tricks an employee, a weak password reused across accounts, an unpatched router, or an ex-employee's credentials still active. A security audit looks at the whole picture — then we help close the actual gaps.",
  },
];

export default function CybersecurityPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-6xl mx-auto px-6">
            <span
              className="inline-block mb-5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Cybersecurity
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Protect what
              <br />
              <span style={{ color: "#F97316" }}>you&apos;ve built.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Practical cybersecurity for Sonoma County small businesses. No fear tactics, no unnecessary complexity — just honest risk reduction with a clear plan and a real person behind it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
              <Link
                href="/#quiz"
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white px-7 py-3 rounded-md text-sm font-semibold border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Take the free security self-assessment
              </Link>
            </div>
          </div>
        </section>

        {/* Why small businesses are targets */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The reality
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#18181B] mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Small businesses are not too small to be a target.
                </h2>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Most cyberattacks against small businesses are opportunistic, not targeted. Automated tools scan the internet for unpatched systems, reused passwords, and open ports. If your business has a vulnerability, it will be found — regardless of your size or industry.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  The most common causes of small business security incidents are also the most preventable: old passwords still active for former employees, routers running years-old firmware, no multi-factor authentication on email or banking, and backups that have never been tested.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  A cybersecurity audit finds these gaps before an attacker does — and gives you a prioritized plan to close them without overspending.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Businesses that handle customer payment information",
                  "Healthcare-adjacent businesses with patient or appointment data",
                  "Companies that have never had a formal security review",
                  "Businesses with remote employees or BYOD policies",
                  "Organizations recently switching IT providers or staff",
                  "Any business that couldn't operate for a week if data was lost",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8"
                  >
                    <Check size={16} color="#F97316" className="mt-0.5 flex-shrink-0" />
                    <span
                      className="text-sm text-[#3F3F46]/80"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What&apos;s included
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Comprehensive security coverage.
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Scoped to your actual risk profile — not an enterprise checklist designed for a company with a 50-person IT department.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border border-[#18181B]/8 shadow-sm"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.10)" }}
                  >
                    <item.icon size={18} color="#F97316" />
                  </div>
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#3F3F46]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our audit process */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our audit process
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                From first call to closed gaps
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                A structured process that ends with real fixes — not just a report that sits in a drawer.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-6">
              {auditSteps.map((step) => (
                <div key={step.number} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "#18181B" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs text-[#3F3F46]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Self-assessment + tools callout */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#18181B] p-8">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
                >
                  <Lock size={18} color="#F97316" />
                </div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Free tool
                </p>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Security self-assessment quiz
                </h3>
                <p
                  className="text-white/60 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Answer 10 questions about your current setup. You&apos;ll get an honest picture of your security posture and the three most important things to address — no email required.
                </p>
                <Link
                  href="/#quiz"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Take the quiz <ArrowRight size={14} />
                </Link>
              </div>
              <div className="rounded-2xl bg-white border border-[#18181B]/10 p-8">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(249,115,22,0.10)" }}
                >
                  <Search size={18} color="#F97316" />
                </div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Free tool
                </p>
                <h3
                  className="text-xl font-bold text-[#18181B] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Website health check
                </h3>
                <p
                  className="text-[#3F3F46]/60 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Run your business website through our diagnostic tool. Check for HTTPS configuration, mixed content warnings, missing security headers, and common vulnerability indicators.
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Check your website <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mini FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common questions
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Cybersecurity FAQ
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-[#FAFAF9] rounded-xl border border-[#18181B]/10 p-6"
                >
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="text-sm text-[#3F3F46]/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Take the first step
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Know where you stand.
            </h2>
            <p
              className="text-white/60 text-lg max-w-lg mx-auto mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              A free 30-minute call to discuss your current setup and any concerns. No obligation, no scare tactics — just an honest conversation about your risk and what it would take to address it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white px-7 py-3 rounded-md text-sm font-semibold border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
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
