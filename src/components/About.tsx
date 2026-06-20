"use client";

import Image from "next/image";
import { MapPin, ShieldCheck, Code2, X } from "lucide-react";
import { RevealOnScroll, SpotlightCard } from "@/components/motion";

// Drop a real headshot at this /public path and the photo replaces the monogram
// automatically — no other change needed. A real founder photo is the single
// biggest trust lift for this section, so add one as soon as you have it.
// e.g. FOUNDER_HEADSHOT = "/team/duke-hutcheon.jpg"
const FOUNDER_HEADSHOT = "/team/duke-hutcheon.png";

const highlights = [
  { icon: MapPin, text: "Based in Santa Rosa, CA — working with clients across the U.S." },
  { icon: ShieldCheck, text: "Cybersecurity-aware approach to every engagement" },
  { icon: Code2, text: "Custom-coded solutions, no cookie-cutter templates" },
];

const wontDo = [
  "No hourly billing surprises — scoped work with a fixed price",
  "No lock-in contracts — you own everything we build",
  "No handoff-and-disappear — ongoing support is part of every engagement",
];

const cities = [
  "Petaluma", "Santa Rosa", "Sebastopol", "Rohnert Park",
  "Sonoma", "Bodega Bay", "Cotati", "Windsor",
  "Healdsburg", "Cloverdale",
];

export default function About() {
  return (
    <section id="about" className="bg-ink-0 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: the founder story */}
          <RevealOnScroll as="div" direction="left" distance={20} duration={0.6}>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About Copper Bay Tech
            </p>
            <h2
              className="text-4xl font-bold text-warm mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Personal service.
              <br />
              Enterprise-grade standards.
            </h2>

            {/* Headshot / Avatar — shows a real photo when FOUNDER_HEADSHOT is set,
                otherwise a polished monogram so the section never looks unfinished.
                To enable: set FOUNDER_HEADSHOT to e.g. "/team/duke-hutcheon.jpg" */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-copper-dim ring-offset-2 ring-offset-ink-0">
                {FOUNDER_HEADSHOT ? (
                  <Image
                    src={FOUNDER_HEADSHOT}
                    alt="Duke Hutcheon — founder of Copper Bay Tech, Sonoma County"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <span className="sr-only">Duke Hutcheon, founder of Copper Bay Tech — Sonoma County</span>
                    <div
                      className="flex h-full w-full items-center justify-center bg-ink-3"
                      aria-hidden="true"
                    >
                      <span
                        className="text-2xl font-bold text-copper-bright"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        DH
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div>
                <p
                  className="text-base font-bold text-warm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Duke Hutcheon
                </p>
                <p
                  className="text-sm text-warm-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Founder, Developer & IT Consultant
                </p>
              </div>
            </div>

            {/* Lead with the real client backstory — this is the opener that
                resonates immediately with the right prospect. */}
            <p
              className="text-warm-2 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most of my clients come to me after being burned by a template agency or
              left hanging by a big IT firm — slow to respond, quick to upsell, and gone
              the moment the contract ends. I started Copper Bay Tech because small
              businesses deserve a real technology partner: someone who
              picks up the phone, knows your name, and builds things that actually last.
            </p>
            <p
              className="text-warm-2 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              My work spans custom web development, network infrastructure, and
              cybersecurity — all under one roof, without the overhead of an agency
              or the guesswork of a generalist freelancer.
            </p>

            {/* What I won&apos;t do — reinforces differentiators honestly */}
            <div className="mb-8 rounded-xl border border-hairline bg-ink-2 p-5">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-warm-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What I won&apos;t do
              </p>
              <ul className="space-y-2">
                {wontDo.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X size={13} className="mt-0.5 flex-shrink-0 text-copper-bright" aria-hidden="true" />
                    <span
                      className="text-sm text-warm-2 leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-4">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-hairline bg-ink-2"
                  >
                    <h.icon size={16} className="text-copper" />
                  </div>
                  <span
                    className="text-sm text-warm-2 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {h.text}
                  </span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          {/* Right: where we work — dark spotlight panel */}
          <RevealOnScroll as="div" direction="right" distance={20} duration={0.6}>
            <SpotlightCard radius={20}>
              <div className="p-10">
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Where We Work
                </p>
                <p
                  className="text-warm-2 leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Based in Sonoma County, we work with clients across the U.S. — with
                  on-site service throughout the North Bay, including:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {cities.map((city) => (
                    <div key={city} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0" />
                      <span
                        className="text-sm text-warm"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {city}
                      </span>
                    </div>
                  ))}
                </div>
                <p
                  className="mt-6 text-warm-3 text-xs"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Remote engagements available nationwide.
                </p>
              </div>
            </SpotlightCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
