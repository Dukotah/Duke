"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Stethoscope,
  Wrench,
  Wine,
  ShoppingBag,
  Home,
  Heart,
  Utensils,
} from "lucide-react";

const industries = [
  {
    icon: Briefcase,
    label: "Professional Services",
    description: "Law firms, insurance agencies, accountants, and financial advisors.",
  },
  {
    icon: Stethoscope,
    label: "Healthcare & Dental",
    description: "Medical offices, dental practices, and allied health providers.",
  },
  {
    icon: Wrench,
    label: "Home Services & Contractors",
    description: "Plumbers, electricians, landscapers, and general contractors.",
  },
  {
    icon: Wine,
    label: "Hospitality & Wineries",
    description: "Tasting rooms, boutique hotels, bed & breakfasts, and event venues.",
  },
  {
    icon: ShoppingBag,
    label: "Retail & E-commerce",
    description: "Brick-and-mortar shops expanding online and direct-to-consumer brands.",
  },
  {
    icon: Home,
    label: "Real Estate",
    description: "Brokers, property managers, staging companies, and mortgage advisors.",
  },
  {
    icon: Heart,
    label: "Nonprofits & Community Orgs",
    description: "501(c)(3)s, foundations, and community-focused organizations.",
  },
  {
    icon: Utensils,
    label: "Restaurants & Food",
    description: "Cafés, catering companies, food trucks, and farm-to-table producers.",
  },
];

export default function Industries() {
  const reduce = useReducedMotion();
  return (
    <section className="py-24 bg-ink-0">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Industries we serve
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for small businesses
            <br className="hidden md:block" /> like yours
          </h2>
          <p
            className="text-lg text-zinc-400 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We work across the industries we know best — from winery tasting rooms
            to dental offices to independent contractors.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.label}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.07 }}
                className="rounded-xl border border-hairline bg-ink-1 p-6 flex flex-col gap-4 hover:border-copper-dim transition-all duration-200"
              >
                {/* Icon tile */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <Icon size={20} color="#DDAA75" />
                </div>

                {/* Label */}
                <h3
                  className="text-sm font-bold text-white leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {industry.label}
                </h3>

                {/* Description */}
                <p
                  className="text-xs text-zinc-400 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p
            className="text-sm text-zinc-400 mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Don&apos;t see your industry? Reach out — if you&apos;re a local business, we can
            almost certainly help.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md text-sm font-bold text-ink-0 bg-copper hover:bg-copper-bright transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Let&apos;s talk about your business
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
