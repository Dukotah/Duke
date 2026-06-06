# Copper Bay Tech — Product Roadmap

_Last updated: 2026-06-01_

This roadmap covers improvements to the marketing site **and** the new
CRM + email-automation system introduced in this iteration. It is ordered
by priority and grouped into shippable phases.

---

## Phase 0 — Foundation (this PR)

The lead-capture → outreach → tracking loop. Shipped in this iteration:

- [x] **CRM data model & store** (`src/lib/crm/`) — contacts, activities, and
      per-email tracking, persisted to Upstash Redis (see "Storage" below).
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

- [x] **Durable storage.** _(done)_ The power-dialer store was migrated off the
      ephemeral local SQLite file to **Upstash Redis** (`src/lib/crm/store.ts`),
      the same backend `src/lib/db.ts` already uses. Leads, calls, and
      dispositions now survive serverless cold starts and Vercel's read-only FS.
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

Persistence runs on **Upstash Redis** (`src/lib/redis.ts`), shared with the
rest of the app (`src/lib/db.ts`). The power-dialer store (`src/lib/crm/store.ts`)
keys everything under a `crm:` prefix and is durable across serverless cold
starts. Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (see
`.env.example`). To move to Postgres later, reimplement the same async
functions in `store.ts`; the API routes already `await` them.

See `docs/CRM_SETUP.md` for required environment variables and the Resend
webhook setup.

---
---

# The Next 100 — improvement backlog (added 2026-06-06)

A prioritized menu of 100 concrete improvements for the site + CRM. Pick by
leverage. Most are buildable by an agent; a handful need Dukotah (**[owner]**).

**Effort key:** `S` ≈ <1 hr · `M` ≈ a few hrs · `L` ≈ a day+.
**Reality check:** on-page SEO is already strong; the biggest revenue levers are
OFF-site (Google Business Profile, real reviews, citations, backlinks) and only
the owner can pull them. Those are flagged **[owner]** and must not be faked.

**✅ Shipped from this list (2026-06-06):** #10 (/get-started guided funnel),
#94 (CRM health endpoint now checks lead-feed reachability + CRM_ADMIN_TOKEN +
webhook), #17 (/process "how we work" page),
#18 (who-we-are/aren't-a-fit-for, on /process), #21 (visible breadcrumbs in both
page templates + BreadcrumbList schema), #24 (hub FAQs — already present),
#26 (/locations matrix hub), #27 (visible "Updated" dates on blog posts),
#23 (matrix-driven "other services in this city" cross-sell block on every
service-city page), #1 (sticky mobile call/book bar —
consolidated the existing StickyCTA site-wide + route-aware), #19/#25 (Service
`AggregateOffer` price schema from `pricing.ts` on all service-city pages), #53
(CRM `previewUrl` "Demo" badge), #86 (first-touch lead-source attribution —
UTM/referrer/landing captured per session, folded into the CRM note + notify
email on BOTH the contact form and all 4 free-tool captures), #91 (baseline
security headers; strict CSP still TODO), #92 (Upstash rate limiting on
`/api/contact|capture|audit`, fails open), #93 (contact-form honeypot +
submit-timing spam gate). Many discrete a11y items
from #78–84 also shipped in the audit pass. **Already existed (no work needed):**
#76 (custom `not-found.tsx`); #16 trust signals are largely covered by the
existing `SocialProof` "Serving …" strip; #47 (Article/BlogPosting schema) was
already present on all 31 blog posts.

**NAP resolved (2026-06-06):** business is a **service-area business, no public
storefront** — schema is region-only + areaServed (no city HQ), and "based in
<city>" copy is now service-area language. The earlier Petaluma↔Santa Rosa
conflict is moot. ⚠️ Owner: set up the Google Business Profile as a service-area
business (hide address) and pick a CAN-SPAM mailing address for `MAILING_ADDRESS`.

## 1. Conversion rate optimization (CRO)
1. `M` Sticky mobile "call / book" bar after the hero scrolls off — one-tap `tel:` + `/schedule`.
2. `M` A/B-test hero CTA copy via a config-driven variant flag.
3. `S` Exit-intent / scroll-depth prompt offering the free audit (mobile-suppressed, reduced-motion aware).
4. `M` Inline mini "instant estimate" widget on each service page (not only `/pricing`).
5. `S` Trust microcopy under every form submit ("No spam. We reply within 1 business day.").
6. `M` Honest, config-driven "responds in ~X hrs" availability badge in nav/footer.
7. `S` Audit for plain-text phone numbers; make every instance a clickable `tel:`.
8. `M` "What happens next" 3-step timeline on `/schedule` to de-risk booking.
9. `S` Comparison-anchored CTA on city pages ("Most agencies bill hourly. We quote flat.").
10. `M` `/get-started` funnel (service → budget → timeline) that pre-fills the contact form.

## 2. Trust, proof & credibility
11. **[owner]** `S` Populate `REAL_REVIEWS` in `src/lib/reviews.ts` (unlocks rating schema + stars).
12. **[owner]** `S` Set `GOOGLE_REVIEW_URL` once GBP is live.
13. **[owner]** `S` Real founder headshot (`FOUNDER_HEADSHOT`) + LinkedIn (`SOCIAL.linkedin`).
14. `M` Replace "Representative example" testimonials with an honest "Why no reviews yet?" founder note until real ones exist.
15. `M` Real `/case-studies` template: before/after metrics, screenshots, verifiable client link (gated until real).
16. `S` Reusable trust-badges row (local, flat-fee, month-to-month, no offshore).
17. `M` "Process" page (discovery → build → launch → support) with honest timelines.
18. `S` "Who we're NOT a fit for" section — counter-signaling that builds trust.

## 3. Local SEO & on-page content
19. `M` One source-of-truth `LocalBusiness` + `GeoCoordinates` + full `areaServed` JSON-LD.
20. `S` Unique per-page `og:image` for every service-city page via the `opengraph-image` route.
21. `M` Visible breadcrumb UI (not just schema) on all service/city pages.
22. `S` Canonical self-reference + `lang` correctness audit across all pages.
23. `M` Matrix-driven "related services in {city}" block so every page auto-links siblings.
24. `M` Homepage + service-hub FAQ sections (FAQPage schema) for "people also ask".
25. `S` `Service` schema `offers`/`priceRange` pulled from `src/config/pricing.ts`.
26. `M` `/locations` hub page listing every city × services offered (matrix landing).
27. `S` Visible "last updated" dates on blog posts (E-E-A-T freshness).

## 4. Programmatic / local expansion
28. `M` Remaining service×city pages only where unique content exists.
29. `L` **[owner]** Second-county expansion (Marin/Napa) — service-area decision first.
30. `M` `industries × city` pages ("Winery websites in Healdsburg") where demand is real.
31. `M` Santa Rosa neighborhood/landmark pages (Railroad Square, Montgomery Village) by volume.
32. `S` Privacy-safe coarse-geo "nearest city page" suggester.
33. `M` Per-city "local tech resources" page (chamber, SBDC, broadband) — earns links.
34. `S` Split sitemap index (pages / blog / locations) as URL count grows.

## 5. New lead-magnet tools
35. `M` "Website grader" → emailed PDF report (extends the audit).
36. `M` Mobile-friendliness instant checker (screenshot + viewport).
37. `M` Domain/email security checker (SPF/DKIM/DMARC/DNSSEC) — extends `/tools/email-headers`.
38. `M` Hospitality "downtime cost calculator" (outage × revenue/hour).
39. `M` "Ransomware readiness quiz" → tailored checklist + CRM lead.
40. `S` GBP completeness checklist tool (no API).
41. `M` SSL/HTTPS + mixed-content scanner for a URL.
42. `M` Accessibility quick-scan (axe-core in browser) for a pasted URL.
43. `S` Upgrade `/tools/password` with HIBP k-anonymity breach check.
44. `M` Branded PDF export for every tool result, gated behind email.

## 6. Blog & content marketing
45. `M` Migrate hand-built blog pages to an MDX/content collection (new post = data file).
46. `S` Related-posts block + category tags per article.
47. `M` Author bio + `BlogPosting` schema with `datePublished`/`dateModified`.
48. `M` Table-of-contents + reading-time on long posts.
49. `S` End-of-post newsletter capture (soft CRM lead).
50. `M` 5 high-intent comparison posts ("Wix vs custom for a winery", vs competitors).
51. `M` Monthly "Sonoma County small-business tech" roundup (freshness + links).
52. `S` Social share buttons + auto per-post OG images.

## 7. CRM & sales tooling
53. `M` Surface the new `previewUrl` in the lead list/kanban + a "has demo" filter/badge.
54. `M` Global `lead_meta` hash for cross-rep tags/notes (extends the `lead_previews` pattern).
55. `M` One-click "generate outreach site" button in LeadPanel that triggers the `/websites` factory.
56. `M` Lead dedupe across CSV + custom leads by normalized name/domain (`previewKey` generalizes).
57. `M` "Today's call list" smart queue (tier-A + best-time + not-contacted-recently).
58. `S` Power-dialer keyboard shortcuts (j/k navigate, c call, e email, d disposition).
59. `M` Pipeline value forecast widget (claimed × tier conversion estimate).
60. `M` Drag-drop CSV import → custom leads with column mapping.
61. `M` Per-rep activity heatmap + streaks (data already in `getWeeklyCallHistory`/`getStreak`).
62. `S` Cmd-K command palette in the CRM (jump to lead/city/tool).

## 8. Outreach & email automation
63. `M` Wire server-side events so the existing `track()` booking funnel actually flows.
64. `M` Open/click tracking + link wrapping on outreach (with unsubscribe — CAN-SPAM).
65. `M` Auto-advance the 4-touch cadence via a scheduled job instead of manual sends.
66. `S` Per-lead "best send time" suggestion (extends `bestTimeToCall`).
67. `M` Reply-detection inbox view (IMAP/webhook) inside the CRM.
68. `M` A/B subject-line testing in `BulkOutreach` with win-rate tracking.
69. **[owner]** `S` Set `OUTREACH_DOMAIN_VERIFIED_DATE` to enable the warm-up auto-ramp.

## 9. Performance & technical SEO
70. `M` Swap `<img>` → `next/image` once real assets exist (Portfolio note flags this).
71. `S` Correct `priority`/lazy-loading on hero vs below-fold images.
72. `M` Lighthouse CI gate (GitHub Action) failing on perf/a11y/SEO regressions.
73. `S` Cache-Control / ISR tuning on the lead CSV fetch + dynamic routes.
74. `M` Self-host fonts with `next/font` to kill layout shift.
75. `S` `preconnect` audit for third-party origins.
76. `M` Structured 404/500 pages with helpful links + search.
77. `S` Promote `scripts/sitemap-audit.mjs` to a CI check.

## 10. Accessibility & UX polish
78. `M` axe + manual keyboard pass on every page type; fix focus traps, contrast, labels.
79. `S` Visible focus rings + `aria-label`s on forms, icon buttons, nav.
80. `S` `prefers-reduced-motion` everywhere framer-motion animates (audit the rest).
81. `M` Skip-to-content link + landmark roles in the layout.
82. `S` Verify `#F97316` text contrast meets WCAG AA on light backgrounds.
83. `M` Form error summaries with screen-reader focus management.
84. `S` Mobile tap-target audit (44px min) across nav, cards, CTAs.

## 11. Analytics & measurement
85. `M` Server-side conversion events (form submit, audit run, booking).
86. `S` UTM capture on inbound + store source on the CRM lead (`intake.ts` has the hook).
87. `M` Internal funnel dashboard (views → audit → lead → booked).
88. `S` Add Vercel Speed Insights (Web Vitals) + monthly summary.
89. `M` Per-city / per-service conversion tracking (which local pages convert).
90. **[owner]** `S` Flip on "Web Analytics" in the Vercel dashboard.

## 12. Security & ops
91. `S` CSP + standard security headers (middleware / `next.config`).
92. `M` Rate-limit public API routes (`/api/contact`, `/api/audit`, `/api/capture`) via Upstash.
93. `S` Honeypot + timing check on public forms (no captcha).
94. `M` Expand `/api/crm/admin/health` (Redis, Resend, CSV reachability, env presence) + structured logging.

## 13. /websites factory integration
95. `M` `previewUrl` filter + bulk "push demos to CRM" UI button calling the new endpoint.
96. `M` Two-way sync: mark a demo "engaged" in gallery analytics when a prospect replies.
97. `S` Per-demo view-count ping back to the CRM lead ("they opened it 3×").

## 14. Productized / client-facing features
98. `L` Lightweight client portal (project status, invoices, tickets) reusing CRM auth.
99. `M` Branded "report card" PDF generator (site + security + SEO snapshot) for prospects.
100. `M` Productized "monthly care plan" page + Stripe checkout (recurring revenue tiers).

---

### Suggested first sprint (high leverage, low risk, no owner dependency)
**#23** auto related-services block · **#19/#25** consolidated LocalBusiness + price schema ·
**#53** surface `previewUrl` in the queue · **#1** sticky mobile call bar · **#78–82** the a11y pass ·
**#91/#93** security headers + form honeypot.

### Owner unlocks (do these and the SEO/trust work compounds)
**#11/#12** reviews + Google review URL · **#13** headshot + LinkedIn ·
**#69/#90** outreach ramp + Vercel Analytics toggle · **Google Business Profile** (the single
biggest local-ranking lever).
