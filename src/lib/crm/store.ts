// CRM store — backend selector / single async seam.
//
// This module is the ONE import path callers use ("@/lib/crm/store" or
// "./store"). It picks a backend at module load and re-exports every store
// function under its original name with an async signature, so callers only
// ever needed to add `await`:
//
//   * Postgres (store.pg.ts)    — when `process.env.DATABASE_URL` is set and
//                                 `process.env.CRM_STORE !== 'sqlite'`.
//   * SQLite   (store.sqlite.ts) — otherwise (local dev / no DATABASE_URL, or
//                                 an explicit `CRM_STORE=sqlite` override).
//
// Both implementations are imported statically: neither touches the network or
// the filesystem at import time (the SQLite connection and the Neon client are
// both created lazily on first call), so importing the inactive backend is free
// and never throws.

import type {
  Lead,
  Activity,
  Rep,
  CrmStats,
} from "./types";

import * as sqliteImpl from "./store.sqlite";
import * as pgImpl from "./store.pg";
import type { DispositionInput, RepStat } from "./store.sqlite";

export type { DispositionInput, RepStat };

// The shared contract both backends satisfy. Keeping it explicit gives a
// compile-time guarantee that the two impls stay signature-compatible.
export interface CrmStore {
  getReps(): Promise<Rep[]>;
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  getQueue(): Promise<Lead[]>;
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead | undefined>;
  addNote(leadId: string, body: string, repId?: string): Promise<Activity | undefined>;
  logEmail(
    leadId: string,
    input: { subject: string; body: string; repId?: string },
  ): Promise<Lead | undefined>;
  logDisposition(leadId: string, input: DispositionInput): Promise<Lead | undefined>;
  createLead(
    input: Partial<Lead> & { business: string; phone: string },
  ): Promise<Lead>;
  getStats(): Promise<CrmStats>;
  getRepStats(): Promise<RepStat[]>;
}

// Conformance checks: both impls must structurally satisfy CrmStore. These are
// type-only assertions (erased at runtime) and must compile without
// `@ts-expect-error` — if a signature drifts, the build fails here.
const _sqlite: CrmStore = sqliteImpl;
const _pg: CrmStore = pgImpl;
void _sqlite;
void _pg;

const usePg =
  Boolean(process.env.DATABASE_URL) && process.env.CRM_STORE !== "sqlite";

const impl: CrmStore = usePg ? pgImpl : sqliteImpl;

// Re-export each function bound to the chosen backend, preserving names.
export const getReps: CrmStore["getReps"] = (...args) => impl.getReps(...args);
export const getLeads: CrmStore["getLeads"] = (...args) => impl.getLeads(...args);
export const getLead: CrmStore["getLead"] = (...args) => impl.getLead(...args);
export const getQueue: CrmStore["getQueue"] = (...args) => impl.getQueue(...args);
export const updateLead: CrmStore["updateLead"] = (...args) =>
  impl.updateLead(...args);
export const addNote: CrmStore["addNote"] = (...args) => impl.addNote(...args);
export const logEmail: CrmStore["logEmail"] = (...args) => impl.logEmail(...args);
export const logDisposition: CrmStore["logDisposition"] = (...args) =>
  impl.logDisposition(...args);
export const createLead: CrmStore["createLead"] = (...args) =>
  impl.createLead(...args);
export const getStats: CrmStore["getStats"] = (...args) => impl.getStats(...args);
export const getRepStats: CrmStore["getRepStats"] = (...args) =>
  impl.getRepStats(...args);
