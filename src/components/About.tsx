"use client";

import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Code2 } from "lucide-react";

const highlights = [
  { icon: MapPin, text: "Based in Sonoma County — we show up in person when it matters" },
  { icon: ShieldCheck, text: "Cybersecurity-aware approach to every engagement" },
  { icon: Code2, text: "Custom-coded solutions, no cookie-cutter templates" },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
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
              About CopperBayTech
            </p>
            <h2
              className="text-4xl font-bold text-[#18181B] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Local expertise.
              <br />
              Enterprise-grade standards.
            </h2>
            <p
              className="text-[#3F3F46]/60 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              I&apos;m Duke, a Sonoma County-based developer and IT consultant with a
              rigorous background in cybersecurity principles and custom application
              development. I started CopperBayTech because local businesses deserve
              the same quality of technology that larger companies take for granted —
              without the overhead or the runaround.
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
                "Petaluma",
                "Santa Rosa",
                "Sebastopol",
                "Rohnert Park",
                "Sonoma",
                "Bodega Bay",
                "Cotati",
                "Windsor",
                "Healdsburg",
                "Cloverdale",
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
