import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Phone, AlertTriangle, DollarSign, Wifi } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

export const metadata: Metadata = {
  title: "IT Support for Small Business | Sonoma County | Copper Bay Tech",
  description:
    "Managed IT support for Sonoma County small businesses. Networks, workstations, cloud, and a direct line — not a ticket queue. Month-to-month, no contracts.",
  openGraph: {
    title: "IT Support for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Local managed IT support for Petaluma, Santa Rosa, and the greater North Bay. Month-to-month retainers, flat-fee projects.",
    url: "https://copperbaytech.com/it-support",
  },
  alternates: {
    canonical: "https://copperbaytech.com/it-support-sonoma-county",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Managed IT Support",
  provider: { "@type": "LocalBusiness", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  areaServed: "Sonoma County, CA",
  description:
    "Managed IT support for Sonoma County small businesses. Networks, workstations, cloud migration, and ongoing support.",
  offers: {
    "@type": "Offer",
    priceRange: "$550 – $2,200",
    priceCurrency: "USD",
  },
};

const included = [
  "Network setup, management, and troubleshooting",
  "Workstation setup and ongoing support",
  "Wi-Fi optimization for offices and retail spaces",
  "Cloud migration — Google Workspace, Microsoft 365, Dropbox",
  "Process automation and AI tool integrations",
  "Staff onboarding and training",
  "Vendor coordination (ISP, hardware, software)",
  "Direct line to a real person — not a ticket queue",
];

const painPoints = [
  {
    Icon: AlertTriangle,
    title: "The single point of failure",
    desc: "Most small businesses have one person who \"knows computers.\" When that person is unavailable — or leaves — everything stops. A managed support partner means your operations never depend on a single person's availability.",
  },
  {
    Icon: DollarSign,
    title: "The break-fix trap",
    desc: "Hourly IT is financially incentivized to fix slowly, not prevent. Every hour a problem lingers is billable time. A flat-rate retainer aligns incentives: we get paid the same whether your systems run perfectly or not — so prevention is the whole point.",
  },
  {
    Icon: Wifi,
    title: "The productivity leak",
    desc: "Slow Wi-Fi, aging workstations, and cloud tools nobody manages are quietly costing hours every week. Staff works around problems instead of reporting them. The real cost of poor IT isn't the repair bill — it's the compounding lost time.",
  },
];

const retainerTiers = [
  {
    name: "Starter",
    price: "$550/mo",
    problem: "Your first IT safety net",
    desc: "Ideal for solo operators and 2–3 person shops: someone to call when things go wrong, monthly check-in to catch issues early, and priority scheduling so you're not waiting a week for a callback.",
  },
  {
    name: "Core",
    price: "$1,200/mo",
    problem: "Proactive — not reactive",
    desc: "For 4–10 person teams ready to stop putting out fires. Proactive monitoring, faster response, quarterly infrastructure reviews, and a point of contact who knows your setup cold.",
    featured: true,
  },
  {
    name: "Growth",
    price: "Custom",
    problem: "Complex infrastructure, covered",
    desc: "For 11+ person businesses with servers, multiple locations, or compliance requirements. Custom scope, dedicated support hours, and full vendor coordination.",
  },
];

export default function ITSupportPage() {
  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <main className="theme-dark">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Do I need to sign a long-term contract?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. All retainer plans are month-to-month with 30 days notice to cancel. No lock-in, no penalties.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What's the difference between break-fix and a retainer?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Break-fix means you call when something goes wrong and pay hourly. A retainer means we're proactively monitoring and maintaining your systems — and we're motivated to prevent problems, not just fix them.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How quickly do you respond when something breaks?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Retainer clients get same-day response during business hours for urgent issues. We give you a direct line — not a ticket queue.",
                  },
                },
              ],
            }),
          }}
        />

        {/* ── Hero ─────────────────────────────────────────────────────────
            Websites-first framing: IT is the "rest of your tech," folded into
            the same handled-for-life care story. The <h1> is the LCP — plain
            warm text in server markup, painting before any motion. */}
        <section className="bg-ink-0 pt-32 pb-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll
              as="span"
              direction="up"
              distance={10}
              duration={0.5}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-ink-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The rest of your tech, handled
            </RevealOnScroll>

            <h1
              className="mb-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-warm md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT that just works —
              <br />
              <span className="bg-gradient-to-r from-copper to-copper-bright bg-clip-text text-transparent">
                every single day.
              </span>
            </h1>

            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.15}
              distance={12}
              className="mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-warm-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We start with your website and keep the rest of your tech handled too.
              Local managed IT support for Sonoma County small businesses — your
              network, workstations, cloud tools, and day-to-day tech, looked after
              by the same partner. Month-to-month, no long-term contracts.
            </RevealOnScroll>

            <RevealOnScroll
              as="div"
              direction="up"
              delay={0.25}
              distance={12}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-3 text-sm font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticCTA>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline bg-ink-2 px-6 py-3 text-sm font-semibold text-warm transition-colors duration-200 hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Phone size={15} aria-hidden /> {PHONE}
              </a>
            </RevealOnScroll>

            {/* Urgent fast path */}
            <RevealOnScroll
              as="p"
              direction="up"
              delay={0.35}
              distance={8}
              className="mt-6 text-sm text-warm-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Server down or site offline?{" "}
              <a
                href={PHONE_HREF}
                className="font-semibold text-copper-bright underline-offset-4 hover:text-copper hover:underline focus-visible:outline-none focus-visible:underline"
              >
                Call or text {PHONE}
              </a>{" "}
              for same-day response.
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Pain points ─────────────────────────────────────────────────── */}
        <section className="bg-ink-1 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why most small business IT fails
              </h2>
              <p
                className="mb-10 max-w-xl text-pretty text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                It&apos;s not bad luck — it&apos;s structural. Three patterns show up in
                almost every small business we work with.
              </p>
            </RevealOnScroll>

            <div className="grid gap-6 sm:grid-cols-3">
              {painPoints.map((p, i) => (
                <RevealOnScroll key={p.title} delay={i * 0.08} className="h-full">
                  <SpotlightCard radius={16} className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-ink-3">
                        <p.Icon size={20} className="text-copper-bright" aria-hidden />
                      </div>
                      <h3
                        className="mb-2 font-bold text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── What's covered ──────────────────────────────────────────────── */}
        <section className="bg-ink-0 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
                style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
              >
                Folded into one partner
              </p>
              <h2
                className="mb-8 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What we cover
              </h2>
            </RevealOnScroll>

            <ul className="grid gap-4 sm:grid-cols-2">
              {included.map((item, i) => (
                <RevealOnScroll key={item} as="li" delay={(i % 2) * 0.06}>
                  <span className="flex items-start gap-3 rounded-xl border border-hairline bg-ink-1 p-4">
                    <CheckCircle
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-copper"
                      aria-hidden
                    />
                    <span
                      className="text-sm text-warm-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </span>
                  </span>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Retainer tiers ──────────────────────────────────────────────── */}
        <section className="bg-ink-1 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Monthly retainer plans
              </h2>
              <p
                className="mb-8 max-w-xl text-pretty text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Priced by the problem you need solved, not just headcount. Cancel
                anytime with 30 days notice — no lock-in, no penalties.
              </p>
            </RevealOnScroll>

            <div className="grid gap-6 sm:grid-cols-3">
              {retainerTiers.map((t, i) => (
                <RevealOnScroll key={t.name} delay={i * 0.08} className="h-full">
                  <SpotlightCard
                    radius={16}
                    className={`h-full ${t.featured ? "surface-featured" : ""}`}
                    style={t.featured ? { border: "1px solid var(--copper)" } : undefined}
                  >
                    <div className="flex h-full flex-col p-6">
                      <p
                        className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="mb-1 text-2xl font-bold tabular-nums text-warm"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        {t.price}
                      </p>
                      <p
                        className="mb-3 text-xs font-semibold text-copper"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {t.problem}
                      </p>
                      <p
                        className="text-sm leading-relaxed text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-ink-0 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <RevealOnScroll>
              <h2
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Stop putting up with IT that doesn&apos;t work.
              </h2>
              <p
                className="mx-auto mb-8 max-w-xl text-pretty text-warm-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Free 30-minute IT assessment. We&apos;ll review your current setup and
                tell you exactly what we&apos;d fix and what it would cost.
              </p>
              <MagneticCTA
                as="link"
                href={BOOKING_URL}
                className="group inline-flex items-center gap-2 rounded-lg bg-copper px-8 py-4 text-base font-semibold text-ink-0 transition-colors duration-200 hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Book a free consultation
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </MagneticCTA>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
