"use client";

import { motion } from "framer-motion";
import { Globe, Server, ShieldCheck } from "lucide-react";

const tiers = [
  {
    icon: Globe,
    tier: "Tier 1 — Foundation",
    headline: "Your digital front door, done right.",
    items: [
      "Custom-coded business websites",
      "No templates, no page builders",
      "Mobile-first, fast-loading",
      "Local SEO optimization",
      "Google Business Profile setup",
      "Domain, hosting & email setup",
    ],
    cta: "Start with a website",
  },
  {
    icon: Server,
    tier: "Tier 2 — Core Operations",
    headline: "IT that just works, every day.",
    items: [
      "Network setup & management",
      "Workstations, Wi-Fi, printers",
      "Cloud migration & storage",
      "Process & workflow automation",
      "AI agent integrations",
      "Staff onboarding & support",
    ],
    cta: "Get IT support",
    featured: true,
  },
  {
    icon: ShieldCheck,
    tier: "Tier 3 — Security & Custom Dev",
    headline: "Protect what you've built.",
    items: [
      "Cybersecurity audits & reporting",
      "Infrastructure hardening",
      "Incident response planning",
      "Custom web application development",
      "Compliance baseline (PCI, HIPAA)",
      "Ongoing security monitoring",
    ],
    cta: "Talk security",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1C3A5E] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What we do
          </h2>
          <p
            className="text-lg text-[#1A1A1A]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            From your first website to a hardened security posture — we grow with you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-xl p-8 flex flex-col ${
                t.featured
                  ? "bg-[#1C3A5E] text-white shadow-xl"
                  : "bg-[#F5F4F0] border border-[#1C3A5E]/5"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 ${
                  t.featured ? "bg-white/10" : "bg-[#1C3A5E]/8"
                }`}
              >
                <t.icon size={22} color={t.featured ? "#C8A96E" : "#1C3A5E"} />
              </div>

              <p
                className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                  t.featured ? "text-[#C8A96E]" : "text-[#1C3A5E]/50"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.tier}
              </p>

              <h3
                className={`text-xl font-bold mb-4 ${
                  t.featured ? "text-white" : "text-[#1C3A5E]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.headline}
              </h3>

              <ul className="flex-1 space-y-2 mb-8">
                {t.items.map((item) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2 text-sm ${
                      t.featured ? "text-white/80" : "text-[#1A1A1A]/60"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        t.featured ? "bg-[#C8A96E]" : "bg-[#2D6A4F]"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  t.featured
                    ? "bg-[#C8A96E] text-[#1C3A5E] hover:bg-[#b8985e]"
                    : "bg-[#1C3A5E] text-white hover:bg-[#152d4a]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
