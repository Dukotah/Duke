"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Server, ShieldCheck, ArrowRight } from "lucide-react";

// Concrete "starting at" anchors so visitors can self-qualify on price before
// they ever fill out the form. Numbers mirror the /pricing page tiers — keep
// them in sync if pricing changes there.
const anchors = [
  {
    icon: Globe,
    label: "Web Design",
    price: "$2,500",
    note: "one-time, custom-built",
    href: "/web-design-sonoma-county",
  },
  {
    icon: Server,
    label: "Managed IT",
    price: "$550",
    note: "per month, flat fee",
    href: "/it-support-sonoma-county",
    featured: true,
  },
  {
    icon: ShieldCheck,
    label: "Security Audit",
    price: "$750",
    note: "one-time assessment",
    href: "/cybersecurity-small-business",
  },
];

export default function PricingTeaser() {
  return (
    <section className="bg-[#FAFAF9] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#F97316]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Straightforward Pricing
          </p>
          <h2
            className="text-4xl font-bold leading-tight text-[#18181B] md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            No quotes-on-request games.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-[#3F3F46]/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Flat fees you can see up front. Here&apos;s where each service starts —
            the full breakdown lives on our pricing page.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {anchors.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={a.href}
                  className={`group flex h-full flex-col rounded-2xl border p-7 outline-none transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${
                    a.featured
                      ? "border-[#F97316]/40 bg-white shadow-lg shadow-[#F97316]/[0.08]"
                      : "border-[#18181B]/10 bg-white hover:border-[#18181B]/25"
                  }`}
                >
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(249,115,22,0.1)" }}
                  >
                    <Icon size={20} color="#F97316" />
                  </div>
                  <p
                    className="text-sm font-semibold uppercase tracking-wide text-[#3F3F46]/50"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {a.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span
                      className="text-xs font-medium text-[#3F3F46]/45"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      from
                    </span>
                    <span
                      className="text-3xl font-bold tracking-tight text-[#18181B]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {a.price}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-sm text-[#3F3F46]/55"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {a.note}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    See details
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-md bg-[#18181B] px-7 py-3 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#0d0d0f] focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See full pricing
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
