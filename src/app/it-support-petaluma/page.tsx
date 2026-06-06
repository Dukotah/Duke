import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { serviceSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support Petaluma CA | Local Managed IT Services | Copper Bay Tech",
  description:
    "IT support for Petaluma businesses. Copper Bay Tech is a local Sonoma County IT team providing managed IT, network support, cloud migration, and direct access when things go wrong.",
  keywords:
    "IT support Petaluma, IT company Petaluma CA, managed IT Petaluma, computer support Petaluma, small business IT Petaluma",
  alternates: { canonical: "https://copperbaytech.com/it-support-petaluma" },
  openGraph: {
    title: "IT Support Petaluma | Copper Bay Tech",
    description: "Local managed IT support for Petaluma businesses, serving all of Sonoma County.",
    url: "https://copperbaytech.com/it-support-petaluma",
    siteName: "Copper Bay Tech",
  },
};

const schema = serviceSchema({
  name: "IT Support Petaluma",
  description: "Managed IT support for Petaluma small businesses. Based locally in Petaluma.",
  url: "https://copperbaytech.com/it-support-petaluma",
  areaServed: { "@type": "City", name: "Petaluma", containedInPlace: { "@type": "State", name: "California" } },
});

const includes = [
  "Direct line to a real person — no ticket queue",
  "Network setup, management, and monitoring",
  "Workstation and device support",
  "Cloud migration (Google Workspace, Microsoft 365)",
  "Staff onboarding and training",
  "MFA and password manager rollout",
  "Flat monthly fee — no hourly billing",
  "Month-to-month — no long-term contract",
];

export default function ITSupportPetaluma() {
  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={breadcrumbSchema([{name:"Home",url:"https://copperbaytech.com"},{name:"IT Support",url:"https://copperbaytech.com/it-support-sonoma-county"},{name:"IT Support Petaluma"}])} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <pattern id="topo-itpt" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo-itpt)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}>
              Petaluma, CA · IT Support
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              IT support<br />
              <span style={{ color: "#F97316" }}>for Petaluma businesses.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              We&apos;re a local North Bay IT team serving Petaluma businesses. We provide IT support, network management, and cloud migration — with a direct line, not a helpdesk ticket.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                Get a Free Assessment <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold" style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}>
                See Pricing
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF9] to-transparent" />
        </section>

        {/* Includes + local advantage */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>What&apos;s included</p>
                <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>What Petaluma businesses get.</h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} color="#F97316" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                    Get a Free Assessment <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Local to Sonoma County</p>
                <h3 className="text-2xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Local IT support that can actually show up.</h3>
                <div className="space-y-4">
                  {[
                    { label: "On-site when needed", body: "Some IT problems need a person in the room. We serve Petaluma and the surrounding North Bay — we can be at your office fast." },
                    { label: "We know your setup", body: "Retainer clients don't explain their setup from scratch every time. We already know it." },
                    { label: "Direct line", body: "Text or call a real number. Not a ticket that goes to a queue in another state." },
                    { label: "No long-term contracts", body: "Month-to-month. 30-day cancel. We earn your business every month." },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-white border border-[#18181B]/8">
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
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              &ldquo;I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we&apos;d had for years. Fixed it same day, no drama.&rdquo;
            </p>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>James R.</p>
            <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Principal, Santa Rosa Insurance Group</p>
            <p className="mt-5 text-[11px] italic text-white/30" style={{ fontFamily: "var(--font-body)" }}>
              Representative example — illustrates the kind of work and results we aim for, not a verified quote from a specific named client.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Let&apos;s talk about your IT situation.</h2>
            <p className="text-lg text-[#3F3F46]/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              We can meet in person anywhere in the North Bay, or hop on a call. Free 30 minutes, honest assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white" style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                Get a Free Assessment <ArrowRight size={16} />
              </Link>
              <a href="tel:+17072396725" className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold" style={{ border: "2px solid #18181B33", color: "#18181B", fontFamily: "var(--font-heading)" }}>
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
