# Tasks — Phase 1: Close the Loop

_Last updated: 2026-06-06_

## Done

### T1 — GitHub Actions CI ✅
`.github/workflows/ci.yml` — lint, typecheck, test, build on every push/PR.

### T2 — Drip sequence cron ✅
`/api/crm/cron/tick` + `vercel.json` (runs daily at 10am UTC).
3-step sequence templates in `src/lib/crm/sequences.ts`.
9 new tests. Respects suppression list, daily cap, domain verification gate.

### T3 — Lead score display ✅
Already implemented in existing `CallQueue` (colored score circle) and `AllLeads` (ScoreBar).
Queue sorted by `outreach_score` descending by default. No change needed.

### T4 — Audit tool timeout enforcement ✅
Already implemented in all audit routes that fetch user-provided URLs.
`schema/`, `tech/`, `compliance/`, `crawl/`, `seo/`, `links/`, `headers/` all use `AbortSignal.timeout`.

### T5 — Password reset flow ✅
`/api/crm/reset-request`, `/api/crm/reset-confirm`, `/crm/reset` page.
"Forgot password?" link on login. Redis token with 1h TTL.

### T6 — Resend email events webhook ✅
`/api/crm/email-events`: receives opened/clicked/bounced/complained events.
Signature verified when `RESEND_WEBHOOK_SECRET` set. Bounces auto-suppress.
`verifyResendSignature` (already existed) now actually wired to a route.

## Doing

_(starting Phase 2 now)_

## Todo — Phase 2

### T7 — Admin setup tab: actionable error states
When a health check fails, show a one-line fix instruction, not just a red dot.
Current: setup tab shows green/red for each integration.
Target: failing checks show "Fix: set RESEND_API_KEY in Vercel env vars" etc.

### T8 — Blog post: IT support for Sonoma County restaurants
New SEO post targeting "IT support for restaurants Sonoma County".
Internal links to /services/it-support and /industries/restaurants.

### T9 — FAQ schema on service pages
Add FAQPage JSON-LD to /services/it-support, /services/cybersecurity, /services/web-development.
3 FAQs per page targeting common prospect questions.

### T10 — Testimonial capture trigger
After admin marks a submission "accepted", auto-send an email to the client
asking for a Google review (direct link to the CBT Google Business Profile).

### Todo — Phase 2

Set up `.github/workflows/ci.yml`: install deps, lint, typecheck, build, test.
Runs on push to any branch and on PRs to main.
**Definition of done**: green check appears on every PR.

### T2 — Drip sequence cron
Create `/api/crm/cron/tick` route. On each tick:
1. Load all contacts in `contacted` state
2. For each: check time since last outreach activity
3. If > configured delay (default 3d) and not unsubscribed/bounced → send next sequence step
4. Log activity, advance step counter on contact record
Config lives in `src/lib/crm/playbook.ts` (already has sequence defs).
Add Vercel Cron entry in `vercel.json`.
**Definition of done**: tick route runs, sends follow-ups, logs activity. Manual curl test passes.

### T3 — Lead score badge in dashboard
The score is calculated; it's not displayed. Add a colored badge (red/yellow/green)
to each lead card in `CRMDashboard.tsx`. Sort queue by score descending by default.
**Definition of done**: dashboard shows colored score; hot leads appear at top.

### T4 — Audit tool timeout enforcement
Every external fetch in `src/app/api/` audit routes lacks an AbortController timeout.
Wrap each in a helper that enforces 8s max, catches AbortError, returns `{error: "timeout"}`.
**Definition of done**: no audit route can hang longer than 8s. Tests cover timeout case.

### T5 — Password reset flow
Add `POST /api/crm/reset-request` (takes email, sends reset link via Resend) and
`POST /api/crm/reset-confirm` (takes token, updates password). Token stored in Redis
with 1h TTL. UI: "Forgot password?" link on `/crm/login`.
**Definition of done**: owner can reset password via email without touching env vars.

### T6 — Resend webhook signature verification
`src/lib/crm/webhook.ts` has the verification code but it's gated behind a secret
being present. Ensure `RESEND_WEBHOOK_SECRET` is documented in `.env.example` and
the verification is enforced (not optional) in production.
**Definition of done**: webhook returns 401 if signature missing/invalid. Covered by test.

## Done

_(Phase 0 items — see ROADMAP.md)_
