// Pure outreach gating logic, extracted so it can be unit-tested without Redis,
// the network, or a request. The /api/crm/outreach route composes these helpers
// with its side effects (suppression lookup, Resend send, activity logging).

export interface OutreachLead {
  id: string;
  name: string;
  email: string;
  city: string;
  // Live URL of a generated demo/sample site for this lead, if one exists.
  // Injected into the email body via the {demoUrl} placeholder.
  demoUrl?: string;
}

// Basic shape check to avoid sending to obviously malformed addresses.
// Hard bounces are one of the strongest signals that flags a sender as spam.
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Normalize an address the same way the suppression list stores it, so lookups
// match regardless of casing or surrounding whitespace.
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export interface GateResult {
  // Leads we may attempt to send to, after dropping malformed and suppressed
  // addresses (suppression takes precedence and order is preserved).
  sendable: OutreachLead[];
  // How many of the original leads were dropped (malformed or suppressed).
  skipped: number;
}

// Given the full request batch and the suppression set, decide which leads are
// eligible to receive an email. A lead is dropped when it has no email, the
// email is malformed, or the address has unsubscribed.
export function gateLeads(
  leads: OutreachLead[],
  suppressed: Iterable<string>,
): GateResult {
  const suppressedSet = new Set<string>();
  for (const e of suppressed) suppressedSet.add(normalizeEmail(e));

  const sendable = leads.filter(
    (l) =>
      Boolean(l.email) &&
      isValidEmail(l.email) &&
      !suppressedSet.has(normalizeEmail(l.email)),
  );

  return { sendable, skipped: leads.length - sendable.length };
}

// How many emails can actually go out, respecting the per-day warm-up cap.
// Returns 0 (or a clamped value) when the cap is already reached — never negative.
export function remainingDailyCapacity(
  sendableCount: number,
  sentToday: number,
  maxPerDay: number,
): number {
  return Math.max(0, Math.min(sendableCount, maxPerDay - sentToday));
}

// Resolve the configured daily cap. A cold/freshly-verified domain can be warmed
// up slowly via OUTREACH_DAILY_CAP; falls back to a conservative default.
export function resolveDailyCap(
  rawCap: string | undefined,
  fallback = 200,
): number {
  const n = parseInt(rawCap ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Real delivery is gated behind explicit domain verification. We only actually
// send when a Resend API key is present AND the domain has been verified
// (OUTREACH_DOMAIN_VERIFIED=true). Otherwise we track-only to protect the
// domain's sending reputation.
export function canDeliver(
  apiKey: string | undefined,
  domainVerifiedRaw: string | undefined,
): boolean {
  const domainVerified = (domainVerifiedRaw ?? "").trim().toLowerCase() === "true";
  return Boolean(apiKey) && domainVerified;
}

// Personalize a subject or body template with the lead's details. Placeholders
// are case-insensitive: {name}, {business}, {city}, {demoUrl}, {fromName}.
// A missing {demoUrl} collapses to an empty string (same as other vars), so
// templates that reference it should keep it on its own line.
export function personalize(
  template: string,
  lead: Pick<OutreachLead, "name" | "city" | "demoUrl">,
  fromName: string,
): string {
  return template
    .replace(/\{name\}/gi, lead.name)
    .replace(/\{business\}/gi, lead.name)
    .replace(/\{city\}/gi, lead.city)
    .replace(/\{demoUrl\}/gi, lead.demoUrl ?? "")
    .replace(/\{fromName\}/gi, fromName);
}
