# Copper Bay Tech — Project Backlog (100 tasks)

_Drafted 2026-06-06. Companion to `ROADMAP.md` (phased) and `FREEMIUM_ROADMAP.md`._

A prioritized, actionable backlog across the whole project — marketing site,
free tools, CRM/automation, infra, and growth. Grouped by theme; each item is
scoped to be a single PR-sized chunk. **🔴 = do soon / blocking, 🟡 = high value,
🟢 = nice-to-have.** Items marked **(legal)** carry compliance risk.

---

## A. Pre-deploy gate — security, legal, trust (do first)

1. 🔴 **(legal)** Replace fake case studies/testimonials on `/work` with real,
   client-approved ones — or clearly label as illustrative. FTC 16 CFR Part 465.
2. 🔴 **(legal)** Set a real CAN-SPAM postal address in `MAILING_ADDRESS` /
   `src/config/site.ts`; it's referenced by every outreach + auto-reply footer.
3. 🔴 SSRF guard for all server-side fetch-by-user-URL endpoints (presence,
   audit, ssl, seo, headers, dns, tech, links, crawl, schema): block
   private/loopback/link-local IPs and non-http(s) schemes.
4. 🔴 Rate-limit every public scan endpoint + `/api/capture` + `/api/contact`
   (per-IP) using `src/lib/rate-limit.ts`. Land the unmerged rate-limit branch.
5. 🔴 Escape user input interpolated into outbound email HTML (`/api/capture`,
   `/api/contact`, audit-lead) — prevent HTML/script injection.
6. 🔴 Zod-validate all public POST bodies (email, url, free-text length caps).
7. 🔴 Honeypot + timing check on all public forms (contact, business-analysis,
   subscribe, assessment) to cut bot lead spam.
8. 🟡 Unify NAP/address across `JsonLd.tsx`, `Footer.tsx`, and `site.ts`
   (Petaluma vs Santa Rosa inconsistency hurts local SEO + looks sloppy).
9. 🟡 Secrets hygiene: confirm no real keys committed in `.env.local`; rotate the
   Upstash token if it has been; document least-privilege Resend key.
10. 🟡 Add `SECURITY.md` + a `security.txt` route for responsible disclosure.

## B. Freemium "Business Analysis" (see FREEMIUM_ROADMAP.md for detail)

11. 🔴 Audit → CRM bridge: `/api/capture` creates/updates a scored CRM lead.
12. 🔴 Actually email the promised full report (server-rendered, with link).
13. 🔴 `verified: boolean` on scan results + neutral "couldn't verify" UI state.
14. 🔴 Rule-engine guard: never recommend a category that already passed.
15. 🟡 Stream scan results per-category instead of awaiting all four.
16. 🟡 Tag freemium leads with source + recommended service for outreach pre-fill.
17. 🟡 Funnel analytics events across the whole flow (depends on #61).
18. 🟢 Persist scans + shareable read-only results page `/business-analysis/r/[id]`.
19. 🟢 Monthly re-scan cron + "your score changed" email.
20. 🟢 Local-competitor benchmark in results (uses scraper data).

## C. CRM core & data model

21. 🔴 Reconcile storage: the CRM reads SQLite (`node:sqlite`, `.data/crm.db`)
    which is **ephemeral on Vercel**, while Redis holds users/suppression. Pick
    one durable backend (Postgres/Neon or Upstash) behind the `CrmStore` seam.
22. 🔴 Migration + seed scripts for the chosen durable store; backup/restore path.
23. 🟡 Single source of truth for "a lead": today CSV leads + custom leads +
    website-owned leads + capture leads live in different places. Unify the read
    model so every lead (incl. freemium captures) shows in the dialer queue.
24. 🟡 Lead dedup/merge (email/phone/business) across all sources on write.
25. 🟡 Lead scoring v2: fold email opens/clicks/replies + freemium grade +
    service interest into the heat score (ROADMAP Phase 2).
26. 🟡 Soft-delete + audit trail on lead edits (who changed stage, when).
27. 🟢 Lead tags / custom fields for segmentation.
28. 🟢 CSV import UI in admin (today scraper CSV is fetched; add manual upload).
29. 🟢 Export leads/activities to CSV from admin.
30. 🟢 Bulk stage/owner actions in the dialer queue.

## D. Email automation & deliverability

31. 🔴 Verify the sending domain in Resend (SPF/DKIM/DMARC) per `DELIVERABILITY.md`;
    flip `OUTREACH_DOMAIN_VERIFIED=true` only after.
32. 🔴 Wire `RESEND_WEBHOOK_SECRET` + signature verification; update lead status on
    open/click/bounce/complaint (currently track-only, no real event ingestion).
33. 🔴 Inbound reply handling (Cloudflare Email Routing → `/api/crm/inbound`) to
    auto-flip leads to `replied`.
34. 🟡 Sequence/drip engine + Vercel Cron tick (`/api/crm/cron/tick`): multi-step
    follow-ups with stop-on-reply. Backbone for freemium + cold outreach.
35. 🟡 Warm-up ramp enforcement (10→200/day) tied to the daily cap.
36. 🟡 A/B subject-line testing with per-variant open/reply reporting.
37. 🟡 Server-side template store (templates currently live in browser
    localStorage — they don't sync across devices/reps).
38. 🟡 Real open/click pixel + redirect tracking wired to lead timeline.
39. 🟢 Send-time scheduling / timezone-aware sends.
40. 🟢 Per-lead "do not contact" + global suppression UI parity.

## E. Auth & access control

41. 🔴 Replace shared `CRM_ADMIN_TOKEN` / `ADMIN_PASSWORD=admin` with real auth
    (Clerk or NextAuth) before the CRM is reachable in prod.
42. 🟡 Role model: admin vs rep enforced server-side on every `/api/crm/*` route
    (today several rely on client-sent `x-user-role`).
43. 🟡 Session hardening: rotate `SESSION_SECRET`, short-lived tokens, logout-all.
44. 🟢 Audit log of admin actions (suppress, delete rep, resolve submission).
45. 🟢 Per-rep API rate limiting on outreach send.

## F. Lead-gen tools (the free audit suite)

46. 🟡 De-duplicate overlapping tool routes: `/it-health-check` vs `/assessment`,
    `/tools/health-check` vs `/it-health-check`, `/audit` vs `/report` vs
    `/business-analysis`. One canonical per job; 301 the rest.
47. 🟡 Capture leads from *all* tools (most scan tools don't capture today) — add
    an optional "email me this report" on every tool, feeding the CRM bridge.
48. 🟡 Downloadable PDF report for audit/business-analysis (shareable artifact).
49. 🟡 Cache scan results per-URL (short TTL) to cut PageSpeed quota + speed UX.
50. 🟢 Add a "competitor compare" mode to the audit (we have `/compare` + tech).
51. 🟢 Consolidate the 15+ scan endpoints behind a shared fetch/normalize util
    (timeouts, UA, error shape) — lots of duplicated logic today.
52. 🟢 Tool result history for returning visitors (depends on persistence).

## G. SEO & content

53. 🟡 Move blog from 30 hardcoded TSX pages to MDX/content-collection so posts
    are data, not code (enables cadence + bulk edits).
54. 🟡 Programmatic service×city pages from a single template + data table
    (covers more long-tail without hand-authoring each).
55. 🟡 BreadcrumbList + FAQ + Service JSON-LD audit across all pages (some have it,
    coverage is uneven).
56. 🟡 Internal-linking pass: every blog post links to ≥2 services + ≥1 location.
57. 🟡 Blog cadence: 2 posts/month on Sonoma County IT/web/AI keywords (ROADMAP).
58. 🟢 Auto-generate OG images per page (script exists — wire it into build).
59. 🟢 `lastModified` accuracy in `sitemap.ts` from git/file mtime, not hardcoded.
60. 🟢 Add hreflang/region signals only if expanding beyond Sonoma County.

## H. Analytics & measurement

61. 🔴 Install privacy-friendly analytics (Vercel/Plausible) — currently none, so
    no funnel visibility anywhere. Blocks honest iteration on freemium + tools.
62. 🟡 Define + fire conversion events (form submit, tool complete, call booked).
63. 🟡 Lead-source attribution dashboard (freemium vs contact vs tool vs blog).
64. 🟡 CRM funnel report: new → contacted → replied → booked → won, by source.
65. 🟢 UTM capture on first touch persisted onto the lead record.
66. 🟢 Server-side event log for tool usage (counts per tool, error rates).

## I. Performance & accessibility

67. 🟡 Performance budget: LCP < 2.5s on home/service/blog; dogfood our own audit
    in CI and fail the build on regressions.
68. 🟡 WCAG 2.2 AA pass on all forms + interactive widgets (focus states, labels,
    contrast, keyboard nav for the dialer).
69. 🟡 Image optimization sweep (sharp is installed) — ensure next/image + sizes.
70. 🟢 Reduce client JS on marketing pages (many are client components that could
    be server components).
71. 🟢 Add skeleton/streaming states to slow tool pages.
72. 🟢 Prefetch/Link warm-up for the primary funnel (home → service → schedule).

## J. Testing & quality

73. 🔴 GitHub Actions CI: lint + typecheck + `vitest run` + `next build` on every
    PR (no CI exists today; parallel-agent branches merge unverified).
74. 🟡 Playwright E2E for the money paths: contact submit, business-analysis scan,
    CRM login → dialer → log call → send outreach. (Land the e2e branch.)
75. 🟡 API route tests with mocked Resend/Redis (outreach gating, capture, webhook).
76. 🟡 Component tests (add jsdom to vitest) for forms + the results UI.
77. 🟢 Contract test for the website manifest → CRM sync (`leadMatch`).
78. 🟢 Visual regression on key pages (Playwright screenshots).
79. 🟢 Seed/fixtures for a realistic demo CRM dataset for local dev + demos.

## K. Observability & ops

80. 🟡 Error reporting (Sentry) on API routes + client (ROADMAP Phase 4).
81. 🟡 Structured logging with request IDs across `/api/*`.
82. 🟡 Health endpoint expansion + an uptime check on the public site + CRM.
83. 🟢 Alerting on outreach failures / bounce-rate spikes.
84. 🟢 Cost guardrails + alerting on PageSpeed/Resend/Upstash usage.

## L. Admin & rep experience

85. 🟡 Calendar booking embed (Cal.com/Calendly) on `/schedule` that auto-logs a
    "meeting booked" CRM activity (ROADMAP Phase 2; `CALENDLY_URL` already set).
86. 🟡 Templated proposals/quotes generated from PricingEstimator inputs.
87. 🟡 Dialer keyboard shortcuts + next-best-lead flow for speed.
88. 🟢 In-app notifications/broadcasts surfaced to reps (backend exists).
89. 🟢 Rep leaderboard polish + streaks/goals UI (backend exists).
90. 🟢 Mobile-friendly CRM dialer view.

## M. Growth & product expansion

91. 🟡 Referral capture flow triggered after a "won" deal (ask for referral +
    review). Feeds both testimonials (#1) and new leads.
92. 🟡 Post-deal review-request automation (Google Business Profile link).
93. 🟢 Embeddable "site score badge" from freemium for soft virality.
94. 🟢 Niche landing pages tied to the scraper's verticals (restaurants, wineries,
    law, dental, real estate) with a tailored freemium scan.
95. 🟢 Productized "monthly care plan" page (recurring revenue offer) wired to CRM.
96. 🟢 Partner/affiliate page for referrers.
97. 🟢 Localized content hub / resource center for SEO authority.
98. 🟢 Live chat → CRM lead bridge (ChatWidget exists; capture conversations).
99. 🟢 Win-back sequence for `lost`/cold leads after N days.
100. 🟢 Quarterly "state of your online presence" report to existing clients
     (retention + upsell touchpoint, reuses the freemium scan engine).

---

### Suggested sequencing

- **Sprint 1 (gate):** A1–A9, B11–B14, D31, E41 — make it safe + legal + the
  freemium loop actually closes.
- **Sprint 2 (measure + automate):** H61–H64, D32–D34, C21–C23, J73.
- **Sprint 3 (convert):** B15–B17, F46–F49, L85, G53–G57.
- **Then:** harden (J/K), expand (M), and layer freemium Option B (B18–B20).
