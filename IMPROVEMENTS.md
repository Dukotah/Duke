# Copper Bay Tech — Improvement Findings & Backlog

_Generated 2026-06-07 from a 9-agent sweep: 5 web-research agents (competitors, local
SEO/AI-search, agency CRO, AI service offerings, cold-email deliverability) + 4 codebase
polish-audit agents (visual/a11y, content honesty, technical SEO/perf, CRM/funnel)._

This is the "what we can improve" doc. **Section 1** = shipped this session. **Section 2** =
strategic research (mostly off-site / owner moves). **Section 3** = remaining code backlog,
prioritized. **Section 4** = owner-only unlocks.

---

## 1. Shipped this session (committed locally, NOT pushed)

**Data integrity**
- Cybersecurity JSON-LD `highPrice` was `$2,500` — contradicted `pricing.ts` ($1,200). All
  three `AggregateOffer` blocks in `pricing/page.tsx` now reference `PRICING.*` constants
  (numbers, not strings) so schema can never drift from the cards again.
- IT-support prose "$400–$900/mo" (undercut the canonical $550 floor) → aligned to "$550+"
  in `it-support-sonoma-county` FAQ and the `managed-it-support-vs-break-fix` blog post.
- Novato `county` was "Marin / Sonoma County" → "Marin County" (Novato is in Marin).

**NAP consistency (service-area-business policy)**
- Removed `addressLocality: "Petaluma"` from 6 schema blocks that contradicted the documented
  no-storefront policy: `/services/{web-development,it-support,cybersecurity}` and the hand-built
  `it-support-windsor`, `it-support-healdsburg`, `web-design-rohnert-park` pages.
- Fixed visible "Web Development · Petaluma, CA" badge → "Sonoma County, CA".
- `/services/*` schema email `duke@` → canonical `contact@copperbaytech.com`.

**Lead-capture reliability**
- `/api/audit-lead` was returning `{ok:true}` on ANY Resend failure — visitor saw success
  while the report + lead-notify silently vanished. Now checks `res.ok` on both sends and
  returns 500 on failure (CRM bridge already captures the lead independently).
- `/api/subscribe` had no rate limiting → added `rateLimit(5/10min)` matching the contact route.
- `/schedule` booking form now sends `attribution` (was blind — no lead source) + honeypot +
  submit-timing so it gets the same spam protection and source tracking as the contact form.
- IT-health-check quiz result CTA `/#contact` → `/schedule` (was a jarring cross-page hash
  scroll from `/it-health-check`).

**SEO / a11y**
- `/report` was crawlable with no title/noindex → added `report/layout.tsx` (noindex) + added
  `/report` to `robots.ts` disallow.
- Contact form inline errors `text-red-500` (fails AA) → `text-red-700` + `role="alert"`;
  input focus ring switched to the site-standard `focus-visible` orange ring.

_Gates: `tsc` ✓ · `eslint` ✓ · `next build` ✓ (170+ static pages)._

---

## 2. Strategic research findings (highest leverage first)

### Competitive positioning
- **Price transparency is your single biggest untapped edge.** Every local competitor
  (Fitz Designz, SR Technologies, DeepNet, West County Net, Smallnormous, Techeffex…) hides
  pricing behind a call. You publish it — but it's buried on `/pricing`. **Surface a price
  line in the homepage hero** ("Websites from $2,500. IT from $550/mo. Prices published, no
  asterisks.").
- **The bundle is uncontested.** No Sonoma County provider offers web + IT + cyber + AI under
  one flat-fee relationship. Add a "One vendor, everything covered" section to the homepage /
  `/services`.
- **AI is wide open locally** — zero competitors advertise AI receptionist / missed-call
  text-back. Promote AI higher in nav + homepage.
- **Named-competitor compare pages** (`/compare/sr-technologies`, `/compare/deepnet`) would
  capture high-intent "X alternative" searches. Infra already exists (`Comparison.tsx`).
- **Founder story converts here** — top local sites lead with a named local founder + photo.
  (Blocked on real headshot — owner.)

### Local SEO & AI-search (2026)
- **AI Overviews now hit ~20% of local commercial queries**; cited pages get +35% CTR,
  non-cited lose ~34%. The triggers: FAQPage schema + direct 40–60-word answers.
- **Add FAQPage schema + a "Common Questions" block to the 4 service-hub pages** and migrate
  the two hand-built high-traffic city pages (`web-design-santa-rosa`, `web-design-petaluma`)
  to the `ServiceCityPage` template (which already emits FAQ + breadcrumb schema).
- **Cross-platform presence drives LLM citations** (brands on 4+ platforms are 2.8× more
  likely cited; LinkedIn rising fast). Needs GBP + LinkedIn + Clutch/Yelp/Expertise listings
  (owner) → then populate `SOCIAL` in `site.ts` and `sameAs` auto-emits.
- **Fix the dead Calendly URL in `/public/llms.txt`** → point to `/schedule`. Register Bing
  Webmaster Tools (ChatGPT pulls ~92% from Bing's index).
- **Add `ai` to the service×city matrix** (start Santa Rosa + Petaluma) — AI queries growing,
  zero local competition.

### Conversion (CRO)
- **Real social proof is the #1 gap.** Testimonials are still placeholder. One real, named,
  client-approved quote + a Google review link closes most of the trust gap. (Owner-dependent
  for real quotes; see §3 for the compliance fix until then.)
- **Pricing-card CTAs route to `/#contact`** — embed a path to `/schedule` (booking pages
  convert 30–70% better than a contact-form redirect). Pass `?service=` to pre-select.
- **Audit-tool result has no conversion bridge** — after showing a score, add a contextual
  "We can fix this — book a 15-min call" CTA to `/schedule?ref=audit`. Highest-intent moment
  on the site.
- **CTA copy**: first-person/benefit framing ("Get My Free IT Estimate", "Book a Free
  Security Call") beats generic "Get a Quote" by 10–90% in tests.
- **52.6% of pro-services conversions are phone calls** — keep the sticky mobile call bar
  visible on `/pricing` + service pages.

### AI service offerings (productize + price)
- Add **named AI tiers with anchors** instead of the vague "$1,500–$4,000 + $200/mo":
  Automation Starter ($750 + $150/mo: missed-call text-back + review automation), AI
  Receptionist ($1,200 + $297/mo), Full Stack ($2,000–3,000 + $497/mo). Market supports
  50–70% margins via a GoHighLevel-style backbone.
- Add a **`/industries/home-services` (contractors/HVAC) page** — highest-value local vertical
  ($497–1,200/mo retainers), chronic missed-call pain.
- A **$500 "Business AI Audit"** is a proven low-friction top-of-funnel (credited toward a build).

### Cold-email deliverability (do BEFORE going live)
- **Don't send outreach from `copperbaytech.com`** (it also carries transactional mail) — use a
  separate verified domain (e.g. `getcopperbay.com`). Set `OUTREACH_FROM` to it.
- **Warm-up ramp is too aggressive** (`20/50/100`) — drop to ~`10/30/75` in
  `lib/outreach.ts` per 2026 Gmail/Yahoo norms.
- **Wire Resend `email.bounced`/`email.complained` → `suppressEmail()`** so bad addresses
  aren't re-queued (the webhook route exists but doesn't auto-suppress).
- **Graduate DMARC** `p=none → quarantine → reject` (document the timeline in `DELIVERABILITY.md`).
- Add IT + cybersecurity outreach templates (current set is 100% web-design).
- Verify the CAN-SPAM `MAILING_ADDRESS` is a real deliverable address (FTC penalty $53,088/email).

---

## 3. Remaining code backlog (prioritized — buildable by an agent)

### Honesty / compliance (do next)
- **Placeholder testimonials are live on the homepage** (`Testimonials.tsx`, `SHOW_SAMPLE_MARKER`).
  The "Sample" badge is 10px/low-opacity — insufficient as an FTC disclaimer. Either render
  `null` until real quotes exist (like `Portfolio` does) or make the disclaimer a visible
  16px line above the cards. Same issue on `/reviews` (per-card label needed) and the
  verbatim duplicate quotes reused across multiple city pages.
- `/web-development` runs its own tier scheme ($2,500–$6,000) vs canonical Starter/Business/
  Premium ($2,500/$4,500/$7,500) — align to `PRICING` or `rangeLabel()`.

### SEO (mechanical, high value)
- **12 city hub pages missing `alternates.canonical`** (+ 6 missing OG entirely).
- **53 service/location pages have `openGraph` but no `images`** → social shares fall back to
  generic. Add `images:[{url:'/og-image.png',...}]` or per-route `opengraph-image.tsx`.
- **29 blog posts have visible FAQ content but no FAQPage schema** — free SERP real estate.
- Industry + case-study pages missing canonical + breadcrumb schema.
- `JsonLd.tsx`: add `@id` + `openingHoursSpecification` to LocalBusiness; logo as `ImageObject`;
  BlogPosting `author` → `Person` + add `dateModified`.
- 47 page titles exceed ~60 chars (SERP truncation) — shorten the worst blog titles.

### a11y / visual polish
- **`#F97316` orange as small text on white/linen fails AA (~3:1)** — add a `--gold-on-light:
  #C2540A` token for small labels; keep full orange for large/dark only. (~13 components.)
- **framer-motion animations don't gate on `useReducedMotion()`** (only `Hero` does) — the CSS
  media query doesn't reliably stop JS-driven motion. ~12 components.
- Low-opacity text below AA: blog dates `/30`, Stats sub-labels `/40`, ChatWidget status `/50`.
- `WhyUs` comparison "yes" cells render `text-white/80` on a near-white tinted bg (invisible).
- `ChatWidget`: FAB missing `aria-expanded`, panel missing `role="dialog"`, invisible focus rings.
- Missing focus-visible rings on `BookCallButton`, `ScrollCTA`, `Services`/`WhyUs` CTAs,
  `CityPage`/`ServiceCityPage` hero CTAs, `AuditTeaser`/`ToolsTeaser` (+ they use raw zinc/orange
  tokens instead of the site palette).
- `FAQ` accordion missing `aria-controls`. `HowItWorks` uses non-standard `left-1/6` fraction.

### CRM / funnel
- Free-tool capture widgets (`ITQuiz`, `tools/*`) have **no error state** — a failed
  `/api/capture` shows the green success anyway. Add an `error` state + `res.ok` check.
- `/tools/health-check` duplicates the audit suite but has **no email capture** → redirect to
  `/tools` (301) or add the capture block.
- `CRMDashboard` swallows all fetch errors (`.catch(()=>{})`) → silent empty states.
- Contact→CRM dedup is email-only; cross-check audit-lead by hostname to avoid duplicate cards.
- Consider CSP report-only header (the `next.config.ts` comment promises it but it's not wired).

---

## 4. Owner-only unlocks (compounding — can't be faked)
- **Google Business Profile** as a service-area business (hide address, all 11 cities, 5+
  services w/ prices, 10+ photos, 750+ char description, weekly posts) → set `GOOGLE_REVIEW_URL`.
- **First 5–10 real Google reviews** (the biggest local-pack lever; competitors sit at 49–54).
- **LinkedIn + Clutch/UpCity/Expertise/Yelp/Manifest listings** → fill `SOCIAL` in `site.ts`.
- **Real founder headshot** → `FOUNDER_HEADSHOT`. **Real client quotes** → `REAL_REVIEWS`.
- **Real Calendly/Cal.com** → `BOOKING_URL` (or keep the on-site `/schedule`).
- Verify outreach domain + set `OUTREACH_DOMAIN_VERIFIED_DATE`; flip on Vercel Web Analytics.
