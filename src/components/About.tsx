"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { MapPin, ShieldCheck, Code2, X } from "lucide-react";

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

export default function About() {
  const reduce = useReducedMotion();
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About Copper Bay Tech
            </p>
            <h2
              className="text-4xl font-bold text-[#18181B] mb-6 leading-tight"
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
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#F97316]/40 ring-offset-2 ring-offset-white">
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
                      className="flex h-full w-full items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #27272A 0%, #18181B 100%)" }}
                      aria-hidden="true"
                    >
                      <span
                        className="text-2xl font-bold text-[#F97316]"
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
                  className="text-base font-bold text-[#18181B]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Duke Hutcheon
                </p>
                <p
                  className="text-sm text-[#3F3F46]/50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Founder, Developer & IT Consultant
                </p>
              </div>
            </div>

            {/* Lead with the real client backstory — this is the opener that
                resonates immediately with the right prospect. */}
            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most of my clients come to me after being burned by a template agency or
              left hanging by a big IT firm — slow to respond, quick to upsell, and gone
              the moment the contract ends. I started Copper Bay Tech because small
              businesses deserve a real technology partner: someone who
              picks up the phone, knows your name, and builds things that actually last.
            </p>
            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              My work spans custom web development, network infrastructure, and
              cybersecurity — all under one roof, without the overhead of an agency
              or the guesswork of a generalist freelancer.
            </p>

            {/* What I won&apos;t do — reinforces differentiators honestly */}
            <div className="mb-8 rounded-xl border border-[#18181B]/8 bg-[#FAFAF9] p-5">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What I won&apos;t do
              </p>
              <ul className="space-y-2">
                {wontDo.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <X size={13} className="mt-0.5 flex-shrink-0 text-[#F97316]" aria-hidden="true" />
                    <span
                      className="text-sm text-[#3F3F46]/70 leading-relaxed"
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
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(24,24,27,0.07)" }}
                  >
                    <h.icon size={16} color="#18181B" />
                  </div>
                  <span
                    className="text-sm text-[#3F3F46]/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {h.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { duration: 0.6 }}
            className="rounded-2xl overflow-hidden bg-[#18181B] p-10 text-white"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Where We Work
            </p>
            <p
              className="text-white/80 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Based in Sonoma County, we work with clients across the U.S. — with
              on-site service throughout the North Bay, including:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Petaluma", "Santa Rosa", "Sebastopol", "Rohnert Park",
                "Sonoma", "Bodega Bay", "Cotati", "Windsor",
                "Healdsburg", "Cloverdale",
              ].map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span
                    className="text-sm text-white/70"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {city}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="mt-6 text-white/40 text-xs"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Remote engagements available nationwide.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
