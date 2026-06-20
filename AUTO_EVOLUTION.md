# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 20 — 2026-06-20

### 1. Current Status
Green. **vitest 258 passed (33 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~24 commits ahead of `origin/main`, not pushed. Shippable; loop on optional handler-test
breadth (owner can pause/deploy anytime).

### 2. Completed in This Epoch
- **`api/crm/automation/route.test.ts`** (2): GET 401/403/200+[]; POST 401/403 + admin
  persisting validated rules that GET returns.
- **`api/crm/sequences/route.test.ts`** (2): GET 401 + default-steps for any authed user;
  POST 401/403/400(empty)/200(admin override). 254 → 258.

### 3. Discovered Debt / Opportunities
- Remaining untested handlers: `activity`, `import-leads`, `export`, `contacts`,
  `companies`, `deals`. Low marginal value. **Still recommend pausing + deploying.**

### 4. The Next Epoch Roadmap
> ⚑ Owner decision point: branch is review/deploy-ready. Continuing only per the
> "use up credits today" directive.
1. **Handler tests for `activity` + `import-leads`** (or another batch).
2. **Pause / hand off** whenever ready to review or deploy `crm-cockpit`.

---

## Epoch 19 — 2026-06-20
- `api/crm/notifications/route.test.ts` + `smart-lists/route.test.ts`. 248 → 254.

---

## Epoch 18 — 2026-06-20
- `api/crm/tags/route.test.ts` + `today/route.test.ts`. 242 → 248.

---

## Epoch 17 — 2026-06-20
- `api/crm/tasks/route.test.ts` (CRUD) + `search/route.test.ts` (hermetic paths). 237 → 242.

## Epoch 16 — 2026-06-20
- `api/crm/state/route.test.ts` (4): auth/validation, patch persistence, safe stage-change
  automation path. 233 → 237.

---

## Epoch 15 — 2026-06-20
- `api/crm/claim/route.test.ts` (5): claim/unclaim, 409 cross-rep guard + admin override,
  403 non-owner unclaim. 228 → 233.

## Epoch 14 — 2026-06-20
- `api/crm/bulk/route.test.ts` (5): auth/validation + setStage mutates per-user state. 223 → 228.

---

## Epoch 13 — 2026-06-20
- Admin route-handler tests (`admin/outreach`: 403/400/200) + `docs/TESTING.md`. 217 → 223.

## Epoch 12 — 2026-06-20
- First route-handler tests (`custom-leads`: 401/400/201 + isolation). 212 → 217.

## Epoch 11 — 2026-06-20
- Hardened `admin/outreach` POST body parsing. 212 tests.

## Epoch 10 — 2026-06-20
- Finished admin authz consolidation onto shared `requireAdmin` (7 routes).

## Epoch 9 — 2026-06-20
- `notifications` + `sequenceConfig` tests. All Redis libs covered. 204 → 212.

## Epoch 8 — 2026-06-20
- `setupIsolatedRedis` helper + `smartlists.test.ts`. 199 → 204.

## Epoch 7 — `merge.test.ts` (9). 190 → 199.
## Epoch 6 — `tags.test.ts` (6) + LocalRedis parity guard. 183 → 190.
## Epoch 5 — Fixed LocalRedis 5 missing commands; `tasks.test.ts` (6). 177 → 183.
## Epoch 4 — Removed orphaned `Pipeline.tsx`; `.gitattributes`; wasted-query drop.
## Epoch 3 — Consolidated automation/merge/sequences authz onto `requireAdmin`.
## Epoch 2 — Extracted `validateRules()` + tests (9). 168 → 177.
## Epoch 1 — `requireAdmin` + guarded analytics routes; `parseCSVLine` tests (8). 160 → 168.
