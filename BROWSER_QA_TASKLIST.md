# Browser QA Tasklist — Copper Bay Tech (copperbaytech.com)

**Target:** the DEPLOYED site at https://copperbaytech.com
**Goal:** confirm the live site is 100% functional and flag anything broken, ugly, or dishonest.
**Note:** the local repo has 18 unpushed commits, so some recent fixes may NOT be live yet. Flag anything that looks unfixed — it may already be fixed locally and just needs a push. Test on BOTH desktop and a mobile viewport (~390px wide).

---

## 1. Core pages load & render (desktop + mobile)
Visit each and confirm: page loads (no 404/500), no obvious layout break, nav is VISIBLE and legible, footer present.
- [ ] `/` (home)
- [ ] `/services`, `/services/web-development`, `/services/it-support`, `/services/cybersecurity`
- [ ] `/pricing`
- [ ] `/about`
- [ ] `/work` (portfolio)
- [ ] `/faq`
- [ ] `/blog` (index) + open 3 articles
- [ ] `/reviews`, `/testimonials`
- [ ] `/schedule`
- [ ] `/contact` (or homepage contact section)
- [ ] `/privacy`, `/terms`
- [ ] A few location pages: `/santa-rosa`, `/petaluma`, `/web-design-santa-rosa`

## 2. Navbar legibility (the known risk area)
- [ ] On LIGHT-background pages (`/about`, `/faq`, `/terms`, and the white blog articles like `/blog/cloud-vs-local-server`, `/blog/what-is-ransomware`), confirm the nav links are readable BEFORE you scroll (not white-on-white).
- [ ] On dark-hero pages, confirm the nav still has the glass/transparent look.
- [ ] Scroll down — nav should become solid/legible everywhere.
- [ ] Open the mobile hamburger menu — links visible, closes correctly.

## 3. Lead-capture tools (functional)
For each tool: interact with it, submit, confirm you reach a success/thank-you state with NO console errors.
- [ ] `/tools` — run the free site audit (enter a real URL, e.g. a local business site) → results render → submit lead.
- [ ] `/tools/website-cost-estimator` — move page slider, toggle features, confirm price range updates and matches /pricing tiers (Starter ≤5p ~$2.5k, Business ≤10p ~$4.5k, Premium ≤20p ~$7.5k). Submit estimate.
- [ ] `/tools/missed-call-calculator` — enter numbers, confirm calc + submit.
- [ ] `/it-health-check` (ITQuiz) — complete the quiz → submit.
- [ ] `/tools/password`, `/tools/email-headers`, `/tools/compliance`, `/tools/health-check` — load and basic-interact.

## 4. Contact / booking funnel
- [ ] Submit the main contact form with test data → confirm redirect to `/thank-you` (or inline success).
- [ ] Trigger a deliberate validation error (empty required field) → confirm inline field error shows.
- [ ] Click every primary CTA ("Book a call", "Schedule", "Get started", "Run free audit") → confirm each lands somewhere real (NOT `#`, NOT a dead Calendly). Booking CTAs should go to `/schedule`.
- [ ] On `/schedule`, confirm the booking step renders (note: if BOOKING_URL still points to `/schedule` placeholder rather than a real Calendly, flag it).

## 5. Pricing consistency
- [ ] Compare prices shown on `/pricing` vs `/services` vs the homepage pricing teaser — they MUST match. Flag any drift.

## 6. Trust / honesty (FTC) check
- [ ] On `/reviews`, `/testimonials`, `/case-studies/*`, and service-page testimonials: confirm any sample/fabricated content is clearly LABELED ("Sample" / "Representative example"). Flag any unlabeled testimonial presented as real.
- [ ] Confirm NO star-rating / aggregate-rating appears anywhere unless backed by real labeled reviews.

## 7. Visual / asset polish
- [ ] Portfolio (`/work` and homepage "what we build"): confirm NO empty gradient placeholder tiles — only real project images should show.
- [ ] About page founder avatar: note whether it's a real photo or a gradient monogram "D" (headshot is a known open to-do).
- [ ] Footer social icons: note which appear (LinkedIn is a known open to-do — may be absent).
- [ ] Hero animation: confirm it fades in smoothly, not jarringly.

## 8. Technical / SEO spot-check
- [ ] View-source or devtools on `/`, `/pricing`, a service page, a location page: confirm a `<title>`, meta description, canonical, and JSON-LD `<script type="application/ld+json">` are present.
- [ ] `/sitemap.xml` loads and lists pages. `/robots.txt` loads and disallows `/crm`.
- [ ] `/crm` — confirm it is login-gated (NOT publicly viewable) and `noindex`.
- [ ] Open browser console on 5–6 representative pages — record ANY red errors or failed network requests (404 assets, etc.).

## 9. Performance / mobile feel
- [ ] On mobile viewport, scroll the homepage end-to-end: no horizontal overflow, tap targets reachable, text not clipped.
- [ ] Note any page that feels slow to first paint or has layout shift (CLS).

---

## What to capture
For every issue: **page URL**, **desktop or mobile**, **what's wrong**, **a screenshot**, and **severity** (Blocker / Major / Minor / Cosmetic). For passes, a simple ✓ is fine.
