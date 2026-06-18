import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedLinks, { type RelatedLink } from "@/components/RelatedLinks";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";
import { ArrowRight, Globe, Server, ShieldCheck, Phone } from "lucide-react";

type CityPageProps = {
  city: string;
  county?: string;
  description: string;
  painPoints: string[];
  services: { icon: React.ElementType; title: string; blurb: string }[];
  nearbyAreas: string[];
  /**
   * Optional city-specific internal links (e.g. a /it-support-{city} page),
   * prepended ahead of the shared service-hub links. Keeps each city page a
   * hub that passes equity to the pages we want ranking.
   */
  relatedLinks?: RelatedLink[];
};

// Shared on every city page: links to the three canonical service hubs plus
// the highest-intent supporting pages. Turns otherwise dead-end location pages
// into internal-link hubs (topical cluster + equity flow).
const SERVICE_HUB_LINKS: RelatedLink[] = [
  { href: "/web-design-sonoma-county", label: "Web Design & Development", blurb: "Fast, modern sites that bring in calls and bookings." },
  { href: "/it-support-sonoma-county", label: "Managed IT Support", blurb: "Same-day help, backups, and networks that just work." },
  { href: "/cybersecurity-small-business", label: "Cybersecurity", blurb: "Protect your business data, email, and customers." },
  { href: "/pricing", label: "Pricing & Free Estimate", blurb: "See typical costs and get a no-pressure quote." },
  { href: "/blog/how-to-choose-an-it-company-sonoma-county", label: "How to choose an IT company", blurb: "What to look for (and avoid) in a local provider." },
  { href: "/work", label: "Our Work & Reviews", blurb: "Examples of what we build for local businesses." },
];

export default function CityPage({
  city,
  county = "Sonoma County",
  description,
  painPoints,
  services,
  nearbyAreas,
  relatedLinks = [],
}: CityPageProps) {
  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Locations", url: "https://copperbaytech.com/locations" }, { name: city }])} />
      <Nav />
      {/* Dark + rationed-copper context: warm off-white text on near-black, depth
          from lighter surfaces + hairlines, copper reserved for CTAs/accents. */}
      <main className="theme-dark bg-ink-0">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink-0 pt-32 pb-20">
          {/* Quiet ambient copper glow — position:absolute, aria-hidden → CLS 0,
              never competes with the headline LCP. CSS-only, no image/WebGL. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full opacity-60 blur-[90px]"
            style={{
              background:
                "radial-gradient(closest-side, var(--copper-glow), transparent 75%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {county}
            </RevealOnScroll>

            {/* The LCP — plain warm text, paints first, waits on no animation. */}
            <h1
              className="text-balance text-[2.4rem] font-bold leading-[1.07] tracking-tight text-warm sm:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT Support & Web Development
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                in {city}
              </span>
            </h1>

            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.1}
              distance={12}
              className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {description}
            </RevealOnScroll>

            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.2}
              distance={12}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href="/#contact"
                shine
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-3 text-sm font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} aria-hidden />
              </MagneticCTA>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline px-6 py-3 text-sm font-semibold text-warm transition-colors duration-200 hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} aria-hidden={true} /> (707) 239-6725
              </a>
            </RevealOnScroll>
          </div>
        </section>

        {/* Pain points */}
        <section className="bg-ink-0 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <Link href="/" className="transition-colors hover:text-copper-bright">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/locations" className="transition-colors hover:text-copper-bright">Locations</Link>
              <span aria-hidden="true">/</span>
              <span className="text-warm-2">{city}</span>
            </nav>

            <RevealOnScroll>
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Sound familiar?
              </p>
              <h2
                className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common problems for {city} businesses
              </h2>
            </RevealOnScroll>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {painPoints.map((point, i) => (
                <RevealOnScroll as="li" key={point} delay={i * 0.06}>
                  <div
                    className="flex h-full items-start gap-3 rounded-xl border border-hairline bg-ink-1 p-4"
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

        {/* Services */}
        <section className="bg-ink-0 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-8 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How we help {city} businesses
              </h2>
            </RevealOnScroll>
            <div className="grid gap-6 sm:grid-cols-3">
              {services.map(({ icon: Icon, title, blurb }, i) => (
                <RevealOnScroll key={title} delay={i * 0.08} className="h-full">
                  <SpotlightCard radius={16} className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <span
                        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-ink-3"
                        aria-hidden
                      >
                        <Icon size={20} className="text-copper-bright" />
                      </span>
                      <h3
                        className="mb-2 text-base font-bold text-warm"
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

        {/* Nearby areas */}
        <section className="border-t border-hairline bg-ink-0 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <p
              className="mb-3 text-sm text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Also serving:
            </p>
            <div className="flex flex-wrap gap-2">
              {nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-hairline bg-ink-1 px-3 py-1 text-xs text-warm-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links — service hubs + city-specific pages */}
        <RelatedLinks
          heading={`Services for ${city} businesses`}
          links={[...relatedLinks, ...SERVICE_HUB_LINKS]}
          variant="dark"
        />

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-hairline bg-ink-0 py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-12rem] left-1/2 h-[26rem] w-[44rem] -translate-x-1/2 rounded-full opacity-50 blur-[100px]"
            style={{
              background:
                "radial-gradient(closest-side, var(--copper-glow), transparent 75%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready to fix your tech — for good?
              </h2>
              <p
                className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Free 30-minute call. We&apos;ll tell you exactly what we&apos;d recommend and what it would cost. No fluff.
              </p>
            </RevealOnScroll>
            <RevealOnScroll as="div" delay={0.1} className="mt-8">
              <MagneticCTA
                as="link"
                href="/#contact"
                shine
                className="inline-flex items-center gap-2 rounded-lg bg-copper px-8 py-4 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a Free Consultation <ArrowRight size={16} aria-hidden />
              </MagneticCTA>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export { Globe, Server, ShieldCheck };
