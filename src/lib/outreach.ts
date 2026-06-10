// Pure outreach gating logic, extracted so it can be unit-tested without Redis,
// the network, or a request. The /api/crm/outreach route composes these helpers
// with its side effects (suppression lookup, Resend send, activity logging).

export interface OutreachLead {
  id: string;
  name: string; // business name
  contactName?: string; // person to greet, when known
  email: string;
  city: string;
  previewUrl?: string; // demo site built by the /websites factory → {demoUrl}
  claimByDate?: string; // demo "claim by" date for urgency → {claimByDate}
  // Enriched MX-verified deliverability: valid | risky | invalid | unknown.
  // When "invalid", the address won't deliver — gateLeads drops it so a fragile
  // warm-up domain never accrues hard bounces. Absent on legacy leads (not dropped).
  emailStatus?: string;
}

// First name for an email greeting, or "" when no usable contact person is known.
export function firstName(full?: string): string {
  return full?.trim().split(/\s+/)[0] ?? "";
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

// An MX-verified status of "invalid" means the address won't deliver. Dropping
// these protects the warm-up domain from hard bounces. Role/free providers are
// deliberately NOT treated as undeliverable — for a web-design pitch an info@ or
// gmail address is a perfectly good (often the only) way to reach a contractor.
// Unknown/risky are kept here (surfaced as a warn-with-override in the composer).
export function isUndeliverableStatus(status?: string): boolean {
  return (status ?? "").toLowerCase() === "invalid";
}

// Strict warm-up gate: an address is only sendable when MX-verification positively
// marked it "valid". Unlike isUndeliverableStatus (a denylist that drops just
// "invalid"), this is an allowlist — unknown, risky, AND legacy-unverified (empty
// status) are all excluded. Used only when OUTREACH_REQUIRE_VALID_EMAIL is on, so a
// fragile new sending domain never emails an address we haven't positively verified.
export function isVerifiedValidStatus(status?: string): boolean {
  return (status ?? "").toLowerCase() === "valid";
}

// Read the strict-valid warm-up flag from its env var.
export function requireValidEmail(raw: string | undefined): boolean {
  return (raw ?? "").trim().toLowerCase() === "true";
}

export interface GateOptions {
  // When true, only MX-verified "valid" addresses pass (warm-up strict mode).
  // Default false preserves the legacy behavior (keep unknown/risky, drop invalid).
  requireValidStatus?: boolean;
}

// Given the full request batch and the suppression set, decide which leads are
// eligible to receive an email. A lead is dropped when it has no email, the
// email is malformed, the address has unsubscribed, or the enriched status marks
// it undeliverable. In strict mode (requireValidStatus) it is additionally dropped
// unless its MX-verified status is "valid".
export function gateLeads(
  leads: OutreachLead[],
  suppressed: Iterable<string>,
  opts: GateOptions = {},
): GateResult {
  const suppressedSet = new Set<string>();
  for (const e of suppressed) suppressedSet.add(normalizeEmail(e));

  const sendable = leads.filter(
    (l) =>
      Boolean(l.email) &&
      isValidEmail(l.email) &&
      !isUndeliverableStatus(l.emailStatus) &&
      (!opts.requireValidStatus || isVerifiedValidStatus(l.emailStatus)) &&
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
// up slowly via OUTREACH_DAILY_CAP; falls back to a conservative default. This is
// the HARD ceiling — the warm-up ramp (below) only ever scales DOWN from here.
export function resolveDailyCap(
  rawCap: string | undefined,
  fallback = 200,
): number {
  const n = parseInt(rawCap ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Days since the (UTC) verified date, or null if either date is unparseable.
// Both inputs are YYYY-MM-DD; comparing at UTC midnight avoids TZ/DST drift.
function daysSince(verifiedDate: string | undefined, today: string): number | null {
  const start = Date.parse(`${(verifiedDate ?? "").trim()}T00:00:00Z`);
  const now = Date.parse(`${today.trim()}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(now)) return null;
  return Math.floor((now - start) / 86_400_000);
}

// Warm-up ramp. A brand-new sending domain that suddenly blasts hundreds of cold
// emails looks exactly like a spammer, so volume must increase slowly over the
// first few weeks (see DELIVERABILITY.md). Given the date the domain was verified
// in Resend (OUTREACH_DOMAIN_VERIFIED_DATE, YYYY-MM-DD) and today's date, return
// the conservative daily ceiling for the current week of the warm-up, never above
// the configured hard cap:
//   week 1 (days 0-6):   20/day
//   week 2 (days 7-13):  50/day
//   week 3 (days 14-20): 100/day
//   week 4+ (day 21+):   hard cap
// A future or unparseable date is treated as day 0 (most conservative). When no
// verified date is configured the ramp is OFF and the hard cap applies — so this
// is purely opt-in and preserves prior behavior until the owner sets the date.
export function rampedDailyCap(
  verifiedDate: string | undefined,
  today: string,
  hardCap: number,
): number {
  if (!(verifiedDate ?? "").trim()) return hardCap; // ramp disabled
  const days = daysSince(verifiedDate, today);
  if (days === null) return hardCap;
  const d = Math.max(0, days); // future date → week 1
  const rung = d < 7 ? 20 : d < 14 ? 50 : d < 21 ? 100 : hardCap;
  return Math.min(rung, hardCap);
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
// are case-insensitive: {name}, {business}, {city}, {fromName}, {demoUrl},
// {claimByDate}. MUST stay in sync with the client-side personalize in
// emailTemplates.ts so the composer preview matches what actually gets sent.
//
// {name} is the recipient GREETING — a contact person's first name when we know
// it, otherwise a neutral "there" so emails read "Hi there," instead of the
// dead-giveaway "Hi Acme Plumbing,". {business} is always the company name.
// Scraped leads rarely carry a contact person, so most sends fall back to "there".
// {demoUrl}/{claimByDate} come from the demo site built by the /websites factory
// (attached via /api/crm/admin/preview-url); empty when no demo exists.
export function personalize(
  template: string,
  lead: Pick<OutreachLead, "name" | "city" | "previewUrl" | "claimByDate"> & { contactName?: string },
  fromName: string,
): string {
  const greeting = firstName(lead.contactName) || "there";
  return template
    .replace(/\{name\}/gi, greeting)
    .replace(/\{business\}/gi, lead.name)
    .replace(/\{city\}/gi, lead.city)
    .replace(/\{fromName\}/gi, fromName)
    .replace(/\{demoUrl\}/gi, lead.previewUrl ?? "")
    .replace(/\{claimByDate\}/gi, lead.claimByDate ?? "");
}
