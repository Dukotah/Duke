// In-memory CRM store.
//
// There is no database wired into this project yet, so leads/activities live
// in a module-level singleton seeded on first access. It is intentionally
// hidden behind this small interface (getLeads / updateLead / logActivity /
// getStats) so it can be swapped for Postgres/SQLite later without touching
// the API routes or UI.
//
// A `globalThis` cache keeps the data stable across Next's dev hot-reloads.

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

interface CrmDB {
  leads: Lead[];
  reps: Rep[];
  seq: number;
}

const g = globalThis as unknown as { __crmDb?: CrmDB };

function db(): CrmDB {
  if (!g.__crmDb) {
    g.__crmDb = { leads: buildSeedLeads(), reps: SEED_REPS, seq: 1 };
  }
  return g.__crmDb;
}

function nextId(prefix: string): string {
  const d = db();
  d.seq += 1;
  return `${prefix}_${Date.now().toString(36)}${d.seq}`;
}

// --- Reads -----------------------------------------------------------------

export function getReps(): Rep[] {
  return db().reps;
}

export function getLeads(): Lead[] {
  // Hottest first; callbacks that are due bubble up regardless of heat.
  const now = Date.now();
  return [...db().leads].sort((a, b) => {
    const aDue = a.callbackAt && new Date(a.callbackAt).getTime() <= now ? 1 : 0;
    const bDue = b.callbackAt && new Date(b.callbackAt).getTime() <= now ? 1 : 0;
    if (aDue !== bDue) return bDue - aDue;
    return b.heatScore - a.heatScore;
  });
}

export function getLead(id: string): Lead | undefined {
  return db().leads.find((l) => l.id === id);
}

// The power-dialer "next up" queue: workable stages only, hottest first,
// skipping anything that's lost/won/do-not-call.
export function getQueue(): Lead[] {
  const workable: PipelineStage[] = [
    "new",
    "attempting",
    "contacted",
    "callback_scheduled",
  ];
  return getLeads().filter((l) => workable.includes(l.stage));
}

// --- Writes ----------------------------------------------------------------

export function updateLead(id: string, patch: Partial<Lead>): Lead | undefined {
  const lead = getLead(id);
  if (!lead) return undefined;
  Object.assign(lead, patch);
  return lead;
}

export function addNote(leadId: string, body: string, repId?: string): Activity | undefined {
  const lead = getLead(leadId);
  if (!lead) return undefined;
  const activity: Activity = {
    id: nextId("act"),
    leadId,
    type: "note",
    body,
    repId,
    createdAt: new Date().toISOString(),
  };
  lead.activities.push(activity);
  return activity;
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

export function logDisposition(leadId: string, input: DispositionInput): Lead | undefined {
  const lead = getLead(leadId);
  if (!lead) return undefined;

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

  return lead;
}

export function createLead(input: Partial<Lead> & { business: string; phone: string }): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    id: nextId("lead"),
    business: input.business,
    contactName: input.contactName,
    phone: input.phone,
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
  db().leads.push(lead);
  return lead;
}

// --- Aggregates ------------------------------------------------------------

export function getStats(): CrmStats {
  const leads = db().leads;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let callsToday = 0;
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
      if (a.type !== "call") continue;
      const t = new Date(a.createdAt).getTime();
      if (t >= startOfDay) {
        callsToday += 1;
        if (a.disposition === "connected" || a.disposition === "booked") connectsToday += 1;
        if (a.disposition === "booked") bookedToday += 1;
      }
    }
  }

  return {
    totalLeads: leads.length,
    callsToday,
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

export function getRepStats(): RepStat[] {
  const leads = db().leads;
  const map = new Map<string, { calls: number; connects: number; booked: number }>();
  for (const rep of db().reps) map.set(rep.id, { calls: 0, connects: 0, booked: 0 });

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

  return db().reps.map((rep) => {
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
