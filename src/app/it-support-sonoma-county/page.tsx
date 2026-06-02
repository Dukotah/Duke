import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, faqSchema } from "@/components/JsonLd";
import { ArrowRight, Server, Wifi, Cloud, Users, ShieldCheck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support Sonoma County | Managed IT Services | Copper Bay Tech",
  description:
    "Local IT support for Sonoma County small businesses. Network setup, managed services, cloud migration, and hands-on tech support in Petaluma, Santa Rosa, and beyond.",
  keywords:
    "IT support Sonoma County, IT company Petaluma, managed IT services Santa Rosa, small business IT support North Bay, computer support Sonoma County",
  alternates: { canonical: "https://copperbaytech.com/it-support-sonoma-county" },
  openGraph: {
    title: "IT Support Sonoma County | Copper Bay Tech",
    description: "Local IT support for Sonoma County businesses. No ticket queues — direct access.",
    url: "https://copperbaytech.com/it-support-sonoma-county",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "IT Support & Managed Services",
  description: "Managed IT support for Sonoma County small businesses.",
  url: "https://copperbaytech.com/it-support-sonoma-county",
  areaServed: "Sonoma County, CA",
});

const services = [
  { icon: Wifi, label: "Network setup & management", body: "Business-grade Wi-Fi, wired networks, guest networks, and ongoing monitoring. We set it up right the first time." },
  { icon: Server, label: "Workstations & devices", body: "Procurement, setup, and ongoing support for computers, printers, scanners, and peripherals across your whole office." },
  { icon: Cloud, label: "Cloud migration", body: "Move off aging local servers onto Google Workspace or Microsoft 365 — with proper data migration and zero downtime." },
  { icon: Users, label: "Staff onboarding & training", body: "We handle new-hire setup and run hands-on training sessions so your team actually uses the tools correctly." },
  { icon: ShieldCheck, label: "Security baseline", body: "MFA enforcement, patch management, password managers, and endpoint protection — the basics most small businesses skip." },
  { icon: Wrench, label: "Process automation", body: "AI integrations and workflow tools that eliminate repetitive manual work and give your team hours back every week." },
];

const faqs = [
  {
    q: "Do I need a full-time IT person?",
    a: "Almost certainly not. Most small businesses in Sonoma County need a reliable partner they can call — not a $80k salary. A monthly retainer gives you the same access at a fraction of the cost.",
  },
  {
    q: "How do I reach you when something breaks?",
    a: "Retainer clients get a direct number — not a ticket queue. You call or text, we pick up or call back fast. For critical issues, same-day response is standard.",
  },
  {
    q: "We already have some IT in place. Can you just fill the gaps?",
    a: "Absolutely. We're happy to audit what's in place, identify the gaps, and either fix them ourselves or advise your existing provider. We don't require a full rip-and-replace.",
  },
  {
    q: "Do you support remote employees?",
    a: "Yes. Remote setup, VPN access, cloud tool configuration, and device management for distributed teams — all covered.",
  },
  {
    q: "What does a monthly retainer cost?",
    a: "Retainer pricing depends on team size and scope. Most small businesses (5–20 employees) fall in the $400–$900/month range. We quote flat monthly fees — no hourly billing.",
  },
];

export default function ITSupportSonomaCounty() {
  return (
    <>
      <JsonLd schema={[schema, faqSchema(faqs)]} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <pattern id="topo2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo2)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Sonoma County · IT Support
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support that shows up.<br />
              <span style={{ color: "#F97316" }}>No ticket queues.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Reliable IT support for Sonoma County businesses. Network setup, cloud migration, workstation management, and a direct line when things go wrong — not a helpdesk runaround.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Get a Free Assessment <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                See Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
              Serving Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Windsor · Healdsburg
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
        </section>

        {/* What's covered */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>What&apos;s covered</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Everything your business actually needs.
              </h2>
              <p className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                From the network your team relies on to the tools that make them faster — we handle it.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-6 border border-[#18181B]/8">
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
                &ldquo;We moved our whole office to the cloud and it was seamless. Duke handled everything — setup, staff training, the works. Our team was up and running in a day.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>SK</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Sandra K.</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Office Manager, Sebastopol Family Dental</p>
                </div>
              </footer>
            </blockquote>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: "12", label: "Staff trained" },
                { value: "Zero", label: "Downtime" },
                { value: "1 weekend", label: "Migration window" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>{m.value}</p>
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiator */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Why Copper Bay</p>
                <h2 className="text-4xl font-bold text-[#18181B] mb-6 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  Local IT that treats you like a person, not a ticket.
                </h2>
                <p className="text-[#3F3F46]/60 leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
                  Big managed service providers give you a call center. We give you a direct line to the person who set up your network and knows your setup inside and out.
                </p>
                <p className="text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  When something breaks, you shouldn&apos;t have to explain your whole setup from scratch to whoever picks up the phone. You should be able to text someone who already knows.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Direct line, not a ticket queue", body: "Retainer clients text or call a real number — same-day response for critical issues." },
                  { label: "Flat monthly pricing", body: "No hourly billing. No surprise invoices. One number, predictable every month." },
                  { label: "On-site when it matters", body: "Some things need a person in the room. We're local and can be there fast." },
                  { label: "No long-term contracts", body: "Month-to-month. If we're not delivering, you can walk. We think that keeps us sharp." },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                    <div className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0 mt-2" />
                    <div>
                      <p className="text-sm font-bold text-[#18181B] mb-1" style={{ fontFamily: "var(--font-heading)" }}>{item.label}</p>
                      <p className="text-sm text-[#3F3F46]/60" style={{ fontFamily: "var(--font-body)" }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
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
              Let&apos;s look at your setup.
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute call. We&apos;ll ask about your current situation and tell you honestly what we&apos;d fix first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Get a Free Assessment <ArrowRight size={16} />
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
