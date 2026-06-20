# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 22 — 2026-06-20  (ARMADA #1)

### 1. Current Status
Green. **vitest 291 passed (38 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~26 commits ahead of `origin/main`, not pushed. **Loop is now armada-level**: each
iteration runs a parallel multi-agent workflow + integration gate, then I verify/commit
and fire the next. No pauses (per owner directive).

### 2. Completed in This Epoch (7-agent armada)
- Handler tests added for **`export`, `goals`, `reminders`** (parallel agents). 264 → 291.
- **`contacts`, `companies`, `deals` correctly SKIPPED** — agents verified those routes do
  NOT exist in this branch (no such dirs under `src/app/api/crm/`). Good guardrail.
- Integration agent fixed the `export` test hanging on the network `getLeads()` fetch by
  stubbing `fetch` to reject — drives the route's real "CSV source unreachable → serve
  empty + still load custom leads" path (assertions unchanged; file 11.8s → 0.7s).

### 3. Discovered Debt / Opportunities
- Untested routes that are real + hermetic: `responded`, `submit`, `activities`,
  `activity-log`. Network/secret-gated (skip or stub): `leads`, `email-events`, `webhook`,
  `cron`, `leads/generate-site`. After route coverage, rotate armadas to **adversarial
  bug-hunt + fix**. Branch remains review/deploy-ready.

### 4. The Next Epoch Roadmap (armada)
1. **Armada #2:** parallel handler tests for `responded`, `submit`, `activities`,
   `activity-log` + integration gate.
2. **Armada #3+:** adversarial bug-hunt → verify → fix passes across lib/crm + components,
   with a build gate.

---

## Epoch 21 — 2026-06-20
- `api/crm/activity/route.test.ts` + `import-leads/route.test.ts`. 258 → 264.

---

## Epoch 20 — 2026-06-20
- `api/crm/automation/route.test.ts` + `sequences/route.test.ts` (admin gates). 254 → 258.

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
