# Copper Bay Tech — Product Roadmap

_Last updated: 2026-06-01_

This roadmap covers improvements to the marketing site **and** the new
CRM + email-automation system introduced in this iteration. It is ordered
by priority and grouped into shippable phases.

---

## Phase 0 — Foundation (this PR)

The lead-capture → outreach → tracking loop. Shipped in this iteration:

- [x] **CRM data model & store** (`src/lib/crm/`) — contacts, activities, and
      per-email tracking with a pluggable storage interface (JSON-file adapter
      today, swap to a hosted DB for production — see "Storage" below).
- [x] **Lead capture wired to CRM** — the existing contact form now creates /
      updates a CRM contact in addition to emailing Duke.
- [x] **Outreach sending** (`POST /api/crm/outreach`) — send a templated email
      to one or more CRM contacts through Resend, with an embedded open-tracking
      pixel, correlation tags, and a compliant unsubscribe footer. Defaults to
      **dry-run**; real sends require `CRM_ADMIN_TOKEN` + `live:true`.
- [x] **Automatic CRM updates from email events** — Resend webhook
      (`POST /api/crm/webhook`) updates a contact to `opened` / `clicked` /
      `bounced` / `complained` the moment the event fires. A pixel fallback
      (`GET /api/crm/track/:id`) covers opens even without provider tracking.
- [x] **Reply detection** (`POST /api/crm/inbound`) — inbound-email webhook
      matches the sender to a contact and flips status to `replied`.
- [x] **Admin dashboard** (`/admin/crm`) — token-gated table of every lead,
      their status, last activity, and email engagement.
- [x] **Compliance guardrails** — one-click unsubscribe, suppression list,
      physical-address footer, dry-run-by-default sending.

## Phase 1 — Make the loop production-grade (next 1–2 weeks)

- [ ] **Durable storage.** The JSON-file store is ephemeral on Vercel. Move to
      Vercel KV / Upstash Redis or Postgres (Neon/Supabase). The `CrmStore`
      interface is already the single seam to swap.
- [ ] **Verify the sending domain** in Resend (SPF/DKIM/DMARC) so outreach
      lands in the inbox, not spam. Required before any real cold send.
- [ ] **Resend webhook signature verification** is implemented; wire the real
      `RESEND_WEBHOOK_SECRET` and register the endpoint in the Resend dashboard.
- [ ] **Sequences / drip campaigns.** Multi-step follow-ups ("no open after 3
      days → send variant B"). Add a `sequences` table + a cron route
      (`/api/crm/cron/tick`) driven by Vercel Cron.
- [ ] **Real auth** for `/admin/crm` (currently a shared token). Add a proper
      login (NextAuth / Clerk) before exposing publicly.
- [ ] **Rate limiting & batching** on outreach to respect Resend limits and
      avoid spam-trap behavior.

## Phase 2 — Conversion & growth (weeks 3–6)

- [ ] **Lead scoring** — weight opens/clicks/replies + service interest into a
      hot/warm/cold score surfaced on the dashboard.
- [ ] **Calendar booking** — embed Cal.com / Calendly; auto-log "meeting booked"
      as a CRM activity.
- [ ] **Audit-tool → CRM bridge** — when someone runs the free site/SEO/SSL
      audit, capture the email and create a contact pre-tagged with their score.
- [ ] **Templated proposals & quotes** off the PricingEstimator inputs.
- [ ] **A/B test outreach subject lines**, report open/reply rates per variant.

## Phase 3 — Site & content improvements (ongoing)

- [ ] **Analytics** — add privacy-friendly analytics (Plausible/Vercel) to
      measure funnel from visit → form → reply → close.
- [ ] **Performance budget** — keep LCP < 2.5s; the audit routes already lean on
      PageSpeed, dogfood it on our own pages in CI.
- [ ] **Accessibility pass** (WCAG 2.2 AA) across forms and interactive widgets.
- [ ] **Blog cadence** — 2 posts/month targeting Sonoma County IT keywords;
      cross-link to relevant services.
- [ ] **Structured data** (LocalBusiness, FAQ, BreadcrumbList) for richer SERP.
- [ ] **Testimonial/case-study capture flow** triggered after a "won" deal.

## Phase 4 — Platform hardening

- [ ] **Tests** — unit tests for the CRM store + webhook parsing; an e2e test
      for the capture→track loop.
- [ ] **Observability** — structured logging + error reporting (Sentry).
- [ ] **CI** — lint + typecheck + build on every PR (GitHub Actions).
- [ ] **Secrets hygiene** — document required env vars (see `docs/CRM_SETUP.md`),
      rotate keys, least-privilege Resend key.

---

## Architecture of the email-automation loop

```
 Visitor → Contact form ─┐
                         ├─▶ CRM store (contacts + activities + emails)
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

Status automatically advances along: `new → contacted → opened → clicked →
replied`, with `bounced` / `complained` / `unsubscribed` as terminal off-ramps.
Status never downgrades (a reply won't be overwritten by a later open).

## Storage

The default `JsonFileStore` persists to `CRM_DATA_DIR` (`.data/` by default).
This is fine for local dev but **ephemeral on serverless** — see Phase 1.
Swap by implementing the `CrmStore` interface in `src/lib/crm/store.ts`
against KV/Postgres; nothing else changes.

See `docs/CRM_SETUP.md` for required environment variables and the Resend
webhook setup.
