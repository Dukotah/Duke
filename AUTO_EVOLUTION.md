# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 2 — 2026-06-20

### 1. Current Status
Green and healthy. **vitest 177 passed (13 files) · tsc 0 · eslint 0 · next build exit 0.**
Branch ~6 commits ahead of `origin/main`, not pushed. Same architecture as Epoch 1.
Admin-only API routes now follow two patterns that should converge: the new
`requireAdmin` helper (`lib/api.ts`, Epoch 1) and per-route `isAdmin` closures
(automation/merge/sequences). Validation logic for automation rules is now a pure,
tested library function rather than inline route code.

### 2. Completed in This Epoch
- **Extracted the automation-rules validator** out of `src/app/api/crm/automation/
  route.ts` into a pure, exported `validateRules()` in `src/lib/crm/automation.ts`
  (single source of truth for a valid rule; the route now imports it). Removed the
  inline `sanitizeRules` + duplicated `ACTION_KINDS`.
- **Added `src/lib/crm/automation.test.ts`** (9 cases) covering the trust boundary
  for admin-supplied rules: non-array input, id preservation vs generation, missing/
  blank `toStage`, zero-valid-action drop, unknown action kinds, `createTask` inDays
  coercion, `setFollowUp` numeric requirement, and trimming/mixed-action filtering.
  Test count 168 → 177.

### 3. Discovered Debt / Opportunities
- **Authz helper duplication:** `automation`, `merge`, and `sequences` routes each
  define their own `isAdmin`/`getUserRole` closure instead of the shared
  `requireAdmin` from `lib/api.ts`. Consolidate for one consistent 403 path.
- Carried forward from Epoch 1 (still open): missing `requireAdmin` on the other
  `/api/crm/admin/*` routes (revenue/submissions/territory/users/broadcast) — but
  NOT `leaderboard` (rep-facing); untested Redis-backed libs (`tasks`, `tags`,
  `notifications`, `smartlists`, `merge`, `sequenceConfig`) needing local-redis test
  isolation; orphaned `Pipeline.tsx`; `.gitattributes` for CRLF; `demos/route.ts:20`
  unused-var warning.

### 4. The Next Epoch Roadmap
1. **Authz consolidation + sweep.** Replace the per-route `isAdmin`/`getUserRole`
   closures in automation/merge/sequences with `requireAdmin`, and add it to the
   remaining admin-only `/api/crm/admin/*` routes (revenue, submissions, territory,
   users, broadcast) — explicitly leaving `leaderboard` rep-accessible. One route per
   edit; verify after each.
2. **Local-redis test isolation**, then integration-test `tasks.ts` and `tags.ts`
   CRUD round-trips without polluting `.local-db.json`.
3. **Integration-test `merge.ts`** key re-pointing (survivor keeps data, loser keys
   gone, no-op on equal ids) — riskiest untested module.
4. **Remove orphaned `Pipeline.tsx`** (confirm no importers remain) + add root
   `.gitattributes` (`* text=auto eol=lf`) to end CRLF churn.
5. **Clear the `demos/route.ts:20` warning** (prefix unused destructure with `_`).

---

## Epoch 1 — 2026-06-20

### Completed
- **Security:** added reusable `requireAdmin(req)` to `src/lib/api.ts`; enforced on
  `GET /api/crm/admin/funnel` and `/api/crm/admin/template-stats` (previously
  unguarded despite "admin-only" comments — `/api/crm/admin/*` is not role-gated by
  middleware).
- **Tests:** added `src/app/api/crm/leads/route.test.ts` (8 cases) for the
  `parseCSVLine` parser behind the lead feed + CSV import/export. 160 → 168.
- Established baseline; confirmed middleware injects `x-user-role`; confirmed
  `admin/leaderboard` is intentionally rep-accessible.

### Notes
Architecture: `/api/crm/*` is session-gated by `src/middleware.ts` (injects
`x-user-id`/`x-user-role`/`x-user-name`); the admin redirect only guards the
`/crm/admin` *page* path, so admin-only API routes must self-enforce.
