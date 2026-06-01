// Seed data: realistic Sonoma County small-business leads with the kind of
// website problems the audit tools surface, plus a small rep roster and some
// recent call history so the dashboards have something to show on first load.

import type { Lead, Rep, Activity, Disposition } from "./types";
import { computeHeatScore } from "./scoring";

export const SEED_REPS: Rep[] = [
  { id: "rep_dana", name: "Dana Cole", avatarColor: "#F97316" },
  { id: "rep_marco", name: "Marco Reyes", avatarColor: "#0EA5E9" },
  { id: "rep_priya", name: "Priya Nair", avatarColor: "#A855F7" },
];

interface SeedLead {
  business: string;
  contactName?: string;
  phone: string;
  website?: string;
  industry: string;
  city: string;
  signals: Lead["signals"];
  estValue: number;
  source: string;
  stage?: Lead["stage"];
  ownerRepId?: string;
}

const RAW: SeedLead[] = [
  {
    business: "Russian River Plumbing",
    contactName: "Gary Holt",
    phone: "(707) 555-0142",
    website: "russianriverplumbing.com",
    industry: "Plumber",
    city: "Guerneville",
    estValue: 3500,
    source: "Google Maps scrape",
    signals: { noWebsite: false, hasSSL: false, speedScore: 31, mobileScore: 42, brokenLinks: 2, notMobileFriendly: true, copyrightYear: 2017 },
  },
  {
    business: "Sonoma Hills Dental",
    contactName: "Dr. Lena Voss",
    phone: "(707) 555-0188",
    website: "sonomahillsdental.com",
    industry: "Dentist",
    city: "Santa Rosa",
    estValue: 5500,
    source: "Audit tool submission",
    signals: { noWebsite: false, hasSSL: true, speedScore: 47, mobileScore: 61, brokenLinks: 0, notMobileFriendly: false, copyrightYear: 2021 },
  },
  {
    business: "Petaluma Pour House",
    contactName: "Mike Trabucco",
    phone: "(707) 555-0119",
    website: "petalumapourhouse.com",
    industry: "Restaurant / Bar",
    city: "Petaluma",
    estValue: 2800,
    source: "Cold list",
    signals: { noWebsite: false, hasSSL: false, speedScore: 22, mobileScore: 35, brokenLinks: 4, notMobileFriendly: true, copyrightYear: 2015 },
  },
  {
    business: "Healdsburg Fine Cabinetry",
    contactName: "Tom Rourke",
    phone: "(707) 555-0173",
    industry: "Carpenter / Contractor",
    city: "Healdsburg",
    estValue: 4200,
    source: "Referral",
    signals: { noWebsite: true, hasSSL: false, speedScore: null, mobileScore: null, brokenLinks: 0, notMobileFriendly: true, copyrightYear: null },
  },
  {
    business: "Coastal Paws Grooming",
    contactName: "Bianca Reed",
    phone: "(707) 555-0150",
    website: "coastalpawsgrooming.com",
    industry: "Pet Services",
    city: "Bodega Bay",
    estValue: 2500,
    source: "Audit tool submission",
    signals: { noWebsite: false, hasSSL: false, speedScore: 55, mobileScore: 48, brokenLinks: 1, notMobileFriendly: true, copyrightYear: 2019 },
  },
  {
    business: "Valley Auto Repair",
    contactName: "Sal Greco",
    phone: "(707) 555-0166",
    website: "valleyautorepair.net",
    industry: "Auto Repair",
    city: "Rohnert Park",
    estValue: 3200,
    source: "Google Maps scrape",
    signals: { noWebsite: false, hasSSL: false, speedScore: 38, mobileScore: 40, brokenLinks: 3, notMobileFriendly: true, copyrightYear: 2016 },
  },
  {
    business: "Sebastopol Yoga Collective",
    contactName: "Aria Lindgren",
    phone: "(707) 555-0134",
    website: "sebastopolyoga.com",
    industry: "Fitness / Wellness",
    city: "Sebastopol",
    estValue: 3000,
    source: "Cold list",
    signals: { noWebsite: false, hasSSL: true, speedScore: 68, mobileScore: 72, brokenLinks: 0, notMobileFriendly: false, copyrightYear: 2023 },
  },
  {
    business: "North Bay Roofing Co.",
    contactName: "Derek Bauer",
    phone: "(707) 555-0177",
    website: "northbayroofingco.com",
    industry: "Roofing Contractor",
    city: "Windsor",
    estValue: 4800,
    source: "Cold list",
    signals: { noWebsite: false, hasSSL: false, speedScore: 29, mobileScore: 33, brokenLinks: 5, notMobileFriendly: true, copyrightYear: 2014 },
  },
  {
    business: "Glen Ellen Day Spa",
    contactName: "Rosa Mendel",
    phone: "(707) 555-0102",
    website: "glenellendayspa.com",
    industry: "Spa / Salon",
    city: "Glen Ellen",
    estValue: 3600,
    source: "Audit tool submission",
    signals: { noWebsite: false, hasSSL: true, speedScore: 51, mobileScore: 58, brokenLinks: 2, notMobileFriendly: false, copyrightYear: 2020 },
  },
  {
    business: "Cotati Family Law",
    contactName: "Anthony Pell",
    phone: "(707) 555-0190",
    website: "cotatifamilylaw.com",
    industry: "Law Firm",
    city: "Cotati",
    estValue: 6000,
    source: "Referral",
    signals: { noWebsite: false, hasSSL: true, speedScore: 44, mobileScore: 55, brokenLinks: 1, notMobileFriendly: true, copyrightYear: 2018 },
  },
  {
    business: "Wine Country Landscaping",
    contactName: "Hector Diaz",
    phone: "(707) 555-0124",
    industry: "Landscaping",
    city: "Kenwood",
    estValue: 3800,
    source: "Google Maps scrape",
    signals: { noWebsite: true, hasSSL: false, speedScore: null, mobileScore: null, brokenLinks: 0, notMobileFriendly: true, copyrightYear: null },
  },
  {
    business: "Bennett Valley Bakery",
    contactName: "Claire Fong",
    phone: "(707) 555-0158",
    website: "bennettvalleybakery.com",
    industry: "Bakery / Cafe",
    city: "Santa Rosa",
    estValue: 2600,
    source: "Cold list",
    signals: { noWebsite: false, hasSSL: false, speedScore: 60, mobileScore: 50, brokenLinks: 0, notMobileFriendly: true, copyrightYear: 2019 },
  },
  {
    business: "Sonoma Coast Electric",
    contactName: "Will Okafor",
    phone: "(707) 555-0181",
    website: "sonomacoastelectric.com",
    industry: "Electrician",
    city: "Jenner",
    estValue: 4000,
    source: "Audit tool submission",
    signals: { noWebsite: false, hasSSL: false, speedScore: 41, mobileScore: 44, brokenLinks: 2, notMobileFriendly: true, copyrightYear: 2017 },
  },
  {
    business: "Healdsburg HVAC Pros",
    contactName: "Janet Liu",
    phone: "(707) 555-0145",
    website: "healdsburghvacpros.com",
    industry: "HVAC",
    city: "Healdsburg",
    estValue: 4500,
    source: "Cold list",
    signals: { noWebsite: false, hasSSL: true, speedScore: 73, mobileScore: 78, brokenLinks: 0, notMobileFriendly: false, copyrightYear: 2024 },
  },
];

// A few pre-baked activities so connect-rate / booked metrics aren't zero on
// first load. Keyed by business name for readability.
const HISTORY: Record<string, { disposition: Disposition; hoursAgo: number; repId: string; note?: string }[]> = {
  "Sonoma Hills Dental": [
    { disposition: "connected", hoursAgo: 3, repId: "rep_dana", note: "Spoke with office manager, Dr. Voss interested. Booked." },
    { disposition: "booked", hoursAgo: 3, repId: "rep_dana" },
  ],
  "Glen Ellen Day Spa": [
    { disposition: "voicemail", hoursAgo: 26, repId: "rep_marco" },
    { disposition: "callback", hoursAgo: 2, repId: "rep_marco", note: "Asked to call back Thursday AM." },
  ],
  "Valley Auto Repair": [
    { disposition: "no_answer", hoursAgo: 5, repId: "rep_priya" },
  ],
  "Cotati Family Law": [
    { disposition: "connected", hoursAgo: 1, repId: "rep_dana", note: "Wants pricing in writing first." },
  ],
  "Petaluma Pour House": [
    { disposition: "not_interested", hoursAgo: 28, repId: "rep_marco", note: "Owner says nephew handles it." },
  ],
};

let _idCounter = 1000;
function nextId(prefix: string) {
  _idCounter += 1;
  return `${prefix}_${_idCounter}`;
}

export function buildSeedLeads(): Lead[] {
  const now = Date.now();
  return RAW.map((r, i) => {
    const id = `lead_${1001 + i}`;
    const history = HISTORY[r.business] ?? [];
    const activities: Activity[] = history.map((h) => ({
      id: nextId("act"),
      leadId: id,
      type: h.note ? "call" : "call",
      disposition: h.disposition,
      body: h.note,
      durationSec: h.disposition === "connected" || h.disposition === "booked" ? 180 + Math.floor(Math.random() * 240) : undefined,
      repId: h.repId,
      createdAt: new Date(now - h.hoursAgo * 3600_000).toISOString(),
    }));

    const last = history[history.length - 1];
    const stage =
      r.stage ??
      (last?.disposition === "booked"
        ? "demo_booked"
        : last?.disposition === "callback"
          ? "callback_scheduled"
          : last?.disposition === "connected"
            ? "contacted"
            : last?.disposition === "not_interested"
              ? "lost"
              : history.length > 0
                ? "attempting"
                : "new");

    const callbackAt =
      last?.disposition === "callback"
        ? new Date(now + 18 * 3600_000).toISOString()
        : null;

    return {
      id,
      business: r.business,
      contactName: r.contactName,
      phone: r.phone,
      website: r.website,
      industry: r.industry,
      city: r.city,
      state: "CA",
      signals: r.signals,
      heatScore: computeHeatScore(r.signals, r.estValue),
      stage,
      ownerRepId: r.ownerRepId ?? last?.repId,
      estValue: r.estValue,
      source: r.source,
      callbackAt,
      attempts: history.filter((h) => h.disposition !== "booked").length,
      lastContactedAt: history.length ? activities[activities.length - 1].createdAt : null,
      createdAt: new Date(now - (RAW.length - i) * 36 * 3600_000).toISOString(),
      activities,
    };
  });
}
