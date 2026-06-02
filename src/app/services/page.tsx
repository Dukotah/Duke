import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "IT Services for Sonoma County Businesses | Copper Bay Tech",
  description:
    "Web development, IT support, and cybersecurity for small businesses in Petaluma, Santa Rosa, Sebastopol, Rohnert Park, and across Sonoma County. Local, flat-fee, no contracts.",
  keywords:
    "IT services Sonoma County, small business IT Petaluma, web development Santa Rosa, cybersecurity North Bay, managed IT support Sonoma County",
  openGraph: {
    title: "IT Services for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Web development, IT support, and cybersecurity. Based in Petaluma, serving all of Sonoma County.",
    url: "https://copperbaytech.com/services",
  },
  alternates: {
    canonical: "https://copperbaytech.com/services",
  },
};

const services = [
  {
    slug: "web-development",
    emoji: "🖥️",
    title: "Web Development",
    tagline: "Websites that load fast, rank locally, and convert visitors.",
    desc: "Custom-built with React and Next.js. No templates, no page builders. Every site includes performance optimization, local SEO foundations, SSL, analytics, and 30 days of post-launch support.",
    bullets: [
      "Sub-2 second load times",
      "Mobile-first responsive design",
      "Local SEO built in from day one",
      "Flat-fee proposals, no hourly billing",
    ],
    range: "$1,500 – $20,000+",
    cta: "See web development →",
  },
  {
    slug: "it-support",
    emoji: "🔧",
    title: "IT Support & Managed Services",
    tagline: "Your outsourced IT department — without the overhead.",
    desc: "Flat-rate monthly support covering workstations, servers, network, cloud accounts, and helpdesk. No surprise invoices. No waiting two days for a callback. Just reliable support from someone who knows your setup.",
    bullets: [
      "Unlimited helpdesk for covered users",
      "Remote and on-site support (Sonoma County)",
      "Network monitoring and patch management",
      "New employee setup and offboarding",
    ],
    range: "$300 – $2,500/month",
    cta: "See IT support →",
  },
  {
    slug: "cybersecurity",
    emoji: "🛡️",
    title: "Cybersecurity",
    tagline: "Practical protection for businesses that can't afford a breach.",
    desc: "Security assessments, endpoint protection, backup and disaster recovery, employee training, and email security hardening. Designed for businesses with 2–50 employees who want real protection without enterprise complexity.",
    bullets: [
      "Free IT Security Risk Assessment",
      "Ransomware protection + tested backups",
      "Phishing simulation and employee training",
      "HIPAA, PCI-DSS, and CCPA compliance support",
    ],
    range: "$600 – $12,000+",
    cta: "See cybersecurity →",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="bg-[#18181B] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span
            className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serving Sonoma County Since 2022
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Technology that works for your business —{" "}
            <span className="text-orange-400">not the other way around.</span>
          </h1>
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Copper Bay Tech provides web development, IT support, and cybersecurity for small
            businesses across Sonoma County. Based in Petaluma. Flat fees. No long-term contracts.
            Real humans who pick up the phone.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-[#FAFAF9] py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="text-5xl">{service.emoji}</div>
                  <div className="flex-1">
                    <h2
                      className="text-2xl font-bold text-zinc-900 mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {service.title}
                    </h2>
                    <p
                      className="text-orange-500 font-semibold mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {service.tagline}
                    </p>
                    <p
                      className="text-zinc-600 leading-relaxed mb-6"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {service.desc}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-zinc-700 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                          <span className="text-orange-400 font-bold">✓</span> {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-6">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {service.cta}
                      </Link>
                      <span className="text-zinc-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                        Starting at {service.range}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why local */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Sonoma County businesses work with Copper Bay Tech
          </h2>
          <p
            className="text-zinc-600 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            There are national IT and web firms that will take your money. Here&apos;s why local
            matters.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📍", title: "Actually local", desc: "Based in Petaluma. On-site support across the North Bay within the same day for most clients." },
              { icon: "💬", title: "One point of contact", desc: "You talk to the same person every time — not a ticketing system or a different tech each call." },
              { icon: "📋", title: "Flat-fee pricing", desc: "No hourly billing. You know what you'll pay before work starts. No surprises on your invoice." },
              { icon: "🚫", title: "No long-term contracts", desc: "Month-to-month for support and maintenance. We earn your business every month, not just at signing." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3
                  className="font-bold text-zinc-900 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas served */}
      <section className="bg-[#FAFAF9] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-2xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serving all of Sonoma County
          </h2>
          <p className="text-zinc-500 text-base mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Petaluma · Santa Rosa · Sebastopol · Rohnert Park · Sonoma · Windsor · Healdsburg ·
            Cotati · Bodega Bay · Cloverdale · Guerneville
          </p>
          <p className="text-zinc-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Remote work is available everywhere. On-site visits are available throughout the North
            Bay.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#18181B] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not sure where to start?
          </h2>
          <p
            className="text-white/70 text-lg mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book a free 30-minute consultation. We&apos;ll learn about your business and tell you
            exactly where the biggest risks and opportunities are — whether or not you hire us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Free Consultation →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              See pricing estimates ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
