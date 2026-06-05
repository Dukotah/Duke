import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Web Development for Sonoma County Businesses | Copper Bay Tech",
  description:
    "Hand-coded, fast-loading websites for Sonoma County small businesses. No templates, no page builders. Local SEO included. Flat-fee pricing starting at $2,500.",
  openGraph: {
    title: "Custom Web Development | Copper Bay Tech — Sonoma County",
    description:
      "Custom websites built for Petaluma, Santa Rosa, Sebastopol, and the greater North Bay. Fast, mobile-first, and built to rank locally.",
    url: "https://copperbaytech.com/web-development",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Web Development",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Hand-coded, fast-loading websites for Sonoma County small businesses. No templates. Local SEO included.",
  offers: {
    "@type": "Offer",
    priceRange: "$2,500 – $6,000",
    priceCurrency: "USD",
  },
};

const included = [
  "Custom-coded — no WordPress, no templates, no drag-and-drop builders",
  "Mobile-first design that looks great on every screen size",
  "Fast load times (we optimize for Core Web Vitals)",
  "Local SEO setup — meta tags, schema, Google Business Profile",
  "Contact forms, booking integrations, and CTAs built to convert",
  "Domain, hosting, and email setup included",
  "Flat-fee pricing — you know the cost before we start",
  "Delivered in 2–3 weeks, not months",
];

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Most small business websites fall between $2,500 and $6,000 depending on complexity. You get a flat-fee proposal before we start — no surprises, no hourly billing.",
  },
  {
    q: "How long does it take?",
    a: "Most projects are live in 2–3 weeks. We set a timeline upfront and stick to it.",
  },
  {
    q: "Do you work with businesses outside Sonoma County?",
    a: "Yes — web development is fully remote. We prioritize local clients but work with businesses throughout California.",
  },
  {
    q: "Can you redesign my existing site?",
    a: "Absolutely. We'll assess what you have and give you a clear plan and price within 24 hours.",
  },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How long does it take to build a website?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most small business websites are live in 2–3 weeks. Complex projects with custom functionality may take 4–6 weeks. We set a timeline before we start and stick to it.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you use WordPress or website builders?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Every website we build is custom-coded — no WordPress, no Squarespace, no drag-and-drop builders. This means faster load times, better security, and full control over your site.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What happens if I need changes after launch?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Small updates are quick and affordable. Larger changes are scoped and priced upfront. Many clients add a monthly retainer for ongoing updates and support.",
                  },
                },
              ],
            }),
          }}
        />
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Web Development
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Websites that work as hard
              <br />
              <span style={{ color: "#F97316" }}>as your business does.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Custom-coded, fast-loading, and built to rank locally. No templates. No page builders. Just a professional website that converts visitors into customers — delivered in weeks, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Quote <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} /> (707) 239-6725
              </a>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What every project includes
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8"
                >
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#16A34A" />
                  <span className="text-sm text-[#3F3F46]/70" style={{ fontFamily: "var(--font-body)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Transparent, flat-fee pricing
            </h2>
            <p className="text-[#3F3F46]/60 mb-4 max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              You&apos;ll get a fixed price before we start. No hourly billing, no scope creep surprises.
            </p>
            <p className="text-sm text-[#3F3F46]/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Not sure which tier fits your project?{" "}
              <Link href="/tools/website-cost-estimator" className="text-[#F97316] hover:underline font-medium">
                Try our free website cost estimator
              </Link>{" "}
              to get a ballpark in under two minutes.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { tier: "Business Site", price: "$2,500 – $4,000", desc: "5–8 pages, contact form, local SEO, Google Business Profile setup. Ideal for service businesses, consultants, and local shops." },
                { tier: "Growth Site", price: "$4,000 – $6,000", desc: "Everything in Business, plus booking integrations, blog, multiple service pages, and conversion-focused copywriting." },
                { tier: "Custom Web App", price: "$6,000+", desc: "Portals, dashboards, custom tools, e-commerce, and complex integrations. Scoped per project after discovery." },
              ].map((p) => (
                <div key={p.tier} className="bg-white rounded-xl border border-[#18181B]/10 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {p.tier}
                  </p>
                  <p className="text-2xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {p.price}
                  </p>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Common questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-[#18181B]/10 p-6 bg-[#FAFAF9]">
                  <p className="font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {faq.q}
                  </p>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Ready for a website that actually works?
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Free 30-minute consultation. We&apos;ll review your current site, tell you what we&apos;d build, and give you a flat-fee quote — no obligation.
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
