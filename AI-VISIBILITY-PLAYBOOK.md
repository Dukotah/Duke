# AI Visibility Playbook — getting Copper Bay Tech recommended BY AI

*How to show up when someone asks ChatGPT / Claude / Perplexity / Google AI
Overviews / Copilot "who can build me a website" or "recommend a company to
build custom software." Based on fact-checked 2025–2026 research (sources at the
bottom). Last updated 2026-06-27.*

---

## The one thing to understand first

**Your own website is NOT what gets you named in AI answers.** In a study of
23,387 AI citations, **57% went to reviews / listicles / forums / social proof**
and **17% to directories & reference sites** (Crunchbase, Clutch, GBP, Wikipedia).
Brand-owned pages were cited rarely — About ~1.9%, home ~1.8%, FAQ ~0.4%.

And separately: **adding more schema markup does essentially nothing** for AI
citations (controlled 1,885-page study: ~0% uplift, AI Overviews actually −4.6%).
Schema is hygiene, not growth.

**Translation:** the on-site work is basically done (see "Already handled"
below). Everything that moves the needle now is **off-site reputation + entity
presence** — i.e. the list below. This is the work. None of it is code.

Two more facts that shape the plan:
- **Retrieval is live, not frozen training data.** AI answers increasingly come
  from real-time web crawls; OpenAI's crawl tripled since GPT-5 and now leans
  toward *search* indexing. You're already crawlable (robots.txt allows them).
- **You don't need to rank #1.** ~62% of AI-cited pages are NOT in Google's top
  10 — AI "fans out" into sub-questions and cites whoever answers each best. A
  tiny local shop can win long-tail/local queries (≈60% of AI-Overview-triggering
  keywords get <100 searches/mo). That's your lane.

---

## P0 — Do these first (highest leverage, ~1–2 evenings)

### 1. Lock down the Google Business Profile
A GBP already exists (the review link is live in `config/site.ts`). Make it bulletproof:
- [ ] Set it up as a **Service-Area Business** (hide street address; list service
      areas: Santa Rosa, Petaluma, Sebastopol, Rohnert Park, Sonoma, Windsor,
      Healdsburg, Cotati, Bodega Bay, Glen Ellen, Guerneville).
- [ ] **Primary category:** "Website designer." **Additional:** "Software
      company", "Computer support and services", "Computer security service".
- [ ] NAP must match the site **byte-for-byte**: `Copper Bay Tech`,
      `(707) 239-6725`, `Santa Rosa, CA 95403`. (Single source of truth is now
      `src/config/site.ts` — match the GBP to it, not the other way around.)
- [ ] Fill the description, services (with prices), hours (Mon–Fri 9–6), and add
      10+ photos (work samples, logo, headshot of Duke).
- [ ] Grab the **public profile URL** (`g.page/...` or `maps.google.com/?cid=...`)
      and paste it into `SOCIAL.googleBusiness` in `config/site.ts` → it auto-adds
      to `sameAs`.

### 2. Start the review engine (this is the real flywheel)
Reviews are the #1 cited content type AND the #1 local ranking signal.
- [ ] The "Leave a review" CTA on `/reviews` already points to the GBP review
      link. Now **ask every happy past/current client** — text them the link
      personally. Goal: **5 reviews in week 1, 10+ within a month.**
- [ ] Ask reviewers to mention the **service + city** ("built our website,
      Petaluma") — those phrases are what AI extracts for local queries.
- [ ] Reply to every review (signals an active, real business).

### 3. Create the directory / entity-graph profiles
Each one is a high-authority page AI cites *about* you, and each becomes a
`sameAs` that merges your mentions into one recognizable entity. Create, then
paste the URL into the matching key in `SOCIAL` (`config/site.ts`):
- [ ] **LinkedIn Company Page** (separate from Duke's personal profile) → `linkedin`
- [ ] **Clutch** profile (clutch.co — the dominant agency-review directory AI leans on)
- [ ] **GoodFirms** profile → `goodfirms`
- [ ] **Crunchbase** company entity → `crunchbase` (this is a reference site AI trusts)
- [ ] **Yelp** business page → `yelp`
- [ ] **GitHub** org (you're a dev shop — proof of work) → `github`
- [ ] Bonus low-effort: Bing Places, Apple Business Connect, Nextdoor Business,
      The Manifest, DesignRush, UpCity.

> After pasting URLs into `SOCIAL`, they flow automatically into `sameAs` across
> the whole site (LocalBusiness + Organization). No other code change needed.

---

## P1 — Do these next (weeks 2–6)

### 4. Get onto third-party "best of" listicles
These are 21%+ of AI citations and exactly what "recommend a company…" queries
pull from. Target lists like *"Best Web Designers in Santa Rosa / Sonoma County"*,
*"Top Software Developers in the North Bay"*:
- [ ] Get listed on **Clutch / GoodFirms / UpCity / Expertise.com / DesignRush**
      ranked lists (often free to be listed; reviews push you up them).
- [ ] Find existing local roundup blog posts (search `best web designers sonoma
      county`, `santa rosa web developer`) and **email the author** offering to be
      included — a short, genuine pitch with your differentiators + 1 work sample.
- [ ] Local chambers / orgs: Santa Rosa Metro Chamber, Sonoma County
      Economic Development Board member directories.

### 5. Genuine Reddit / community presence
Reddit punches way above its weight in AI citations (especially Perplexity &
ChatGPT; near-zero for Gemini). **Promotional posts get filtered — only genuine
help works.**
- [ ] Participate honestly in `r/sonoma`, `r/santarosa`, `r/smallbusiness`,
      `r/webdev`, `r/web_design`, `r/entrepreneur`. Answer real questions. Mention
      the business only when directly relevant (e.g. someone asks for a local dev).
- [ ] Aim for a few genuinely useful comments/week, not a campaign.

### 6. Establish the entity in reference graphs
- [ ] **Crunchbase** (from P0) — also add founder, founding year, location.
- [ ] **Wikidata item** for Copper Bay Tech (you don't need a Wikipedia article to
      have a Wikidata entity) — name, instance-of: business, location, website,
      founder. This is what helps AI say your *name* vs. a "ghost citation."

---

## P2 — Ongoing content (the only on-page lever that's proven)

The peer-reviewed Princeton GEO study found these content tactics measurably
raise AI visibility (up to +30–40%): **add statistics, cite sources, include
direct quotes, and write with clear authoritative language.** Keyword stuffing
does nothing.

- [ ] When writing/updating key pages and blog posts, make them **quotable and
      fact-dense**: concrete numbers, named specifics, clear Q→A structure.
- [ ] Build **answer-shaped pages for sub-questions** (query fan-out targets):
      "cost to build a website in Sonoma County", "custom software vs off-the-shelf",
      "how to choose a web developer", "hire a freelancer vs an agency". Several
      strong starts already exist in `/blog`.
- [ ] City-specific FAQ blocks on the local×service pages (cheap, fans out well).
- [ ] **Close the Cotati gap:** there's no `cybersecurity-cotati` page (2/3 of
      the matrix). Add it to complete the set.

---

## Already handled on-site (don't waste effort re-doing)

- ✅ `robots.txt` explicitly allows every major AI crawler (GPTBot, **OAI-SearchBot**,
  ClaudeBot, PerplexityBot, Google-Extended/GoogleOther, CCBot, Applebot-Extended…).
- ✅ `llms.txt` present (now rewritten to be quotable + cover custom-software intent).
- ✅ Full JSON-LD: LocalBusiness (stable `@id`), Organization, Service (37 local
  pages), BlogPosting, BreadcrumbList, FAQPage — single-source NAP, now with
  city/postal/geo and `sameAs` scaffolding.
- ✅ 127-URL sitemap, canonical/OG/Twitter metadata, manifest (just added).
- ✅ `AggregateRating` builder ready — **switch it on the moment real reviews
  exist** (see `aggregateRatingSchema` in `JsonLd.tsx`; emit on the home page).

---

## How to measure (do this monthly)

There's no Search Console for AI. You test by **asking the assistants**:
- In ChatGPT (search on), Perplexity, Gemini, Claude, Copilot, ask:
  - "Who can build a website for my small business in Sonoma County?"
  - "Recommend a custom software developer near Santa Rosa."
  - "Best web designers in Petaluma / the North Bay."
- Track: (a) are you a **source link** (citation)? (b) are you **named** in the
  text (mention)? Mentions lag citations and require the entity work above.
- Re-run monthly. Expect citations before mentions; expect the directory/review
  work (P0) to show up first.

---

## Sources (fact-checked, 22/25 claims confirmed)
- OpenAI crawler docs + Botify/SEJ crawl-volume analysis (retrieval is live; allow OAI-SearchBot)
- Ahrefs schema A/B study, 1,885 pages (schema ≠ citations)
- Omniscient Digital, 23,387 citations (57% reviews/social, 17% directories)
- Semrush AI Overviews study (commercial/long-tail intents) + Ghost Citations study (citation ≠ mention)
- Ahrefs AI-Overview top-10 study (query fan-out; 62% cited pages outside top 10)
- Tinuiti / CMSWire (Reddit & social citation share by platform)
- Princeton GEO paper, arXiv 2311.09735 (stats/quotes/citations raise visibility)
