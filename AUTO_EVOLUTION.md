# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 4 — 2026-06-20

### 1. Current Status
Green, and now **lint-pristine**: **vitest 177 passed (13 files) · tsc 0 · eslint 0
errors / 0 warnings · next build exit 0.** Branch ~8 commits ahead of `origin/main`,
not pushed. Dead code and CRLF churn cleared this epoch.

### 2. Completed in This Epoch
- **Removed orphaned `src/app/crm/components/Pipeline.tsx`** — confirmed zero importers
  (DealsBoard replaced it in the pipeline view). Dead code gone.
- **Added root `.gitattributes`** (`* text=auto eol=lf`) — ends the per-commit
  "LF will be replaced by CRLF" warning noise.
- **Removed a wasted Redis round-trip in `/api/crm/demos`**: the route fetched
  `getAllLeadStates(userId)` into an unused `states` var. Dropped the call + import —
  clears the last remaining eslint warning AND saves a per-request Redis call.

### 3. Discovered Debt / Opportunities
- The CRM has solid pure-function test coverage (parser, validator, hashing) but the
  Redis-backed libs remain integration-untested — the next high-value frontier.
- Carried forward: local-redis test isolation needed before integration tests; the
  older admin routes (`revenue`/`submissions`/`users`/`territory`/`admin/health`/
  `admin/outreach`, and `broadcast` per-method) still use local admin closures rather
  than the shared `requireAdmin`.

### 4. The Next Epoch Roadmap
1. **Local-redis test isolation:** add a way to point the file-backed store at a temp
   file (e.g. an env override read in `localRedis.ts`) or a `__reset()` so vitest can
   exercise it without polluting `.local-db.json`. Foundation for items 2–3.
2. **Integration-test `tasks.ts`** CRUD round-trips (create → list → update done/
   snooze → delete) against the isolated store.
3. **Integration-test `tags.ts`** (create/list/delete defs + add/remove/getLeadTags +
   getAllLeadTagMap).
4. **Integration-test `merge.ts`** key re-pointing (survivor keeps data, loser keys
   gone, no-op on equal ids) — riskiest untested module.
5. **Finish authz consolidation:** migrate the remaining older admin routes to the
   shared `requireAdmin` (per-method care for `broadcast`'s intentionally-open GET).

---

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authorization onto the shared
  `requireAdmin` (`lib/api.ts`); removed 3 duplicated local closures. Audit confirmed
  no missing admin guards (`broadcast`/`leaderboard` GET intentionally rep-facing).

## Epoch 2 — 2026-06-20
- Extracted `validateRules()` (pure) from `automation/route.ts` to `lib/crm/
  automation.ts`; added `automation.test.ts` (9 cases). 168 → 177.

## Epoch 1 — 2026-06-20
- Added `requireAdmin(req)` to `lib/api.ts`; enforced on `admin/funnel` +
  `admin/template-stats`. Added `leads/route.test.ts` (8 cases) for `parseCSVLine`.
  160 → 168. Architecture note: `/api/crm/*` is session-gated by `src/middleware.ts`
  (`x-user-id`/`x-user-role`/`x-user-name`); admin-only API routes must self-enforce.
