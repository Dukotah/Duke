// Single source of truth for the headline pricing shown across the marketing
// site — /pricing, /services, and the homepage PricingTeaser. These used to be
// hand-typed on each page and drifted out of sync (e.g. /services advertised web
// at "$1,500 – $20,000+" while /pricing showed "$2,500 – $7,500", and IT at
// "$300 – $2,500/mo" vs "$550 – $2,200/mo"). Edit the numbers here once and every
// page stays consistent.
//
// `range`      — the headline low–high range (no unit suffix; /pricing pairs it
//                with `note`, /services appends `unit`).
// `unit`       — billing unit appended where the range stands alone ("" or "/mo").
// `note`       — the small qualifier under the range on /pricing.
// `startingAt` — the "from" anchor used by the homepage PricingTeaser.

// `low`/`high` are the numeric bounds of `range` — used to emit schema.org
// AggregateOffer price data (keep them in sync with `range`).
export const PRICING = {
  web: {
    range: "$2,500 – $7,500",
    unit: "",
    note: "One-time, by scope",
    startingAt: "$2,500",
    low: 2500,
    high: 7500,
  },
  it: {
    range: "$550 – $2,200",
    unit: "/mo",
    note: "Per month, flat fee by team size",
    startingAt: "$550",
    low: 550,
    high: 2200,
  },
  cybersecurity: {
    range: "$750 – $1,200",
    unit: "",
    note: "One-time audit fee",
    startingAt: "$750",
    low: 750,
    high: 1200,
  },
  ai: {
    range: "$1,500 – $4,000",
    unit: "",
    note: "One-time build + from $200/mo",
    startingAt: "$1,500",
    low: 1500,
    high: 4000,
  },
} as const;

// Convenience: full self-contained range label (range + unit), e.g. "$550 – $2,200/mo".
export function rangeLabel(key: keyof typeof PRICING): string {
  const p = PRICING[key];
  return `${p.range}${p.unit}`;
}
