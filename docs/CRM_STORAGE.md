# CRM storage seam

The CRM persists its data (leads, reps, and activities) behind a single async
interface so the storage backend can be swapped without touching the API routes
or UI. Two backends ship today:

- **SQLite** — local, file-based, zero-config. Great for development. Ephemeral
  on Vercel (the filesystem is wiped between deploys/invocations).
- **Postgres (Neon)** — hosted and durable. Recommended for production.

For operator-facing setup steps, see [`../SETUP.md`](../SETUP.md). This document
describes the code seam for contributors.

## The `CrmStore` interface

All persistence goes through one async interface (in `src/lib/crm/store.ts`).
Every method returns a `Promise`, so a backend is free to do real I/O. The shape
mirrors the operations the app already needs:

```ts
export interface CrmStore {
  // Reads
  getReps(): Promise<Rep[]>;
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  getQueue(): Promise<Lead[]>;

  // Writes
  createLead(input: Partial<Lead> & { business: string; phone: string }): Promise<Lead>;
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead | undefined>;
  addNote(leadId: string, body: string, repId?: string): Promise<Activity | undefined>;
  logEmail(leadId: string, input: { subject: string; body: string; repId?: string }): Promise<Lead | undefined>;
  logDisposition(leadId: string, input: DispositionInput): Promise<Lead | undefined>;

  // Aggregates
  getStats(): Promise<CrmStats>;
  getRepStats(): Promise<RepStat[]>;
}
```

The domain types (`Lead`, `Activity`, `Rep`, `CrmStats`, `Disposition`,
`PipelineStage`, …) live in `src/lib/crm/types.ts` and are shared by every
backend — only the persistence mechanics differ.

> Note: exact method names and signatures are defined in `src/lib/crm/store.ts`;
> treat the list above as the conceptual contract. If a signature here ever
> drifts from `store.ts`, `store.ts` is the source of truth.

## The two implementations

| File | Backend | Notes |
|------|---------|-------|
| `src/lib/crm/store.sqlite.ts` | SQLite via Node's built-in `node:sqlite` | File at `$CRM_DB_PATH` (default `.data/crm.db`); created and seeded on first access. Ephemeral on Vercel. |
| `src/lib/crm/store.pg.ts` | Postgres (Neon) | Connects via `DATABASE_URL`. Schema applied out-of-band by the migration (see below), not on first access. |

Both implement the same `CrmStore` interface, so they are interchangeable from
the caller's point of view.

## How the selector chooses

`src/lib/crm/store.ts` exports the active store, picked at module load from the
environment:

1. If **`CRM_STORE`** is set, it wins:
   - `CRM_STORE=pg` → use the Postgres store (requires `DATABASE_URL`).
   - `CRM_STORE=sqlite` → use the SQLite store, even if `DATABASE_URL` is set.
2. Otherwise, auto-select: if **`DATABASE_URL`** is present, use Postgres;
   if not, fall back to **SQLite**.

In short: Postgres in production (where `DATABASE_URL` is configured), SQLite
locally — and `CRM_STORE` is the explicit override for either direction.

## Adding a new backend

1. Create `src/lib/crm/store.<name>.ts` exporting an object (or factory) that
   implements the `CrmStore` interface.
2. Reuse the shared domain types from `src/lib/crm/types.ts` and the seed data
   in `src/lib/crm/seed.ts` so behavior matches the existing backends.
3. Register it in the selector in `src/lib/crm/store.ts` (add a `CRM_STORE`
   value and/or auto-select rule).
4. If the backend needs a schema, add a `.sql` file alongside the others and
   wire it into the migration workflow.

Keep all backend differences inside the `store.<name>.ts` file — routes, UI, and
domain logic should never branch on which store is active.

## Migration workflow (Postgres)

The Postgres schema is **not** created lazily on first request; it is applied
explicitly so production startup stays fast and predictable.

- **Schema:** `src/lib/crm/store.schema.sql` — the `CREATE TABLE IF NOT EXISTS`
  statements for `reps`, `leads`, and `activities`. Idempotent.
- **Runner:** `src/lib/crm/migrate.ts` — connects with `DATABASE_URL` and
  executes `store.schema.sql`.
- **Command:** `npm run db:migrate` — runs the runner.

Run it once after first setting `DATABASE_URL`, and again whenever the schema
file changes:

```bash
npm run db:migrate
```

SQLite, by contrast, applies its schema and seed automatically on first access
inside `store.sqlite.ts`, so no separate migration step is needed for local
development.
