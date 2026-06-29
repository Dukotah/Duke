// All database operations. Uses Upstash Redis.
import { getRedis } from "./redis";

// ─── Password hashing (Node crypto, no deps) ──────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const candidate = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return candidate === hashHex;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "rep";
  commissionRate: number; // e.g. 0.10 = 10%
  createdAt: string;
  active: boolean;
  // Email-sending profile. Undefined is treated as "full" (legacy/admin).
  //   full       — compose & send freely (default for the owner/admin)
  //   restricted — templated, one lead at a time, daily-capped, own leads only
  //   off        — phone only; cannot send any outreach email
  emailMode?: "full" | "restricted" | "off";
}

export type PublicUser = Omit<User, "passwordHash">;

export interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string;
  notes: string;
  lastContacted?: string;
  submittedAt?: string;
  callCount?: number;
  lastOutcome?: string;
  followUpDate?: string; // YYYY-MM-DD
}

export interface Submission {
  id: string; // `${userId}:${leadId}`
  userId: string;
  repName: string;
  leadId: string;
  leadName: string;
  leadCity: string;
  leadPhone: string;
  leadEmail: string;
  leadWebsite: string;
  leadTier: string;
  pitch: string;
  repNotes: string;
  estimatedBudget: string;
  status: "pending" | "accepted" | "rejected";
  dealValue?: number;
  commissionAmount?: number;
  commissionPaid?: boolean;
  submittedAt: string;
  resolvedAt?: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const user: User = { ...data, id, createdAt: new Date().toISOString() };
  await redis.hset(`user:${id}`, user as unknown as Record<string, unknown>);
  await redis.sadd("users:index", id);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const redis = getRedis();
  const u = await redis.hgetall(`user:${id}`);
  if (!u || !u.id) return null;
  return u as unknown as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const redis = getRedis();
  const ids = await redis.smembers("users:index");
  for (const id of ids) {
    const u = await getUserById(id as string);
    if (u && u.email.toLowerCase() === email.toLowerCase()) return u;
  }
  return null;
}

export async function listUsers(): Promise<PublicUser[]> {
  const redis = getRedis();
  const ids = await redis.smembers("users:index");
  const users = await Promise.all((ids as string[]).map(getUserById));
  return (users.filter(Boolean) as User[])
    .map(({ passwordHash: _, ...u }) => u);
}

export async function updateUser(id: string, patch: Partial<Omit<User, "id">>): Promise<void> {
  const redis = getRedis();
  await redis.hset(`user:${id}`, patch as Record<string, unknown>);
}

export async function deleteUser(id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`user:${id}`);
  await redis.srem("users:index", id);
}

// ─── Lead state ───────────────────────────────────────────────────────────────

export async function getLeadState(userId: string, leadId: string): Promise<LeadState | null> {
  const redis = getRedis();
  const s = await redis.hgetall(`lead:${userId}:${leadId}`);
  if (!s || !s.status) return null;
  return s as unknown as LeadState;
}

export async function setLeadState(userId: string, leadId: string, state: Partial<LeadState>): Promise<void> {
  const redis = getRedis();
  await redis.hset(`lead:${userId}:${leadId}`, state as Record<string, unknown>);
}

export async function getAllLeadStates(userId: string): Promise<Record<string, LeadState>> {
  const redis = getRedis();
  const keys = await redis.keys(`lead:${userId}:*`);
  if (!keys.length) return {};
  const result: Record<string, LeadState> = {};
  await Promise.all(
    (keys as string[]).map(async (key) => {
      const leadId = key.replace(`lead:${userId}:`, "");
      const s = await redis.hgetall(key);
      if (s && s.status) result[leadId] = s as unknown as LeadState;
    })
  );
  return result;
}

export async function getUserLeadCount(userId: string): Promise<number> {
  const redis = getRedis();
  const keys = await redis.keys(`lead:${userId}:*`);
  return keys.length;
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function createSubmission(data: Omit<Submission, "id" | "status" | "submittedAt">): Promise<Submission> {
  const redis = getRedis();
  const sub: Submission = {
    ...data,
    id: `${data.userId}:${data.leadId}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  await redis.hset(`submission:${sub.id}`, sub as unknown as Record<string, unknown>);
  await redis.zadd("submissions:index", { score: Date.now(), member: sub.id });
  // Mark the lead state as submitted
  await setLeadState(data.userId, data.leadId, { submittedAt: sub.submittedAt });
  return sub;
}

export async function listSubmissions(filter?: "pending" | "accepted" | "rejected"): Promise<Submission[]> {
  const redis = getRedis();
  const ids = await redis.zrange("submissions:index", 0, -1, { rev: true });
  const subs = await Promise.all(
    (ids as string[]).map(async (id) => {
      const s = await redis.hgetall(`submission:${id}`);
      return s as unknown as Submission;
    })
  );
  const valid = subs.filter(Boolean);
  if (filter) return valid.filter((s) => s.status === filter);
  return valid;
}

export async function getSubmissionsByUser(userId: string): Promise<Submission[]> {
  const all = await listSubmissions();
  return all.filter((s) => s.userId === userId);
}

export async function resolveSubmission(
  subId: string,
  status: "accepted" | "rejected",
  dealValue?: number
): Promise<Submission> {
  const redis = getRedis();
  const raw = await redis.hgetall(`submission:${subId}`);
  if (!raw) throw new Error("Submission not found");
  const sub = raw as unknown as Submission;

  const user = await getUserById(sub.userId);
  let commissionAmount: number | undefined;
  if (status === "accepted" && dealValue && user) {
    const tiers = await getCommissionTiers();
    commissionAmount = computeCommission(dealValue, user.commissionRate, tiers).amount;
  }

  const updated: Partial<Submission> = {
    status,
    resolvedAt: new Date().toISOString(),
    ...(dealValue !== undefined && { dealValue }),
    ...(commissionAmount !== undefined && { commissionAmount, commissionPaid: false }),
  };

  await redis.hset(`submission:${subId}`, updated as Record<string, unknown>);
  return { ...sub, ...updated };
}

export async function markCommissionPaid(subId: string): Promise<void> {
  const redis = getRedis();
  await redis.hset(`submission:${subId}`, { commissionPaid: true });
}

// ─── Tiered commission rates ───────────────────────────────────────────────────
// Optional deal-value bands that override the rep's flat commissionRate at
// deal-accept time. A band applies when `min <= dealValue < max` (max omitted =
// open-ended top band). Stored as one JSON value in a global settings hash so the
// admin can edit it; absent config falls back to DEFAULT_COMMISSION_TIERS, and a
// dealValue that matches no band falls back to the rep's flat rate. Historical
// commissions are never recomputed — this only fires when a submission is accepted.

export interface CommissionTier {
  min: number;      // inclusive lower bound on dealValue
  max?: number;     // exclusive upper bound; omitted = open-ended top band
  rate: number;     // commission rate for this band, e.g. 0.15 = 15%
}

// Sane out-of-the-box ladder: <1000 → 10%, 1000–2999 → 15%, 3000+ → 20%.
export const DEFAULT_COMMISSION_TIERS: CommissionTier[] = [
  { min: 0, max: 1000, rate: 0.1 },
  { min: 1000, max: 3000, rate: 0.15 },
  { min: 3000, rate: 0.2 },
];

const SETTINGS_KEY = "crm_settings";
const COMMISSION_TIERS_FIELD = "commissionTiers";

// Validate + normalize a raw tier array (drops malformed entries, sorts by min).
function sanitizeTiers(raw: unknown): CommissionTier[] | null {
  if (!Array.isArray(raw)) return null;
  const tiers: CommissionTier[] = [];
  for (const t of raw) {
    if (!t || typeof t !== "object") continue;
    const o = t as Record<string, unknown>;
    const min = Number(o.min);
    const rate = Number(o.rate);
    if (!Number.isFinite(min) || min < 0) continue;
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) continue;
    const tier: CommissionTier = { min, rate };
    if (o.max !== undefined && o.max !== null && o.max !== "") {
      const max = Number(o.max);
      if (Number.isFinite(max) && max > min) tier.max = max;
    }
    tiers.push(tier);
  }
  if (!tiers.length) return null;
  tiers.sort((a, b) => a.min - b.min);
  return tiers;
}

// Read the configured commission tiers, or null when none are set (caller then
// uses the rep's flat rate). Tolerant of Upstash auto-parse.
export async function getCommissionTiers(): Promise<CommissionTier[] | null> {
  const redis = getRedis();
  const raw = await redis.hget(SETTINGS_KEY, COMMISSION_TIERS_FIELD);
  if (raw == null) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return sanitizeTiers(parsed);
  } catch {
    return null;
  }
}

// Persist (or clear) the admin-set commission tiers. Passing an empty/invalid
// array clears the override so the flat per-rep rate applies again.
export async function setCommissionTiers(tiers: unknown): Promise<CommissionTier[] | null> {
  const redis = getRedis();
  const clean = sanitizeTiers(tiers);
  if (!clean) {
    await redis.hdel(SETTINGS_KEY, COMMISSION_TIERS_FIELD);
    return null;
  }
  await redis.hset(SETTINGS_KEY, { [COMMISSION_TIERS_FIELD]: JSON.stringify(clean) });
  return clean;
}

// Find the rate for a dealValue within a tier set. Returns null when no band
// matches so the caller can fall back to the rep's flat rate.
export function rateForDealValue(dealValue: number, tiers: CommissionTier[]): number | null {
  for (const t of tiers) {
    const aboveMin = dealValue >= t.min;
    const belowMax = t.max === undefined || dealValue < t.max;
    if (aboveMin && belowMax) return t.rate;
  }
  return null;
}

// Compute the commission amount for an accepted deal. Uses the tiered rate when a
// band matches, otherwise the rep's flat rate. Rounded to cents.
export function computeCommission(
  dealValue: number,
  flatRate: number,
  tiers?: CommissionTier[] | null
): { amount: number; rate: number; tiered: boolean } {
  const tierRate = tiers && tiers.length ? rateForDealValue(dealValue, tiers) : null;
  const rate = tierRate ?? flatRate;
  const amount = Math.round(dealValue * rate * 100) / 100;
  return { amount, rate, tiered: tierRate !== null };
}

export async function getRepStats(userId: string) {
  const subs = await getSubmissionsByUser(userId);
  const accepted = subs.filter((s) => s.status === "accepted");
  const pending = accepted.filter((s) => !s.commissionPaid);
  const paid = accepted.filter((s) => s.commissionPaid);
  return {
    totalSubmissions: subs.length,
    accepted: accepted.length,
    rejected: subs.filter((s) => s.status === "rejected").length,
    pendingPayout: pending.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
    totalPaid: paid.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
    totalEarned: accepted.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
  };
}

// ─── Activity Timeline ────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  userId: string;
  repName: string;
  type: "call" | "note" | "email" | "submitted" | "status_change" | "reply";
  outcome?: string; // "no_answer" | "voicemail" | "interested" etc
  note?: string;
  createdAt: string;
  // Inbound-reply payload (type === "reply"): the FULL email so the rep can read
  // it straight from the timeline without a second lookup.
  fromEmail?: string;
  fromName?: string;
  subject?: string;
  text?: string;
  html?: string;
}

export async function addActivity(
  leadId: string,
  userId: string,
  repName: string,
  entry: Omit<ActivityEntry, "id" | "userId" | "repName" | "createdAt">
): Promise<void> {
  const redis = getRedis();
  const full: ActivityEntry = {
    ...entry,
    id: crypto.randomUUID(),
    userId,
    repName,
    createdAt: new Date().toISOString(),
  };
  const key = `activity:${leadId}`;
  await redis.lpush(key, JSON.stringify(full));
  await redis.ltrim(key, 0, 49);
}

export async function getActivity(leadId: string): Promise<ActivityEntry[]> {
  const redis = getRedis();
  const items = await redis.lrange(`activity:${leadId}`, 0, -1);
  return (items as string[]).map((s) => JSON.parse(s) as ActivityEntry);
}

export async function deleteActivity(leadId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`activity:${leadId}`);
}

// ─── Inbound email replies ────────────────────────────────────────────────────
// When a lead replies to an outreach email (captured via the inbound webhook),
// we both (a) drop the FULL reply onto the lead's activity timeline so the rep
// can read it, and (b) durably stamp the cross-rep lead_actions hash (respondedAt
// set-once, lastOutcome="replied", replyCount) so the lead auto-surfaces in the
// "Responded" tab and shows a badge for every rep. The newest reply body is also
// kept in a dedicated `lead_replies` hash for a cheap one-HGET read by the feed.

export interface InboundReply {
  fromEmail: string;
  fromName?: string;
  subject?: string;
  text?: string;
  html?: string;
  receivedAt: string; // ISO
}

// What the feed/card needs to render a reply: latest body + count + when first
// replied. Shape is JSON-stored per leadId in the `lead_replies` hash.
export interface LeadReply extends InboundReply {
  leadId: string;
  replyCount: number;
  respondedAt: string; // ISO of the FIRST reply (set-once)
}

const LEAD_REPLIES_KEY = "lead_replies";

export async function recordInboundReply(
  leadId: string,
  reply: { fromEmail: string; fromName?: string; subject?: string; text?: string; html?: string; receivedAt?: string },
  opts: { userId: string; repName?: string }
): Promise<void> {
  if (!leadId) return;
  const redis = getRedis();
  const receivedAt = reply.receivedAt || new Date().toISOString();
  const repName = opts.repName ?? "lead";

  // (a) Append the FULL reply to the lead's timeline.
  await addActivity(leadId, opts.userId, repName, {
    type: "reply",
    outcome: "replied",
    note: reply.subject || "Replied to outreach email",
    fromEmail: reply.fromEmail,
    ...(reply.fromName ? { fromName: reply.fromName } : {}),
    ...(reply.subject ? { subject: reply.subject } : {}),
    ...(reply.text ? { text: reply.text } : {}),
    ...(reply.html ? { html: reply.html } : {}),
  });

  // (b) Durable cross-rep stamp: respondedAt is sticky/set-once (first reply),
  // but lastOutcome/lastOutcomeAt always update and replyCount always bumps.
  try {
    await stampLeadAction(
      leadId,
      {
        respondedAt: receivedAt, // STICKY_ONCE — keeps the FIRST reply time
        lastOutcome: "replied",
        lastOutcomeAt: receivedAt,
        _incReply: true,
      },
      { userId: opts.userId, repName }
    );
  } catch {
    /* timeline already written; the stamp is additive */
  }

  // (c) Store the newest reply body for a cheap feed read. Read-modify-write so
  // respondedAt stays the FIRST reply and replyCount is monotonic.
  const prev = await getLeadReply(leadId);
  const value: LeadReply = {
    leadId,
    fromEmail: reply.fromEmail,
    ...(reply.fromName ? { fromName: reply.fromName } : {}),
    ...(reply.subject ? { subject: reply.subject } : {}),
    ...(reply.text ? { text: reply.text } : {}),
    ...(reply.html ? { html: reply.html } : {}),
    receivedAt,
    replyCount: (prev?.replyCount ?? 0) + 1,
    respondedAt: prev?.respondedAt || receivedAt,
  };
  await redis.hset(LEAD_REPLIES_KEY, { [leadId]: JSON.stringify(value) });
}

// Latest reply (body + count + first-reply time) for one lead, or null.
export async function getLeadReply(leadId: string): Promise<LeadReply | null> {
  const redis = getRedis();
  const raw = await redis.hget(LEAD_REPLIES_KEY, leadId);
  if (raw == null) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") return parsed as LeadReply;
  } catch {
    /* skip malformed */
  }
  return null;
}

// Whole map of leadId → latest LeadReply for enriching a page in one HGETALL.
export async function getLeadReplies(): Promise<Record<string, LeadReply>> {
  const redis = getRedis();
  const all = (await redis.hgetall(LEAD_REPLIES_KEY)) as Record<string, unknown> | null;
  if (!all) return {};
  const out: Record<string, LeadReply> = {};
  for (const [k, v] of Object.entries(all)) {
    try {
      const parsed = typeof v === "string" ? JSON.parse(v) : v;
      if (parsed && typeof parsed === "object") out[k] = parsed as LeadReply;
    } catch {
      /* skip malformed entry */
    }
  }
  return out;
}

// ─── Custom Leads ─────────────────────────────────────────────────────────────

export interface CustomLead {
  id: string;
  name: string; // business name
  contactName?: string; // person to greet in outreach, when known (e.g. from the contact form)
  phone: string;
  email: string;
  website: string;
  city: string;
  county: string;
  niche: string;
  notes: string;
  addedBy: string;
  createdAt: string;
  // Stable Overture business id (the canonical cross-repo join key). Set when the
  // lead was imported from the website-factory seam; absent for hand-added leads.
  businessId?: string;
}

export async function createCustomLead(
  userId: string,
  data: Omit<CustomLead, "id" | "addedBy" | "createdAt">
): Promise<CustomLead> {
  const redis = getRedis();
  const lead: CustomLead = {
    ...data,
    contactName: data.contactName?.trim() ?? "", // never store undefined (Redis hset)
    id: crypto.randomUUID(),
    addedBy: userId,
    createdAt: new Date().toISOString(),
  };
  await redis.hset(`custom_lead:${lead.id}`, lead as unknown as Record<string, unknown>);
  await redis.sadd(`custom_leads:${userId}`, lead.id);
  return lead;
}

export async function getCustomLeads(userId: string): Promise<CustomLead[]> {
  const redis = getRedis();
  const ids = await redis.smembers(`custom_leads:${userId}`);
  if (!ids.length) return [];
  const leads = await Promise.all(
    (ids as string[]).map(async (id) => {
      const l = await redis.hgetall(`custom_lead:${id}`);
      return l as unknown as CustomLead;
    })
  );
  return leads.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ─── Lead Preview Sites (from the /websites factory) ──────────────────────────
// A generated demo/preview site for a prospect, attached by BUSINESS NAME rather
// than lead id: cold-lead ids are CSV row indexes that shift on every re-export,
// while the name is stable and is the only field both the CRM CSV and the
// /websites manifest share. Stored in ONE global hash so the whole queue is
// enriched with a single HGETALL.

export type DemoStatus = "ready" | "needs_review" | "archived";

export interface LeadPreview {
  previewUrl: string;
  linkedAt: string;
  status?: DemoStatus;
  flags?: string[];
  category?: string;
  area?: string;
  claimByDate?: string;
  thumbnailUrl?: string;
  slug?: string;
  // Cross-repo join keys carried from the website-factory seam. `id` is the stable
  // Overture business id (preferred); `matchKey` is the tight fuzzy-name fallback.
  id?: string;
  matchKey?: string;
}

const LEAD_PREVIEWS_KEY = "lead_previews";

// Normalize a business name to a stable join key. Both the writer (the push
// endpoint, from the /websites manifest name) and the reader (the lead queue,
// from the CSV name) run a name through this, so the two sides line up without
// a shared id. This is the LEGACY fuzzy fallback — prefer `businessId` / matchKey.
export function previewKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// matchKey — TS twin of scraper-app/contract/normalize.js `matchKey`/`norm`. The
// tight cross-repo name key: lowercase -> non-alnum to space -> drop legal-suffix
// words -> strip whitespace. Keep byte-identical to the contract normalizer so the
// CRM, the website factory, and the scraper engine compute the same key. This is
// the SECOND-choice join (after the stable business id, before previewKey).
const MATCH_KEY_SUFFIX_RE =
  /\b(llc|inc|incorporated|co|company|group|team|realty|realtors|real estate|properties|brokerage|the)\b/g;
export function matchKey(name: string): string {
  let n = (name || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ");
  n = n.replace(MATCH_KEY_SUFFIX_RE, " ");
  return n.replace(/\s+/g, "");
}

function normalizeDemoStatus(raw: string | undefined): DemoStatus {
  if (raw === "needs-review" || raw === "needs_review") return "needs_review";
  if (raw === "archived") return "archived";
  return "ready";
}

// Input type for the optional demo-package extras. status accepts any string
// and is normalized to DemoStatus inside setLeadPreview.
export type LeadPreviewExtras = Partial<Omit<LeadPreview, "previewUrl" | "linkedAt" | "status">> & {
  status?: string;
};

export async function setLeadPreview(
  name: string,
  previewUrl: string,
  extra: LeadPreviewExtras = {}
): Promise<void> {
  const key = previewKey(name);
  if (!key || !previewUrl) return;
  const redis = getRedis();
  const value: LeadPreview = {
    previewUrl,
    linkedAt: new Date().toISOString(),
    status: normalizeDemoStatus(extra.status as string | undefined),
    // Only store non-empty optional fields so old readers treat missing as absent
    ...(extra.flags && extra.flags.length > 0 ? { flags: extra.flags } : {}),
    ...(extra.category ? { category: extra.category } : {}),
    ...(extra.area ? { area: extra.area } : {}),
    ...(extra.claimByDate ? { claimByDate: extra.claimByDate } : {}),
    ...(extra.thumbnailUrl ? { thumbnailUrl: extra.thumbnailUrl } : {}),
    ...(extra.slug ? { slug: extra.slug } : {}),
    // Carry the stable business id when present, and ALWAYS a matchKey (derived
    // from the name when the caller didn't supply one) so the demos join can
    // prefer the id and fall back to the tight name key before the fuzzy one.
    ...(extra.id ? { id: extra.id } : {}),
    matchKey: extra.matchKey || matchKey(name),
  };
  await redis.hset(LEAD_PREVIEWS_KEY, { [key]: JSON.stringify(value) });
}

// Build id/matchKey lookup indexes from a previews map (one pass), so the demos
// feed can resolve a lead's demo by the stable id first. Previews written before
// this change simply won't appear in these indexes and fall through to the name
// path — fully backward compatible.
export function indexLeadPreviews(previews: Record<string, LeadPreview>): {
  byId: Record<string, LeadPreview>;
  byMatchKey: Record<string, LeadPreview>;
} {
  const byId: Record<string, LeadPreview> = {};
  const byMatchKey: Record<string, LeadPreview> = {};
  for (const p of Object.values(previews)) {
    if (p?.id) byId[p.id] = p;
    if (p?.matchKey) byMatchKey[p.matchKey] = p;
  }
  return { byId, byMatchKey };
}

// Resolve the demo preview attached to a lead. Preference order:
//   1) stable Overture business id   (exact, never fuzzy)
//   2) matchKey(name)                (tight legal-suffix-stripped name key)
//   3) previewKey(name)              (legacy fuzzy fallback — unchanged behavior)
// Pass the previews map plus its indexes (from indexLeadPreviews) so a whole page
// of the queue resolves without rebuilding indexes per lead.
export function resolveLeadPreview(
  previews: Record<string, LeadPreview>,
  indexes: { byId: Record<string, LeadPreview>; byMatchKey: Record<string, LeadPreview> },
  lead: { businessId?: string; name: string }
): LeadPreview | undefined {
  if (lead.businessId && indexes.byId[lead.businessId]) return indexes.byId[lead.businessId];
  const mk = matchKey(lead.name);
  if (mk && indexes.byMatchKey[mk]) return indexes.byMatchKey[mk];
  return previews[previewKey(lead.name)];
}

// Returns a map of normalized-name → previewUrl for enriching the lead queue.
// Kept intact so any future caller still compiles without changes.
export async function getLeadPreviews(): Promise<Record<string, string>> {
  const redis = getRedis();
  const all = (await redis.hgetall(LEAD_PREVIEWS_KEY)) as Record<string, unknown> | null;
  if (!all) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(all)) {
    try {
      // Upstash may auto-deserialize JSON values back to objects, so accept both.
      const parsed = (typeof v === "string" ? JSON.parse(v) : v) as LeadPreview;
      if (parsed?.previewUrl) out[k] = parsed.previewUrl;
    } catch {
      /* skip malformed entry */
    }
  }
  return out;
}

// Returns the full demo package per normalized-name key.
// CRITICAL: tolerates legacy bare-URL string values stored before this change —
// reconstructs { previewUrl, linkedAt: '' } so callers always get a usable object.
export async function getLeadPreviewObjects(): Promise<Record<string, LeadPreview>> {
  const redis = getRedis();
  const all = (await redis.hgetall(LEAD_PREVIEWS_KEY)) as Record<string, unknown> | null;
  if (!all) return {};
  const out: Record<string, LeadPreview> = {};
  for (const [k, v] of Object.entries(all)) {
    try {
      const parsed = typeof v === "string" ? JSON.parse(v) : v;
      // Legacy bare-string value: wrap it into a minimal LeadPreview
      if (typeof parsed === "string") {
        out[k] = { previewUrl: parsed, linkedAt: "" };
      } else if (parsed && typeof parsed === "object" && (parsed as LeadPreview).previewUrl) {
        out[k] = parsed as LeadPreview;
      }
      // If neither condition applies (malformed), skip the entry
    } catch {
      /* skip malformed entry */
    }
  }
  return out;
}

// ─── Durable per-lead action stamps (GLOBAL, cross-rep) ───────────────────────
// LeadState is keyed PER USER, so it can't answer "what was done to this lead"
// across the whole team. This is a single GLOBAL hash (one per-lead JSON value),
// mirroring the proven lead_previews pattern: one HGETALL enriches an entire page
// of the queue. Stamped on email send and call outcome so any rep sees, durably,
// the last touch on every lead — no 2-day TTL, never expires.

export interface LeadActions {
  emailedAt?: string;       // ISO — last time anyone emailed this lead
  calledAt?: string;        // ISO — last time anyone logged a call outcome
  emailCount?: number;      // total emails sent across all reps
  callCount?: number;       // total call outcomes logged across all reps
  lastOutcome?: string;     // last call/email outcome (no_answer|voicemail|interested|sent|…)
  lastOutcomeAt?: string;   // ISO — when lastOutcome was recorded
  interestedAt?: string;    // ISO — set-once when any rep first logs "interested"; sticky, never cleared
  notInterestedAt?: string; // ISO — set-once when any rep marks the lead not-interested; sticky
  lastTouchedBy?: string;   // userId of the rep who last touched it
  lastTouchedName?: string; // display name of that rep (for row initials)
  lastTouchedAt?: string;   // ISO — last touch of any kind
  followUpDate?: string;    // YYYY-MM-DD — shared follow-up date
  status?: string;          // mirrors LeadState.status when known (won|not_interested|…)
  openedAt?: string;        // ISO — last time this lead opened an outreach email (Resend webhook)
  openedCount?: number;     // total opens across all sends — engagement signal
  clickedAt?: string;       // ISO — last time this lead clicked a link (e.g. the demo) — hottest signal
  clickedCount?: number;    // total link clicks
  bouncedAt?: string;       // ISO — email hard-bounced or was marked spam; address suppressed. Don't re-email.
  respondedAt?: string;     // ISO — set-once when the lead FIRST replies to an outreach email (inbound webhook); sticky
  replyCount?: number;      // total inbound replies received from this lead
}

const LEAD_ACTIONS_KEY = "lead_actions";

// Patch type accepted by stampLeadAction. `_incEmail` / `_incCall` are sentinel
// flags: when true, bump the respective counter (read-modify-write) instead of
// the caller having to know the current value.
export type LeadActionPatch = Partial<LeadActions> & {
  _incEmail?: boolean;
  _incCall?: boolean;
  _incOpen?: boolean;
  _incClick?: boolean;
  _incReply?: boolean;
};

// Single lead's actions, tolerant of Upstash auto-deserialization and legacy
// shapes. Returns null when absent.
export async function getLeadAction(leadId: string): Promise<LeadActions | null> {
  const redis = getRedis();
  const raw = await redis.hget(LEAD_ACTIONS_KEY, leadId);
  if (raw == null) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") return parsed as LeadActions;
  } catch {
    /* skip malformed */
  }
  return null;
}

// Whole map of leadId → LeadActions for enriching a page of the queue with one
// HGETALL. Tolerates both string and pre-parsed object values.
export async function getLeadActions(): Promise<Record<string, LeadActions>> {
  const redis = getRedis();
  const all = (await redis.hgetall(LEAD_ACTIONS_KEY)) as Record<string, unknown> | null;
  if (!all) return {};
  const out: Record<string, LeadActions> = {};
  for (const [k, v] of Object.entries(all)) {
    try {
      const parsed = typeof v === "string" ? JSON.parse(v) : v;
      if (parsed && typeof parsed === "object") out[k] = parsed as LeadActions;
    } catch {
      /* skip malformed entry */
    }
  }
  return out;
}

// Additively merge a patch into a lead's global action record (read-modify-write
// of the one JSON value). Counters bump via the `_inc*` sentinels. Never expires.
// Only non-undefined fields are written, so an old reader treats missing as absent.
export async function stampLeadAction(
  leadId: string,
  patch: LeadActionPatch,
  touchedBy?: { userId?: string; repName?: string }
): Promise<void> {
  if (!leadId) return;
  const redis = getRedis();
  const current = (await getLeadAction(leadId)) ?? {};

  const { _incEmail, _incCall, _incOpen, _incClick, _incReply, ...rest } = patch;
  const next: LeadActions = { ...current };

  // Sticky, set-once fields: once a high-value signal is recorded, a later
  // outcome (e.g. a follow-up "no_answer") must never clear it. We keep the
  // first non-empty value so cross-rep Interested/Not-interested membership
  // does not silently vanish on a subsequent touch.
  const STICKY_ONCE = new Set(["interestedAt", "notInterestedAt", "respondedAt"]);

  for (const [k, val] of Object.entries(rest)) {
    if (val !== undefined && val !== null && val !== "") {
      if (STICKY_ONCE.has(k) && (current as Record<string, unknown>)[k]) continue;
      (next as Record<string, unknown>)[k] = val;
    }
  }

  if (_incEmail) next.emailCount = (current.emailCount ?? 0) + 1;
  if (_incCall) next.callCount = (current.callCount ?? 0) + 1;
  if (_incOpen) next.openedCount = (current.openedCount ?? 0) + 1;
  if (_incClick) next.clickedCount = (current.clickedCount ?? 0) + 1;
  if (_incReply) next.replyCount = (current.replyCount ?? 0) + 1;

  const nowISO = new Date().toISOString();
  next.lastTouchedAt = nowISO;
  if (touchedBy?.userId) next.lastTouchedBy = touchedBy.userId;
  if (touchedBy?.repName) next.lastTouchedName = touchedBy.repName;

  await redis.hset(LEAD_ACTIONS_KEY, { [leadId]: JSON.stringify(next) });
}

// ─── Lead Claims ─────────────────────────────────────────────────────────────

export interface LeadClaim {
  leadId: string;
  userId: string;
  repName: string;
  claimedAt: string;
}

export async function claimLead(leadId: string, userId: string, repName: string): Promise<LeadClaim> {
  const redis = getRedis();
  const claim: LeadClaim = { leadId, userId, repName, claimedAt: new Date().toISOString() };
  await redis.hset(`claim:${leadId}`, claim as unknown as Record<string, unknown>);
  await redis.expire(`claim:${leadId}`, 60 * 60 * 24 * 30); // 30 days
  await redis.sadd(`claimed_by_user:${userId}`, leadId);
  return claim;
}

export async function unclaimLead(leadId: string, userId: string): Promise<void> {
  const redis = getRedis();
  const existing = await getLeadClaim(leadId);
  if (!existing || existing.userId !== userId) return;
  await redis.del(`claim:${leadId}`);
  await redis.srem(`claimed_by_user:${userId}`, leadId);
}

export async function getLeadClaim(leadId: string): Promise<LeadClaim | null> {
  const redis = getRedis();
  const c = await redis.hgetall(`claim:${leadId}`);
  if (!c || !c.leadId) return null;
  return c as unknown as LeadClaim;
}

export async function getClaimedLeadIds(userId: string): Promise<string[]> {
  const redis = getRedis();
  const ids = await redis.smembers(`claimed_by_user:${userId}`);
  return ids as string[];
}

export async function getAllClaims(): Promise<LeadClaim[]> {
  const redis = getRedis();
  const keys = await redis.keys("claim:*");
  if (!keys.length) return [];
  const claims = await Promise.all(
    (keys as string[]).map(async (key) => {
      const c = await redis.hgetall(key);
      if (!c || !c.leadId) return null;
      return c as unknown as LeadClaim;
    })
  );
  return claims.filter(Boolean) as LeadClaim[];
}

// ─── Lead Assignments (durable, exclusive — admin-controlled ownership) ─────────
//
// Distinct from claims: a *claim* is a rep self-service "I'm working this now"
// (soft, 30-day TTL). An *assignment* is admin-controlled, durable, and EXCLUSIVE
// — a lead belongs to exactly one rep, so two cold-callers never dial the same
// business. Assigning a lead that's already owned MOVES it to the new owner.
// Stored as one global hash (leadId → JSON) so the leads API can scope a whole
// page with a single HGETALL, mirroring the lead_actions pattern.

export interface LeadAssignment {
  leadId: string;
  userId: string;
  repName: string;
  assignedAt: string;
  assignedBy: string; // admin user id/name who made the assignment
}

const LEAD_ASSIGNMENTS_KEY = "lead_assignments";

export async function getLeadAssignment(leadId: string): Promise<LeadAssignment | null> {
  const redis = getRedis();
  const raw = await redis.hget(LEAD_ASSIGNMENTS_KEY, leadId);
  if (raw == null) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object" && (parsed as LeadAssignment).userId) return parsed as LeadAssignment;
  } catch { /* skip malformed */ }
  return null;
}

export async function getAllAssignments(): Promise<Record<string, LeadAssignment>> {
  const redis = getRedis();
  const all = (await redis.hgetall(LEAD_ASSIGNMENTS_KEY)) as Record<string, unknown> | null;
  if (!all) return {};
  const out: Record<string, LeadAssignment> = {};
  for (const [k, v] of Object.entries(all)) {
    try {
      const parsed = typeof v === "string" ? JSON.parse(v) : v;
      if (parsed && typeof parsed === "object" && (parsed as LeadAssignment).userId) out[k] = parsed as LeadAssignment;
    } catch { /* skip malformed entry */ }
  }
  return out;
}

export async function getAssignedLeadIds(userId: string): Promise<string[]> {
  const redis = getRedis();
  const ids = await redis.smembers(`assigned_to:${userId}`);
  return ids as string[];
}

// Assign one lead to a rep. Exclusive: if already owned by someone else, the lead
// is moved (removed from the previous owner's set). Idempotent for the same owner.
export async function assignLead(
  leadId: string, userId: string, repName: string, assignedBy: string
): Promise<LeadAssignment> {
  const redis = getRedis();
  const prev = await getLeadAssignment(leadId);
  if (prev && prev.userId !== userId) {
    await redis.srem(`assigned_to:${prev.userId}`, leadId);
  }
  const a: LeadAssignment = { leadId, userId, repName, assignedAt: new Date().toISOString(), assignedBy };
  await redis.hset(LEAD_ASSIGNMENTS_KEY, { [leadId]: JSON.stringify(a) });
  await redis.sadd(`assigned_to:${userId}`, leadId);
  return a;
}

// Bulk assign. Returns how many were written.
export async function assignLeads(
  leadIds: string[], userId: string, repName: string, assignedBy: string
): Promise<number> {
  let n = 0;
  for (const id of leadIds) {
    if (!id) continue;
    await assignLead(id, userId, repName, assignedBy);
    n++;
  }
  return n;
}

// Remove an assignment entirely (lead returns to the unassigned pool).
export async function unassignLead(leadId: string): Promise<void> {
  const redis = getRedis();
  const prev = await getLeadAssignment(leadId);
  if (!prev) return;
  await redis.hdel(LEAD_ASSIGNMENTS_KEY, leadId);
  await redis.srem(`assigned_to:${prev.userId}`, leadId);
}

export async function unassignLeads(leadIds: string[]): Promise<number> {
  let n = 0;
  for (const id of leadIds) {
    if (!id) continue;
    await unassignLead(id);
    n++;
  }
  return n;
}

// ─── Territories ──────────────────────────────────────────────────────────────

export interface Territory {
  userId: string;
  counties: string[];
  niches: string[];
  updatedAt: string;
}

export async function setTerritory(userId: string, territory: { counties: string[]; niches: string[] }): Promise<Territory> {
  const redis = getRedis();
  const t: Territory = { ...territory, userId, updatedAt: new Date().toISOString() };
  await redis.hset(`territory:${userId}`, {
    userId: t.userId,
    counties: JSON.stringify(t.counties),
    niches: JSON.stringify(t.niches),
    updatedAt: t.updatedAt,
  });
  await redis.sadd("territories:index", userId);
  return t;
}

export async function getTerritory(userId: string): Promise<Territory | null> {
  const redis = getRedis();
  const raw = await redis.hgetall(`territory:${userId}`);
  if (!raw || !raw.userId) return null;
  return {
    userId: raw.userId as string,
    counties: JSON.parse((raw.counties as string) ?? "[]"),
    niches: JSON.parse((raw.niches as string) ?? "[]"),
    updatedAt: raw.updatedAt as string,
  };
}

export async function deleteTerritory(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`territory:${userId}`);
  await redis.srem("territories:index", userId);
}

export async function getAllTerritories(): Promise<Record<string, Territory>> {
  const redis = getRedis();
  const ids = await redis.smembers("territories:index");
  const result: Record<string, Territory> = {};
  await Promise.all(
    (ids as string[]).map(async (id) => {
      const t = await getTerritory(id as string);
      if (t) result[id as string] = t;
    })
  );
  return result;
}

// ─── Quotas (per-rep targets) ──────────────────────────────────────────────────
// Per-rep performance targets, stored one-hash-per-rep mirroring the Territory
// pattern (`quota:{userId}`). Drives the admin's progress-vs-quota view alongside
// the existing call/submission stats. Additive and read-mostly; absent = no quota.

export interface Quota {
  userId: string;
  callsPerWeek: number;
  dealsPerMonth: number;
  updatedAt: string;
}

export async function setQuota(
  userId: string,
  quota: { callsPerWeek: number; dealsPerMonth: number }
): Promise<Quota> {
  const redis = getRedis();
  const q: Quota = {
    userId,
    callsPerWeek: Math.max(0, Math.round(quota.callsPerWeek || 0)),
    dealsPerMonth: Math.max(0, Math.round(quota.dealsPerMonth || 0)),
    updatedAt: new Date().toISOString(),
  };
  await redis.hset(`quota:${userId}`, {
    userId: q.userId,
    callsPerWeek: q.callsPerWeek,
    dealsPerMonth: q.dealsPerMonth,
    updatedAt: q.updatedAt,
  });
  await redis.sadd("quotas:index", userId);
  return q;
}

export async function getQuota(userId: string): Promise<Quota | null> {
  const redis = getRedis();
  const raw = await redis.hgetall(`quota:${userId}`);
  if (!raw || !raw.userId) return null;
  return {
    userId: raw.userId as string,
    callsPerWeek: Number(raw.callsPerWeek ?? 0),
    dealsPerMonth: Number(raw.dealsPerMonth ?? 0),
    updatedAt: String(raw.updatedAt ?? ""),
  };
}

export async function deleteQuota(userId: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`quota:${userId}`);
  await redis.srem("quotas:index", userId);
}

export async function getAllQuotas(): Promise<Record<string, Quota>> {
  const redis = getRedis();
  const ids = await redis.smembers("quotas:index");
  const result: Record<string, Quota> = {};
  await Promise.all(
    (ids as string[]).map(async (id) => {
      const q = await getQuota(id as string);
      if (q) result[id as string] = q;
    })
  );
  return result;
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  submissionsThisMonth: number;
  acceptedThisMonth: number;
  callsThisMonth: number;
  totalEarned: number;
  currentStreak: number;
  rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const redis = getRedis();
  const users = await listUsers();
  const reps = users.filter((u) => u.role === "rep" && u.active);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const allSubs = await listSubmissions();

  const entries = await Promise.all(
    reps.map(async (rep) => {
      const repSubs = allSubs.filter((s) => s.userId === rep.id);
      const thisMonthSubs = repSubs.filter((s) => {
        const d = new Date(s.submittedAt);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      const acceptedThisMonth = thisMonthSubs.filter((s) => s.status === "accepted").length;
      const totalEarned = repSubs
        .filter((s) => s.status === "accepted")
        .reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);

      // Count calls this month from daily Redis keys
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let callsThisMonth = 0;
      await Promise.all(
        Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          const monthStr = String(month + 1).padStart(2, "0");
          const dateStr = `${year}-${monthStr}-${day}`;
          return redis.get(`daily:${rep.id}:${dateStr}:calls`).then((v) => {
            callsThisMonth += typeof v === "number" ? v : parseInt(String(v ?? "0"), 10) || 0;
          });
        })
      );

      // Streak: consecutive days with at least 1 call (going back from today)
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const calls = await redis.get(`daily:${rep.id}:${dateStr}:calls`);
        const count = typeof calls === "number" ? calls : parseInt(String(calls ?? "0"), 10) || 0;
        if (count > 0) currentStreak++;
        else break;
      }

      return {
        userId: rep.id,
        name: rep.name,
        email: rep.email,
        submissionsThisMonth: thisMonthSubs.length,
        acceptedThisMonth,
        callsThisMonth,
        totalEarned,
        currentStreak,
        rank: 0,
      };
    })
  );

  // Sort: submissions this month, then calls, then total earned
  entries.sort((a, b) => {
    if (b.submissionsThisMonth !== a.submissionsThisMonth) return b.submissionsThisMonth - a.submissionsThisMonth;
    if (b.callsThisMonth !== a.callsThisMonth) return b.callsThisMonth - a.callsThisMonth;
    return b.totalEarned - a.totalEarned;
  });

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

// ─── Broadcasts ───────────────────────────────────────────────────────────────

export interface Broadcast {
  id: string;
  message: string;
  type: "info" | "success" | "urgent";
  createdAt: string;
  expiresAt: string;
  createdBy: string;
}

export async function createBroadcast(
  message: string,
  type: Broadcast["type"],
  expiresInDays: number,
  createdBy: string
): Promise<Broadcast> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const broadcast: Broadcast = { id, message, type, createdAt: now.toISOString(), expiresAt, createdBy };
  await redis.hset(`broadcast:${id}`, broadcast as unknown as Record<string, unknown>);
  await redis.sadd("broadcasts:index", id);
  return broadcast;
}

export async function getActiveBroadcasts(): Promise<Broadcast[]> {
  const redis = getRedis();
  const ids = await redis.smembers("broadcasts:index");
  if (!ids.length) return [];
  const broadcasts = await Promise.all(
    (ids as string[]).map(async (id) => {
      const b = await redis.hgetall(`broadcast:${id}`);
      return b as unknown as Broadcast;
    })
  );
  const now = new Date().toISOString();
  return broadcasts.filter((b) => b && b.id && b.expiresAt > now);
}

export async function deleteBroadcast(id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`broadcast:${id}`);
  await redis.srem("broadcasts:index", id);
}

// ─── Outreach suppression list (unsubscribes) ─────────────────────────────────
// Emails that have opted out. We must never send to these again — re-mailing
// someone who unsubscribed is the fastest way to get reported as spam.

const SUPPRESS_KEY = "outreach:suppressed";

export async function suppressEmail(email: string): Promise<void> {
  const redis = getRedis();
  await redis.sadd(SUPPRESS_KEY, email.toLowerCase().trim());
}

export async function getSuppressedEmails(): Promise<string[]> {
  const redis = getRedis();
  const members = await redis.smembers(SUPPRESS_KEY);
  return (members as string[]).map((e) => e.toLowerCase());
}

export async function getSuppressedCount(): Promise<number> {
  const redis = getRedis();
  return (await redis.scard(SUPPRESS_KEY)) as number;
}

// Re-allow an address that previously unsubscribed (admin action).
export async function unsuppressEmail(email: string): Promise<void> {
  const redis = getRedis();
  await redis.srem(SUPPRESS_KEY, email.toLowerCase().trim());
}

// ─── Do-Not-Call list (cold-call compliance) ──────────────────────────────────
// The phone equivalent of the email suppression list. A business that asks not to
// be called (or that a rep flags) goes here so the call queue skips it. Stored as
// a set of normalized digits-only phone numbers, mirroring the suppression set.

const DNC_KEY = "outreach:do_not_call";

// Normalize any phone string to bare digits so formatting differences
// ("(707) 555-1212", "+1 707-555-1212", "7075551212") all match. A leading US
// country code "1" on an 11-digit number is stripped so +1 numbers match their
// 10-digit form.
export function normalizePhone(phone: string): string {
  let digits = (phone ?? "").replace(/\D+/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits;
}

// Mark a phone number do-not-call. `by` (userId/name) is accepted for parity with
// addDoNotCall callers/audit but the set only stores the normalized number.
export async function addDoNotCall(phone: string, by?: string): Promise<void> {
  void by;
  const norm = normalizePhone(phone);
  if (!norm) return;
  const redis = getRedis();
  await redis.sadd(DNC_KEY, norm);
}

// Re-allow a number that was previously marked do-not-call (admin action).
export async function removeDoNotCall(phone: string): Promise<void> {
  const norm = normalizePhone(phone);
  if (!norm) return;
  const redis = getRedis();
  await redis.srem(DNC_KEY, norm);
}

// All do-not-call numbers, normalized to digits-only.
export async function getDoNotCallPhones(): Promise<string[]> {
  const redis = getRedis();
  const members = await redis.smembers(DNC_KEY);
  return (members as string[]).map((p) => normalizePhone(p));
}

export async function getDoNotCallCount(): Promise<number> {
  const redis = getRedis();
  return (await redis.scard(DNC_KEY)) as number;
}

// Is this phone number on the do-not-call list?
export async function isDoNotCall(phone: string): Promise<boolean> {
  const norm = normalizePhone(phone);
  if (!norm) return false;
  const phones = await getDoNotCallPhones();
  return phones.includes(norm);
}

// ─── Cross-rep daily email dedup ──────────────────────────────────────────────
// A shared, date-scoped set of every address actually emailed today, across ALL
// reps. Two reps working the same queue must not both email the same business in
// one day — duplicate sends look spammy and burn the lead. Keyed by YYYY-MM-DD and
// expired after 2 days so it self-cleans.

const EMAILED_TODAY_KEY = (date: string) => `outreach:emailed:${date}`;
const EMAILED_TODAY_TTL = 172_800; // 2 days, in seconds

// Addresses already emailed on `date` (YYYY-MM-DD), normalized lowercase.
export async function getEmailedToday(date: string): Promise<string[]> {
  const redis = getRedis();
  const members = await redis.smembers(EMAILED_TODAY_KEY(date));
  return (members as string[]).map((e) => e.toLowerCase());
}

// Record that `email` was emailed on `date` so other reps skip it today.
export async function markEmailedToday(date: string, email: string): Promise<void> {
  const redis = getRedis();
  const key = EMAILED_TODAY_KEY(date);
  await redis.sadd(key, email.toLowerCase().trim());
  await redis.expire(key, EMAILED_TODAY_TTL);
}

// ─── Resend email_id → lead mapping ───────────────────────────────────────────
// Stored at send time so inbound Resend webhook events (clicked/opened/bounced/
// complained) correlate back to the exact lead by the email's own id — instead of
// guessing from the recipient address against a capped recent-sends log (which
// silently dropped older sends). Keyed by Resend's email id; 45-day TTL comfortably
// covers the window in which engagement events realistically arrive.

const EMAIL_SEND_PREFIX = "resend_email:";
const EMAIL_SEND_TTL = 60 * 60 * 24 * 45; // 45 days, in seconds

export interface EmailSendRef {
  userId: string;
  leadId: string;
  leadName?: string;
}

// Remember which lead a delivered Resend email belongs to.
export async function recordEmailSend(emailId: string, ref: EmailSendRef): Promise<void> {
  if (!emailId) return;
  const redis = getRedis();
  await redis.set(`${EMAIL_SEND_PREFIX}${emailId}`, JSON.stringify(ref), { ex: EMAIL_SEND_TTL });
}

// Resolve the lead a Resend email_id was sent to. Null when unknown/expired.
export async function getEmailSend(emailId: string): Promise<EmailSendRef | null> {
  if (!emailId) return null;
  const redis = getRedis();
  const raw = await redis.get(`${EMAIL_SEND_PREFIX}${emailId}`);
  if (raw == null) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") return parsed as EmailSendRef;
  } catch { /* malformed — fall through */ }
  return null;
}

// ─── Outreach send log (for admin email tracking) ─────────────────────────────
// Each send is recorded under `outreach_log:<userId>`. This aggregates them.

export interface OutreachLogEntry {
  userId: string;
  leadId: string;
  leadName: string;
  email: string;
  subject: string;
  sentAt: string;
  // Whether the email was actually delivered (Resend configured) or only
  // tracked/logged (delivery integration not live yet). Older entries
  // predate this field — treat a missing value as delivered.
  delivered?: boolean;
}

export async function getAllOutreachLog(limit = 250): Promise<OutreachLogEntry[]> {
  const redis = getRedis();
  const keys = await redis.keys("outreach_log:*");
  if (!keys.length) return [];
  const all: OutreachLogEntry[] = [];
  await Promise.all(
    (keys as string[]).map(async (key) => {
      const userId = key.replace("outreach_log:", "");
      const items = await redis.lrange(key, 0, -1);
      for (const raw of items as unknown[]) {
        try {
          const e = typeof raw === "string" ? JSON.parse(raw) : raw;
          if (e && e.email) all.push({ ...(e as Omit<OutreachLogEntry, "userId">), userId });
        } catch {
          // skip malformed entry
        }
      }
    })
  );
  all.sort((a, b) => (b.sentAt ?? "").localeCompare(a.sentAt ?? ""));
  return all.slice(0, limit);
}

// Resolve an email address to (userId, leadId) the SAME way the Resend delivery
// webhook does: scan every rep's outreach log for a matching recipient. Falls
// back to matching a custom lead by its stored email (a custom lead's id is what
// the CRM keys activity/actions on). Returns null when nothing matches — callers
// must treat that as "unmatched, don't error".
export async function findLeadByEmail(
  email: string
): Promise<{ userId: string; leadId: string; leadName: string } | null> {
  const redis = getRedis();
  const norm = email.toLowerCase().trim();
  if (!norm) return null;

  // 1) Outreach log — the authoritative record of who we emailed (any rep).
  const keys = await redis.keys("outreach_log:*");
  for (const key of keys as string[]) {
    const userId = key.replace("outreach_log:", "");
    const items = (await redis.lrange(key, 0, -1)) as unknown[];
    for (const raw of items) {
      try {
        const entry = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (typeof entry?.email === "string" && entry.email.toLowerCase().trim() === norm) {
          return { userId, leadId: entry.leadId, leadName: entry.leadName ?? "" };
        }
      } catch {
        /* skip malformed entry */
      }
    }
  }

  // 2) Custom leads — a reply may come from a hand-raiser / manually-added lead
  // we never bulk-emailed. Their CRM id is `custom_lead:{id}`, keyed under the
  // owning user in `custom_leads:{userId}`. The activity/actions hashes for these
  // are keyed by the raw custom_lead id (e.g. demos feed uses `custom:{id}`),
  // but the timeline/actions use the bare id, so return the bare id here.
  const userIndexKeys = await redis.keys("custom_leads:*");
  for (const idxKey of userIndexKeys as string[]) {
    const userId = idxKey.replace("custom_leads:", "");
    const ids = (await redis.smembers(idxKey)) as string[];
    for (const id of ids) {
      const lead = (await redis.hgetall(`custom_lead:${id}`)) as unknown as CustomLead | null;
      if (lead && typeof lead.email === "string" && lead.email.toLowerCase().trim() === norm) {
        return { userId, leadId: id, leadName: lead.name ?? "" };
      }
    }
  }

  return null;
}

// ─── Admin seed ───────────────────────────────────────────────────────────────

export async function ensureAdminExists(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await getUserByEmail(email);
  if (existing) return;

  await createUser({
    name: "Duke",
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    commissionRate: 0,
    active: true,
  });
}

// ─── Daily Goals & Streaks ────────────────────────────────────────────────────

export interface DailyStats {
  date: string; // YYYY-MM-DD
  callsLogged: number;
  leadsWorked: number;
  submissionsToday: number;
}

export interface RepStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalCallsAllTime: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function incrementDailyCalls(userId: string): Promise<void> {
  const redis = getRedis();
  const date = todayStr();
  const key = `daily:${userId}:${date}:calls`;
  await redis.incr(key);
  // TTL: 90 days in seconds
  await redis.expire(key, 90 * 24 * 60 * 60);
  await updateStreak(userId);
}

export async function getDailyStats(userId: string, date?: string): Promise<DailyStats> {
  const redis = getRedis();
  const d = date ?? todayStr();
  const callsRaw = await redis.get(`daily:${userId}:${d}:calls`);
  const leadsRaw = await redis.get(`daily:${userId}:${d}:leads`);
  const subsRaw = await redis.get(`daily:${userId}:${d}:submissions`);
  return {
    date: d,
    callsLogged: Number(callsRaw ?? 0),
    leadsWorked: Number(leadsRaw ?? 0),
    submissionsToday: Number(subsRaw ?? 0),
  };
}

export async function getStreak(userId: string): Promise<RepStreak> {
  const redis = getRedis();
  const raw = await redis.hgetall(`streak:${userId}`);
  if (!raw || !raw.currentStreak) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: "", totalCallsAllTime: 0 };
  }
  return {
    currentStreak: Number(raw.currentStreak),
    longestStreak: Number(raw.longestStreak),
    lastActiveDate: String(raw.lastActiveDate ?? ""),
    totalCallsAllTime: Number(raw.totalCallsAllTime ?? 0),
  };
}

export async function updateStreak(userId: string): Promise<void> {
  const redis = getRedis();
  const today = todayStr();
  const streak = await getStreak(userId);

  if (streak.lastActiveDate === today) {
    // Already counted today — just bump all-time calls
    await redis.hincrby(`streak:${userId}`, "totalCallsAllTime", 1);
    return;
  }

  let newCurrent: number;
  if (!streak.lastActiveDate) {
    newCurrent = 1;
  } else {
    const last = new Date(streak.lastActiveDate);
    const todayDate = new Date(today);
    const diffMs = todayDate.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    newCurrent = diffDays === 1 ? streak.currentStreak + 1 : 1;
  }

  const newLongest = Math.max(newCurrent, streak.longestStreak);
  await redis.hset(`streak:${userId}`, {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastActiveDate: today,
    totalCallsAllTime: streak.totalCallsAllTime + 1,
  });
}

export async function getWeeklyCallHistory(userId: string): Promise<{ date: string; calls: number }[]> {
  const redis = getRedis();
  const result: { date: string; calls: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const raw = await redis.get(`daily:${userId}:${date}:calls`);
    result.push({ date, calls: Number(raw ?? 0) });
  }
  return result;
}

// ─── Lead-fetch audit log (anti-exfiltration) ─────────────────────────────────
// Every rep lead-list fetch is appended to a capped per-user Redis list
// `lead_audit:{userId}` so an admin can spot bulk-scraping behavior (a rep paging
// through the whole list, or pulling thousands of rows). Newest-first (lpush +
// ltrim). All callers SWALLOW failures — auditing must never break a lead fetch.

export interface LeadAuditEntry {
  userId: string;
  /** ISO-8601 timestamp of the fetch. */
  at: string;
  /** Requested page number. */
  page: number;
  /** Number of leads returned on this page. */
  count: number;
  /** Total leads matching the rep's filters (across all pages). */
  total: number;
  /** Active query/filter params on the request (only the non-empty ones). */
  filters: Record<string, string>;
}

const LEAD_AUDIT_CAP = 500;

export async function logLeadFetch(entry: LeadAuditEntry): Promise<void> {
  try {
    const redis = getRedis();
    const key = `lead_audit:${entry.userId}`;
    await redis.lpush(key, JSON.stringify(entry));
    await redis.ltrim(key, 0, LEAD_AUDIT_CAP - 1);
  } catch {
    // Best-effort: never let an audit-write failure surface to the rep.
  }
}

// Recent audit entries. With a userId → just that rep's list; otherwise the
// newest entries merged across every rep (admin overview). `limit` caps the
// returned rows after the cross-user merge.
export async function getLeadAudit(
  userId?: string,
  limit = 200
): Promise<LeadAuditEntry[]> {
  const redis = getRedis();
  const parse = (raw: unknown): LeadAuditEntry | null => {
    try {
      const e = typeof raw === "string" ? JSON.parse(raw) : raw;
      return e && typeof e === "object" ? (e as LeadAuditEntry) : null;
    } catch {
      return null;
    }
  };

  if (userId) {
    const items = (await redis.lrange(`lead_audit:${userId}`, 0, limit - 1)) as unknown[];
    return items.map(parse).filter((e): e is LeadAuditEntry => !!e);
  }

  const keys = (await redis.keys("lead_audit:*")) as string[];
  if (!keys.length) return [];
  const all: LeadAuditEntry[] = [];
  await Promise.all(
    keys.map(async (key) => {
      const items = (await redis.lrange(key, 0, limit - 1)) as unknown[];
      for (const raw of items) {
        const e = parse(raw);
        if (e) all.push(e);
      }
    })
  );
  all.sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""));
  return all.slice(0, limit);
}
