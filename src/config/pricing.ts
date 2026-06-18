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

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITES-FIRST pricing model ("Websites, handled — for life.")
//
// The PRICING const above is the legacy, multi-service headline data still
// imported by 130+ marketing/service pages — it is UNCHANGED and must stay.
// The exports below power the new homepage offer architecture: a one-time
// website build (websitePackages) + an ongoing care plan (carePlans, where
// IT/security/AI are folded in as benefits, not headline services) + optional
// addOns. Prices are strings (display-ready) plus numeric `priceValue` for
// schema/estimator math.
// ─────────────────────────────────────────────────────────────────────────────

export type PriceCadence = "one-time" | "monthly";

export type WebsitePackage = {
  /** Stable id for keys/analytics. */
  id: "starter" | "business" | "custom";
  name: string;
  /** Display price, e.g. "$2,500" or "$8,000". */
  price: string;
  /** "$" prefix already in `price`; this is "" or "from " etc. */
  pricePrefix?: string;
  /** Numeric anchor for schema / estimator math. */
  priceValue: number;
  cadence: PriceCadence;
  /** One-line positioning under the name. */
  tagline: string;
  /** Bulleted inclusions. */
  features: string[];
  /** Highlight as the recommended tier (copper border + "Most popular"). */
  popular?: boolean;
};

export const websitePackages: readonly WebsitePackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$2,500",
    priceValue: 2500,
    cadence: "one-time",
    tagline: "A polished, fast site to get found and get calls.",
    features: [
      "Up to 5 custom-designed pages",
      "Mobile-first, accessible, SEO-ready build",
      "Contact form + Google Business setup",
      "Launch in 2–3 weeks",
      "Pairs with any care plan for life",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "$4,500",
    priceValue: 4500,
    cadence: "one-time",
    tagline: "More pages, more proof, built to convert.",
    popular: true,
    features: [
      "Up to 12 custom pages + blog",
      "Copywriting guidance & on-page SEO",
      "Lead capture, analytics & booking integration",
      "Performance-tuned (Core Web Vitals)",
      "Priority 2–4 week build",
    ],
  },
  {
    id: "custom",
    name: "Custom & Commerce",
    price: "$8,000",
    pricePrefix: "from ",
    priceValue: 8000,
    cadence: "one-time",
    tagline: "Online stores, portals, and bespoke builds.",
    features: [
      "Unlimited pages / e-commerce / memberships",
      "Custom integrations & automation",
      "Conversion & SEO strategy included",
      "Dedicated project lead",
      "Scoped to fit — quoted after a quick call",
    ],
  },
] as const;

export type CarePlan = {
  id: "essential" | "pro" | "managed";
  name: string;
  /** Monthly display price, e.g. "$95". */
  price: string;
  priceValue: number;
  cadence: "monthly";
  tagline: string;
  features: string[];
  popular?: boolean;
};

export const carePlans: readonly CarePlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: "$95",
    priceValue: 95,
    cadence: "monthly",
    tagline: "Your site, always up, always current.",
    features: [
      "Hosting, SSL & daily backups",
      "Software & security updates",
      "Uptime monitoring",
      "Small content edits (up to 1 hr/mo)",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$245",
    priceValue: 245,
    cadence: "monthly",
    tagline: "Hands-off upkeep plus steady improvements.",
    popular: true,
    features: [
      "Everything in Essential",
      "Up to 3 hrs/mo of edits & new sections",
      "Monthly performance & SEO tune-ups",
      "Form & analytics monitoring",
      "Priority support (next business day)",
    ],
  },
  {
    id: "managed",
    name: "Fully Managed",
    price: "$550",
    priceValue: 550,
    cadence: "monthly",
    tagline: "Website, IT, security & AI — one partner, handled.",
    features: [
      "Everything in Pro",
      "Managed IT & helpdesk for your team",
      "Cybersecurity monitoring & hardening",
      "AI tools & automation setup",
      "Unlimited reasonable edits + same-day support",
    ],
  },
] as const;

export type AddOn = {
  id: string;
  name: string;
  /** Display price, e.g. "$150" or "$2,000". */
  price: string;
  /** "" | "from " | "/page" handled in the string where it reads best. */
  priceNote?: string;
  priceValue: number;
  cadence: PriceCadence;
  description: string;
};

export const addOns: readonly AddOn[] = [
  {
    id: "extra-pages",
    name: "Extra pages",
    price: "$150",
    priceNote: "each",
    priceValue: 150,
    cadence: "one-time",
    description: "Add custom-designed pages beyond your package.",
  },
  {
    id: "online-store",
    name: "Online store",
    price: "$2,000",
    priceNote: "from",
    priceValue: 2000,
    cadence: "one-time",
    description: "Sell products or services with a managed storefront.",
  },
  {
    id: "ai-chat",
    name: "AI chat assistant",
    price: "$1,200",
    priceNote: "from",
    priceValue: 1200,
    cadence: "one-time",
    description: "On-site AI assistant trained on your business.",
  },
  {
    id: "seo-kit",
    name: "SEO kit",
    price: "$750",
    priceValue: 750,
    cadence: "one-time",
    description: "Keyword research, on-page SEO & local listings setup.",
  },
  {
    id: "copywriting",
    name: "Copywriting",
    price: "$600",
    priceNote: "from",
    priceValue: 600,
    cadence: "one-time",
    description: "Professional, conversion-focused copy for your pages.",
  },
  {
    id: "brand",
    name: "Brand & logo",
    price: "$900",
    priceNote: "from",
    priceValue: 900,
    cadence: "one-time",
    description: "Logo, color, and type system to anchor your identity.",
  },
] as const;
