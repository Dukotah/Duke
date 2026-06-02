// Small presentational helpers for the admin dashboard.
// Self-contained under src/app/admin — no shared/global components touched.

import type { ReactNode } from "react";
import type { PipelineStage } from "@/lib/crm/types";
import { STAGE_LABELS } from "@/lib/crm/types";

// --- Formatters ------------------------------------------------------------

export function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fmtCompactCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function fmtPct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

// --- Card ------------------------------------------------------------------

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
      {children}
    </h2>
  );
}

// --- Heat badge ------------------------------------------------------------

export function heatBand(score: number): {
  label: string;
  className: string;
} {
  if (score >= 70)
    return {
      label: "Hot",
      className: "bg-red-500/10 text-red-400 border border-red-500/20",
    };
  if (score >= 45)
    return {
      label: "Warm",
      className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    };
  return {
    label: "Cool",
    className: "bg-zinc-700/30 text-zinc-400 border border-zinc-700",
  };
}

export function HeatBadge({ score }: { score: number }) {
  const band = heatBand(score);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${band.className}`}
    >
      {score}
      <span className="opacity-70 font-medium">{band.label}</span>
    </span>
  );
}

// --- Stage badge -----------------------------------------------------------

const STAGE_BADGE: Record<PipelineStage, string> = {
  new: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
  attempting: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20",
  contacted: "bg-violet-500/10 text-violet-300 border border-violet-500/20",
  callback_scheduled:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  demo_booked: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  won: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  lost: "bg-zinc-700/30 text-zinc-500 border border-zinc-700",
};

export function StageBadge({ stage }: { stage: PipelineStage }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STAGE_BADGE[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

// --- Avatar chip -----------------------------------------------------------

export function Avatar({
  name,
  color,
  size = 28,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </span>
  );
}
