// CRM Postgres migrator.
//
// Applies store.schema.sql to the database in `DATABASE_URL`. The schema is
// idempotent (CREATE ... IF NOT EXISTS), so re-running is safe.
//
// Run it with the npm script (added to package.json):
//
//   npm run db:migrate
//
// which invokes Node directly on this TypeScript file using Node 22's built-in
// type stripping:
//
//   node --experimental-strip-types src/lib/crm/migrate.ts
//
// (If your Node build lacks type stripping, run via tsx:
//   npx tsx src/lib/crm/migrate.ts
// — see blockers in the task summary.)
//
// The Neon HTTP client runs one statement per request, so we split the schema
// file into individual statements and apply them in order.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set — cannot migrate.");
    process.exit(1);
  }

  const here = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.join(here, "store.schema.sql");
  const raw = fs.readFileSync(schemaPath, "utf8");

  // Strip line comments, then split on semicolons into individual statements.
  const sansComments = raw.replace(/^\s*--.*$/gm, "");
  const statements = sansComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sql = neon(url);

  console.log(`Applying ${statements.length} statement(s) from store.schema.sql…`);
  for (const stmt of statements) {
    // Calling the query function directly (ordinary, non-tagged-template usage)
    // runs a literal SQL string with no params.
    await sql(stmt);
  }
  console.log("CRM schema migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
