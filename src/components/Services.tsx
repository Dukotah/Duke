"use client";

import { Server, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { RevealOnScroll, MagneticCTA } from "@/components/motion";

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
        {/* ── Intro: what we do (packages + pricing live on /pricing) ──────── */}
        <RevealOnScroll className="mx-auto mb-14 max-w-2xl text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-copper"
            style={{ fontFamily: "var(--font-mono, var(--font-heading))" }}
          >
            What we do
          </p>
          <h2
            className="text-balance text-3xl font-bold leading-[1.1] text-warm sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A website that brings you customers — then handled for life.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-pretty text-lg text-warm-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A one-time custom build (no templates), then a monthly care plan that
            keeps it hosted, updated, secure, and improving. IT, security, and AI
            come folded in — one partner, one invoice.
          </p>
        </RevealOnScroll>

        {/* ── Quiet "also handled" (IT / cyber / AI as benefits) ──────────── */}
        <RevealOnScroll>
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
          </div>
        </RevealOnScroll>

        {/* ── One clear path to packages + pricing ───────────────────────── */}
        <RevealOnScroll className="mt-10 text-center">
          <MagneticCTA
            as="link"
            href="/pricing"
            shine
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-7 py-3.5 text-sm font-semibold text-ink-0 transition-colors hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See packages &amp; pricing
            <ArrowRight size={15} aria-hidden />
          </MagneticCTA>
        </RevealOnScroll>
      </div>
    </section>
  );
}
