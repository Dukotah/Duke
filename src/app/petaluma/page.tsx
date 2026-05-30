import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Petaluma | Copper Bay Tech",
  description:
    "Copper Bay Tech provides local IT support, cybersecurity, and web development services to Petaluma businesses. Fast response, no jargon, fair pricing.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  description: "IT support and web development for Petaluma businesses.",
  telephone: "(707) 239-6725",
  email: "duke@copperbaytech.com",
  areaServed: "Petaluma, CA",
  url: "https://copperbaytech.com/petaluma",
};

export default function PetalumaPage() {
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
              Petaluma, CA
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support and web development
              <br />
              <span style={{ color: "#F97316" }}>for Petaluma businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mb-8" style={{ fontFamily: "var(--font-body)" }}>
              From the Turning Basin to East Petaluma, we help local businesses stay secure, online, and running smoothly — without the enterprise price tag.
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
              What we do for Petaluma businesses
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  icon: <Globe size={22} />,
                  title: "Web Development",
                  body: "Petaluma's restaurant scene, artisan shops, and professional services deserve websites that convert visitors into customers. We build fast, mobile-first sites that actually rank locally.",
                },
                {
                  icon: <Cpu size={22} />,
                  title: "IT Support",
                  body: "On-site and remote support for Petaluma's small businesses. Whether it's a network outage or a laptop that won't cooperate before a big client meeting, we respond fast.",
                },
                {
                  icon: <ShieldCheck size={22} />,
                  title: "Cybersecurity",
                  body: "Small businesses in Petaluma are real targets. We harden your systems, train your team, and set up monitoring so threats get caught before they become disasters.",
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
                Why local matters in Petaluma
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Petaluma's business community is tight-knit. When you call us, you're talking to someone who knows the difference between downtown foot traffic and a Washington Street storefront — not a ticketing system in another time zone. We're here when you need us, often the same day.
              </p>
            </div>

            {/* Resources link */}
            <p className="text-sm text-[#3F3F46]/50 mb-14" style={{ fontFamily: "var(--font-body)" }}>
              Looking for free guidance?{" "}
              <Link href="/blog" className="text-[#F97316] underline underline-offset-2">Browse our resource library →</Link>
            </p>

            {/* Final CTA */}
            <div className="rounded-2xl bg-[#18181B] p-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Serving Petaluma and all of Sonoma County
              </p>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Ready to work with a local tech partner?
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Call <a href="tel:+17072396725" className="text-white hover:text-[#F97316]">(707) 239-6725</a> or email{" "}
                <a href="mailto:duke@copperbaytech.com" className="text-white hover:text-[#F97316]">duke@copperbaytech.com</a>. No obligation.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Contact Us <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
