import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Rohnert Park | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support, web development, and cybersecurity for Rohnert Park businesses. Fast local response, transparent pricing, no contracts.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  description: "IT support and web development for Rohnert Park businesses.",
  telephone: "(707) 239-6725",
  email: "duke@copperbaytech.com",
  areaServed: "Rohnert Park, CA",
  url: "https://copperbaytech.com/rohnert-park",
};

export default function RohnertParkPage() {
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
              Rohnert Park, CA
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support and web development
              <br />
              <span style={{ color: "#F97316" }}>for Rohnert Park businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Rohnert Park is a hub for retail, healthcare, and growing professional services. We keep your technology running reliably so you can focus on serving your customers.
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
              What we offer Rohnert Park businesses
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  icon: <Globe size={22} />,
                  title: "Web Development",
                  body: "Whether you're drawing customers from Commerce Boulevard or targeting buyers across Sonoma County, your website is your hardest-working salesperson. We build it to perform — fast load times, clear messaging, and local SEO built in.",
                },
                {
                  icon: <Cpu size={22} />,
                  title: "IT Support",
                  body: "Rohnert Park businesses need tech that doesn't slow them down. We provide hands-on support — on-site when needed, remote when faster — with clear communication and no runaround.",
                },
                {
                  icon: <ShieldCheck size={22} />,
                  title: "Cybersecurity",
                  body: "From phishing attacks targeting your email to ransomware threats, small businesses face real risk. We put the right protections in place without overcomplicating things.",
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
                Why local matters in Rohnert Park
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Rohnert Park sits right in the middle of Sonoma County, which means we can reach you fast — and we know the local business landscape well. We're not a national chain with a call center. When you need help, you're talking to someone nearby who knows your setup and cares about getting you back on track.
              </p>
            </div>

            <p className="text-sm text-[#3F3F46]/50 mb-14" style={{ fontFamily: "var(--font-body)" }}>
              Get free IT and web advice:{" "}
              <Link href="/blog" className="text-[#F97316] underline underline-offset-2">Read our blog →</Link>
            </p>

            {/* Final CTA */}
            <div className="rounded-2xl bg-[#18181B] p-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Serving Rohnert Park and all of Sonoma County
              </p>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Stop tolerating unreliable tech.
              </h3>
              <p className="text-white/60 text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
                Call <a href="tel:+17072396725" className="text-white hover:text-[#F97316]">(707) 239-6725</a> or email{" "}
                <a href="mailto:duke@copperbaytech.com" className="text-white hover:text-[#F97316]">duke@copperbaytech.com</a>. Free consultation, no pressure.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Let's Talk <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
