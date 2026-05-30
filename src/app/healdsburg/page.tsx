import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Healdsburg | Copper Bay Tech",
  description:
    "Copper Bay Tech serves Healdsburg wineries, boutique hotels, and local businesses with expert web development, IT support, and cybersecurity. Local, responsive, trusted.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  description: "IT support and web development for Healdsburg businesses.",
  telephone: "(707) 239-6725",
  email: "duke@copperbaytech.com",
  areaServed: "Healdsburg, CA",
  url: "https://copperbaytech.com/healdsburg",
};

export default function HealdsburgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Healdsburg, CA
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support and web development
              <br />
              <span style={{ color: "#F97316" }}>for Healdsburg businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Healdsburg sets a high bar for everything from food to lodging. Your digital presence should match that standard. We build technology that lives up to the quality your customers already expect.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#18181B] mb-10" style={{ fontFamily: "var(--font-heading)" }}>
              Services tailored to Healdsburg
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  icon: <Globe size={22} />,
                  title: "Web Development",
                  body: "Healdsburg attracts discerning visitors — from Dry Creek Valley wine collectors to guests of the town's top hotels. Your website needs to convey the same level of craft as your business. We design with intention and build for performance.",
                },
                {
                  icon: <Cpu size={22} />,
                  title: "IT Support",
                  body: "From tasting room POS systems to hotel property management software, technology downtime isn't just frustrating — it costs you business. We provide proactive maintenance and rapid-response support when things go wrong.",
                },
                {
                  icon: <ShieldCheck size={22} />,
                  title: "Cybersecurity",
                  body: "Healdsburg businesses often hold sensitive customer data and payment information. We protect it with enterprise-grade practices scaled down to what small and mid-size businesses actually need.",
                },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl bg-white border border-[#18181B]/10 p-7 shadow-sm">
                  <div className="mb-4 text-[#F97316]">{s.icon}</div>
                  <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.title}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.body}</p>
                </div>
              ))}
            </div>

            {/* Why local */}
            <div className="rounded-2xl bg-white border border-[#18181B]/10 p-8 shadow-sm mb-10">
              <h2 className="text-xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Why local matters in Healdsburg
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Healdsburg's businesses operate at a caliber that demands partners who match that standard. We're a Sonoma County company — close enough to be on-site quickly, knowledgeable enough to understand what makes Healdsburg's economy tick. We're not a remote help desk. We're a local partner invested in your success.
              </p>
            </div>

            <p className="text-sm text-[#3F3F46]/50 mb-14" style={{ fontFamily: "var(--font-body)" }}>
              Free resources for wine country businesses:{" "}
              <Link href="/blog" className="text-[#F97316] underline underline-offset-2">Visit our blog →</Link>
            </p>

            {/* Final CTA */}
            <div className="rounded-2xl bg-[#18181B] p-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Serving Healdsburg and all of Sonoma County
              </p>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Premium service doesn't have to mean a premium price.
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Call <a href="tel:+17072396725" className="text-white hover:text-[#F97316]">(707) 239-6725</a> or email{" "}
                <a href="mailto:duke@copperbaytech.com" className="text-white hover:text-[#F97316]">duke@copperbaytech.com</a> to get started.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Schedule a Free Call <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
