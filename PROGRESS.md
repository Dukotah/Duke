# Progress Log

_Running log — most recent first._

## 2026-06-06 — Session 2 (continued)

**State on completion**: Build clean, 108 tests passing, lint clean.
All Phase 1, 2, 3, and 4 items complete (except Sentry observability which requires external account).

### Shipped this session

**Phase 1 (T1–T6)** — All done:
- T1: GitHub Actions CI (lint, typecheck, build, test)
- T2: Drip sequence cron (`/api/crm/cron/tick`, vercel.json)
- T3: Lead score display in dashboard queue
- T4: Audit tool timeout enforcement (already done)
- T5: Password reset flow (`/crm/reset`, reset-request, reset-confirm)
- T6: Resend webhook signature verification

**Phase 2 (T7–T10)** — All done:
- T7: Setup tab shows actionable "Fix:" instructions for failing health checks
- T8: IT support for restaurants Sonoma County blog post
- T9: FAQ schema on all 3 service pages
- T10: Review request email when deal accepted

**Phase 3** — All done:
- Blog scaffold script (`scripts/new-post.mjs`)
- Internal linking: 34/34 blog posts link to service/industry pages
- Internal link audit tool (`scripts/link-audit.mjs`)
- Canonical tags: 34/34 blog posts + 5 industry pages + 5 service pages
- HowTo JSON-LD schema on tool pages (health-check, missed-call-calculator)
- New blog posts: real estate IT, cybersecurity for law firms
- New city IT support pages: Sebastopol, Rohnert Park

**Phase 4** — Partial:
- Playwright E2E smoke test suite (10 tests, `npm run test:e2e`)
- Rate limiting on ALL 12 public-facing API routes (was only on /api/ada)
- Redis key TTL audit — all transient keys have TTLs; no unbounded growth

**Skipped**: Sentry observability (requires external account setup)

---

## 2026-06-06 — Session start

**State on arrival**: Build clean, 98 tests passing, lint clean.
Phase 0 fully done. Phase 1 planned in TASKS.md.
