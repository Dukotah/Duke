import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Web Design Rohnert Park CA | Custom Websites | Copper Bay Tech",
  description:
    "Custom website design for Rohnert Park businesses. Fast, mobile-first, built to convert. Local web designer based in Sonoma County serving Rohnert Park and Cotati.",
  keywords:
    "web design Rohnert Park, website design Rohnert Park CA, web developer Rohnert Park, small business website Rohnert Park CA",
  alternates: { canonical: "https://copperbaytech.com/web-design-rohnert-park" },
  openGraph: {
    title: "Web Design Rohnert Park | Copper Bay Tech",
    description: "Custom websites for Rohnert Park small businesses. Based locally in Sonoma County.",
    url: "https://copperbaytech.com/web-design-rohnert-park",
    siteName: "Copper Bay Tech",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Design Rohnert Park",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    telephone: "+17072396725",
    address: { "@type": "PostalAddress", addressLocality: "Petaluma", addressRegion: "CA" },
  },
  areaServed: { "@type": "City", name: "Rohnert Park", containedInPlace: { "@type": "State", name: "California" } },
  description: "Custom website design for Rohnert Park small businesses. Based locally in Sonoma County.",
};

const includes = [
  "Custom-coded — no Squarespace, no Wix, no WordPress themes",
  "90+ Google PageSpeed score, mobile-first",
  "Local SEO targeting Rohnert Park search queries",
  "Google Business Profile setup for Rohnert Park",
  "Contact form with spam filtering",
  "Flat fee quoted upfront — no hourly billing",
  "Live in 2–3 weeks",
  "30 days post-launch support included",
];

const industries = [
  "Restaurants & cafes",
  "Home services & contractors",
  "Health & wellness practitioners",
  "Retail & boutiques",
  "Professional services",
  "Real estate agents",
  "Auto & repair shops",
  "Fitness & studios",
];

export default function WebDesignRohnertPark() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#18181B] pt-16">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topo-wdrp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0 40 Q20 20 40 40 Q60 60 80 40" fill="none" stroke="#F97316" strokeWidth="0.8" />
                  <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="#F97316" strokeWidth="0.5" />
                  <path d="M0 60 Q20 40 40 60 Q60 80 80 60" fill="none" stroke="#F97316" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo-wdrp)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-24">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Rohnert Park, CA · Web Design
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Web design for<br />
              <span style={{ color: "#F97316" }}>Rohnert Park businesses.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Copper Bay Tech is based right here in Sonoma County. We build custom websites for Rohnert Park and Cotati businesses that load fast, rank locally, and convert visitors into customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid rgba(255,255,255,0.3)", color: "white", fontFamily: "var(--font-heading)" }}
              >
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
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Every site includes</p>
                <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  What Rohnert Park businesses get.
                </h2>
                <ul className="space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={16} color="#F97316" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white"
                    style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
                  >
                    Get a Quote <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Industries we work with</p>
                <h3 className="text-2xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Who we build for in Rohnert Park.</h3>
                <div className="grid grid-cols-2 gap-3">
                  {industries.map((ind) => (
                    <div key={ind} className="bg-white rounded-lg p-3 border border-[#18181B]/8 text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>
                      {ind}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Based locally */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Based in Sonoma County</p>
            <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Your web designer is a neighbor, not a vendor.
            </h2>
            <p className="text-lg text-[#3F3F46]/60 max-w-2xl mx-auto mb-12" style={{ fontFamily: "var(--font-body)" }}>
              We&apos;re not a remote agency you&apos;ll never meet. Copper Bay Tech is based in Sonoma County, minutes from Rohnert Park. We can meet in person, we know the local business landscape, and we&apos;re around when something comes up.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "In-person meetings", body: "If you want to sit down and talk through the project before committing, we can do that." },
                { label: "Local SEO that works", body: "We know which Rohnert Park and Cotati search terms actually drive foot traffic and calls." },
                { label: "Fast response", body: "When something needs attention, you're not waiting in a queue. You call or text a real local number." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#FAFAF9] p-6 border border-[#18181B]/8">
                  <h3 className="text-base font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{item.label}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              &ldquo;Our old site barely showed up when people searched for us in Rohnert Park. Copper Bay Tech rebuilt it, dialed in the local SEO, and now we&apos;re getting calls from customers who found us on the first page.&rdquo;
            </p>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>Daniel P.</p>
            <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>Owner, Rohnert Park Auto Care</p>
          </div>
        </section>

        {/* Nearby */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm text-[#3F3F46]/60" style={{ fontFamily: "var(--font-body)" }}>
              We also build websites for businesses in{" "}
              <Link href="/web-design-petaluma" className="text-[#F97316] font-semibold hover:underline">Petaluma</Link>,{" "}
              <Link href="/web-design-santa-rosa" className="text-[#F97316] font-semibold hover:underline">Santa Rosa</Link>, and{" "}
              <Link href="/web-design-sonoma-county" className="text-[#F97316] font-semibold hover:underline">across Sonoma County</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#18181B] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Let&apos;s build something.
            </h2>
            <p className="text-lg text-[#3F3F46]/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute consultation. In person in Rohnert Park or over a call — your call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold"
                style={{ border: "2px solid #18181B33", color: "#18181B", fontFamily: "var(--font-heading)" }}
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
