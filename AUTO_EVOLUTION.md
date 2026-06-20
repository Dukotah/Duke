# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 3 — 2026-06-20

### 1. Current Status
Green. **vitest 177 passed (13 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~7 commits ahead of `origin/main`, not pushed. Admin authorization is converging on
the single shared `requireAdmin` helper (`lib/api.ts`). Audit this epoch confirmed
**no missing admin guards** anywhere: every `/api/crm/admin/*` mutating handler and
admin-only GET is gated; `broadcast` GET and `leaderboard` GET are intentionally open
(consumed by the rep dashboard's BroadcastBanners + LeaderboardPeek).

### 2. Completed in This Epoch
- **Consolidated authorization** in `automation`, `merge`, and `sequences` routes onto
  the shared `requireAdmin(req)` from `lib/api.ts`; removed their three duplicated
  local `isAdmin`/`getUserRole` closures. Behavior-preserving (same 401-then-403 flow;
  `sequences` GET stays intentionally open, only POST is gated). No test delta needed
  for a pure refactor; full suite + build reverify zero regressions.

### 3. Discovered Debt / Opportunities
- **Remaining closure duplication (low risk, works today):** the older admin routes
  `revenue`, `submissions`, `users`, `territory`, `admin/health`, `admin/outreach`
  still define local `isAdmin`/`requireAdmin` closures. They can adopt the shared
  helper too — but `broadcast` must keep its GET open (only POST/DELETE gated), so
  that one needs per-method care.
- Carried forward: untested Redis libs (`tasks`, `tags`, `notifications`, `smartlists`,
  `merge`, `sequenceConfig`) need local-redis test isolation; orphaned `Pipeline.tsx`;
  no root `.gitattributes` (CRLF churn on every commit); `demos/route.ts:20` unused-var
  warning.

### 4. The Next Epoch Roadmap
1. **Quick-win cleanup (tight, safe):** remove the orphaned `Pipeline.tsx` (confirm no
   importers — DealsBoard replaced it), add a root `.gitattributes` (`* text=auto
   eol=lf`) to end CRLF warnings, and clear the `demos/route.ts:20` unused-var warning
   (prefix with `_`).
2. **Local-redis test isolation:** add a reset/temp-file hook so the file-backed store
   can be exercised in vitest without polluting `.local-db.json`.
3. **Integration-test `tasks.ts` + `tags.ts`** CRUD round-trips against the isolated store.
4. **Integration-test `merge.ts`** key re-pointing (survivor keeps data, loser keys
   gone, no-op on equal ids) — riskiest untested module.
5. **Finish authz consolidation:** migrate the remaining older admin routes to
   `requireAdmin` (per-method care for `broadcast`'s open GET).

---

## Epoch 2 — 2026-06-20
- Extracted the automation-rules validator from `automation/route.ts` into a pure
  exported `validateRules()` in `lib/crm/automation.ts` (route imports it); removed
  inline `sanitizeRules`/`ACTION_KINDS`.
- Added `lib/crm/automation.test.ts` (9 cases) for the admin-rules trust boundary.
  168 → 177 tests.

## Epoch 1 — 2026-06-20
- Added reusable `requireAdmin(req)` to `lib/api.ts`; enforced on the previously
  unguarded `admin/funnel` + `admin/template-stats` GETs.
- Added `leads/route.test.ts` (8 cases) for the `parseCSVLine` parser. 160 → 168.
- Architecture note: `/api/crm/*` is session-gated by `src/middleware.ts` (injects
  `x-user-id`/`x-user-role`/`x-user-name`); the admin redirect only guards the
  `/crm/admin` *page* path, so admin-only API routes must self-enforce.
