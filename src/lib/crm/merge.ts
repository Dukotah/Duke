// Duplicate detection + guided merge for CRM leads.
//
// ─── DATA-INTEGRITY NOTES (read before changing) ──────────────────────────────
// A "lead" surfaces in the queue from two sources:
//   1. The external CSV feed (cold leads) — id is `<csvId>` (CSV row id /
//      fingerprint / index). These are read-only; we NEVER mutate or delete a CSV
//      lead. We only ever merge a CUSTOM lead into a survivor.
//   2. Custom leads — stored in hash `custom_lead:<id>`, indexed per user in the
//      set `custom_leads:<userId>`. In the FEED their id is prefixed `custom:<id>`
//      (see src/app/api/crm/leads/route.ts), but their activity/state/actions
//      stamps are keyed on the BARE id `<id>` for inbound replies
//      (see findLeadByEmail in db.ts) AND on the prefixed `custom:<id>` for things
//      stamped from the feed UI. Because of this split we re-point BOTH key
//      variants when merging, and treat the survivor id exactly as the caller
//      passed it.
//
// Redis key namespaces this module TOUCHES (read and/or write):
//   - custom_lead:<id>            (hash)   READ all, DELETE loser only
//   - custom_leads:<userId>       (set)    SREM loser id from its owner's index
//   - lead:<userId>:<leadId>      (hash)   per-user lead state — copy loser→survivor where survivor has none
//   - activity:<leadId>           (list)   timeline — re-point loser entries onto survivor
//   - lead_actions   (hash field=<leadId>) global cross-rep stamps — merge loser into survivor
//   - claim:<leadId>              (hash)   + claimed_by_user:<userId> (set) — move claim if survivor unclaimed
//   - submission:<userId>:<leadId>(hash)   + submissions:index (zset) — re-key loser submissions onto survivor
//   - lead_replies   (hash field=<leadId>) latest inbound reply body — move if survivor has none
//
// SAFETY INVARIANTS enforced below:
//   * never delete the survivor; survivorId is only ever a write target.
//   * no-op (and report) if survivorId === loserId.
//   * only the LOSER custom lead is removed, and only after its data is re-pointed.
//   * a CSV (non-custom) loser is refused — there is no custom_lead row to delete,
//     and silently "merging" a CSV id would orphan its stamps. Callers must merge
//     INTO a CSV survivor, never AWAY from one.
//   * survivor-wins on scalar conflicts (lead state, single-value action fields):
//     we only fill fields the survivor is MISSING, so we never clobber good data.

import { getRedis } from "@/lib/redis";
import {
  getCustomLeads,
  getActivity,
  type CustomLead,
  type LeadActions,
} from "@/lib/db";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DuplicateLead {
  id: string;          // the FEED id: `custom:<id>` for custom leads, raw id for CSV
  rawId: string;       // bare id (custom_lead id or csv id) — what activity/state key off when stamped via inbound
  isCustom: boolean;
  ownerId?: string;    // userId that owns the custom lead (custom only)
  name: string;
  email: string;
  phone: string;
  city: string;
  county: string;
  website: string;
  niche: string;
  createdAt?: string;
}

export interface DuplicateGroup {
  // What linked these together: "email" | "phone" | "name+city".
  reason: "email" | "phone" | "name+city";
  key: string;          // the normalized value the group shares (for display)
  leads: DuplicateLead[];
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normEmail(email?: string): string {
  return (email ?? "").trim().toLowerCase();
}

// Phone → digits only, then strip a leading US country code so "+1 707…",
// "(707)…" and "707…" collapse to the same key. Empty/short numbers are ignored
// (return "") so blanks never group together.
export function normPhone(phone?: string): string {
  let d = (phone ?? "").replace(/\D+/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length >= 7 ? d : "";
}

// Fuzzy join key for name+city: lowercase, drop common business suffixes and all
// non-alphanumerics. Both must be present or we return "" (don't group on city
// alone). This is intentionally conservative — name+city is a SUGGESTION the
// admin confirms, never an auto-merge.
export function normNameCity(name?: string, city?: string): string {
  const n = (name ?? "")
    .toLowerCase()
    .replace(/\b(llc|inc|co|corp|ltd|the|and|&)\b/g, " ")
    .replace(/[^a-z0-9]+/g, "");
  const c = (city ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (!n || !c) return "";
  return `${n}|${c}`;
}

// ─── findDuplicates ───────────────────────────────────────────────────────────
// Scans every user's custom leads PLUS an optional loaded feed of CSV leads,
// groups by normalized email / phone / (name+city), and returns only the groups
// with 2+ members. A lead can appear in more than one group (e.g. shared email
// AND shared phone) — that's fine; the admin merges one pair at a time.
//
// `feedLeads` is optional: pass the already-loaded CSV feed (from getLeads()) to
// also catch a custom lead that duplicates a cold CSV lead. We do NOT fetch the
// CSV here to keep this module free of network/import cycles and fast for the
// admin endpoint; the route layer can pass it in.

export interface FeedLeadInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  county?: string;
  website?: string;
  category?: string;
  isCustom?: boolean;
}

function customToDup(c: CustomLead): DuplicateLead {
  return {
    id: `custom:${c.id}`,
    rawId: c.id,
    isCustom: true,
    ownerId: c.addedBy,
    name: c.name ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    city: c.city ?? "",
    county: c.county ?? "",
    website: c.website ?? "",
    niche: c.niche ?? "",
    createdAt: c.createdAt,
  };
}

function feedToDup(f: FeedLeadInput): DuplicateLead {
  const isCustom = f.isCustom || f.id.startsWith("custom:");
  const rawId = f.id.startsWith("custom:") ? f.id.slice("custom:".length) : f.id;
  return {
    id: f.id,
    rawId,
    isCustom,
    name: f.name ?? "",
    email: f.email ?? "",
    phone: f.phone ?? "",
    city: f.city ?? "",
    county: f.county ?? "",
    website: f.website ?? "",
    niche: f.category ?? "",
  };
}

export async function findDuplicates(feedLeads: FeedLeadInput[] = []): Promise<DuplicateGroup[]> {
  const redis = getRedis();

  // Every user's custom leads.
  const userIndexKeys = (await redis.keys("custom_leads:*")) as string[];
  const all: DuplicateLead[] = [];
  const seenRawIds = new Set<string>();

  await Promise.all(
    userIndexKeys.map(async (idxKey) => {
      const userId = idxKey.replace("custom_leads:", "");
      const leads = await getCustomLeads(userId);
      for (const l of leads) {
        if (seenRawIds.has(l.id)) continue;
        seenRawIds.add(l.id);
        all.push(customToDup(l));
      }
    })
  );

  // Optional CSV feed — only add ones we haven't already captured as custom.
  for (const f of feedLeads) {
    const d = feedToDup(f);
    if (d.isCustom && seenRawIds.has(d.rawId)) continue;
    if (seenRawIds.has(d.id)) continue;
    seenRawIds.add(d.id);
    all.push(d);
  }

  // Bucket by each key type.
  const byEmail = new Map<string, DuplicateLead[]>();
  const byPhone = new Map<string, DuplicateLead[]>();
  const byNameCity = new Map<string, DuplicateLead[]>();

  const push = (map: Map<string, DuplicateLead[]>, key: string, lead: DuplicateLead) => {
    if (!key) return;
    const arr = map.get(key) ?? [];
    arr.push(lead);
    map.set(key, arr);
  };

  for (const lead of all) {
    push(byEmail, normEmail(lead.email), lead);
    push(byPhone, normPhone(lead.phone), lead);
    push(byNameCity, normNameCity(lead.name, lead.city), lead);
  }

  const groups: DuplicateGroup[] = [];
  const emit = (map: Map<string, DuplicateLead[]>, reason: DuplicateGroup["reason"]) => {
    for (const [key, leads] of map.entries()) {
      if (leads.length < 2) continue;
      // de-dupe leads within a group by feed id (a lead can't be its own dup)
      const uniq = Array.from(new Map(leads.map((l) => [l.id, l])).values());
      if (uniq.length < 2) continue;
      groups.push({ reason, key, leads: uniq });
    }
  };

  emit(byEmail, "email");
  emit(byPhone, "phone");
  emit(byNameCity, "name+city");

  // Strongest signal first (email > phone > fuzzy), then largest group.
  const order = { email: 0, phone: 1, "name+city": 2 } as const;
  groups.sort((a, b) => order[a.reason] - order[b.reason] || b.leads.length - a.leads.length);
  return groups;
}

// ─── mergeLeads ───────────────────────────────────────────────────────────────

export interface MergeResult {
  ok: boolean;
  merged: boolean;
  message: string;
  touched: string[]; // human-readable list of what was re-pointed (for audit/verify)
}

// Helper: re-point a custom lead's activity timeline from one feed-id onto the
// survivor. Activity is keyed `activity:<leadId>`; a custom lead may have entries
// under BOTH `activity:custom:<id>` (feed-stamped) and `activity:<id>` (inbound
// reply-stamped). We append loser entries to the survivor's timeline preserving
// order, then delete the loser's lists.
async function repointActivity(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const loserKeys = loser.isCustom
    ? [`custom:${loser.rawId}`, loser.rawId]
    : [loser.id];

  // Survivor timeline lives at activity:<survivorFeedId>. We import addActivity-
  // style raw writes via the redis client to preserve original timestamps/authors.
  const redis = getRedis();
  for (const lk of loserKeys) {
    const entries = await getActivity(lk); // newest-first
    if (!entries.length) continue;
    // rpush in chronological (oldest-first) order so the survivor list keeps
    // newest-at-head ordering after we re-prepend below.
    const chrono = [...entries].reverse();
    const survKey = `activity:${survivorFeedId}`;
    for (const e of chrono) {
      // lpush newest to head one at a time; since chrono is oldest-first, the
      // final head is the newest loser entry. This interleaves loser history
      // above the survivor's existing entries — acceptable: it's additive and
      // never drops a record.
      await redis.lpush(survKey, JSON.stringify(e));
    }
    await redis.ltrim(survKey, 0, 49);
    await redis.del(`activity:${lk}`);
    touched.push(`activity ${lk} -> ${survKey} (${entries.length})`);
  }
}

// Merge a global lead_actions record from loser into survivor. lead_actions is a
// single hash; field key = feed id. We combine counters (sum), keep the EARLIEST
// of the sticky set-once timestamps, and fill any survivor field that is missing.
async function repointActions(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const redis = getRedis();
  const KEY = "lead_actions";
  const loserKeys = loser.isCustom ? [`custom:${loser.rawId}`, loser.rawId] : [loser.id];

  const parse = (raw: unknown): LeadActions | null => {
    if (raw == null) return null;
    try {
      const p = typeof raw === "string" ? JSON.parse(raw) : raw;
      return p && typeof p === "object" ? (p as LeadActions) : null;
    } catch {
      return null;
    }
  };

  const survRaw = await redis.hget(KEY, survivorFeedId);
  let surv: LeadActions = parse(survRaw) ?? {};
  let changed = false;

  const earlier = (a?: string, b?: string) => {
    if (!a) return b;
    if (!b) return a;
    return a < b ? a : b;
  };
  const COUNTERS: (keyof LeadActions)[] = ["emailCount", "callCount", "openedCount", "clickedCount", "replyCount"];
  const STICKY: (keyof LeadActions)[] = ["interestedAt", "notInterestedAt", "respondedAt"];

  for (const lk of loserKeys) {
    const loserActions = parse(await redis.hget(KEY, lk));
    if (!loserActions) continue;
    const next: LeadActions = { ...surv };
    // sum counters
    for (const c of COUNTERS) {
      const sum = (Number(next[c] ?? 0) || 0) + (Number(loserActions[c] ?? 0) || 0);
      if (sum) (next as Record<string, unknown>)[c] = sum;
    }
    // earliest sticky timestamps
    for (const s of STICKY) {
      const e = earlier(next[s] as string | undefined, loserActions[s] as string | undefined);
      if (e) (next as Record<string, unknown>)[s] = e;
    }
    // fill any other field the survivor is missing
    for (const [k, v] of Object.entries(loserActions)) {
      if (COUNTERS.includes(k as keyof LeadActions) || STICKY.includes(k as keyof LeadActions)) continue;
      if (v !== undefined && v !== null && v !== "" && (next as Record<string, unknown>)[k] == null) {
        (next as Record<string, unknown>)[k] = v;
      }
    }
    surv = next;
    changed = true;
    await redis.hdel(KEY, lk);
    touched.push(`lead_actions ${lk} -> ${survivorFeedId}`);
  }

  if (changed) await redis.hset(KEY, { [survivorFeedId]: JSON.stringify(surv) });
}

// Move the latest-reply body (lead_replies hash) onto the survivor if the
// survivor has none. Otherwise keep the survivor's (it's the one the feed shows)
// and just drop the loser's so it can't resurface.
async function repointReplies(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const redis = getRedis();
  const KEY = "lead_replies";
  const loserKeys = loser.isCustom ? [`custom:${loser.rawId}`, loser.rawId] : [loser.id];
  const survHas = (await redis.hget(KEY, survivorFeedId)) != null;
  for (const lk of loserKeys) {
    const raw = await redis.hget(KEY, lk);
    if (raw == null) continue;
    if (!survHas) {
      await redis.hset(KEY, { [survivorFeedId]: typeof raw === "string" ? raw : JSON.stringify(raw) });
      touched.push(`lead_replies ${lk} -> ${survivorFeedId}`);
    }
    await redis.hdel(KEY, lk);
  }
}

// Copy per-user lead state from loser→survivor for EACH user who has loser state,
// but only fill fields the survivor's state is missing (survivor-wins). lead
// state is keyed `lead:<userId>:<feedId>`. We scan every user's loser-state key.
async function repointLeadState(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const redis = getRedis();
  const loserKeys = loser.isCustom ? [`custom:${loser.rawId}`, loser.rawId] : [loser.id];

  for (const lk of loserKeys) {
    const stateKeys = (await redis.keys(`lead:*:${lk}`)) as string[];
    for (const sk of stateKeys) {
      // sk = lead:<userId>:<lk>. Extract userId = everything between "lead:" and
      // ":<lk>". lk itself may contain no colons (custom:<id> has one); rebuild
      // the survivor key for the SAME user.
      const prefix = "lead:";
      const suffix = `:${lk}`;
      if (!sk.startsWith(prefix) || !sk.endsWith(suffix)) continue;
      const userId = sk.slice(prefix.length, sk.length - suffix.length);
      const loserState = (await redis.hgetall(sk)) as Record<string, unknown> | null;
      if (!loserState || !loserState.status) continue;

      const survKey = `lead:${userId}:${survivorFeedId}`;
      const survState = (await redis.hgetall(survKey)) as Record<string, unknown> | null;
      const fill: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(loserState)) {
        if (v !== undefined && v !== null && v !== "" && (!survState || survState[k] == null || survState[k] === "")) {
          fill[k] = v;
        }
      }
      if (Object.keys(fill).length) {
        await redis.hset(survKey, fill);
        touched.push(`lead state ${sk} -> ${survKey} (${Object.keys(fill).length} fields)`);
      }
      await redis.del(sk);
    }
  }
}

// Move a claim from loser→survivor only if the survivor is currently UNCLAIMED
// (never steal an active claim). Always release the loser's claim afterward.
async function repointClaims(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const redis = getRedis();
  const loserKeys = loser.isCustom ? [`custom:${loser.rawId}`, loser.rawId] : [loser.id];
  const survClaimed = (await redis.hgetall(`claim:${survivorFeedId}`)) as { leadId?: string } | null;
  const survivorAlreadyClaimed = !!(survClaimed && survClaimed.leadId);

  for (const lk of loserKeys) {
    const claim = (await redis.hgetall(`claim:${lk}`)) as
      | { leadId?: string; userId?: string; repName?: string; claimedAt?: string }
      | null;
    if (!claim || !claim.leadId) continue;
    if (!survivorAlreadyClaimed) {
      await redis.hset(`claim:${survivorFeedId}`, {
        leadId: survivorFeedId,
        userId: claim.userId ?? "",
        repName: claim.repName ?? "",
        claimedAt: claim.claimedAt ?? new Date().toISOString(),
      });
      await redis.expire(`claim:${survivorFeedId}`, 60 * 60 * 24 * 30);
      if (claim.userId) await redis.sadd(`claimed_by_user:${claim.userId}`, survivorFeedId);
      touched.push(`claim ${lk} -> ${survivorFeedId}`);
    }
    // release the loser claim either way
    await redis.del(`claim:${lk}`);
    if (claim.userId) await redis.srem(`claimed_by_user:${claim.userId}`, lk);
  }
}

// Re-key the loser's submissions onto the survivor. submission id is
// `<userId>:<feedId>`, indexed in the zset submissions:index by send time. We
// only move a loser submission if the survivor has no submission for that same
// user (don't create a duplicate accepted-deal record).
async function repointSubmissions(survivorFeedId: string, loser: DuplicateLead, touched: string[]) {
  const redis = getRedis();
  const loserKeys = loser.isCustom ? [`custom:${loser.rawId}`, loser.rawId] : [loser.id];

  for (const lk of loserKeys) {
    const subKeys = (await redis.keys(`submission:*:${lk}`)) as string[];
    for (const skKey of subKeys) {
      const raw = (await redis.hgetall(skKey)) as Record<string, unknown> | null;
      if (!raw || !raw.id) continue;
      const userId = String(raw.userId ?? "");
      if (!userId) continue;
      const newId = `${userId}:${survivorFeedId}`;
      const survExists = await redis.exists(`submission:${newId}`);
      if (!survExists) {
        const moved = { ...raw, id: newId, leadId: survivorFeedId };
        await redis.hset(`submission:${newId}`, moved as Record<string, unknown>);
        // preserve original score (send time) if present, else now
        await redis.zadd("submissions:index", { score: Date.now(), member: newId });
        touched.push(`submission ${raw.id} -> ${newId}`);
      }
      // drop the loser submission + its index entry
      await redis.del(skKey);
      await redis.zrem("submissions:index", String(raw.id));
    }
  }
}

export async function mergeLeads(survivorId: string, loserId: string): Promise<MergeResult> {
  const touched: string[] = [];

  // ── Guards ──
  if (!survivorId || !loserId) {
    return { ok: false, merged: false, message: "survivorId and loserId are required", touched };
  }
  if (survivorId === loserId) {
    return { ok: true, merged: false, message: "Survivor and loser are the same lead — nothing to merge", touched };
  }

  const loserIsCustom = loserId.startsWith("custom:");
  if (!loserIsCustom) {
    // Refuse to merge AWAY from a CSV lead — there is no custom_lead row to
    // delete and we'd orphan its stamps. Caller must pick the custom lead as the
    // loser (merge into the CSV/other lead as survivor).
    return {
      ok: false,
      merged: false,
      message:
        "Only a custom lead can be the loser. A CSV lead has no deletable record — pick the custom duplicate as the loser (merge it INTO the other).",
      touched,
    };
  }

  const loserRawId = loserId.slice("custom:".length);

  // Confirm the loser custom lead actually exists before we move anything.
  const redis = getRedis();
  const loserHash = (await redis.hgetall(`custom_lead:${loserRawId}`)) as unknown as CustomLead | null;
  if (!loserHash || !loserHash.id) {
    return { ok: false, merged: false, message: "Loser custom lead not found", touched };
  }

  const loser: DuplicateLead = {
    id: loserId,
    rawId: loserRawId,
    isCustom: true,
    ownerId: loserHash.addedBy,
    name: loserHash.name ?? "",
    email: loserHash.email ?? "",
    phone: loserHash.phone ?? "",
    city: loserHash.city ?? "",
    county: loserHash.county ?? "",
    website: loserHash.website ?? "",
    niche: loserHash.niche ?? "",
    createdAt: loserHash.createdAt,
  };

  // ── Re-point everything onto the survivor (order matters: data first, delete last) ──
  await repointActions(survivorId, loser, touched);
  await repointReplies(survivorId, loser, touched);
  await repointActivity(survivorId, loser, touched);
  await repointLeadState(survivorId, loser, touched);
  await repointClaims(survivorId, loser, touched);
  await repointSubmissions(survivorId, loser, touched);

  // ── Finally remove the LOSER custom lead (never the survivor) ──
  await redis.del(`custom_lead:${loserRawId}`);
  if (loser.ownerId) await redis.srem(`custom_leads:${loser.ownerId}`, loserRawId);
  // also remove from any other user's index defensively (id is globally unique,
  // but the index set is per-user — a stray membership would resurface a ghost).
  const allIndexKeys = (await redis.keys("custom_leads:*")) as string[];
  for (const idxKey of allIndexKeys) {
    await redis.srem(idxKey, loserRawId);
  }
  touched.push(`removed custom_lead:${loserRawId}`);

  return {
    ok: true,
    merged: true,
    message: `Merged "${loser.name || loserRawId}" into ${survivorId}`,
    touched,
  };
}
