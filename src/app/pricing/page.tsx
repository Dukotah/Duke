import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, Server, ShieldCheck, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Web Design, IT Support & Cybersecurity | Copper Bay Tech",
  description:
    "Transparent, flat-fee pricing for web design, IT support, and cybersecurity in Sonoma County. No hourly billing, no surprise invoices. See what things actually cost.",
  keywords:
    "web design pricing Sonoma County, IT support cost small business, cybersecurity audit price, Copper Bay Tech pricing",
  alternates: { canonical: "https://copperbaytech.com/pricing" },
  openGraph: {
    title: "Pricing | Copper Bay Tech",
    description: "Transparent flat-fee pricing for web design, IT support, and cybersecurity.",
    url: "https://copperbaytech.com/pricing",
    siteName: "Copper Bay Tech",
  },
};

const tiers = [
  {
    icon: Globe,
    label: "Web Design",
    tagline: "Your digital front door, done right.",
    price: "$2,500 – $4,500",
    priceNote: "One-time flat fee",
    href: "/web-design-sonoma-county",
    includes: [
      "Custom-coded in Next.js — no templates",
      "Mobile-first, 90+ PageSpeed score",
      "Up to 8 pages (home, about, services, contact + more)",
      "Contact form with spam filtering",
      "Local SEO setup & schema markup",
      "Google Business Profile configuration",
      "Domain, hosting & email setup",
      "30 days of post-launch support",
    ],
    addons: [
      { label: "E-commerce / booking integration", price: "+ $500–$1,500" },
      { label: "Monthly maintenance retainer", price: "$75/mo" },
    ],
    cta: "Get a Quote",
    ctaHref: "/#contact",
  },
  {
    icon: Server,
    label: "IT Support",
    tagline: "IT that just works, every day.",
    price: "$400 – $900",
    priceNote: "Per month, flat fee",
    href: "/it-support-sonoma-county",
    featured: true,
    includes: [
      "Direct line — no ticket queue",
      "Network setup & management",
      "Workstation & device support",
      "Cloud migration & storage",
      "Staff onboarding & training",
      "MFA & password manager rollout",
      "Monthly check-in call",
      "No long-term contract",
    ],
    addons: [
      { label: "Security audit (one-time)", price: "+ $400–$800" },
      { label: "Process automation build-out", price: "Quoted separately" },
    ],
    cta: "Get a Quote",
    ctaHref: "/#contact",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity",
    tagline: "Find the gaps before attackers do.",
    price: "$400 – $800",
    priceNote: "One-time audit fee",
    href: "/cybersecurity-small-business",
    includes: [
      "Full network & device scan",
      "Open port & firmware audit",
      "Account access controls review",
      "MFA & password audit",
      "Critical issues fixed same day",
      "Written remediation report",
      "90-day follow-up check",
      "HIPAA / PCI baseline mapping (if applicable)",
    ],
    addons: [
      { label: "Ongoing monthly monitoring", price: "+ $150/mo" },
      { label: "Incident response plan document", price: "+ $300" },
    ],
    cta: "Book an Audit",
    ctaHref: "/#contact",
  },
];

const faqs = [
  {
    q: "Why aren't you cheaper?",
    a: "Because cheap IT and cheap websites are expensive in the long run. A $500 website built on a theme breaks, runs slow, and costs you leads for years. We charge fair prices for work that lasts.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Yes. For project work (web design, one-time audits), we split 50% upfront and 50% on delivery. For larger projects, we can discuss phased payments.",
  },
  {
    q: "What if my needs don't fit these packages?",
    a: "Most don't fit exactly — these are starting points. Tell us what you need and we'll quote it precisely. We don't force you into tiers.",
  },
  {
    q: "Is there a contract for monthly IT support?",
    a: "Month-to-month. 30-day cancellation notice. No long-term commitment required.",
  },
  {
    q: "Do you offer discounts for nonprofits?",
    a: "Yes — 15% off project work for registered 501(c)(3) organizations in Sonoma County. Just mention it when you reach out.",
  },
];

export default function Pricing() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span
              className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Transparent Pricing
            </span>
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Flat fees.<br />
              <span style={{ color: "#F97316" }}>No surprises.</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We quote a number before any work starts, and that&apos;s the number you pay. No hourly billing, no change-order padding, no hidden fees.
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((t) => (
                <div
                  key={t.label}
                  className={`rounded-2xl p-8 flex flex-col ${
                    t.featured ? "bg-[#18181B] text-white shadow-2xl scale-[1.02]" : "bg-white border border-[#18181B]/8"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      t.featured ? "bg-white/10" : "bg-[#18181B]/6"
                    }`}
                  >
                    <t.icon size={22} color="#F97316" />
                  </div>

                  <p
                    className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                      t.featured ? "text-[#F97316]" : "text-[#18181B]/50"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.label}
                  </p>

                  <p
                    className={`text-sm mb-5 ${t.featured ? "text-white/60" : "text-[#3F3F46]/50"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {t.tagline}
                  </p>

                  <div className="mb-6">
                    <span
                      className={`text-3xl font-bold ${t.featured ? "text-white" : "text-[#18181B]"}`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.price}
                    </span>
                    <p
                      className={`text-xs mt-1 ${t.featured ? "text-white/40" : "text-[#3F3F46]/40"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {t.priceNote}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {t.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check size={14} color="#F97316" className="flex-shrink-0 mt-0.5" />
                        <span
                          className={`text-sm ${t.featured ? "text-white/80" : "text-[#3F3F46]/70"}`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {t.addons.length > 0 && (
                    <div className={`rounded-lg p-4 mb-6 ${t.featured ? "bg-white/8" : "bg-[#FAFAF9]"}`}>
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest mb-2 ${t.featured ? "text-white/40" : "text-[#18181B]/40"}`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Common add-ons
                      </p>
                      {t.addons.map((a) => (
                        <div key={a.label} className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs ${t.featured ? "text-white/60" : "text-[#3F3F46]/60"}`}
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {a.label}
                          </span>
                          <span
                            className={`text-xs font-semibold ${t.featured ? "text-white/60" : "text-[#18181B]/60"}`}
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {a.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href={t.ctaHref}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      t.featured
                        ? "bg-[#F97316] text-white hover:bg-[#ea6c0a]"
                        : "bg-[#18181B] text-white hover:bg-[#0d0d0f]"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t.cta} <ArrowRight size={14} />
                  </Link>

                  <Link
                    href={t.href}
                    className={`mt-3 text-center text-xs underline underline-offset-2 ${t.featured ? "text-white/40 hover:text-white/60" : "text-[#3F3F46]/40 hover:text-[#3F3F46]/70"}`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-[#3F3F46]/50 mt-8" style={{ fontFamily: "var(--font-body)" }}>
              All prices are estimates. You&apos;ll get a specific quote before any work starts. No billing begins until you approve it in writing.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>Pricing questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="bg-[#FAFAF9] rounded-xl border border-[#18181B]/8 p-6">
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
              Not sure what you need?
            </h2>
            <p className="text-lg text-white/60 mb-10" style={{ fontFamily: "var(--font-body)" }}>
              Tell us what&apos;s going on. We&apos;ll recommend the right starting point and give you a clear number — free, no obligation.
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
