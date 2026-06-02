import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve | Copper Bay Tech — Sonoma County",
  description:
    "IT support, web development, and cybersecurity tailored for restaurants, medical practices, law firms, real estate, and wineries in Sonoma County.",
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT & Web Services for Sonoma County Businesses",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    url: "https://copperbaytech.com",
  },
  areaServed: "Sonoma County, CA",
  url: "https://copperbaytech.com/industries",
};

const industries = [
  {
    name: "Restaurants & Food Service",
    href: "/industries/restaurants",
    desc: "POS support, guest Wi-Fi, online ordering, and websites that drive covers.",
  },
  {
    name: "Medical & Dental Practices",
    href: "/industries/healthcare",
    desc: "HIPAA-compliant IT and websites for patient-facing practices.",
  },
  {
    name: "Law Firms & Legal Practices",
    href: "/industries/law-firms",
    desc: "Secure IT infrastructure and professional websites for attorneys.",
  },
  {
    name: "Real Estate Agents & Brokerages",
    href: "/industries/real-estate",
    desc: "Custom agent websites, CRM integrations, and local SEO.",
  },
  {
    name: "Wineries & Tasting Rooms",
    href: "/industries/wineries",
    desc: "Reservation systems, wine club tech, and websites for wine country.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Industries We Serve
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Built for your industry.
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We work with Sonoma County businesses across industries — and we understand the specific tech challenges each one faces.
            </p>
          </div>
        </section>

        {/* Industry cards */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {industries.map((industry) => (
                <div
                  key={industry.href}
                  className="rounded-xl border border-[#18181B]/10 bg-[#FAFAF9] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2
                    className="font-bold text-[#18181B] text-lg mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {industry.name}
                  </h2>
                  <p
                    className="text-sm text-[#3F3F46]/60 mb-4 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {industry.desc}
                  </p>
                  <Link
                    href={industry.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#F97316] hover:text-[#ea6c0a] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Learn more <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Don't see your industry CTA strip */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Don&apos;t see your industry?
            </h2>
            <p
              className="text-white/60 mb-8 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We work with all kinds of Sonoma County businesses. If you don&apos;t see your industry, reach out — we&apos;ll tell you honestly if we can help.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
