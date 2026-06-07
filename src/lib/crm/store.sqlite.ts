// SQLite-backed CRM store (async seam).
//
// Leads / activities / reps are persisted to a local SQLite database via Node's
// built-in `node:sqlite` (synchronous). The underlying calls are synchronous,
// but every exported function is `async` so this module conforms to the shared
// `CrmStore` seam — letting `./store` swap it for the Postgres implementation
// without callers changing their import path (callers just `await`).
//
// The database file lives at `$CRM_DB_PATH` (default `.data/crm.db`). It is
// created and seeded on first access. A `globalThis` cache holds the open
// connection so Next's dev hot-reloads don't reopen/reseed it.

import path from "node:path";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
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
import { buildSeedLeads, SEED_REPS } from "./seed";

const DB_PATH =
  process.env.CRM_DB_PATH ?? path.join(process.cwd(), ".data", "crm.db");

const g = globalThis as unknown as { __crmSqlite?: DatabaseSync };

function conn(): DatabaseSync {
  if (!g.__crmSqlite) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const db = new DatabaseSync(DB_PATH);
    db.exec("PRAGMA journal_mode = WAL;");
    db.exec("PRAGMA foreign_keys = ON;");
    migrate(db);
    seedIfEmpty(db);
    g.__crmSqlite = db;
  }
  return g.__crmSqlite;
}

function migrate(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS reps (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      avatarColor TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS leads (
      id              TEXT PRIMARY KEY,
      business        TEXT NOT NULL,
      contactName     TEXT,
      phone           TEXT NOT NULL,
      email           TEXT,
      website         TEXT,
      industry        TEXT NOT NULL,
      city            TEXT NOT NULL,
      state           TEXT NOT NULL,
      signals         TEXT NOT NULL,
      heatScore       REAL NOT NULL,
      stage           TEXT NOT NULL,
      ownerRepId      TEXT,
      estValue        REAL NOT NULL,
      source          TEXT NOT NULL,
      callbackAt      TEXT,
      attempts        INTEGER NOT NULL,
      lastContactedAt TEXT,
      createdAt       TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activities (
      id          TEXT PRIMARY KEY,
      leadId      TEXT NOT NULL,
      type        TEXT NOT NULL,
      disposition TEXT,
      body        TEXT,
      durationSec INTEGER,
      repId       TEXT,
      createdAt   TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_activities_leadId ON activities(leadId);
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    INSERT OR IGNORE INTO meta (key, value) VALUES ('seq', '1');
  `);

  // Additive column migrations for databases created before these columns
  // existed. SQLite has no "ADD COLUMN IF NOT EXISTS", so we check the table's
  // current columns and only ALTER when missing — keeping this idempotent.
  ensureColumn(db, "leads", "email", "TEXT");
}

// Add a column to a table only if it isn't already present. Safe to call on
// every startup (e.g. an `email` column added after the initial release).
function ensureColumn(
  db: DatabaseSync,
  table: string,
  column: string,
  type: string,
): void {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as unknown as {
    name: string;
  }[];
  if (cols.some((c) => c.name === column)) return;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
}

function seedIfEmpty(db: DatabaseSync): void {
  const row = db.prepare("SELECT COUNT(*) AS n FROM leads").get() as { n: number };
  if (row.n > 0) return;

  const insertRep = db.prepare(
    "INSERT INTO reps (id, name, avatarColor) VALUES (?, ?, ?)",
  );
  for (const rep of SEED_REPS) {
    insertRep.run(rep.id, rep.name, rep.avatarColor);
  }
  for (const lead of buildSeedLeads()) {
    insertLeadRow(db, lead);
    for (const activity of lead.activities) insertActivityRow(db, activity);
  }
}

// node:sqlite only binds null / number / bigint / string / Uint8Array, so
// `undefined` columns must be coerced to null on the way in.
function nz<T>(v: T | undefined): T | null {
  return v === undefined ? null : v;
}

function insertLeadRow(db: DatabaseSync, lead: Lead): void {
  db.prepare(
    `INSERT INTO leads (
       id, business, contactName, phone, email, website, industry, city, state,
       signals, heatScore, stage, ownerRepId, estValue, source, callbackAt,
       attempts, lastContactedAt, createdAt
     ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    lead.id,
    lead.business,
    nz(lead.contactName),
    lead.phone,
    nz(lead.email),
    nz(lead.website),
    lead.industry,
    lead.city,
    lead.state,
    JSON.stringify(lead.signals),
    lead.heatScore,
    lead.stage,
    nz(lead.ownerRepId),
    lead.estValue,
    lead.source,
    nz(lead.callbackAt),
    lead.attempts,
    nz(lead.lastContactedAt),
    lead.createdAt,
  );
}

function insertActivityRow(db: DatabaseSync, a: Activity): void {
  db.prepare(
    `INSERT INTO activities (id, leadId, type, disposition, body, durationSec, repId, createdAt)
     VALUES (?,?,?,?,?,?,?,?)`,
  ).run(
    a.id,
    a.leadId,
    a.type,
    nz(a.disposition),
    nz(a.body),
    nz(a.durationSec),
    nz(a.repId),
    a.createdAt,
  );
}

// Persist the mutable columns of an existing lead (createdAt never changes).
function persistLead(db: DatabaseSync, lead: Lead): void {
  db.prepare(
    `UPDATE leads SET
       business=?, contactName=?, phone=?, email=?, website=?, industry=?, city=?,
       state=?, signals=?, heatScore=?, stage=?, ownerRepId=?, estValue=?,
       source=?, callbackAt=?, attempts=?, lastContactedAt=?
     WHERE id=?`,
  ).run(
    lead.business,
    nz(lead.contactName),
    lead.phone,
    nz(lead.email),
    nz(lead.website),
    lead.industry,
    lead.city,
    lead.state,
    JSON.stringify(lead.signals),
    lead.heatScore,
    lead.stage,
    nz(lead.ownerRepId),
    lead.estValue,
    lead.source,
    nz(lead.callbackAt),
    lead.attempts,
    nz(lead.lastContactedAt),
    lead.id,
  );
}

// --- Row → domain mapping --------------------------------------------------

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
  signals: string;
  heatScore: number;
  stage: string;
  ownerRepId: string | null;
  estValue: number;
  source: string;
  callbackAt: string | null;
  attempts: number;
  lastContactedAt: string | null;
  createdAt: string;
}

interface ActivityRow {
  id: string;
  leadId: string;
  type: string;
  disposition: string | null;
  body: string | null;
  durationSec: number | null;
  repId: string | null;
  createdAt: string;
}

function rowToActivity(r: ActivityRow): Activity {
  return {
    id: r.id,
    leadId: r.leadId,
    type: r.type as ActivityType,
    disposition: (r.disposition as Disposition | null) ?? undefined,
    body: r.body ?? undefined,
    durationSec: r.durationSec ?? undefined,
    repId: r.repId ?? undefined,
    createdAt: r.createdAt,
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
    signals: JSON.parse(r.signals) as Lead["signals"],
    heatScore: r.heatScore,
    stage: r.stage as PipelineStage,
    ownerRepId: r.ownerRepId ?? undefined,
    estValue: r.estValue,
    source: r.source,
    callbackAt: r.callbackAt,
    attempts: r.attempts,
    lastContactedAt: r.lastContactedAt,
    createdAt: r.createdAt,
    activities,
  };
}

// Load every lead with its activities attached. Two queries + an in-memory
// group-by keeps it to O(n) regardless of lead count.
function allLeads(): Lead[] {
  const db = conn();
  const leadRows = db.prepare("SELECT * FROM leads").all() as unknown as LeadRow[];
  const actRows = db
    .prepare("SELECT * FROM activities ORDER BY createdAt ASC, rowid ASC")
    .all() as unknown as ActivityRow[];

  const byLead = new Map<string, Activity[]>();
  for (const a of actRows) {
    const list = byLead.get(a.leadId);
    if (list) list.push(rowToActivity(a));
    else byLead.set(a.leadId, [rowToActivity(a)]);
  }

  return leadRows.map((r) => rowToLead(r, byLead.get(r.id) ?? []));
}

function nextId(prefix: string): string {
  const db = conn();
  const row = db
    .prepare(
      "UPDATE meta SET value = CAST(value AS INTEGER) + 1 WHERE key='seq' RETURNING value",
    )
    .get() as { value: string } | undefined;
  const seq = row ? Number(row.value) : Date.now();
  return `${prefix}_${Date.now().toString(36)}${seq}`;
}

// Synchronous getLead used internally by other writes (avoids re-awaiting).
function getLeadSync(id: string): Lead | undefined {
  const db = conn();
  const r = db.prepare("SELECT * FROM leads WHERE id = ?").get(id) as
    | LeadRow
    | undefined;
  if (!r) return undefined;
  const acts = db
    .prepare(
      "SELECT * FROM activities WHERE leadId = ? ORDER BY createdAt ASC, rowid ASC",
    )
    .all(id) as unknown as ActivityRow[];
  return rowToLead(r, acts.map(rowToActivity));
}

// --- Reads -----------------------------------------------------------------

export async function getReps(): Promise<Rep[]> {
  const db = conn();
  return db.prepare("SELECT * FROM reps").all() as unknown as Rep[];
}

export async function getLeads(): Promise<Lead[]> {
  // Hottest first; callbacks that are due bubble up regardless of heat.
  const now = Date.now();
  return allLeads().sort((a, b) => {
    const aDue = a.callbackAt && new Date(a.callbackAt).getTime() <= now ? 1 : 0;
    const bDue = b.callbackAt && new Date(b.callbackAt).getTime() <= now ? 1 : 0;
    if (aDue !== bDue) return bDue - aDue;
    return b.heatScore - a.heatScore;
  });
}

export async function getLead(id: string): Promise<Lead | undefined> {
  return getLeadSync(id);
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

export async function updateLead(
  id: string,
  patch: Partial<Lead>,
): Promise<Lead | undefined> {
  const lead = getLeadSync(id);
  if (!lead) return undefined;
  Object.assign(lead, patch);
  persistLead(conn(), lead);
  return lead;
}

export async function addNote(
  leadId: string,
  body: string,
  repId?: string,
): Promise<Activity | undefined> {
  const lead = getLeadSync(leadId);
  if (!lead) return undefined;
  const activity: Activity = {
    id: nextId("act"),
    leadId,
    type: "note",
    body,
    repId,
    createdAt: new Date().toISOString(),
  };
  insertActivityRow(conn(), activity);
  return activity;
}

// Record a sent email on the lead's timeline. Keeps the lead in its current
// stage (an email is a touch, not a disposition) but updates last-contacted.
export async function logEmail(
  leadId: string,
  input: { subject: string; body: string; repId?: string },
): Promise<Lead | undefined> {
  const lead = getLeadSync(leadId);
  if (!lead) return undefined;
  const now = new Date().toISOString();
  lead.activities.push({
    id: nextId("act"),
    leadId,
    type: "email",
    body: `Subject: ${input.subject}\n\n${input.body}`,
    repId: input.repId,
    createdAt: now,
  });
  lead.lastContactedAt = now;
  if (input.repId) lead.ownerRepId = input.repId;
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
  const lead = getLeadSync(leadId);
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
  insertActivityRow(conn(), activity);
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

  persistLead(conn(), lead);
  return lead;
}

export async function createLead(
  input: Partial<Lead> & { business: string; phone: string },
): Promise<Lead> {
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
  insertLeadRow(conn(), lead);
  return lead;
}

// --- Aggregates ------------------------------------------------------------

export async function getStats(): Promise<CrmStats> {
  const leads = allLeads();
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
  const leads = allLeads();
  const reps = (await getReps());
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
