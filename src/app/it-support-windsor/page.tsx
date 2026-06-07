import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support Windsor CA | Local Managed IT Services | Copper Bay Tech",
  description:
    "Local IT support for Windsor businesses. Network setup, managed services, cloud migration, and direct access — no ticket queues. Serving Windsor and all of Sonoma County.",
  keywords:
    "IT support Windsor, IT company Windsor CA, managed IT services Windsor, computer support Windsor, small business IT Windsor",
  alternates: { canonical: "https://copperbaytech.com/it-support-windsor" },
  openGraph: {
    title: "IT Support Windsor | Copper Bay Tech",
    description: "Local managed IT support for Windsor small businesses.",
    url: "https://copperbaytech.com/it-support-windsor",
    siteName: "Copper Bay Tech",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support Windsor",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    telephone: "+17072396725",
    address: { "@type": "PostalAddress", addressRegion: "CA" },
  },
  areaServed: { "@type": "City", name: "Windsor", containedInPlace: { "@type": "State", name: "California" } },
  description: "Managed IT support for Windsor small businesses.",
};

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

const industries = [
  "Medical & dental practices",
  "Wineries & tasting rooms",
  "Real estate offices",
  "Retail & restaurants",
  "Professional services",
  "Nonprofits",
  "Construction & trades",
  "Financial services",
];

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://copperbaytech.com" },
    { "@type": "ListItem", position: 2, name: "IT Support", item: "https://copperbaytech.com/it-support-sonoma-county" },
    { "@type": "ListItem", position: 3, name: "IT Support Windsor" },
  ],
};

export default function ITSupportWindsor() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topo-itwn" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo-itwn)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}>
              Windsor, CA · IT Support
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              IT support for<br />
              <span style={{ color: "#F97316" }}>Windsor businesses.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Reliable, local IT support for Windsor small businesses. Direct access to a real person who knows your setup — not a helpdesk runaround.
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

        {/* What's included + industries */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>What&apos;s included</p>
                <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>What Windsor businesses get.</h2>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Industries we support</p>
                <h3 className="text-2xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Who we work with in Windsor.</h3>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((ind) => (
                    <div key={ind} className="bg-white rounded-lg p-3 border border-[#18181B]/8 text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>{ind}</div>
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
              &ldquo;Our point-of-sale and back-office systems used to go down every other week. Duke got everything onto a stable network and now it just works. When we do have a question, we get a real answer the same day.&rdquo;
            </p>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Marcus L.</p>
            <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Owner, Windsor Town Green Bistro</p>
            <p className="mt-5 text-[11px] italic text-white/30" style={{ fontFamily: "var(--font-body)" }}>
              Representative example — illustrates the kind of work and results we aim for, not a verified quote from a specific named client.
            </p>
          </div>
        </section>

        {/* Nearby */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-[#3F3F46]/60" style={{ fontFamily: "var(--font-body)" }}>
              We also support businesses in{" "}
              <Link href="/it-support-santa-rosa" className="text-[#F97316] font-semibold hover:underline">Santa Rosa</Link>,{" "}
              <Link href="/it-support-healdsburg" className="text-[#F97316] font-semibold hover:underline">Healdsburg</Link>,{" "}
              <Link href="/it-support-petaluma" className="text-[#F97316] font-semibold hover:underline">Petaluma</Link>, and{" "}
              <Link href="/it-support-sonoma-county" className="text-[#F97316] font-semibold hover:underline">across Sonoma County</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Let&apos;s look at your setup.</h2>
            <p className="text-lg text-[#3F3F46]/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute call. We&apos;ll ask about your current situation and tell you honestly what we&apos;d fix first and what it would cost.
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
