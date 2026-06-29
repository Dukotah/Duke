I explored the repo to ground this in your actual routes. Here is the plan.

---

# Copper Bay Tech — Topical Authority & Internal Linking Plan
*14 new cornerstone articles · ~41 existing posts · ~37 local service pages*

## Verified site facts (from the repo)
- **Pillars confirmed live:** `/web-development`, `/web-design-sonoma-county`, `/ai-integration-small-business` (all exist in `src/app/`).
- **Blog lives at** `/blog/<slug>` (each post is `src/app/blog/<slug>/page.tsx`).
- **There is NO custom-software pillar page.** `/web-development` is the closest fit and is used as the Custom Software pillar below — see Gaps.
- **Confirmed gap: `cybersecurity-cotati` does not exist.** You have `it-support-cotati` and `web-design-cotati` plus the `cotati` hub, and you have `cybersecurity-*` for bodega-bay, glen-ellen, guerneville, healdsburg, petaluma, rohnert-park, santa-rosa, sebastopol, sonoma, windsor — but Cotati's cybersecurity page is missing.

---

## 1. The four clusters

### Cluster A — Web Design (pillar: `/web-design-sonoma-county`)
Buyer-stage "how do I choose / do I even need this" intent.

**New articles (6):**
- how-to-choose-a-web-designer
- do-i-still-need-a-website-in-2026
- how-long-does-it-take-to-build-a-website
- web-design-vs-web-development *(bridge — see note)*
- local-web-developer-vs-offshore
- what-makes-a-website-convert

**Key existing posts to fold in:** squarespace-vs-custom-website-for-small-business · signs-you-need-a-new-website · 5-signs-your-business-website-is-costing-you-customers · how-to-speed-up-your-business-website · why-slow-websites-hurt-sonoma-county-businesses · the cost-guide set (how-much-does-a-website-cost-sonoma-county, how-much-should-a-small-business-website-cost, small-business-website-cost-guide) · best-website-for-a-sonoma-county-winery

### Cluster B — Custom Software (pillar: `/web-development`)
This is the cluster with the most new content and the least existing support. Highest authority upside.

**New articles (7):**
- what-is-custom-software-development
- custom-software-vs-off-the-shelf
- build-vs-buy-software
- how-much-does-custom-software-cost
- how-to-hire-a-software-development-company
- signs-your-business-has-outgrown-spreadsheets
- how-long-to-build-a-custom-web-app

**Key existing posts to fold in:** cloud-vs-local-server-small-business (light fit; software-adjacent infra). *(Otherwise this cluster is almost entirely new — that's expected and fine.)*

### Cluster C — AI / Automation (pillar: `/ai-integration-small-business`)
**New articles (1):**
- get-your-business-recommended-by-ai *(AEO / "AI search visibility")*

**Key existing posts to fold in:** ai-automations-sonoma-county-small-business · how-ai-helps-sonoma-county-small-businesses · the 7 ai-for-* industry posts (wineries, restaurants, real-estate, healthcare, home-services, professional-services). This cluster is already mature; the new piece extends it into AEO.

### Cluster D — Local / Visibility (supporting cluster, no new article)
Pillar = the local hub structure (`/locations`, city pages). Existing: google-business-profile-setup-sonoma-county · google-business-profile-tips-local-business · why-your-google-business-profile-matters · how-to-rank-on-google-maps-local-business. This cluster's job is to feed link equity to local service pages and to receive a link from `get-your-business-recommended-by-ai`.

**Note on `web-design-vs-web-development`:** it is the deliberate bridge between Cluster A and Cluster B. Link it to BOTH `/web-design-sonoma-county` and `/web-development`, and use it as the canonical hand-off article between the two clusters.

---

## 2. Internal-linking map (new articles → up/across)

Every new article links UP to its pillar in the first ~150 words, and includes 2–4 sibling links + 1 CTA to a money page (`/get-started`, `/pricing`, or relevant service page).

| New article | Links UP to pillar | Links ACROSS (siblings / other clusters) |
|---|---|---|
| how-to-choose-a-web-designer | /web-design-sonoma-county | local-web-developer-vs-offshore, how-long-does-it-take-to-build-a-website, squarespace-vs-custom-website-for-small-business, what-makes-a-website-convert |
| do-i-still-need-a-website-in-2026 | /web-design-sonoma-county | what-makes-a-website-convert, get-your-business-recommended-by-ai (C), signs-you-need-a-new-website |
| how-long-does-it-take-to-build-a-website | /web-design-sonoma-county | how-to-choose-a-web-designer, how-much-does-a-website-cost-sonoma-county, how-long-to-build-a-custom-web-app (B) |
| web-design-vs-web-development | /web-design-sonoma-county **and** /web-development | what-is-custom-software-development (B), how-to-choose-a-web-designer, custom-software-vs-off-the-shelf (B) |
| local-web-developer-vs-offshore | /web-design-sonoma-county | how-to-choose-a-web-designer, how-to-hire-a-software-development-company (B), what-makes-a-website-convert |
| what-makes-a-website-convert | /web-design-sonoma-county | how-to-speed-up-your-business-website, do-i-still-need-a-website-in-2026, 5-signs-your-business-website-is-costing-you-customers |
| what-is-custom-software-development | /web-development | custom-software-vs-off-the-shelf, build-vs-buy-software, web-design-vs-web-development (A) |
| custom-software-vs-off-the-shelf | /web-development | build-vs-buy-software, what-is-custom-software-development, signs-your-business-has-outgrown-spreadsheets |
| build-vs-buy-software | /web-development | custom-software-vs-off-the-shelf, how-much-does-custom-software-cost, signs-your-business-has-outgrown-spreadsheets |
| how-much-does-custom-software-cost | /web-development | build-vs-buy-software, how-long-to-build-a-custom-web-app, how-much-does-a-website-cost-sonoma-county (A) |
| how-to-hire-a-software-development-company | /web-development | local-web-developer-vs-offshore (A), what-is-custom-software-development, how-much-does-custom-software-cost |
| signs-your-business-has-outgrown-spreadsheets | /web-development | custom-software-vs-off-the-shelf, what-is-custom-software-development, ai-automations-sonoma-county-small-business (C) |
| how-long-to-build-a-custom-web-app | /web-development | how-much-does-custom-software-cost, what-is-custom-software-development, how-long-does-it-take-to-build-a-website (A) |
| get-your-business-recommended-by-ai | /ai-integration-small-business | how-to-rank-on-google-maps-local-business (D), why-your-google-business-profile-matters (D), do-i-still-need-a-website-in-2026 (A) |

**Anchor-text rule:** use descriptive, keyword-bearing anchors ("how long it takes to build a custom web app"), never "click here." Vary anchors across pages to avoid over-optimization.

---

## 3. Pillar / service pages → link DOWN to new articles

This is the part that usually gets skipped and matters most for authority flow. Add a "Helpful guides / Learn more" block near the bottom of each pillar and the relevant local pages.

| Page | Should link DOWN to |
|---|---|
| `/web-design-sonoma-county` (pillar) | how-to-choose-a-web-designer, do-i-still-need-a-website-in-2026, how-long-does-it-take-to-build-a-website, local-web-developer-vs-offshore, what-makes-a-website-convert, web-design-vs-web-development |
| `/web-development` (pillar) | what-is-custom-software-development, custom-software-vs-off-the-shelf, build-vs-buy-software, how-much-does-custom-software-cost, how-to-hire-a-software-development-company, signs-your-business-has-outgrown-spreadsheets, how-long-to-build-a-custom-web-app, web-design-vs-web-development |
| `/ai-integration-small-business` (pillar) | get-your-business-recommended-by-ai (+ existing ai-* posts already should be linked here) |
| `/pricing` | how-much-does-custom-software-cost, how-much-does-a-website-cost-sonoma-county, how-long-does-it-take-to-build-a-website |
| `/process` | how-long-does-it-take-to-build-a-website, how-long-to-build-a-custom-web-app, how-to-hire-a-software-development-company |
| `/services` and `/industries` | what-is-custom-software-development, signs-your-business-has-outgrown-spreadsheets |
| Local `web-design-<city>` pages (12) | how-to-choose-a-web-designer, local-web-developer-vs-offshore (reinforces "local" differentiator) |
| `/get-started` / `/get-started` CTA blocks | build-vs-buy-software, how-to-hire-a-software-development-company |

Also: each new article should be picked up by the blog index (`/blog`) and `sitemap.ts` automatically — confirm the sitemap generator enumerates `src/app/blog/*` so all 14 are included.

---

## 4. Content gaps & fixes

1. **Missing `cybersecurity-cotati` local page (confirmed).** You have it-support-cotati and web-design-cotati but no cybersecurity page for Cotati, breaking the otherwise-complete cybersecurity city matrix (10 other cities covered). Create `src/app/cybersecurity-cotati/page.tsx` mirroring `cybersecurity-rohnert-park` (nearest neighbor) and cross-link it from the `cotati` hub and the `cybersecurity-sonoma-county`/`cybersecurity-small-business` parent.

2. **No dedicated custom-software pillar.** Cluster B has 7 strong new articles all pointing at `/web-development`, which reads as web-dev, not "custom software / internal tools / automations." Recommend a true pillar at `/custom-software` (or `/custom-software-development`) and repoint Cluster B's "up" links there; keep `/web-development` for build-vs-buy / web-app crossovers. Until then, `/web-development` is the correct interim pillar.

3. **Thin Custom Software supporting layer.** Cluster B is almost entirely new content with no existing posts beneath it. Future fill-in ideas: "custom CRM vs off-the-shelf CRM," "what is a web app," "internal tools for small business," "how to scope a software project." This deepens the cluster and gives the 7 new articles more siblings to link to.

4. **Cybersecurity has zero new top-of-funnel cornerstone.** Strong existing posts (ransomware, MFA, MSP, HIPAA) but none of the 14 new pieces feeds the cybersecurity pillar(s). Consider a future "how to choose a cybersecurity provider / managed IT company" cornerstone to match the choose-a-web-designer / hire-a-software-company pattern across all service lines.

5. **`web-design-vs-web-development` dual-pillar risk.** It's the only article intentionally linking to two pillars. Keep it that way, but canonicalize it under Web Design (its primary intent is buyer confusion, not engineering) so it doesn't dilute either cluster's focus.

6. **AEO opportunity.** `get-your-business-recommended-by-ai` is your only AI-visibility cornerstone and pairs naturally with the existing `AI-VISIBILITY-PLAYBOOK.md` in the repo root — mine that doc for the article and add schema/FAQ markup so the page itself is citable by AI assistants.

---

**Relevant files:** pillars at `/mnt/c/Users/dukot/projects/Duke/src/app/web-development/page.tsx`, `/mnt/c/Users/dukot/projects/Duke/src/app/web-design-sonoma-county/page.tsx`, `/mnt/c/Users/dukot/projects/Duke/src/app/ai-integration-small-business/page.tsx`; blog posts under `/mnt/c/Users/dukot/projects/Duke/src/app/blog/`; sitemap at `/mnt/c/Users/dukot/projects/Duke/src/app/sitemap.ts`; missing page to create at `/mnt/c/Users/dukot/projects/Duke/src/app/cybersecurity-cotati/page.tsx`.