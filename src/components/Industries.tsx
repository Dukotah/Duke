"use client";

import { motion } from "framer-motion";
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
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Industries we serve
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for Sonoma County
            <br className="hidden md:block" /> businesses like yours
          </h2>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We work across the industries that make the North Bay run — from winery
            tasting rooms to dental offices to independent contractors.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-xl border border-[#18181B]/10 bg-[#FAFAF9] p-6 flex flex-col gap-4 hover:shadow-md hover:border-[#18181B]/20 transition-all duration-200"
              >
                {/* Icon tile */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(24,24,27,0.07)" }}
                >
                  <Icon size={20} color="#18181B" />
                </div>

                {/* Label */}
                <h3
                  className="text-sm font-bold text-[#18181B] leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {industry.label}
                </h3>

                {/* Description */}
                <p
                  className="text-xs text-[#3F3F46]/55 leading-relaxed"
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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p
            className="text-sm text-[#3F3F46]/50 mb-5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Don&apos;t see your industry? Reach out — if you&apos;re a local business, we can
            almost certainly help.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Let&apos;s talk about your business
          </a>
        </motion.div>
      </div>
    </section>
  );
}
