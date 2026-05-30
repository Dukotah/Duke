import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Windsor | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support, custom web development, and cybersecurity services to Windsor businesses. Responsive local service throughout Sonoma County.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  description: "IT support and web development for Windsor businesses.",
  telephone: "(707) 239-6725",
  email: "duke@copperbaytech.com",
  areaServed: "Windsor, CA",
  url: "https://copperbaytech.com/windsor",
};

export default function WindsorPage() {
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
              Windsor, CA
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support and web development
              <br />
              <span style={{ color: "#F97316" }}>for Windsor businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Windsor is one of Sonoma County's fastest-growing communities, and the businesses here are growing too. We help you build the digital infrastructure to keep up.
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
              What Windsor businesses get with Copper Bay Tech
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  icon: <Globe size={22} />,
                  title: "Web Development",
                  body: "Windsor's growing population means growing competition. A professional, fast, and findable website gives you a real edge over businesses still relying on outdated sites or social media alone. We build for results.",
                },
                {
                  icon: <Cpu size={22} />,
                  title: "IT Support",
                  body: "Growing businesses hit growing IT headaches. New employees, new devices, expanding networks — we help Windsor businesses scale their technology without the chaos.",
                },
                {
                  icon: <ShieldCheck size={22} />,
                  title: "Cybersecurity",
                  body: "As your business grows, so does your attack surface. We implement security that scales with you — from employee security awareness training to network monitoring and backup solutions.",
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
                Why local matters in Windsor
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Windsor is building something. New neighborhoods, new businesses, a community that's staking its own identity in Sonoma County. We're proud to be part of that growth. When you work with Copper Bay Tech, you get a local partner who knows the area, is close enough to show up in person, and is invested in Windsor's continued success.
              </p>
            </div>

            <p className="text-sm text-[#3F3F46]/50 mb-14" style={{ fontFamily: "var(--font-body)" }}>
              Practical small business tech guides:{" "}
              <Link href="/blog" className="text-[#F97316] underline underline-offset-2">Check out our blog →</Link>
            </p>

            {/* Final CTA */}
            <div className="rounded-2xl bg-[#18181B] p-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Serving Windsor and all of Sonoma County
              </p>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Ready to build something solid?
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Call <a href="tel:+17072396725" className="text-white hover:text-[#F97316]">(707) 239-6725</a> or email{" "}
                <a href="mailto:duke@copperbaytech.com" className="text-white hover:text-[#F97316]">duke@copperbaytech.com</a> for a free consultation.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get in Touch <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
