import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Phone } from "lucide-react";

type IndustryPageProps = {
  industry: string;
  tagline: string;
  description: string;
  painPoints: string[];
  services: { title: string; blurb: string }[];
  relatedPosts: { slug: string; title: string; tag: string }[];
};

export default function IndustryPage({
  industry,
  tagline,
  description,
  painPoints,
  services,
  relatedPosts,
}: IndustryPageProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `IT & Web Services for ${industry}`,
    description: description,
    provider: {
      "@type": "LocalBusiness",
      name: "Copper Bay Tech",
      url: "https://copperbaytech.com",
      telephone: "+17072396725",
      address: {
        "@type": "PostalAddress",
        addressRegion: "CA",
        addressLocality: "Sonoma County",
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Sonoma County, CA",
    },
  };

  return (
    <>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />

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
              {industry}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT &amp; Web Services for
              <br />
              <span style={{ color: "#F97316" }}>{industry}</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tagline}
            </p>
            <p
              className="text-white/50 text-base max-w-2xl mb-8"
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
                Get Free Consult <ArrowRight size={15} />
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

        {/* Pain Points */}
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
              Common tech problems for {industry}
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
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How we help
            </p>
            <h2
              className="text-3xl font-bold text-[#18181B] mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Services for {industry}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {services.map(({ title, blurb }) => (
                <div
                  key={title}
                  className="p-6 bg-white rounded-xl border border-[#18181B]/8 shadow-sm"
                >
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

        {/* Related Posts */}
        <section className="py-16 bg-white border-t border-[#18181B]/8">
          <div className="max-w-4xl mx-auto px-6">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Related resources
            </p>
            <h2
              className="text-2xl font-bold text-[#18181B] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Helpful reading for your industry
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map(({ slug, title, tag }) => (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="group block rounded-xl bg-[#FAFAF9] border border-[#18181B]/10 hover:border-[#18181B]/30 transition-all p-5 shadow-sm hover:shadow-md"
                >
                  <span
                    className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: "rgba(249,115,22,0.1)",
                      color: "#F97316",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {tag}
                  </span>
                  <p
                    className="text-sm font-semibold text-[#18181B] leading-snug group-hover:text-[#F97316] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 mt-3 text-xs text-[#F97316] font-semibold group-hover:gap-2 transition-all"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Read <ArrowRight size={12} />
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
              Ready to fix your tech — for good?
            </h2>
            <p
              className="text-white/60 mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Free 30-minute call. We&apos;ll tell you exactly what we&apos;d recommend and what it would cost. No fluff.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={16} /> (707) 239-6725
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
