import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  Server,
  Check,
  ArrowRight,
  Network,
  Cloud,
  Monitor,
  Wifi,
  Users,
  Zap,
  PhoneCall,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Managed Services for Sonoma County Businesses | Copper Bay Tech",
  description:
    "Copper Bay Tech provides hands-on IT support, network management, and managed services for Sonoma County small businesses. Month-to-month, no contracts, real local support.",
  keywords: [
    "IT support Sonoma County",
    "managed IT services Petaluma",
    "small business IT Santa Rosa",
    "network setup Sonoma County",
    "IT consultant North Bay California",
  ],
  openGraph: {
    title: "IT Support & Managed Services for Sonoma County Businesses | Copper Bay Tech",
    description:
      "Hands-on IT support and managed services for Sonoma County businesses. Month-to-month retainers, no long-term contracts, direct line — not a ticket queue.",
    type: "website",
  },
};

const included = [
  {
    icon: Network,
    title: "Network setup & management",
    body: "Routers, switches, firewalls, VLANs — designed for reliability and security. We document everything and keep it updated as your team changes.",
  },
  {
    icon: Monitor,
    title: "Workstations & peripherals",
    body: "Laptops, desktops, printers, and monitors — setup, configuration, and troubleshooting. New device provisioning and end-of-life decommissioning handled cleanly.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi design & optimization",
    body: "Coverage mapping, access point placement, and guest network segmentation. We design Wi-Fi for how your team actually works — not just for the router's maximum spec sheet.",
  },
  {
    icon: Cloud,
    title: "Cloud migration & storage",
    body: "Moving to Google Drive, Microsoft OneDrive, or another cloud platform? We plan and execute the migration with minimal disruption and train your staff on the new setup.",
  },
  {
    icon: Zap,
    title: "Process & workflow automation",
    body: "Repetitive tasks that eat into your team's day can often be automated. We identify the right opportunities and build lightweight automations that actually get used.",
  },
  {
    icon: Server,
    title: "AI agent integrations",
    body: "Practical AI tools integrated where they make a real difference — scheduling, draft responses, document processing. We focus on tools your team will adopt, not tech for its own sake.",
  },
  {
    icon: Users,
    title: "Staff onboarding & offboarding",
    body: "New hire setup and departing employee deprovisioning done right — accounts, devices, permissions, and access revoked cleanly so nothing falls through the cracks.",
  },
  {
    icon: PhoneCall,
    title: "Vendor coordination",
    body: "ISP issues, software licensing, hardware warranties — we deal with the vendors so you don't have to spend an hour on hold to report someone else's problem.",
  },
  {
    icon: Calendar,
    title: "Backups & monitoring",
    body: "Backup systems configured and verified, not just set up and forgotten. We confirm your data is actually recoverable before you ever need it.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Free Assessment",
    body: "A free 30-minute call to understand your current setup — what's working, what's frustrating, and what risks you may not know about. No obligation.",
  },
  {
    number: "02",
    title: "Clear Proposal",
    body: "You receive a plain-English proposal with a defined scope and a flat monthly retainer. No hourly billing surprises — you know the number before we start.",
  },
  {
    number: "03",
    title: "Onboarding",
    body: "We document your infrastructure, get access to the right systems, and handle any immediate issues. Most clients feel the difference within the first week.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    body: "You have a direct line — call, text, or email. We respond quickly and show up in person when the issue requires it. Month-to-month, cancel with 30 days notice.",
  },
];

const faqs = [
  {
    q: "What does IT support actually include?",
    a: "It depends on what your business needs — that's the honest answer. At minimum, retainer clients get network management, workstation support, cloud administration, and a direct contact for issues. We scope it specifically to your situation rather than selling you a generic tier.",
  },
  {
    q: "Do I have to sign a long-term contract?",
    a: "No. IT support is month-to-month. Cancel with 30 days notice — no penalties, no lock-in. We want you to stay because the service is good, not because a contract forces you to.",
  },
  {
    q: "We already have a part-time IT person / IT company. Can you supplement them?",
    a: "Yes. We work alongside existing teams frequently — handling overflow, covering specific areas like networking or cloud migration, or providing a second opinion. We'll tell you honestly if we think you already have it covered.",
  },
  {
    q: "How do you handle after-hours issues?",
    a: "Urgent issues — things that stop your business from operating — reach us directly. We're a small team, not a helpdesk with tiers and escalations. What counts as urgent we define together when we start.",
  },
];

export default function ITSupportPage() {
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
              IT Support &amp; Networking
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT that just works,
              <br />
              <span style={{ color: "#F97316" }}>every single day.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Hands-on IT support and managed services for Sonoma County businesses. A real person, not a ticket queue. Month-to-month — no long-term contracts required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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

        {/* Intro — who it's for */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Who it&apos;s for
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#18181B] mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your technology should support your business — not slow it down.
                </h2>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Most small businesses in Sonoma County handle IT reactively — they fix things when they break. That works until it doesn&apos;t: a ransomware incident, a failed drive with no backup, or a key employee departure that leaves no one knowing the passwords.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  We provide proactive, ongoing IT support so problems get caught before they cost you a day of downtime. And when something does go wrong, you have a direct line to someone who knows your setup.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Small businesses without a dedicated IT department",
                  "Teams frustrated by slow computers, unreliable Wi-Fi, or lost files",
                  "Businesses moving to Google Workspace or Microsoft 365",
                  "Owners who want one reliable person to call when tech breaks",
                  "Companies that need IT covered without a full-time hire",
                  "Businesses preparing to scale and need their infrastructure to keep up",
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
                Comprehensive IT coverage.
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Scoped to what your business actually needs — not a rigid package with features you&apos;ll never use.
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

        {/* How our support works */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  How our support works
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#18181B] mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  A direct line. Not a ticket number.
                </h2>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Most managed IT services route your issues through a helpdesk, assign ticket numbers, and have you repeat yourself every time. We work differently.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Retainer clients have a direct contact — Duke Hutcheon, founder of Copper Bay Tech. Call, text, or email. You talk to someone who already knows your setup because he helped build it.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  When an issue requires an in-person visit — a hardware problem, a network reconfiguration, a training session — we come to you. Sonoma County businesses only; we don&apos;t try to serve everyone remotely when presence matters.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Month-to-month",
                    detail: "No annual contracts. Cancel with 30 days notice. We earn your business every month.",
                  },
                  {
                    label: "Direct contact",
                    detail: "Call or text the person who manages your infrastructure. No escalation tiers.",
                  },
                  {
                    label: "On-site when it matters",
                    detail: "Remote support for software issues; in-person for hardware, networking, and training.",
                  },
                  {
                    label: "Flat monthly retainer",
                    detail: "Predictable cost. No surprise invoices for hours you didn't approve. Scope defined upfront.",
                  },
                  {
                    label: "Full documentation",
                    detail: "Your infrastructure is documented and the documentation is yours. No vendor lock-in through obscurity.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-[#FAFAF9] border border-[#18181B]/8 p-5"
                  >
                    <p
                      className="text-sm font-semibold text-[#18181B] mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-sm text-[#3F3F46]/60 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How it works
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                From first call to fully supported
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Getting started is straightforward. No lengthy onboarding process or technical questionnaires.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step) => (
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
                IT support FAQ
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
              Ready to get started?
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support that works as hard as you do.
            </h2>
            <p
              className="text-white/60 text-lg max-w-lg mx-auto mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Free 30-minute consultation. We&apos;ll look at your current setup, identify the gaps, and recommend exactly what your business needs — with a clear scope and flat-fee pricing.
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
