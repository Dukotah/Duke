"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

// Positions Copper Bay against the two alternatives a Sonoma County small
// business actually weighs: a big national MSP / agency, and a cheap
// freelancer / DIY template. Keep the claims factual and defensible.
type Cell = boolean | "partial";

type Row = { feature: string; cbt: Cell; national: Cell; cheap: Cell };

const columns = ["Copper Bay Tech", "National MSP / Agency", "Cheap freelancer / DIY"];

const rows: Row[] = [
  { feature: "Local & on-site when it matters", cbt: true, national: "partial", cheap: false },
  { feature: "Talk to the person doing the work", cbt: true, national: false, cheap: true },
  { feature: "Same-day response, no ticket queue", cbt: true, national: "partial", cheap: false },
  { feature: "Custom-coded — no page builders", cbt: true, national: "partial", cheap: false },
  { feature: "Flat, upfront pricing", cbt: true, national: false, cheap: "partial" },
  { feature: "Month-to-month, no lock-in", cbt: true, national: false, cheap: true },
  { feature: "Security & IT under one roof", cbt: true, national: true, cheap: false },
  { feature: "Built to last past launch", cbt: true, national: true, cheap: false },
];

function CellMark({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-copper/15">
        <Check size={15} color="#DDAA75" strokeWidth={3} />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06]">
        <Minus size={15} className="text-zinc-400" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
      <X size={15} className="text-zinc-500" strokeWidth={3} />
    </span>
  );
}

export default function Comparison() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-ink-0 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-copper-bright"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How we compare
          </p>
          <h2
            className="text-4xl font-bold leading-tight text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The local-shop advantage.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-zinc-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Big providers are slow and impersonal. Bargain freelancers cut corners
            you pay for later. Here&apos;s where we land.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-hairline"
        >
          {/* Header row */}
          <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] bg-ink-1">
            <div className="px-4 py-5 sm:px-6" />
            {columns.map((col, i) => (
              <div
                key={col}
                className={`px-2 py-5 text-center sm:px-4 ${i === 0 ? "bg-ink-2" : ""}`}
              >
                <span
                  className={`text-[11px] font-semibold leading-tight sm:text-sm ${
                    i === 0 ? "text-white" : "text-zinc-300"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1.6fr_repeat(3,1fr)] items-center border-t border-hairline ${
                i % 2 === 1 ? "bg-ink-1" : "bg-ink-0"
              }`}
            >
              <div
                className="px-4 py-4 text-[13px] leading-snug text-zinc-300 sm:px-6 sm:text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {row.feature}
              </div>
              <div className="flex justify-center bg-copper/[0.06] px-2 py-4 sm:px-4">
                <CellMark value={row.cbt} />
              </div>
              <div className="flex justify-center px-2 py-4 sm:px-4">
                <CellMark value={row.national} />
              </div>
              <div className="flex justify-center px-2 py-4 sm:px-4">
                <CellMark value={row.cheap} />
              </div>
            </div>
          ))}
        </motion.div>

        <p
          className="mt-5 text-center text-xs text-zinc-400"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="font-semibold text-copper-bright">✓</span> full &nbsp;·&nbsp;
          <span className="font-semibold">—</span> partial / varies &nbsp;·&nbsp;
          <span className="font-semibold">✕</span> not typically
        </p>
      </div>
    </section>
  );
}
