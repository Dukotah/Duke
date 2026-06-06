# Handoff: Copper Bay Tech (`/duke`) — building locally, push deferred

_Last updated: 2026-06-06_

## Latest (2026-06-06, part 10) — pages batch + DEPLOY #2
Shipped via a 7-agent workflow + my template work: **#26** `/locations` hub (matrix of every city × services, from `serviceCities.ts`), **#17/#18** `/process` page (how-we-work + fit/not-fit), **#21** visible breadcrumbs in `ServiceCityPage` + `CityPage` (+ BreadcrumbList schema, city crumb → `/locations`), **#27** visible "Updated <date>" on blog posts that lacked one, **#24** hub FAQs (already present, no change). Wired `/locations`+`/process` into sitemap + footer. Fixed the `/process` agent's Nav bug (dark hero needs default `<Nav />`, not `light`). Build now **172 static pages**; tsc+eslint+link-audit+build clean. Pushed → Vercel (deploy #2).

## Latest (2026-06-06, part 9) — NAP resolved + #23 + DEPLOY
- **NAP decision (owner): service-area business, no public storefront.** Schema (`JsonLd` + `Footer`) is now region-only `PostalAddress` + `areaServed`/`GeoCircle` (no `addressLocality`/`postalCode`). All "based in Petaluma" HQ claims → service-area copy (kept served-city lists + page-target locales). Email sign-offs → "Sonoma County, CA". This supersedes the earlier Santa Rosa schema change. ⚠️ Owner: configure the **Google Business Profile as a service-area business** (address hidden) and set a real `MAILING_ADDRESS` for CAN-SPAM.
- **#23:** matrix-driven "Other services we offer in {city}" cross-sell block on every service-city page (new `src/config/serviceCities.ts`).
- **#47:** Article schema already present on all 31 posts — no change.
- **DEPLOYED:** pushed to `origin/main` → Vercel build (this is the first push of this whole batch; ~37 commits). For browser review.

## Latest (2026-06-06, part 8) — lead-source attribution (#86)
New `src/lib/attribution.ts` + `AttributionTracker` (site-wide) capture first-touch UTM/referrer/landing once per session. Wired through BOTH inbound paths: the contact form (`/api/contact` → `captureContactLead` note + Duke's notify email) and all 4 free-tool captures (`/api/capture` → `captureToolLead` note). So every CRM lead now records where the prospect came from. `tsc`+`eslint`+`next build` clean. **Now 34 commits ahead** (websites: 1).

## Latest (2026-06-06, part 7) — roadmap sprint cont'd
- **#1 consolidated:** discovered my new `MobileCTABar` duplicated the existing `StickyCTA` (homepage-only). Deleted `MobileCTABar`; made `StickyCTA` route-aware + rendered site-wide from the root layout with one shared mobile spacer; removed the redundant per-page spacers (/about, /faq, /it-health-check, home) — also fixes an audit nit.
- **#19/#25:** `serviceSchema` emits a schema.org `AggregateOffer` (lowPrice/highPrice/USD) sourced from `pricing.ts`; all ~30 service-city pages now carry valid price rich-data. Added numeric `low`/`high` to `PRICING`.
- **#92:** new `src/lib/rateLimit.ts` (fixed-window Upstash limiter, **fails open**) on `/api/contact` (5/10min), `/api/capture` (10/10min), `/api/audit` (8/10min), keyed by client IP → 429 over limit.
- ✅ `tsc` + `eslint` + `next build` (170 pages) clean. **Now 31 commits ahead** (websites: 1). #76 already existed; #16 covered by `SocialProof`.

## Latest (2026-06-06, part 6) — roadmap sprint
Shipped 4 backlog items (commit, all building clean — now **28 commits ahead**):
- **#91 Security headers** on every route via `next.config.ts` `headers()` (HSTS, nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy, Permissions-Policy). Strict CSP intentionally deferred (inline styles/JSON-LD/framer) — do it report-only first.
- **#93 Contact-form anti-spam:** hidden honeypot (`company_website`) + submit-timing (<2s) check; server drops silently (no email, no CRM lead, returns ok).
- **#1 Sticky mobile call/book bar** (`src/components/MobileCTABar.tsx`) — reveals after 500px scroll, hides on `/crm` + utility routes.
- **#53 CRM "Demo" badge** — violet pill in `CallQueue` when a lead has a `previewUrl` (the /websites loop surfaces in the queue now).

## Latest (2026-06-06, part 5) — "finish it" push
Big multi-agent push to get close to a finished product:
- **Service×city matrix COMPLETE** (8 more pages): finished the Guerneville / Bodega Bay / Glen Ellen trios + Cotati. Every meaningful Sonoma County town now has its relevant web/IT/cyber pages, all sitemap'd + cross-linked.
- **`ROADMAP.md`** got a "Next 100" backlog (14 categories, effort-tagged, owner-deps flagged).
- **`scripts/link-audit.mjs`** added — internal-link integrity check (passes clean, 123 routes). Confirmed sitemap is correct (flagged items are intentional `next.config` 301s).
- **4-dimension site audit → fixes applied** (commit): all 31 blog posts now have canonical + OG; NAP corrected to Santa Rosa in schema (JsonLd + Footer); `sameAs` made conditional (was hardcoding unconfirmed URLs); pricing honesty fixes (cyber audit price, /it-support tiers, /testimonials meta); a11y pass (aria-hidden, focus rings, footer headings/contrast, 44px tap targets, ScoreCircle label); **/privacy was missing Nav+Footer — fixed**.
- ✅ `tsc` + `eslint` + full `next build` all clean. **Now 27 local commits ahead of `origin/main`** (websites: 1).

### ⚠️ Flagged for owner decision (NOT auto-resolved)
- **Business city (NAP):** schema was Petaluma, `MAILING_ADDRESS` is Santa Rosa — I aligned schema to Santa Rosa (the explicit address), but lots of marketing copy still says "Petaluma." Confirm the real city and make it consistent everywhere; **the Google Business Profile must match.**
- **`/services/it-support` tiers** ($800–$3,500/mo) exceed the `pricing.ts` $2,200 ceiling — real pricing decision; left as-is (page is a 301 redirect source anyway).
- **Brand-orange `#F97316` as small label text on light bg fails WCAG AA contrast** (~2.8:1). Site-wide eyebrow labels. Did NOT restyle the brand accent unilaterally — needs a design call (roadmap #82). Same for some `/60` opacity body text.

## Latest (2026-06-06, part 4)
- **4 more pages** (commit, on main): `cybersecurity-sonoma` (completes the Sonoma trio) + tourism-town web design for `web-design-guerneville` (Russian River/seasonal), `web-design-bodega-bay` (coastal/Hwy-1 speed), `web-design-glen-ellen` (Jack London / Valley of the Moon). Sitemap + city-page `relatedLinks` updated.
- ✅ **Full `next build` PASSED** (exit 0) — first full build this stretch; validates the entire accumulated batch including the new CRM `preview-url` route. All new service-city pages prerender as static.
- **Now 23 local commits ahead of `origin/main`, none pushed.** Service-city matrix coverage: Santa Rosa, Petaluma, Healdsburg, Windsor, Rohnert Park, Sebastopol all have the full web/IT/cyber trio; Sonoma too; + web-design for Guerneville, Bodega Bay, Glen Ellen.

## Latest (2026-06-06, part 3)
Filled the gaps the investigation surfaced + a second city-page batch:
- **5 more service-city pages** (commit `38ad47b`): `cybersecurity-rohnert-park`, `it-support-sebastopol`, `cybersecurity-sebastopol`, `web-design-sonoma`, `it-support-sonoma`. Completes the web/IT/cyber trio for Rohnert Park and Sebastopol; new Sonoma (city) cluster. Sitemap + city-page `relatedLinks` updated. (We now have service-city coverage for Santa Rosa, Petaluma, Healdsburg, Windsor, Rohnert Park, Sebastopol, Sonoma.)
- **`/websites` → CRM preview-link loop** (duke commit `ec41640` + websites commit `45e5182`): new token-gated `POST /api/crm/admin/preview-url` (`CRM_ADMIN_TOKEN`) attaches a generated demo-site URL to a lead by normalized business name (stable across CSV re-exports), stored in one Redis hash; lead queue enriches via one HGETALL; LeadPanel shows a "Preview site we built" link. New `npm run push-to-crm` in /websites reads `outreach-links.json` and pushes ready demos. Added `CRM_ADMIN_TOKEN` to `.env.example`.

All gates green: `tsc` ✓ · `eslint` ✓ (full `next build` still pending — run before push). **Now 22 local commits ahead of `origin/main`, none pushed.** /websites has 1 local commit (also unpushed).

⚠️ NEW owner to-dos: set `CRM_ADMIN_TOKEN` in BOTH the duke Vercel env and wherever `push-to-crm` runs; set `GALLERY_BASE_URL` for /websites so demo links are absolute. (Deliberately NOT built: a `scraper.py`→CRM schema adapter — the live CRM reads the lead-tracker export, not scraper.py; flag for owner if scraper.py is still in use. And `GITHUB_WEBHOOK_SECRET` is owner-config only.)

## Latest (2026-06-06, part 2)
Fanned out 5 Sonnet agents (lean workflow) to fill the highest-value service×city gaps, each with genuinely unique local content (verified honest — no fabricated testimonials/stats, plain-English, flat-fee framing): **`/cybersecurity-healdsburg`**, **`/web-design-windsor`**, **`/cybersecurity-windsor`**, **`/it-support-rohnert-park`**, **`/web-design-sebastopol`**. This completes the full web/IT/cyber **trio for Healdsburg and Windsor** (strong topical clusters). All 5 added to `sitemap.ts` and cross-linked inbound from their `/{city}` CityPage `relatedLinks`. `tsc` ✓ + `eslint` ✓ (full `next build` still pending — run before push). **Now 20 local commits ahead of `origin/main`, none pushed.**

## Latest (2026-06-06)
Added **`/web-design-healdsburg`** — the city had `it-support-healdsburg` but no web-design page, and web design is the highest-margin service. Built on the proven `ServiceCityPage` template with genuinely Healdsburg-specific content (wine-country hospitality, tasting-room/booking conversion, mobile-first for destination tourists, harvest-season traffic) — unique, not a thin clone. Wired into `sitemap.ts` and cross-linked inbound from the `/healdsburg` city page's `relatedLinks`. `tsc` ✓ + `eslint` ✓ (full `next build` skipped to conserve RAM; safe to run before push). **Now 19 local commits ahead of `origin/main`, none pushed.**


## Project
- **Repo:** `C:\Users\Jeff\duke` (GitHub `Dukotah/Duke`), deploys to **copperbaytech.com** on Vercel.
- **What it is:** Dukotah's own agency site — Sonoma County web dev, IT support, cybersecurity, AI integration for small businesses. **Next.js 16 + Tailwind v4.** Also contains a full sales **CRM** at `/crm` (login-gated, Upstash Redis + CSV leads).
- **⚠️ Read `AGENTS.md` first:** "This is NOT the Next.js you know" — Next 16 has breaking changes; consult `node_modules/next/dist/docs/` before writing framework code.

## ⚠️ Critical workflow rules
- **Pushing to `main` auto-deploys to Vercel.** Dukotah conserves deploy quota — **commit locally, do NOT push** unless he explicitly says so.
- `main` is the real, deployed branch. Always `git fetch origin main` before pushing; expect concurrent commits from parallel agents.
- Keep multi-agent work lean (he's on a $100/mo plan).

## Current state (as of 2026-06-05)
- On branch `main`, working tree **clean**.
- **18 commits sit on local `main` ahead of `origin/main` — NONE are pushed.** (13 prior + 5 from the audit session below.)
- All gates green: `npx tsc --noEmit` ✓ · `npx eslint` ✓ · `npx vitest run` (132 tests) ✓ · `npx next build` (146 static pages) ✓.

## What the last session did
Worked a 19-item live-review punch list (from a browser agent that reviewed the **deployed** build, so some items were already fixed in the unpushed local commits). 5 new commits:

1. `fix(nav)` — navbar was white-on-transparent at scroll-0; invisible on light-bg pages. Added opt-in `light` prop to `src/components/Nav.tsx` (default off = dark-hero glass look), applied to About/FAQ/Terms + 4 white-bg blog articles; dropped `pt-16` on `/it-health-check`.
2. `fix(pricing)` — new **`src/config/pricing.ts`** single source of truth; `/pricing`, `/services`, `PricingTeaser` all read it.
3. `polish(site)` — Portfolio hides empty PREVIEW tiles (renders only projects with a real `image`); Hero faster fade (0.7→0.4s, opacity 0.7 start, reduced-motion aware); About founder avatar = photo-when-set else gradient monogram.
4. `polish(crm)` — no-website email grammar fix; Pipeline kanban header truncation fix.
5. `feat(seo)` — footer social icons (inline brand SVGs, render only when `SOCIAL.*` URL set in `config/site.ts`); `priceRange` + `sameAs` on LocalBusiness schema; FAQPage schema on `/pricing`.

Verified already-done (no change): /resources→/blog, SAMPLE labels (kept for FTC compliance, already subtle), Stats responsive grid, Contact form states, booking `/schedule`, audit tool `/tools`, per-page OG, `/crm` noindex.

## Open owner to-dos (only Dukotah can do)
- **Push the 18 commits** when ready to deploy (`git push origin main`).
- Add a real **founder headshot** → `/public/...` then set `FOUNDER_HEADSHOT` in `src/components/About.tsx`.
- Paste **LinkedIn URL** into `SOCIAL.linkedin` in `src/config/site.ts` to light up the footer icon.
- Longstanding: paste real Calendly into `BOOKING_URL`; replace sample reviews/case studies with real client-approved ones; set up Google Business Profile + `GOOGLE_REVIEW_URL`; flip on Vercel Web Analytics; set `OUTREACH_DOMAIN_VERIFIED_DATE` in Vercel for the cold-email warm-up ramp.

## Suggested next task
Decide whether to push the 18 commits, or keep building. If building, candidate areas: real portfolio screenshots, expanding city×service pages (use `ServiceCityPage` with unique local content), or CRM lead-gen polish.
