import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, Server, ShieldCheck, Phone } from "lucide-react";

type CityPageProps = {
  city: string;
  county?: string;
  description: string;
  painPoints: string[];
  services: { icon: React.ElementType; title: string; blurb: string }[];
  nearbyAreas: string[];
};

export default function CityPage({
  city,
  county = "Sonoma County",
  description,
  painPoints,
  services,
  nearbyAreas,
}: CityPageProps) {
  return (
    <>
      <Nav />
      <main>
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
              {county}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT Support & Web Development
              <br />
              <span style={{ color: "#F97316" }}>in {city}</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
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

        {/* Pain points */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sound familiar?
            </p>
            <h2
              className="text-3xl font-bold text-[#18181B] mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Common problems for {city} businesses
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {painPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How we help {city} businesses
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {services.map(({ icon: Icon, title, blurb }) => (
                <div
                  key={title}
                  className="p-6 bg-white rounded-xl border border-[#18181B]/8 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#18181B]/8 flex items-center justify-center mb-4">
                    <Icon size={20} color="#18181B" />
                  </div>
                  <h3
                    className="font-bold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm text-[#3F3F46]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nearby areas */}
        <section className="py-12 bg-white border-t border-[#18181B]/8">
          <div className="max-w-4xl mx-auto px-6">
            <p
              className="text-sm text-[#3F3F46]/50 mb-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Also serving:
            </p>
            <div className="flex flex-wrap gap-2">
              {nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full text-xs bg-[#FAFAF9] border border-[#18181B]/10 text-[#3F3F46]/60"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {area}
                </span>
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
              Ready to fix your tech — for good?
            </h2>
            <p
              className="text-white/60 mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Free 30-minute call. We'll tell you exactly what we'd recommend and what it would cost. No fluff.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Free Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export { Globe, Server, ShieldCheck };
