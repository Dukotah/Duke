"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ShieldCheck, Code2 } from "lucide-react";

// Drop a real headshot at this /public path and the photo replaces the monogram
// automatically — no other change needed. A real founder photo is the single
// biggest trust lift for this section, so add one as soon as you have it.
// e.g. FOUNDER_HEADSHOT = "/team/duke-hutcheon.jpg"
const FOUNDER_HEADSHOT = "";

const highlights = [
  { icon: MapPin, text: "Based in Sonoma County — we show up in person when it matters" },
  { icon: ShieldCheck, text: "Cybersecurity-aware approach to every engagement" },
  { icon: Code2, text: "Custom-coded solutions, no cookie-cutter templates" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About Copper Bay Tech
            </p>
            <h2
              className="text-4xl font-bold text-[#18181B] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Local expertise.
              <br />
              Enterprise-grade standards.
            </h2>

            {/* Headshot / Avatar — shows a real photo when FOUNDER_HEADSHOT is set,
                otherwise a polished monogram so the section never looks unfinished. */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#F97316]/40 ring-offset-2 ring-offset-white">
                {FOUNDER_HEADSHOT ? (
                  <Image
                    src={FOUNDER_HEADSHOT}
                    alt="Duke Hutcheon, founder of Copper Bay Tech"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
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

            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              I started Copper Bay Tech because local businesses deserve the same quality
              of technology that larger companies take for granted — without the overhead
              or the runaround. My background spans custom application development,
              network infrastructure, and cybersecurity principles.
            </p>
            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Most of my clients come to me after being burned by a template agency or
              left hanging by a big IT firm. What they get instead is a real partner —
              someone who knows the North Bay, picks up the phone, and builds things
              that actually last.
            </p>

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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden bg-[#18181B] p-10 text-white"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Service Area
            </p>
            <p
              className="text-white/80 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Serving businesses throughout Sonoma County and the greater North Bay,
              including:
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
              Remote engagements available throughout California.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
