// Neon Postgres-backed CRM store (async seam).
//
// Production backend behind the same `CrmStore` contract as store.sqlite.ts.
// Every exported function has the identical async signature, so `./store` can
// swap this in transparently — callers only `await`.
//
// Connection: the Neon HTTP client (`neon(DATABASE_URL)`) is created LAZILY,
// inside each function via `sql()`. Importing this module never touches the
// network or throws when DATABASE_URL is absent — that lets the selector in
// `./store` import both impls and pick at call time.
//
// Multi-statement writes that must be atomic (createLead + activity-less insert
// is single-statement; logDisposition writes lead UPDATE + activity INSERT) use
// `client.transaction([...])`, which Neon runs in a single batched, atomic
// request.
//
// Dialect notes vs SQLite (store.sqlite.ts):
//   * Identifiers are camelCase, so they are double-quoted in every statement.
//   * INSERT OR REPLACE → INSERT ... ON CONFLICT (id) DO UPDATE.
//   * `signals` is JSONB; we pass a JS object and read it back already parsed.
//   * Timestamps are TIMESTAMPTZ; readers normalize to ISO via toISOString().
//   * Aggregations are computed in JS (mirroring SQLite) to keep the daily /
//     monthly boundary logic identical to the SQLite path.

import type {
  Lead,
  Activity,
  ActivityType,
  Disposition,
  PipelineStage,
  Rep,
  CrmStats,
} from "./types";
import { PIPELINE_STAGES } from "./types";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// --- Lazy client -----------------------------------------------------------

type Sql = NeonQueryFunction<false, false>;

const g = globalThis as unknown as { __crmNeon?: Sql };

function sql(): Sql {
  if (!g.__crmNeon) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set — the Postgres CRM store cannot connect.",
      );
    }
    // `neon` is imported statically (importing it is side-effect-free and does
    // not connect), but the client itself is created lazily here so importing
    // this module without DATABASE_URL never throws.
    g.__crmNeon = neon(url);
  }
  return g.__crmNeon;
}

// --- Row types -------------------------------------------------------------

interface LeadRow {
  id: string;
  business: string;
  contactName: string | null;
  phone: string;
  email: string | null;
  website: string | null;
  industry: string;
  city: string;
  state: string;
  signals: unknown; // JSONB → already-parsed object
  heatScore: number | string;
  stage: string;
  ownerRepId: string | null;
  estValue: number | string;
  source: string;
  callbackAt: string | Date | null;
  attempts: number | string;
  lastContactedAt: string | Date | null;
  createdAt: string | Date;
}

interface ActivityRow {
  id: string;
  leadId: string;
  type: string;
  disposition: string | null;
  body: string | null;
  durationSec: number | string | null;
  repId: string | null;
  createdAt: string | Date;
}

// Normalize a TIMESTAMPTZ value (Neon returns it as a string) to an ISO string,
// matching what the app and the SQLite path produce/store.
function toIso(v: string | Date | null): string | null {
  if (v === null || v === undefined) return null;
  return new Date(v).toISOString();
}

// JSONB may arrive parsed (object) or, defensively, as a JSON string.
function parseSignals(v: unknown): Lead["signals"] {
  if (typeof v === "string") return JSON.parse(v) as Lead["signals"];
  return v as Lead["signals"];
}

function rowToActivity(r: ActivityRow): Activity {
  return {
    id: r.id,
    leadId: r.leadId,
    type: r.type as ActivityType,
    disposition: (r.disposition as Disposition | null) ?? undefined,
    body: r.body ?? undefined,
    durationSec: r.durationSec === null ? undefined : Number(r.durationSec),
    repId: r.repId ?? undefined,
    createdAt: toIso(r.createdAt) as string,
  };
}

function rowToLead(r: LeadRow, activities: Activity[]): Lead {
  return {
    id: r.id,
    business: r.business,
    contactName: r.contactName ?? undefined,
    phone: r.phone,
    email: r.email ?? undefined,
    website: r.website ?? undefined,
    industry: r.industry,
    city: r.city,
    state: r.state,
    signals: parseSignals(r.signals),
    heatScore: Number(r.heatScore),
    stage: r.stage as PipelineStage,
    ownerRepId: r.ownerRepId ?? undefined,
    estValue: Number(r.estValue),
    source: r.source,
    callbackAt: toIso(r.callbackAt),
    attempts: Number(r.attempts),
    lastContactedAt: toIso(r.lastContactedAt),
    createdAt: toIso(r.createdAt) as string,
    activities,
  };
}

function nz<T>(v: T | undefined): T | null {
  return v === undefined ? null : v;
}

function nextId(prefix: string): string {
  // App-generated id, matching the SQLite format `<prefix>_<base36ts><n>`.
  // A random suffix replaces SQLite's meta-table sequence (no shared counter
  // across stateless serverless invocations), keeping ids unique + sortable.
  const rand = Math.floor(Math.random() * 1_000_000);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

// --- Internal loaders ------------------------------------------------------

async function loadLead(id: string): Promise<Lead | undefined> {
  const s = sql();
  const leadRows = (await s`SELECT * FROM leads WHERE id = ${id}`) as unknown as LeadRow[];
  const r = leadRows[0];
  if (!r) return undefined;
  const actRows = (await s`
    SELECT * FROM activities
    WHERE "leadId" = ${id}
    ORDER BY "createdAt" ASC, id ASC
  `) as unknown as ActivityRow[];
  return rowToLead(r, actRows.map(rowToActivity));
}

async function loadAllLeads(): Promise<Lead[]> {
  const s = sql();
  const leadRows = (await s`SELECT * FROM leads`) as unknown as LeadRow[];
  const actRows = (await s`
    SELECT * FROM activities ORDER BY "createdAt" ASC, id ASC
  `) as unknown as ActivityRow[];

  const byLead = new Map<string, Activity[]>();
  for (const a of actRows) {
    const act = rowToActivity(a);
    const list = byLead.get(act.leadId);
    if (list) list.push(act);
    else byLead.set(act.leadId, [act]);
  }

  return leadRows.map((r) => rowToLead(r, byLead.get(r.id) ?? []));
}

// --- Reads -----------------------------------------------------------------

export async function getReps(): Promise<Rep[]> {
  const s = sql();
  return (await s`SELECT * FROM reps`) as unknown as Rep[];
}

export async function getLeads(): Promise<Lead[]> {
  // Hottest first; callbacks that are due bubble up regardless of heat.
  const now = Date.now();
  return (await loadAllLeads()).sort((a, b) => {
    const aDue = a.callbackAt && new Date(a.callbackAt).getTime() <= now ? 1 : 0;
    const bDue = b.callbackAt && new Date(b.callbackAt).getTime() <= now ? 1 : 0;
    if (aDue !== bDue) return bDue - aDue;
    return b.heatScore - a.heatScore;
  });
}

export async function getLead(id: string): Promise<Lead | undefined> {
  return loadLead(id);
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
  return (await getLeads()).filter((l) => workable.includes(l.stage));
}

// --- Writes ----------------------------------------------------------------

async function persistLead(lead: Lead): Promise<void> {
  const s = sql();
  await s`
    UPDATE leads SET
      business = ${lead.business},
      "contactName" = ${nz(lead.contactName)},
      phone = ${lead.phone},
      email = ${nz(lead.email)},
      website = ${nz(lead.website)},
      industry = ${lead.industry},
      city = ${lead.city},
      state = ${lead.state},
      signals = ${JSON.stringify(lead.signals)}::jsonb,
      "heatScore" = ${lead.heatScore},
      stage = ${lead.stage},
      "ownerRepId" = ${nz(lead.ownerRepId)},
      "estValue" = ${lead.estValue},
      source = ${lead.source},
      "callbackAt" = ${nz(lead.callbackAt)},
      attempts = ${lead.attempts},
      "lastContactedAt" = ${nz(lead.lastContactedAt)}
    WHERE id = ${lead.id}
  `;
}

export async function updateLead(
  id: string,
  patch: Partial<Lead>,
): Promise<Lead | undefined> {
  const lead = await loadLead(id);
  if (!lead) return undefined;
  Object.assign(lead, patch);
  await persistLead(lead);
  return lead;
}

export async function addNote(
  leadId: string,
  body: string,
  repId?: string,
): Promise<Activity | undefined> {
  const lead = await loadLead(leadId);
  if (!lead) return undefined;
  const s = sql();
  const activity: Activity = {
    id: nextId("act"),
    leadId,
    type: "note",
    body,
    repId,
    createdAt: new Date().toISOString(),
  };
  await s`
    INSERT INTO activities (id, "leadId", type, disposition, body, "durationSec", "repId", "createdAt")
    VALUES (
      ${activity.id}, ${activity.leadId}, ${activity.type}, ${null},
      ${nz(activity.body)}, ${null}, ${nz(activity.repId)}, ${activity.createdAt}
    )
  `;
  return activity;
}

// Record a sent email on the lead's timeline. Keeps the lead in its current
// stage (an email is a touch, not a disposition) but updates last-contacted.
//
// NOTE: unlike the SQLite path (which only mutates the returned object in
// memory), Postgres has no per-request shared connection cache to carry that
// mutation, so this implementation PERSISTS the email activity + the
// last-contacted/owner update atomically. See blockers in the task summary.
export async function logEmail(
  leadId: string,
  input: { subject: string; body: string; repId?: string },
): Promise<Lead | undefined> {
  const lead = await loadLead(leadId);
  if (!lead) return undefined;
  const s = sql();
  const now = new Date().toISOString();
  const activity: Activity = {
    id: nextId("act"),
    leadId,
    type: "email",
    body: `Subject: ${input.subject}\n\n${input.body}`,
    repId: input.repId,
    createdAt: now,
  };
  lead.activities.push(activity);
  lead.lastContactedAt = now;
  if (input.repId) lead.ownerRepId = input.repId;

  await s.transaction([
    s`
      INSERT INTO activities (id, "leadId", type, disposition, body, "durationSec", "repId", "createdAt")
      VALUES (
        ${activity.id}, ${activity.leadId}, ${activity.type}, ${null},
        ${nz(activity.body)}, ${null}, ${nz(activity.repId)}, ${activity.createdAt}
      )
    `,
    s`
      UPDATE leads SET
        "lastContactedAt" = ${now},
        "ownerRepId" = ${nz(lead.ownerRepId)}
      WHERE id = ${leadId}
    `,
  ]);
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

export async function logDisposition(
  leadId: string,
  input: DispositionInput,
): Promise<Lead | undefined> {
  const lead = await loadLead(leadId);
  if (!lead) return undefined;

  const s = sql();
  const now = new Date().toISOString();
  const activity: Activity = {
    id: nextId("act"),
    leadId,
    type: "call",
    disposition: input.disposition,
    body: input.note,
    durationSec: input.durationSec,
    repId: input.repId,
    createdAt: now,
  };
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

  // The activity INSERT and the lead UPDATE commit atomically.
  await s.transaction([
    s`
      INSERT INTO activities (id, "leadId", type, disposition, body, "durationSec", "repId", "createdAt")
      VALUES (
        ${activity.id}, ${activity.leadId}, ${activity.type}, ${nz(activity.disposition)},
        ${nz(activity.body)}, ${nz(activity.durationSec)}, ${nz(activity.repId)}, ${activity.createdAt}
      )
    `,
    s`
      UPDATE leads SET
        business = ${lead.business},
        "contactName" = ${nz(lead.contactName)},
        phone = ${lead.phone},
        email = ${nz(lead.email)},
        website = ${nz(lead.website)},
        industry = ${lead.industry},
        city = ${lead.city},
        state = ${lead.state},
        signals = ${JSON.stringify(lead.signals)}::jsonb,
        "heatScore" = ${lead.heatScore},
        stage = ${lead.stage},
        "ownerRepId" = ${nz(lead.ownerRepId)},
        "estValue" = ${lead.estValue},
        source = ${lead.source},
        "callbackAt" = ${nz(lead.callbackAt)},
        attempts = ${lead.attempts},
        "lastContactedAt" = ${nz(lead.lastContactedAt)}
      WHERE id = ${lead.id}
    `,
  ]);
  return lead;
}

export async function createLead(
  input: Partial<Lead> & { business: string; phone: string },
): Promise<Lead> {
  const s = sql();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: nextId("lead"),
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

  // Single-statement INSERT (no activity is created here, mirroring SQLite).
  // ON CONFLICT keeps it idempotent if the same generated id ever collides.
  await s`
    INSERT INTO leads (
      id, business, "contactName", phone, email, website, industry, city, state,
      signals, "heatScore", stage, "ownerRepId", "estValue", source, "callbackAt",
      attempts, "lastContactedAt", "createdAt"
    ) VALUES (
      ${lead.id}, ${lead.business}, ${nz(lead.contactName)}, ${lead.phone},
      ${nz(lead.email)}, ${nz(lead.website)}, ${lead.industry}, ${lead.city},
      ${lead.state}, ${JSON.stringify(lead.signals)}::jsonb, ${lead.heatScore},
      ${lead.stage}, ${nz(lead.ownerRepId)}, ${lead.estValue}, ${lead.source},
      ${nz(lead.callbackAt)}, ${lead.attempts}, ${nz(lead.lastContactedAt)},
      ${lead.createdAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      business = EXCLUDED.business,
      "contactName" = EXCLUDED."contactName",
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      website = EXCLUDED.website,
      industry = EXCLUDED.industry,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      signals = EXCLUDED.signals,
      "heatScore" = EXCLUDED."heatScore",
      stage = EXCLUDED.stage,
      "ownerRepId" = EXCLUDED."ownerRepId",
      "estValue" = EXCLUDED."estValue",
      source = EXCLUDED.source,
      "callbackAt" = EXCLUDED."callbackAt",
      attempts = EXCLUDED.attempts,
      "lastContactedAt" = EXCLUDED."lastContactedAt"
  `;
  return lead;
}

// --- Aggregates ------------------------------------------------------------

export async function getStats(): Promise<CrmStats> {
  const leads = await loadAllLeads();
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
  const leads = await loadAllLeads();
  const reps = await getReps();
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
