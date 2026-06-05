// Redis-backed CRM store (power-dialer leads, activities, reps).
//
// Persistence runs on Upstash Redis — the same durable backend the rest of the
// app uses (`src/lib/db.ts`). This replaces the previous `node:sqlite` store,
// which wrote to a local file (`.data/crm.db`) and therefore reset on every
// serverless cold start (and could fail outright on Vercel's read-only FS).
//
// The public surface is identical to before — getLeads / getLead / updateLead /
// logDisposition / getStats / … — except every function is now `async`, since
// Redis I/O is. Callers under /api/crm already `await` it.
//
// Key layout (prefixed `crm:` to stay clear of db.ts's `lead:`/`user:` keys):
//   crm:rep:<id>          hash   — a caller
//   crm:reps:index        set    — all rep ids
//   crm:lead:<id>         hash   — a lead (signals JSON-encoded; activities live apart)
//   crm:leads:index       set    — all lead ids
//   crm:activity:<leadId> list   — JSON activities, oldest→newest (rpush/lrange)
//   crm:seq               int    — monotonic counter for generated ids
//   crm:seeded            flag    — set once demo data has been seeded

import { getRedis } from "@/lib/redis";
import type {
  Lead,
  Activity,
  Disposition,
  PipelineStage,
  Rep,
  CrmStats,
} from "./types";
import { PIPELINE_STAGES } from "./types";
import { buildSeedLeads, SEED_REPS } from "./seed";

const KEY = {
  rep: (id: string) => `crm:rep:${id}`,
  reps: "crm:reps:index",
  lead: (id: string) => `crm:lead:${id}`,
  leads: "crm:leads:index",
  acts: (leadId: string) => `crm:activity:${leadId}`,
  seq: "crm:seq",
  seeded: "crm:seeded",
} as const;

// ─── Serialization ─────────────────────────────────────────────────────────
// Redis hashes hold flat string/number/bool fields. `signals` is a nested
// object so it's JSON-encoded; `activities` are stored separately as a list.
// `undefined` fields are dropped (Redis can't store them); optional timestamps
// that are explicitly `null` are kept as null.

function leadToHash(lead: Lead): Record<string, unknown> {
  const { activities: _activities, signals, ...rest } = lead;
  const flat: Record<string, unknown> = { ...rest, signals: JSON.stringify(signals) };
  for (const k of Object.keys(flat)) {
    if (flat[k] === undefined) delete flat[k];
  }
  return flat;
}

interface LeadHash extends Record<string, unknown> {
  id?: string;
  signals?: string | object;
}

function hashToLead(h: LeadHash, activities: Activity[]): Lead {
  const signals =
    typeof h.signals === "string"
      ? (JSON.parse(h.signals) as Lead["signals"])
      : (h.signals as Lead["signals"]);
  return {
    id: String(h.id),
    business: String(h.business),
    contactName: (h.contactName as string | undefined) ?? undefined,
    phone: String(h.phone),
    email: (h.email as string | undefined) ?? undefined,
    website: (h.website as string | undefined) ?? undefined,
    industry: String(h.industry),
    city: String(h.city ?? ""),
    state: String(h.state ?? "CA"),
    signals,
    heatScore: Number(h.heatScore ?? 0),
    stage: h.stage as PipelineStage,
    ownerRepId: (h.ownerRepId as string | undefined) ?? undefined,
    estValue: Number(h.estValue ?? 0),
    source: String(h.source ?? "Manual"),
    callbackAt: (h.callbackAt as string | null | undefined) ?? null,
    attempts: Number(h.attempts ?? 0),
    lastContactedAt: (h.lastContactedAt as string | null | undefined) ?? null,
    createdAt: String(h.createdAt),
    activities,
  };
}

// ─── Seeding ─────────────────────────────────────────────────────────────────
// Seed demo reps + leads exactly once. An NX lock keeps concurrent serverless
// invocations from double-seeding. (Demo data only — a partial seed after a
// mid-flight crash is acceptable and self-evident.)

async function ensureSeeded(): Promise<void> {
  const redis = getRedis();
  if (await redis.get(KEY.seeded)) return;
  const lock = await redis.set(KEY.seeded, "1", { nx: true });
  if (lock !== "OK") return; // another invocation is seeding

  for (const rep of SEED_REPS) {
    await redis.hset(KEY.rep(rep.id), rep as unknown as Record<string, unknown>);
    await redis.sadd(KEY.reps, rep.id);
  }
  for (const lead of buildSeedLeads()) {
    await writeLead(lead);
    if (lead.activities.length) {
      await redis.rpush(KEY.acts(lead.id), ...lead.activities.map((a) => JSON.stringify(a)));
    }
  }
}

// Persist a lead's hash + index membership (does not touch its activity list).
async function writeLead(lead: Lead): Promise<void> {
  const redis = getRedis();
  await redis.hset(KEY.lead(lead.id), leadToHash(lead));
  await redis.sadd(KEY.leads, lead.id);
}

async function appendActivity(leadId: string, activity: Activity): Promise<void> {
  await getRedis().rpush(KEY.acts(leadId), JSON.stringify(activity));
}

async function loadActivities(leadId: string): Promise<Activity[]> {
  const items = await getRedis().lrange(KEY.acts(leadId), 0, -1);
  return (items as unknown[]).map((raw) =>
    typeof raw === "string" ? (JSON.parse(raw) as Activity) : (raw as Activity),
  );
}

async function nextId(prefix: string): Promise<string> {
  const seq = await getRedis().incr(KEY.seq);
  return `${prefix}_${seq.toString(36)}${seq}`;
}

// Load every lead with its activities attached.
async function allLeads(): Promise<Lead[]> {
  await ensureSeeded();
  const redis = getRedis();
  const ids = (await redis.smembers(KEY.leads)) as string[];
  const leads = await Promise.all(
    ids.map(async (id) => {
      const [h, acts] = await Promise.all([
        redis.hgetall(KEY.lead(id)) as Promise<LeadHash | null>,
        loadActivities(id),
      ]);
      if (!h || !h.id) return null;
      return hashToLead(h, acts);
    }),
  );
  return leads.filter(Boolean) as Lead[];
}

// ─── Reads ─────────────────────────────────────────────────────────────────

export async function getReps(): Promise<Rep[]> {
  await ensureSeeded();
  const redis = getRedis();
  const ids = (await redis.smembers(KEY.reps)) as string[];
  const reps = await Promise.all(
    ids.map((id) => redis.hgetall(KEY.rep(id)) as Promise<Rep | null>),
  );
  // Stable order (smembers is unordered) so "first rep" defaults are deterministic.
  return (reps.filter(Boolean) as Rep[]).sort((a, b) => a.id.localeCompare(b.id));
}

export async function getLeads(): Promise<Lead[]> {
  // Hottest first; callbacks that are due bubble up regardless of heat.
  const now = Date.now();
  const leads = await allLeads();
  return leads.sort((a, b) => {
    const aDue = a.callbackAt && new Date(a.callbackAt).getTime() <= now ? 1 : 0;
    const bDue = b.callbackAt && new Date(b.callbackAt).getTime() <= now ? 1 : 0;
    if (aDue !== bDue) return bDue - aDue;
    return b.heatScore - a.heatScore;
  });
}

export async function getLead(id: string): Promise<Lead | undefined> {
  await ensureSeeded();
  const redis = getRedis();
  const [h, acts] = await Promise.all([
    redis.hgetall(KEY.lead(id)) as Promise<LeadHash | null>,
    loadActivities(id),
  ]);
  if (!h || !h.id) return undefined;
  return hashToLead(h, acts);
}

// The power-dialer "next up" queue: workable stages only, hottest first,
// skipping anything that's lost/won/do-not-call.
export async function getQueue(): Promise<Lead[]> {
  const workable: PipelineStage[] = [
    "new",
    "attempting",
    "contacted",
    "callback_scheduled",
  ];
  const leads = await getLeads();
  return leads.filter((l) => workable.includes(l.stage));
}

// ─── Writes ──────────────────────────────────────────────────────────────────

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | undefined> {
  const lead = await getLead(id);
  if (!lead) return undefined;
  Object.assign(lead, patch);
  await writeLead(lead);
  return lead;
}

export async function addNote(leadId: string, body: string, repId?: string): Promise<Activity | undefined> {
  const lead = await getLead(leadId);
  if (!lead) return undefined;
  const activity: Activity = {
    id: await nextId("act"),
    leadId,
    type: "note",
    body,
    repId,
    createdAt: new Date().toISOString(),
  };
  await appendActivity(leadId, activity);
  return activity;
}

// Record a sent email on the lead's timeline. Keeps the lead in its current
// stage (an email is a touch, not a disposition) but updates last-contacted.
export async function logEmail(
  leadId: string,
  input: { subject: string; body: string; repId?: string },
): Promise<Lead | undefined> {
  const lead = await getLead(leadId);
  if (!lead) return undefined;
  const now = new Date().toISOString();
  const activity: Activity = {
    id: await nextId("act"),
    leadId,
    type: "email",
    body: `Subject: ${input.subject}\n\n${input.body}`,
    repId: input.repId,
    createdAt: now,
  };
  await appendActivity(leadId, activity);
  lead.activities.push(activity);
  lead.lastContactedAt = now;
  if (input.repId) lead.ownerRepId = input.repId;
  await writeLead(lead);
  return lead;
}

// Map a call disposition onto the resulting pipeline stage.
function stageForDisposition(d: Disposition, current: PipelineStage): PipelineStage {
  switch (d) {
    case "connected":
      return current === "demo_booked" || current === "won" ? current : "contacted";
    case "booked":
      return "demo_booked";
    case "callback":
      return "callback_scheduled";
    case "not_interested":
    case "do_not_call":
    case "wrong_number":
      return "lost";
    case "voicemail":
    case "no_answer":
      return current === "new" ? "attempting" : current;
    default:
      return current;
  }
}

export interface DispositionInput {
  disposition: Disposition;
  note?: string;
  durationSec?: number;
  repId?: string;
  callbackAt?: string | null;
}

export async function logDisposition(leadId: string, input: DispositionInput): Promise<Lead | undefined> {
  const lead = await getLead(leadId);
  if (!lead) return undefined;

  const now = new Date().toISOString();
  const activity: Activity = {
    id: await nextId("act"),
    leadId,
    type: "call",
    disposition: input.disposition,
    body: input.note,
    durationSec: input.durationSec,
    repId: input.repId,
    createdAt: now,
  };
  await appendActivity(leadId, activity);
  lead.activities.push(activity);

  lead.attempts += 1;
  lead.lastContactedAt = now;
  lead.stage = stageForDisposition(input.disposition, lead.stage);
  if (input.repId) lead.ownerRepId = input.repId;

  if (input.disposition === "callback") {
    lead.callbackAt = input.callbackAt ?? new Date(Date.now() + 24 * 3600_000).toISOString();
  } else if (input.disposition !== "no_answer" && input.disposition !== "voicemail") {
    // A real conversation clears any stale callback flag.
    lead.callbackAt = null;
  }

  await writeLead(lead);
  return lead;
}

export async function createLead(input: Partial<Lead> & { business: string; phone: string }): Promise<Lead> {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: await nextId("lead"),
    business: input.business,
    contactName: input.contactName,
    phone: input.phone,
    email: input.email,
    website: input.website,
    industry: input.industry ?? "Unknown",
    city: input.city ?? "",
    state: input.state ?? "CA",
    signals: input.signals ?? {
      noWebsite: false,
      hasSSL: true,
      speedScore: null,
      mobileScore: null,
      brokenLinks: 0,
      notMobileFriendly: false,
      copyrightYear: null,
    },
    heatScore: input.heatScore ?? 0,
    stage: input.stage ?? "new",
    ownerRepId: input.ownerRepId,
    estValue: input.estValue ?? 3000,
    source: input.source ?? "Manual",
    callbackAt: input.callbackAt ?? null,
    attempts: 0,
    lastContactedAt: null,
    createdAt: now,
    activities: [],
  };
  await writeLead(lead);
  return lead;
}

// ─── Aggregates ──────────────────────────────────────────────────────────────

export async function getStats(): Promise<CrmStats> {
  const leads = await allLeads();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let callsToday = 0;
  let emailsToday = 0;
  let connectsToday = 0;
  let bookedToday = 0;
  let wonThisMonth = 0;

  const stageCounts = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [s, 0]),
  ) as Record<PipelineStage, number>;

  let pipelineValue = 0;
  let callbacksDue = 0;

  for (const lead of leads) {
    stageCounts[lead.stage] += 1;
    if (lead.stage !== "lost" && lead.stage !== "won") {
      pipelineValue += lead.estValue;
    }
    if (lead.stage === "won" && new Date(lead.lastContactedAt ?? lead.createdAt).getTime() >= startOfMonth) {
      wonThisMonth += 1;
    }
    if (lead.callbackAt && new Date(lead.callbackAt).getTime() <= now.getTime()) {
      callbacksDue += 1;
    }

    for (const a of lead.activities) {
      const t = new Date(a.createdAt).getTime();
      if (t < startOfDay) continue;
      if (a.type === "email") {
        emailsToday += 1;
        continue;
      }
      if (a.type !== "call") continue;
      callsToday += 1;
      if (a.disposition === "connected" || a.disposition === "booked") connectsToday += 1;
      if (a.disposition === "booked") bookedToday += 1;
    }
  }

  return {
    totalLeads: leads.length,
    callsToday,
    emailsToday,
    connectsToday,
    connectRate: callsToday ? connectsToday / callsToday : 0,
    bookedToday,
    wonThisMonth,
    pipelineValue,
    stageCounts,
    callbacksDue,
  };
}

// Per-rep rollups for the admin leaderboard.
export interface RepStat {
  rep: Rep;
  calls: number;
  connects: number;
  booked: number;
  connectRate: number;
}

export async function getRepStats(): Promise<RepStat[]> {
  const [leads, reps] = await Promise.all([allLeads(), getReps()]);
  const map = new Map<string, { calls: number; connects: number; booked: number }>();
  for (const rep of reps) map.set(rep.id, { calls: 0, connects: 0, booked: 0 });

  for (const lead of leads) {
    for (const a of lead.activities) {
      if (a.type !== "call" || !a.repId) continue;
      const m = map.get(a.repId);
      if (!m) continue;
      m.calls += 1;
      if (a.disposition === "connected" || a.disposition === "booked") m.connects += 1;
      if (a.disposition === "booked") m.booked += 1;
    }
  }

  return reps.map((rep) => {
    const m = map.get(rep.id)!;
    return {
      rep,
      calls: m.calls,
      connects: m.connects,
      booked: m.booked,
      connectRate: m.calls ? m.connects / m.calls : 0,
    };
  });
}
