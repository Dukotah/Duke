"use client";

import Link from "next/link";
import { Check, Globe, Server, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { websitePackages, carePlans } from "@/config/pricing";
import { RevealOnScroll, SpotlightCard, MagneticCTA } from "@/components/motion";

// Quiet "also handled" — IT / security / AI are folded in as care-plan benefits,
// never headline services. This row simply reassures that they're covered.
const alsoHandled = [
  {
    icon: Server,
    label: "Managed IT & helpdesk",
    note: "Workstations, cloud, support for your team.",
  },
  {
    icon: ShieldCheck,
    label: "Cybersecurity & hardening",
    note: "Monitoring, backups, incident planning.",
  },
  {
    icon: Sparkles,
    label: "AI tools & automation",
    note: "Answer calls, reply to leads, clear busywork.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-ink-0 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* ── Block 1: Websites (the product) ───────────────────────────── */}
        <RevealOnScroll className="mb-14 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
          >
            Start with a website
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A custom website, built to last.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            One-time build, no templates. Pick a starting point — then keep it
            handled for life with a care plan.
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {websitePackages.map((pkg, i) => (
            <RevealOnScroll key={pkg.id} delay={i * 0.08} className="h-full">
              <SpotlightCard radius={20} className="h-full">
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-hairline bg-ink-3"
                      aria-hidden
                    >
                      <Globe size={20} className="text-copper-bright" />
                    </span>
                    {pkg.popular && (
                      <span
                        className="rounded-full border border-copper-dim px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-copper-bright"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        Most popular
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-xl font-bold text-warm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {pkg.name}
                  </h3>

                  <p
                    className="mt-1.5 min-h-[2.75rem] text-sm text-warm-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {pkg.tagline}
                  </p>

                  <p className="mt-5 flex items-baseline gap-1.5">
                    {pkg.pricePrefix && (
                      <span
                        className="text-sm font-medium text-warm-3"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        {pkg.pricePrefix.trim()}
                      </span>
                    )}
                    <span
                      className="text-3xl font-bold tabular-nums text-warm"
                      style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                    >
                      {pkg.price}
                    </span>
                    <span
                      className="text-sm text-warm-3"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      one-time
                    </span>
                  </p>

                  <ul className="mt-6 mb-7 flex-1 space-y-2.5">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Check
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-copper"
                          aria-hidden
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <MagneticCTA
                    as="link"
                    href="/pricing"
                    shine={pkg.popular}
                    className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 ${
                      pkg.popular
                        ? "bg-copper text-ink-0 hover:bg-copper-bright"
                        : "border border-hairline bg-ink-3 text-warm hover:border-copper-dim"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Build your plan
                    <ArrowRight size={15} aria-hidden />
                  </MagneticCTA>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* ── Block 2: Care plans (security/updates/IT live here as benefits) ── */}
        <RevealOnScroll className="mt-24 mb-14 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
          >
            Then keep it handled
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Care plans, for life.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Hosting, updates, security, and improvements — handled monthly so your
            site never goes stale or unsafe.
          </p>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {carePlans.map((plan, i) => (
            <RevealOnScroll key={plan.id} delay={i * 0.08} className="h-full">
              <SpotlightCard
                radius={20}
                className={`h-full ${plan.popular ? "surface-featured" : ""}`}
                style={
                  plan.popular
                    ? { border: "1px solid var(--copper)" }
                    : undefined
                }
              >
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <h3
                      className="text-xl font-bold text-warm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span
                        className="rounded-full border border-copper-dim px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-copper-bright"
                        style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                      >
                        Most popular
                      </span>
                    )}
                  </div>

                  <p className="flex items-baseline gap-1.5">
                    <span
                      className="text-3xl font-bold tabular-nums text-warm"
                      style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm text-warm-3"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      /mo
                    </span>
                  </p>

                  <p
                    className="mt-2 min-h-[2.75rem] text-sm text-warm-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {plan.tagline}
                  </p>

                  <ul className="mt-6 mb-7 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-warm-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <Check
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-copper"
                          aria-hidden
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <MagneticCTA
                    as="link"
                    href="/pricing"
                    shine={plan.popular}
                    className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 ${
                      plan.popular
                        ? "bg-copper text-ink-0 hover:bg-copper-bright"
                        : "border border-hairline bg-ink-3 text-warm hover:border-copper-dim"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Build your plan
                    <ArrowRight size={15} aria-hidden />
                  </MagneticCTA>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* ── Block 3: Quiet "also handled" (IT / cyber / AI as benefits) ── */}
        <RevealOnScroll className="mt-20">
          <div className="rounded-2xl border border-hairline bg-ink-1 p-7 sm:p-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p
                  className="text-sm font-semibold text-warm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Also handled, on the Fully Managed plan
                </p>
                <p
                  className="mt-1.5 text-sm text-warm-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  IT, security, and AI aren&rsquo;t add-on services to chase — they
                  come folded into one partner.
                </p>
              </div>

              <ul className="grid flex-1 gap-x-8 gap-y-4 sm:grid-cols-3 lg:max-w-2xl">
                {alsoHandled.map(({ icon: Icon, label, note }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hairline bg-ink-3"
                      aria-hidden
                    >
                      <Icon size={16} className="text-copper" />
                    </span>
                    <span>
                      <span
                        className="block text-sm font-semibold text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="mt-0.5 block text-xs leading-relaxed text-warm-3"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {note}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 border-t border-hairline pt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-copper-bright underline-offset-4 transition-colors hover:text-copper hover:underline focus-visible:outline-none focus-visible:underline"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See everything in a plan
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
