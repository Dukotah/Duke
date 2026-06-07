-- Postgres DDL for the CRM store (Neon production backend).
--
-- Mirrors the SQLite model in store.sqlite.ts. Ids are application-generated
-- text (e.g. `lead_<ts>`, `act_<ts>`, rep `me`), so all primary keys are TEXT
-- rather than SERIAL. `signals` is a JSON document, stored as JSONB. Timestamps
-- the app produces are ISO-8601 strings; we store them as TIMESTAMPTZ and the
-- reader normalizes them back to ISO strings via toISOString().
--
-- This script is idempotent: every statement is CREATE ... IF NOT EXISTS, so it
-- is safe to run on every deploy / migration.

CREATE TABLE IF NOT EXISTS reps (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  "avatarColor" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id                TEXT PRIMARY KEY,
  business          TEXT NOT NULL,
  "contactName"     TEXT,
  phone             TEXT NOT NULL,
  email             TEXT,
  website           TEXT,
  industry          TEXT NOT NULL,
  city              TEXT NOT NULL,
  state             TEXT NOT NULL,
  signals           JSONB NOT NULL,
  "heatScore"       DOUBLE PRECISION NOT NULL,
  stage             TEXT NOT NULL,
  "ownerRepId"      TEXT,
  "estValue"        DOUBLE PRECISION NOT NULL,
  source            TEXT NOT NULL,
  "callbackAt"      TIMESTAMPTZ,
  attempts          INTEGER NOT NULL,
  "lastContactedAt" TIMESTAMPTZ,
  "createdAt"       TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id            TEXT PRIMARY KEY,
  "leadId"      TEXT NOT NULL,
  type          TEXT NOT NULL,
  disposition   TEXT,
  body          TEXT,
  "durationSec" INTEGER,
  "repId"       TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL
);

-- Activity lookups are always per-lead, ordered by time (timeline + group-by).
CREATE INDEX IF NOT EXISTS idx_activities_leadid
  ON activities ("leadId");
CREATE INDEX IF NOT EXISTS idx_activities_leadid_createdat
  ON activities ("leadId", "createdAt");

-- Queue ordering / "callbacks due" scans filter on stage and callbackAt.
CREATE INDEX IF NOT EXISTS idx_leads_stage
  ON leads (stage);
CREATE INDEX IF NOT EXISTS idx_leads_callbackat
  ON leads ("callbackAt");

-- Dedup probes in inbound.ts match on email / phone / business name.
CREATE INDEX IF NOT EXISTS idx_leads_email
  ON leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_leads_phone
  ON leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_business
  ON leads (lower(business));
