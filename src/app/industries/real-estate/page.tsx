import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, Globe, Smartphone, Database, Mail, Laptop, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Websites & IT Support for Real Estate Agents in Sonoma County | Copper Bay Tech",
  description:
    "Agent websites with MLS integration, CRM setup, mobile-optimized listings, and IT support for real estate professionals in Sonoma County. Copper Bay Tech.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Websites & IT Support for Real Estate",
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
    "Agent and brokerage websites with MLS integration, CRM setup, lead capture, and IT support for real estate professionals throughout Sonoma County.",
};

const painPoints = [
  { problem: "Generic brokerage website that doesn't showcase you as an agent", solution: "A personal agent website that highlights your listings, local expertise, sold history, and client testimonials — separate from the brokerage template." },
  { problem: "Listings that look bad on phones", solution: "Mobile-first property pages with large photos, key details at a glance, and easy contact buttons so buyers can reach you from any device." },
  { problem: "Leads scattered across email, text, and three different CRMs", solution: "We help you set up and configure a CRM that actually fits your workflow, with website lead forms that route inquiries to the right place." },
  { problem: "Slow laptop before a listing appointment", solution: "Workstation tune-up, hardware recommendations, and on-site support across Sonoma County so your tech keeps up with your pace." },
];

const services = [
  { icon: Globe, title: "Agent & Brokerage Websites", desc: "Custom sites with your branding, bio, featured listings, testimonials, and local neighborhood guides that rank in search." },
  { icon: Smartphone, title: "Mobile-Optimized Listings", desc: "Property pages that load fast and look sharp on any screen — because most buyers are browsing on their phones." },
  { icon: Database, title: "CRM Setup & Integration", desc: "We help you configure Follow Up Boss, LionDesk, or your preferred CRM and connect it to your website's lead forms." },
  { icon: Mail, title: "Business Email & Productivity", desc: "Professional email setup, Microsoft 365 or Google Workspace, and e-signature tool configuration." },
  { icon: Laptop, title: "IT Support for Agents", desc: "Workstation tune-ups, hardware setup, VPN for secure remote work, and a local tech to call when something breaks." },
  { icon: CheckCircle, title: "Ongoing Website Updates", desc: "Need to add a new neighborhood page or update your bio? We keep your site current so you don't have to think about it." },
];

export default function RealEstatePage() {
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
              Real Estate
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tech that helps you{" "}
              <span style={{ color: "#F97316" }}>close more deals</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Sonoma County real estate moves fast. Whether you&rsquo;re a solo agent in Petaluma or a brokerage in Santa Rosa, your technology should keep pace — from a website that ranks for local searches to the CRM that captures every lead.
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
              Problems we solve for agents
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
              Real estate tech services
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

        {/* Local market callout */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-2xl p-8 border border-[#18181B]/8">
              <h3 className="text-xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                We know Sonoma County
              </h3>
              <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                We&rsquo;ve built websites and handled IT for businesses from Bodega Bay to Windsor. We understand the local market, the neighborhoods buyers search for, and how to position your site to rank for terms like &ldquo;homes for sale in Healdsburg&rdquo; or &ldquo;Sebastopol real estate agent.&rdquo; That local knowledge is built into every site we create.
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
              Build your online presence in Sonoma County
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Custom agent websites, CRM setup, and local IT support. Flat-fee pricing, quick turnaround.
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
