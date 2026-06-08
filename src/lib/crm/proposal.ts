// Templated proposal / quote generator.
//
// Turns a lead + a set of selected services into a clean, ready-to-send proposal
// built from the canonical PRICING numbers, so a rep never hand-types a quote
// (and never quotes a number that's drifted from the site). Pure + deterministic
// so the UI and any assisting agent produce the same document; returns plain
// text that drops straight into an email or mailto link.

import { PRICING, rangeLabel } from "@/config/pricing";
import { EMAIL, PHONE, BOOKING_URL, SITE_URL } from "@/config/site";

export type ServiceKey = keyof typeof PRICING; // "web" | "it" | "cybersecurity" | "ai"

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  web: "Website design & build",
  it: "Managed IT support",
  cybersecurity: "Cybersecurity audit",
  ai: "AI integration",
};

export interface ProposalInput {
  businessName: string;
  contactName?: string;
  city?: string;
  services: ServiceKey[];
  repName?: string;
  notes?: string;
}

export interface ProposalLineItem {
  service: ServiceKey;
  label: string;
  price: string; // e.g. "$2,500 – $7,500" or "$550 – $2,200/mo"
  note: string;
}

export interface Proposal {
  subject: string;
  body: string;
  lineItems: ProposalLineItem[];
  estimateLow: number;
  estimateHigh: number;
}

// Sensible default services to pre-select from a lead's tier. Tier A (no site)
// and B (weak DIY site) are website-led; everyone benefits from the security
// audit, so it rides along as a natural cross-sell.
export function suggestServices(tier?: string): ServiceKey[] {
  const t = (tier || "").toUpperCase();
  if (t === "A" || t === "B") return ["web", "cybersecurity"];
  return ["web"];
}

const bookingLink = BOOKING_URL.startsWith("http") ? BOOKING_URL : `${SITE_URL}${BOOKING_URL}`;

export function buildProposal(input: ProposalInput): Proposal {
  const services = input.services.length ? input.services : (["web"] as ServiceKey[]);

  const lineItems: ProposalLineItem[] = services.map((service) => ({
    service,
    label: SERVICE_LABELS[service],
    price: rangeLabel(service),
    note: PRICING[service].note,
  }));

  // One-time services contribute to the headline estimate; recurring ("/mo")
  // lines are summarized separately so we never add a monthly fee to a one-time
  // total.
  const oneTime = services.filter((s) => PRICING[s].unit !== "/mo");
  const estimateLow = oneTime.reduce((sum, s) => sum + PRICING[s].low, 0);
  const estimateHigh = oneTime.reduce((sum, s) => sum + PRICING[s].high, 0);

  const greeting = input.contactName?.trim() ? `Hi ${input.contactName.trim().split(/\s+/)[0]},` : "Hi,";
  const rep = input.repName && input.repName.trim().toLowerCase() !== "me" ? input.repName.trim() : "";

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");
  const estLine =
    oneTime.length > 0
      ? estimateLow === estimateHigh
        ? `Estimated one-time investment: ${fmt(estimateLow)}`
        : `Estimated one-time investment: ${fmt(estimateLow)} – ${fmt(estimateHigh)}`
      : "Investment: see the monthly figures above";

  const itemLines = lineItems.map((li) => `• ${li.label}: ${li.price} (${li.note})`);

  const bodyParts = [
    greeting,
    "",
    `Thanks for the time — here's a quick proposal for ${input.businessName}${input.city ? ` in ${input.city}` : ""}.`,
    "",
    "What we'd do:",
    ...itemLines,
    "",
    estLine,
    "",
    ...(input.notes?.trim() ? [input.notes.trim(), ""] : []),
    "Everything is flat-fee and scoped up front — no surprises, no long contracts. Most websites go live in about two weeks.",
    "",
    `Next step: grab a 15-minute call and we'll lock the scope — ${bookingLink}`,
    "",
    "Best,",
    ...(rep ? [rep] : []),
    "Copper Bay Tech",
    `${PHONE} · ${EMAIL}`,
  ];

  return {
    subject: `Proposal for ${input.businessName} — Copper Bay Tech`,
    body: bodyParts.join("\n"),
    lineItems,
    estimateLow,
    estimateHigh,
  };
}
