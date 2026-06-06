# Copper Bay Tech — Product Roadmap

_Last updated: 2026-06-06_

This roadmap covers improvements to the marketing site **and** the CRM + email-automation
system. Ordered by priority and grouped into shippable phases.

---

## Phase 0 — Foundation ✅ DONE

- [x] CRM data model & store (contacts, activities, per-email tracking in Upstash Redis)
- [x] Lead capture wired to CRM (contact form + audit tool → CRM contact)
- [x] Outreach sending (Resend, tracking pixel, unsubscribe footer, suppression list)
- [x] Automatic CRM updates from email events (Resend webhook)
- [x] Reply detection (inbound email webhook)
- [x] Admin dashboard (health checks, rep management, leaderboard, broadcast)
- [x] Power-dialer UI (lead queue, call logging, email compose, activity timeline)
- [x] Durable storage (Upstash Redis, survives serverless cold starts)
- [x] Compliance guardrails (CAN-SPAM, one-click unsubscribe, suppression list)
- [x] 98 unit/integration tests passing

---

## Phase 1 — Close the Loop (current sprint)

**Goal**: automated follow-up sequences fire without human intervention; lead scoring
surfaces hot leads visually; CI runs on every push.

- [ ] **Drip sequences / cron** — Vercel Cron job at `/api/crm/cron/tick` checks
      contacts in `contacted` state with no reply after N days and sends follow-up
      variant. Config in `playbook.ts`.
- [ ] **Lead score display** — surface the calculated score as a colored badge on
      each lead card in the dashboard. Sort queue by score descending by default.
- [ ] **GitHub Actions CI** — lint + typecheck + build + test on every PR push.
- [ ] **Password reset flow** — email-based reset for CRM login (ADMIN_EMAIL via Resend).
- [ ] **Audit tool timeout enforcement** — wrap all external HTTP calls in
      AbortController with 8s timeout; return partial results gracefully.
- [ ] **Resend webhook signature verification** — wire `RESEND_WEBHOOK_SECRET` to
      the existing verification code in `webhook.ts`.

---

## Phase 2 — Conversion & Growth (weeks 3–6)

- [ ] **Calendar booking embed** — embed Cal.com on /schedule; auto-log "meeting booked"
      as a CRM activity via Cal webhook.
- [ ] **Templated proposals** — generate a PDF/HTML proposal from PricingEstimator
      inputs; email it to the prospect with one click from the CRM.
- [ ] **A/B subject line testing** — two variants per sequence step; track open/reply
      rates per variant; surface winner in admin analytics.
- [ ] **Audit score in lead card** — show the website audit score (PageSpeed, SSL,
      compliance) alongside each lead for better cold-call context.
- [ ] **Missed-call SMS fallback** — if a rep logs "no answer" twice, trigger an
      automated SMS via Twilio (opt-in only).

---

## Phase 3 — Site & SEO Polish (ongoing)

- [ ] **Performance budget** — keep LCP < 2.5s; run Lighthouse in CI and fail if
      score drops below 85.
- [ ] **Accessibility pass** — WCAG 2.2 AA across all forms and interactive widgets.
- [ ] **Blog cadence automation** — a `scripts/new-post.mjs` scaffold that generates
      the frontmatter + outline for a new post; tracks published count vs. goal.
- [ ] **Internal linking audit** — script to find blog posts missing links to their
      relevant service or city page.
- [ ] **Testimonial capture flow** — after a deal is marked "won" in CRM, trigger
      an automated email asking for a Google review (with direct link).
- [ ] **Structured data expansion** — FAQ schema on service pages; HowTo on tool pages.

---

## Phase 4 — Platform Hardening

- [ ] **Observability** — structured logging (console → JSON in prod) + Sentry for
      error reporting on both client and server.
- [ ] **Secrets hygiene** — document all required env vars with types/defaults in
      `.env.example`; rotation runbook in docs.
- [ ] **E2E tests** — Playwright smoke test for: home page loads, audit tool runs,
      CRM login, send email from dashboard.
- [ ] **Redis key TTL strategy** — set appropriate TTLs on transient keys (sessions,
      rate-limit counters) to avoid unbounded Redis growth.
- [ ] **Admin: actionable error states** — setup tab shows not just red/green but
      a one-line fix instruction for every failing check.

---

## IMPROVEMENTS (ideas worth building eventually)

- **Multi-tenant** — turn Duke into a product other agencies can use. Namespace all
  Redis keys by tenant ID; add a billing/plan layer.
- **AI lead intel** — GPT-4o call on contact creation to summarize the prospect's
  website and suggest the best opening line.
- **Call recording & transcription** — integrate Twilio Conversations + Whisper to
  auto-summarize calls and push the summary into the CRM activity log.
- **Chrome extension** — "Add to CRM" button when browsing a prospect's LinkedIn or
  website.
- **Mobile app** — React Native wrapper around the power-dialer so the owner can
  work leads from their phone.

---

## Architecture Reference

```
 Visitor → Contact form ─┐
                         ├─▶ CRM store (contacts + activities + emails) ←── Cron tick
 Manual / import lead ───┘            ▲           ▲            ▲
                                      │           │            │
 POST /api/crm/outreach ──▶ Resend ───┘  open ────┘  reply ────┘
   (templated, tracked,         │   /click/bounce      (inbound
    unsubscribe footer)         │   webhook            email
                                ▼   → /api/crm/webhook  webhook)
                        recipient inbox                → /api/crm/inbound
                                │
                                └─ open pixel → GET /api/crm/track/:id (fallback)
```

Status progression: `new → contacted → opened → clicked → replied`
Terminal states: `bounced`, `complained`, `unsubscribed`
Status never downgrades.
