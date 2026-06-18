import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Phone } from "lucide-react";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

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
      <main className="theme-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />

        {/* Hero — dark canvas, rationed-copper eyebrow + one accent line.
            Headline text is in server-rendered markup; the reveals fade it in
            after paint and drop entirely under reduced motion. */}
        <section className="relative overflow-hidden bg-ink-0 pt-32 pb-20">
          {/* Quiet ambient copper wash — CSS-only, position:absolute → CLS 0,
              no LCP cost. The one soft glow that warms the dark canvas. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(60% 50% at 18% 0%, var(--copper-dim), transparent 60%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <RevealOnScroll as="div" direction="up" distance={10} duration={0.5}>
              <span
                className="mb-4 inline-block rounded-full border border-copper-dim bg-ink-2 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {industry}
              </span>
            </RevealOnScroll>
            <h1
              className="mb-4 text-balance text-4xl font-bold leading-tight text-warm md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT &amp; Web Services for
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                {industry}
              </span>
            </h1>
            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              distance={12}
              className="mb-4 max-w-2xl text-lg text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tagline}
            </RevealOnScroll>
            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.18}
              distance={12}
              className="mb-8 max-w-2xl text-base text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {description}
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.26}
              distance={12}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href="/#contact"
                shine
                className="inline-flex items-center justify-center gap-2 rounded-md bg-copper px-6 py-3 text-sm font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get Free Consult <ArrowRight size={15} aria-hidden />
              </MagneticCTA>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-ink-2 px-6 py-3 text-sm font-semibold text-warm transition-colors hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} aria-hidden /> (707) 239-6725
              </a>
            </RevealOnScroll>
          </div>
        </section>

        {/* Pain Points */}
        <section className="bg-ink-1 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Sound familiar?
              </p>
              <h2
                className="mb-8 text-3xl font-bold text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common tech problems for {industry}
              </h2>
            </RevealOnScroll>
            <ul className="grid gap-4 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <RevealOnScroll key={point} as="li" delay={i * 0.06}>
                  <div
                    className="flex h-full items-start gap-3 rounded-xl border border-hairline bg-ink-2 p-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-copper" />
                    <span className="text-sm text-warm-2">{point}</span>
                  </div>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* Services — the hero-grade effect for this viewport: cursor-spotlight
            gradient-border cards (Linear/Services spec). */}
        <section className="bg-ink-0 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                How we help
              </p>
              <h2
                className="mb-8 text-3xl font-bold text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Services for {industry}
              </h2>
            </RevealOnScroll>
            <div className="grid gap-6 sm:grid-cols-3">
              {services.map(({ title, blurb }, i) => (
                <RevealOnScroll key={title} delay={i * 0.08} className="h-full">
                  <SpotlightCard radius={16} className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <h3
                        className="mb-2 font-bold text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {blurb}
                      </p>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="border-t border-hairline bg-ink-1 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Related resources
              </p>
              <h2
                className="mb-6 text-2xl font-bold text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Helpful reading for your industry
              </h2>
            </RevealOnScroll>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map(({ slug, title, tag }, i) => (
                <RevealOnScroll key={slug} delay={i * 0.08} className="h-full">
                  <Link
                    href={`/blog/${slug}`}
                    className="group block h-full rounded-xl border border-hairline bg-ink-2 p-5 transition-colors hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1"
                  >
                    <span
                      className="mb-3 inline-block rounded-md border border-copper-dim px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright"
                      style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                    >
                      {tag}
                    </span>
                    <p
                      className="text-sm font-semibold leading-snug text-warm transition-colors group-hover:text-copper-bright"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {title}
                    </p>
                    <span
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-copper-bright transition-all group-hover:gap-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Read <ArrowRight size={12} aria-hidden />
                    </span>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-ink-0 py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(50% 60% at 50% 100%, var(--copper-dim), transparent 65%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="mb-4 text-3xl font-bold text-warm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready to fix your tech — for good?
              </h2>
              <p
                className="mb-8 text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Free 30-minute call. We&apos;ll tell you exactly what we&apos;d recommend and what it would cost. No fluff.
              </p>
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              delay={0.1}
              className="flex flex-col justify-center gap-3 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href="/#contact"
                shine
                className="inline-flex items-center justify-center gap-2 rounded-md bg-copper px-8 py-4 font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-ink-2 px-8 py-4 font-semibold text-warm transition-colors hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={16} aria-hidden /> (707) 239-6725
              </a>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
