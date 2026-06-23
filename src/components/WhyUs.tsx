"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Check, X, Minus } from "lucide-react";

type CellValue =
  | { type: "yes"; text: string }
  | { type: "no"; text: string }
  | { type: "partial"; text: string };

const rows: { criterion: string; copper: CellValue; agency: CellValue; bigit: CellValue }[] = [
  {
    criterion: "Pricing transparency",
    copper: { type: "yes", text: "Clear, flat-rate quotes upfront" },
    agency: { type: "no", text: "Hidden revision fees & upsells" },
    bigit: { type: "no", text: "Opaque retainer billing" },
  },
  {
    criterion: "Custom-coded vs templates",
    copper: { type: "yes", text: "100% custom — no page builders" },
    agency: { type: "no", text: "WordPress/Wix templates" },
    bigit: { type: "partial", text: "Varies; often outsourced" },
  },
  {
    criterion: "Who you actually talk to",
    copper: { type: "yes", text: "Duke, directly — every time" },
    agency: { type: "no", text: "Rotating account managers" },
    bigit: { type: "no", text: "Ticketing system & hold queues" },
  },
  {
    criterion: "On-site local support",
    copper: { type: "yes", text: "In-person across Sonoma County" },
    agency: { type: "no", text: "Remote only" },
    bigit: { type: "partial", text: "Occasional dispatch, extra fee" },
  },
  {
    criterion: "Response time",
    copper: { type: "yes", text: "Within 1 business day" },
    agency: { type: "partial", text: "2–5 days typical" },
    bigit: { type: "no", text: "SLA tickets, days to weeks" },
  },
  {
    criterion: "Long-term contracts required",
    copper: { type: "yes", text: "No lock-in — month-to-month" },
    agency: { type: "no", text: "12-month minimums common" },
    bigit: { type: "no", text: "Multi-year enterprise contracts" },
  },
  {
    criterion: "Security-first approach",
    copper: { type: "yes", text: "Built into every engagement" },
    agency: { type: "no", text: "Rarely considered" },
    bigit: { type: "partial", text: "Add-on module, extra cost" },
  },
];

function Cell({ cell }: { cell: CellValue }) {
  if (cell.type === "yes") {
    return (
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="w-6 h-6 rounded-full bg-copper/15 flex items-center justify-center">
          <Check size={13} color="#DDAA75" strokeWidth={2.5} />
        </div>
        <span
          className="text-xs text-white leading-snug max-w-[140px]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {cell.text}
        </span>
      </div>
    );
  }
  if (cell.type === "partial") {
    return (
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center">
          <Minus size={13} color="#9CA3AF" strokeWidth={2.5} />
        </div>
        <span
          className="text-xs text-zinc-400 leading-snug max-w-[140px]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {cell.text}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="w-6 h-6 rounded-full bg-red-900/20 flex items-center justify-center">
        <X size={13} color="#EF4444" strokeWidth={2.5} />
      </div>
      <span
        className="text-xs text-zinc-400 leading-snug max-w-[140px]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {cell.text}
      </span>
    </div>
  );
}

export default function WhyUs() {
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
            Why Copper Bay Tech
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not all tech providers
            <br className="hidden md:block" /> are created equal
          </h2>
          <p
            className="text-lg text-zinc-400 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Here&apos;s how we compare to the alternatives most small businesses end up
            regretting.
          </p>
        </motion.div>

        {/* ── Desktop table (md+) ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          className="hidden md:block rounded-2xl overflow-hidden border border-hairline"
        >
          {/* Column headers */}
          <div className="grid grid-cols-4 bg-ink-2">
            <div className="px-6 py-5" />
            <div className="px-6 py-5 border-l border-hairline">
              <div className="inline-flex items-center gap-2 bg-copper text-ink-0 font-bold rounded-md px-3 py-1 mb-2">
                <Check size={13} strokeWidth={2.5} />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Copper Bay Tech
                </span>
              </div>
              <p
                className="text-xs text-zinc-400"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Founder-led, Sonoma County
              </p>
            </div>
            <div className="px-6 py-5 border-l border-hairline">
              <p
                className="text-sm font-semibold text-zinc-300 mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Template Agencies / DIY
              </p>
              <p
                className="text-xs text-zinc-400"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Generic web shops & builders
              </p>
            </div>
            <div className="px-6 py-5 border-l border-hairline">
              <p
                className="text-sm font-semibold text-zinc-300 mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Big IT Firms
              </p>
              <p
                className="text-xs text-zinc-400"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Enterprise MSPs & agencies
              </p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.criterion}
              className={`grid grid-cols-4 border-t border-hairline ${
                i % 2 === 0 ? "bg-ink-0" : "bg-ink-1"
              }`}
            >
              {/* Criterion */}
              <div className="px-6 py-5 flex items-center">
                <span
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {row.criterion}
                </span>
              </div>

              {/* Copper Bay — highlighted */}
              <div className="px-6 py-5 flex items-center justify-center border-l-2 border-copper/40 bg-copper/[0.06]">
                <Cell cell={row.copper} />
              </div>

              {/* Agency */}
              <div className="px-6 py-5 flex items-center justify-center border-l border-hairline">
                <Cell cell={row.agency} />
              </div>

              {/* Big IT */}
              <div className="px-6 py-5 flex items-center justify-center border-l border-hairline">
                <Cell cell={row.bigit} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Mobile stacked cards (< md) ── */}
        <div className="md:hidden space-y-4">
          {rows.map((row, i) => (
            <motion.div
              key={row.criterion}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, delay: i * 0.07 }}
              className="rounded-xl border border-hairline overflow-hidden bg-ink-1"
            >
              {/* Criterion label */}
              <div className="bg-ink-2 px-5 py-3">
                <p
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {row.criterion}
                </p>
              </div>

              {/* Three columns */}
              <div className="grid grid-cols-3 divide-x divide-hairline">
                {/* Copper Bay */}
                <div className="px-3 py-4 bg-copper/[0.06] flex flex-col items-center gap-2 text-center">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider text-copper-bright"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Copper Bay
                  </p>
                  <div className="w-5 h-5 rounded-full bg-copper/15 flex items-center justify-center">
                    <Check size={11} color="#DDAA75" strokeWidth={2.5} />
                  </div>
                  <span
                    className="text-[11px] text-zinc-300 leading-snug"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {row.copper.text}
                  </span>
                </div>

                {/* Agency */}
                <div className="px-3 py-4 flex flex-col items-center gap-2 text-center">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    DIY/Agency
                  </p>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      row.agency.type === "partial"
                        ? "bg-white/[0.06]"
                        : "bg-red-900/20"
                    }`}
                  >
                    {row.agency.type === "partial" ? (
                      <Minus size={11} color="#9CA3AF" strokeWidth={2.5} />
                    ) : (
                      <X size={11} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </div>
                  <span
                    className="text-[11px] text-zinc-400 leading-snug"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {row.agency.text}
                  </span>
                </div>

                {/* Big IT */}
                <div className="px-3 py-4 flex flex-col items-center gap-2 text-center">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Big IT
                  </p>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      row.bigit.type === "partial"
                        ? "bg-white/[0.06]"
                        : "bg-red-900/20"
                    }`}
                  >
                    {row.bigit.type === "partial" ? (
                      <Minus size={11} color="#9CA3AF" strokeWidth={2.5} />
                    ) : (
                      <X size={11} color="#EF4444" strokeWidth={2.5} />
                    )}
                  </div>
                  <span
                    className="text-[11px] text-zinc-400 leading-snug"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {row.bigit.text}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md text-sm font-bold text-ink-0 bg-copper hover:bg-copper-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Talk to Duke — no sales pitch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
