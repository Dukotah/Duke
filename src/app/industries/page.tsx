import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, UtensilsCrossed, Stethoscope, Scale, Home, Wine } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve in Sonoma County | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support and web development tailored to Sonoma County's key industries: restaurants, healthcare, law firms, real estate, and wineries.",
};

const industries = [
  {
    icon: UtensilsCrossed,
    name: "Restaurants & Food Service",
    desc: "POS systems, online ordering, Wi-Fi for staff and guests, and websites that drive reservations and foot traffic.",
    href: "/industries/restaurants",
  },
  {
    icon: Stethoscope,
    name: "Healthcare & Medical Offices",
    desc: "HIPAA-compliant IT infrastructure, EHR support, secure email, and patient-facing websites that build trust.",
    href: "/industries/healthcare",
  },
  {
    icon: Scale,
    name: "Law Firms",
    desc: "Secure document management, reliable remote access, professional websites, and confidentiality-first IT practices.",
    href: "/industries/law-firms",
  },
  {
    icon: Home,
    name: "Real Estate",
    desc: "MLS integrations, agent websites, CRM setup, and mobile-optimized listings that convert browsers into buyers.",
    href: "/industries/real-estate",
  },
  {
    icon: Wine,
    name: "Wineries & Tasting Rooms",
    desc: "Wine club websites, e-commerce, point-of-sale support, and IT that keeps your tasting room running smoothly.",
    href: "/industries/wineries",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#18181B] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Industries
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Technology built for{" "}
              <span style={{ color: "#F97316" }}>Sonoma County businesses</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every industry has different technology needs, compliance requirements, and customer expectations. We work with the businesses that make Sonoma County what it is — and we know their specific challenges.
            </p>
          </div>
        </section>

        {/* Industries grid */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-2xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Choose your industry
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map(({ icon: Icon, name, desc, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="group bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm hover:border-[#F97316]/40 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2 group-hover:text-[#F97316] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {name}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                    {desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                  >
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
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
              Don&rsquo;t see your industry?
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              We work with all kinds of Sonoma County businesses. Get in touch and we&rsquo;ll tell you how we can help.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Copper Bay Tech <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
