# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 1 — 2026-06-20

### 1. Current Status
Healthy and green. The CRM is a Next.js 16 + Tailwind v4 + Upstash-Redis app under
`src/app/crm` (UI) and `src/app/api/crm` (routes), with a file-backed Redis stand-in
for local dev (`src/lib/localRedis.ts`). It was recently rebuilt to a top-tier,
FUB/HubSpot-style tool over three prior build sprints (nav-rail shell + light/dark
tokens, tabbed record, deals kanban, command palette, Today, tasks, smart lists,
bulk actions, automations, reporting, notifications, CSV, dedup/merge, power dialer,
cadence builder, unified timeline, tags). Gates at end of this epoch: **vitest 168
passed (12 files) · tsc 0 errors · eslint 0 errors · next build exit 0.** Branch is
~5 commits ahead of `origin/main`, **not pushed**.

Architectural note: `/api/crm/*` is session-gated by `src/middleware.ts` (injects
`x-user-id` / `x-user-role` / `x-user-name`), but the admin redirect only guards the
`/crm/admin` *page* path — **API routes must enforce admin themselves.**

### 2. Completed in This Epoch
- **Security hardening — admin API authorization.** Added a reusable
  `requireAdmin(req)` guard to `src/lib/api.ts` (returns `403` or `null`). Enforced
  it on the two admin-analytics routes that previously only *claimed* "admin-only"
  in a comment but had no guard, leaving cross-rep data readable by any authenticated
  rep: `GET /api/crm/admin/funnel` and `GET /api/crm/admin/template-stats`.
- **Test gap — CSV parser.** Added `src/app/api/crm/leads/route.test.ts` (8 cases)
  pinning down `parseCSVLine`, the pure parser behind both the hourly 51k-row lead
  feed and the CSV import/export features: quoted commas, escaped `""`, empty
  leading/middle/trailing fields, quoted-empty, single-field, all-quoted. Test count
  160 → 168.

### 3. Discovered Debt / Opportunities
- **Inconsistent admin authz.** Other `/api/crm/admin/*` routes (revenue, submissions,
  territory, users, broadcast) likely share the old unguarded pattern. They should
  adopt `requireAdmin` — **except `admin/leaderboard`, which is intentionally
  rep-accessible** (the rep dashboard's LeaderboardPeek calls it). Audit individually.
- **Untestable validator.** The automation-rules validator is inline in
  `src/app/api/crm/automation/route.ts` (parses untrusted admin input) and is not
  exported, so it can't be unit-tested. Extract to a pure `validateRules` in
  `src/lib/crm/automation.ts`.
- **No tests on new Redis-backed libs** (`tasks`, `tags`, `notifications`,
  `smartlists`, `automation`, `sequenceConfig`, `merge`). The local-redis fallback
  makes integration tests possible, but it persists to `.local-db.json` — needs an
  isolation/reset hook (e.g. a temp-file path via env, or a `__resetLocalRedis()`).
- **`merge.ts` is data-integrity-sensitive** (re-points lead state/activity/claims
  across Redis namespaces) and untested — highest-risk module to leave uncovered.
- **Dead code:** `src/app/crm/components/Pipeline.tsx` is orphaned (DealsBoard
  replaced it in the pipeline view) — remove or fold in.
- **Line-ending churn:** commits emit many `LF will be replaced by CRLF` warnings;
  a `.gitattributes` (`* text=auto eol=lf`) would silence it.
- Pre-existing lint warning: `src/app/api/crm/demos/route.ts:20` unused `states`.

### 4. The Next Epoch Roadmap
1. **Extract + test the automation rules validator.** Move the inline validator from
   `automation/route.ts` to a pure exported `validateRules` in `lib/crm/automation.ts`;
   add a vitest covering malformed/oversized/unknown-action payloads (it gates
   untrusted admin input → security-relevant).
2. **Sweep admin authz.** Add `requireAdmin` to every genuinely admin-only
   `/api/crm/admin/*` route (revenue, submissions, territory, users, broadcast),
   explicitly **leaving `leaderboard` rep-accessible**. One isolated route per edit.
3. **Test isolation for local-redis**, then integration-test `tasks.ts` and `tags.ts`
   (CRUD round-trips) against it without polluting `.local-db.json`.
4. **Integration-test `merge.ts`** key re-pointing (survivor keeps data, loser keys
   gone, no-op on equal ids) — the riskiest untested module.
5. **Remove the orphaned `Pipeline.tsx`** (confirm no remaining importers) and add a
   root `.gitattributes` to end CRLF warning noise.
