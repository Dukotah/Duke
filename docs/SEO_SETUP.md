# SEO Setup & Ranking Playbook — Copper Bay Tech

_Last updated: 2026-06-04_

The site's on-page SEO is already strong (schema, ~35 blog posts, city/service
pages, canonical redirects, near-complete sitemap). For a **local service
business**, the remaining wins are mostly **off-site** and only you can do them.
This is the priority order — top items outrank everything below them combined.

---

## 0. Google Search Console (do first — it's your dashboard)

You can't optimize what you can't see.

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Add a **Domain** property for `copperbaytech.com` (verify via the DNS TXT
   record at your registrar — covers http/https + all subdomains).
3. Submit the sitemap: **Sitemaps → enter `sitemap.xml` → Submit.**
   (It's already generated at `https://copperbaytech.com/sitemap.xml`.)
4. Check back weekly: **Performance** (what queries you appear for),
   **Pages** (what's indexed vs. excluded), **Experience** (Core Web Vitals).

Also add [Bing Webmaster Tools](https://www.bing.com/webmasters) — 2 minutes,
and it feeds ChatGPT/Copilot search.

---

## 1. Google Business Profile (GBP) — the #1 local lever 🔴

The "map pack" (the 3 starred businesses above the normal results) is ranked
almost entirely by your GBP, **not this website**. If you do one thing, do this.

- Claim/create the profile at [business.google.com](https://business.google.com).
- Category: primary **"Website designer"** or **"Computer support and services"**
  (pick the one closest to your money service); add secondaries.
- Fill **everything**: service area (list the Sonoma County towns), hours,
  services, 10+ photos, a real description.
- **NAP must match the site exactly** — same Name, Address, Phone as
  `src/config/site.ts`. ⚠️ `MAILING_ADDRESS` there is still a placeholder; set a
  real address/P.O. box first, then use it identically everywhere.
- Once live, copy your **"write a review" link** and paste it into
  `GOOGLE_REVIEW_URL` in `src/config/site.ts`. That turns on the "Leave us a
  Google review" button on `/reviews`.

## 2. Reviews — drives map-pack rank AND star snippets ⭐

- Goal: your first **5–10 real Google reviews**. After every happy job, text the
  client your `GOOGLE_REVIEW_URL`. It's the highest-converting ask in person /
  same-day.
- When a client gives written permission to quote them, add them to
  `REAL_REVIEWS` in `src/lib/reviews.ts`. The site then automatically:
  - renders them on `/reviews` with a real aggregate score, and
  - emits `Review` + `AggregateRating` schema → ⭐ stars in search results.
- ⚠️ Never invent reviews. The current `/reviews` and `/testimonials` entries are
  clearly-labeled samples with **no** rating schema for exactly this reason
  (FTC 16 CFR Part 465 + Google policy). Replace them with real, approved quotes.

## 3. Citations & NAP consistency

List the business — with **identical** NAP — on:
Yelp, Bing Places, Apple Business Connect, BBB, the Sonoma County / Petaluma
Chamber of Commerce, Nextdoor, and 2–3 industry directories (Clutch, UpCity for
agencies). Consistency is the ranking signal; inconsistency actively hurts.

## 4. Backlinks (what a young domain needs most)

- Join the **Petaluma Area Chamber of Commerce** → member directory link.
- Sponsor a local event / little-league team → sponsor-page link.
- Your free **`/tools`** (audit, missed-call calculator, password generator,
  compliance checker) are your best *linkable assets* — pitch them to local
  business FB groups, the chamber newsletter, and partner sites. Earned links to
  a useful tool beat ten doorway pages.
- Guest-write one post for a local business blog or partner.

---

## On-page: already done ✅ (don't redo)

- `LocalBusiness`, `Organization`, `Service`, `FAQPage`, `BreadcrumbList`,
  `BlogPosting` schema (`src/components/JsonLd.tsx`).
- Canonical consolidation: duplicate `/cybersecurity`, `/it-support`,
  `/web-development`, `/services/*` 301 → the canonical pages (`next.config.ts`).
- Sitemap (`src/app/sitemap.ts`) — run `node scripts/sitemap-audit.mjs` after
  adding any page to confirm it's listed (redirected URLs are intentionally out).
- `public/llms.txt` + AI-crawler rules in `robots.ts` for AI search visibility.

## On-page: still worth doing (staged)

- **Internal linking** between blog posts and their related service/city pages
  (topical clusters). Partially in progress.
- **Service × city pages** (e.g. cybersecurity per town). High ceiling but only
  add them with **genuinely unique local content** — thin doorway clones get
  penalized, especially on a young domain. Add a few at a time as authority grows.

## How to measure it's working

GSC **Performance** is the scoreboard: rising impressions = Google is showing you
more; rising average position = you're climbing; clicks = it's converting. Watch
"web design petaluma", "it support sonoma county", "cybersecurity {town}", and
your brand name. Map-pack visibility shows up in **GBP Insights**, not GSC.
