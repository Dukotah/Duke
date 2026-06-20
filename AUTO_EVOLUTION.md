# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 5 — 2026-06-20

### 1. Current Status
Green. **vitest 183 passed (14 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~9 commits ahead of `origin/main`, not pushed. The Redis-backed lib layer now has its
first real integration coverage, and a latent local-dev correctness bug is fixed.

### 2. Completed in This Epoch
- **Fixed a real local-dev bug — `LocalRedis` was missing 5 commands the app uses**:
  `hget` (11 call sites), `hdel` (6), `rpush` (2), `zrem` (1), `exists` (1).
  Implemented all five. Previously, any feature path hitting them silently threw in
  local dev (no Upstash) while working in prod — notably `tasks.updateTask`/`deleteTask`
  (hget/hdel), and likely tag/smart-list deletes. **The local sandbox's task edit/
  delete was broken until this fix.**
- **Added `__resetLocalRedis()`** test-isolation hook to `localRedis.ts` — drops the
  cached singleton so tests can point the store at a temp file via `LOCAL_DB_FILE`
  without polluting the dev `.local-db.json`.
- **Added `src/lib/crm/tasks.test.ts`** (6 integration tests over an isolated store):
  create+defaults+trim, per-user isolation, dueAt sort, update-preserves-fields
  (exercises `hget`), no-op update on unknown id, targeted delete (exercises `hdel`).
  177 → 183.

### 3. Discovered Debt / Opportunities
- Now that LocalRedis is complete, the remaining Redis-backed libs (`tags`,
  `smartlists`, `notifications`, `merge`, `sequenceConfig`) can be integration-tested
  the same way — and any that use `hget`/`hdel`/`zrem` were also silently broken in
  local dev before this epoch (now unblocked).
- Consider a tiny `LocalRedis` parity check: a test asserting every method the app
  calls on `redis.*` exists on `LocalRedis`, to catch future drift automatically.
- Carried forward: older admin routes still on local admin closures (vs `requireAdmin`).

### 4. The Next Epoch Roadmap
1. **Integration-test `tags.ts`** (create/list/delete defs + add/remove/getLeadTags +
   getAllLeadTagMap) against the isolated store — likely exercises hdel too.
2. **Integration-test `merge.ts`** key re-pointing (survivor keeps data, loser keys
   gone, no-op on equal ids) — riskiest untested module.
3. **Add a LocalRedis-parity guard test:** grep-style assertion that the `redis.*`
   methods used in `src/**` all exist on `LocalRedis`, preventing silent local-dev
   breakage when new code uses an unimplemented command.
4. **Integration-test `smartlists.ts` + `notifications.ts`** CRUD/cap behavior.
5. **Finish authz consolidation:** migrate remaining older admin routes to the shared
   `requireAdmin` (per-method care for `broadcast`'s open GET).

---

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; added `.gitattributes` (`* text=auto eol=lf`);
  dropped a wasted `getAllLeadStates()` call in `/api/crm/demos`. Lint went pristine.

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authz onto shared `requireAdmin`;
  audit confirmed no missing admin guards (`broadcast`/`leaderboard` GET rep-facing).

## Epoch 2 — 2026-06-20
- Extracted pure `validateRules()` to `lib/crm/automation.ts` + `automation.test.ts`
  (9 cases). 168 → 177.

## Epoch 1 — 2026-06-20
- Added `requireAdmin(req)` to `lib/api.ts`; enforced on `admin/funnel` +
  `admin/template-stats`. Added `leads/route.test.ts` (8 cases). 160 → 168.
  Architecture: `/api/crm/*` session-gated by `src/middleware.ts`; admin-only API
  routes must self-enforce.
