# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 11 — 2026-06-20

### 1. Current Status
Green. **vitest 212 passed (20 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~15 commits ahead of `origin/main`, not pushed. Route input-handling is now consistent:
every mutating handler either uses `parseJsonBody` or wraps a raw `req.json()` in
try/catch.

### 2. Completed in This Epoch
- **Audited every `/api/crm/*` route's body handling.** Found one genuine robustness
  gap: `POST /api/crm/admin/outreach` read `await req.json()` with **no try/catch**, so
  a malformed body threw an unhandled 500 (the only mutating handler not on the safe
  path). Fixed it to use `parseJsonBody` + a `try/handleApiError` wrapper — malformed
  bodies now return a clean 400, matching the file's GET/DELETE.
- Verified the other five raw `req.json()` sites (`login`, `import-leads`, `inbound`,
  `leads/generate-site`, `outreach`) are all already wrapped in try/catch with a 400
  fallback — no change needed. 401 guards present on all per-user mutating routes.

### 3. Discovered Debt / Opportunities
- Route **handlers have no unit tests** — a thin request→response harness would let us
  assert the 401/403/400 contracts directly (the outreach fix above is currently only
  covered transitively by tsc/build). This is the main remaining test gap.
- Otherwise the audit was clean — the armada-built routes are well-structured.

### 4. The Next Epoch Roadmap
1. **Client a11y/perf spot-check** of the new components — icon-button `aria-label`s and
   the suppressed `LeadPanel.tsx:536` `<img>` (decide `next/image` + domain config vs a
   documented eslint-disable). Real findings only.
2. **Add a short testing note** (README/CONTRIBUTING) for the `setupIsolatedRedis`
   pattern.
3. **(If value holds) a minimal route-handler test harness** — build a fake
   NextRequest with headers/body and assert one mutating route's 401/403/400 paths
   (e.g. `/api/crm/custom-leads` or the outreach POST just hardened).
4. **Re-assess scope:** the high-value hardening (security, the LocalRedis bug, full lib
   coverage, authz unification, route-body safety) is now complete — steer remaining
   epochs toward genuine findings; avoid cosmetic churn.

---

## Epoch 10 — 2026-06-20
- Finished admin authz consolidation: 7 older routes migrated to shared `requireAdmin`;
  zero local admin closures remain (`broadcast` GET stays open). 212 tests (refactor).

## Epoch 9 — 2026-06-20
- `notifications.test.ts` (4) + `sequenceConfig.test.ts` (4). All Redis libs covered. 204 → 212.

## Epoch 8 — 2026-06-20
- `setupIsolatedRedis` helper + refactor onto it; `smartlists.test.ts` (5). 199 → 204.

## Epoch 7 — 2026-06-20
- `merge.test.ts` (9). 190 → 199.

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + `localRedis.test.ts` parity guard. 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` 5 missing commands; `__resetLocalRedis()` + `tasks.test.ts` (6). 177 → 183.

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; `.gitattributes`; wasted-query drop in `/api/crm/demos`.

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authz onto `requireAdmin`.

## Epoch 2 — 2026-06-20
- Extracted pure `validateRules()` + `automation.test.ts` (9). 168 → 177.

## Epoch 1 — 2026-06-20
- `requireAdmin(req)` + guarded `admin/funnel`/`template-stats`; `leads/route.test.ts` (8). 160 → 168.
