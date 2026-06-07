# Freemium "Business Analysis" — Strategy & Roadmap

_Drafted 2026-06-06. Status: **pre-deploy — do not ship until P0 is done.**_

This document thinks through the free **Business Analysis** product end-to-end
(`/business-analysis`) before we deploy it: what it's for, how it actually
behaves today, where it's broken or risky, and the phased plan to make it a
reliable lead engine.

---

## 1. What it is today

A single-page scanner at `/business-analysis`:

1. Visitor enters **business name + website + email**.
2. We immediately fire `POST /api/capture` (lead) and run 4 checks in parallel:
   - `/api/audit` — PageSpeed performance score
   - `/api/ssl` — certificate validity / expiry
   - `/api/seo` — on-page SEO health
   - `/api/presence` — social/branding/local signals (HTML heuristics)
3. We compute four sub-scores (Website / Local / Social / Branding), a weighted
   overall (`website .35 + local .30 + branding .20 + social .15`), a letter
   grade, and a **single "biggest opportunity"** via a rule engine that always
   routes to a relevant service CTA.
4. We promise: _"Duke will personally review… and email you a full report with a
   prioritized action plan."_

**Strategic role:** this is a *lead magnet*, not a SaaS. Its job is to turn
anonymous traffic into a qualified, scored lead in the CRM and give Duke a warm,
specific reason to follow up.

---

## 2. The core problem: the loop is open at both ends

The funnel only works if a scan reliably becomes a **scored CRM lead** that gets
**followed up**. Right now neither end is wired:

- **Entry gap.** `/api/capture` (`src/app/api/capture/route.ts`) only emails Duke
  and sends a generic auto-reply. It does **not** create a CRM contact, and it
  carries **none of the scan results**. The lead's grade, biggest opportunity,
  and which service to pitch are computed in the browser and then thrown away.
  This is exactly the "Audit-tool → CRM bridge" that `ROADMAP.md` Phase 2 lists
  as not-yet-done.
- **Exit gap.** The page promises an emailed "full report with a prioritized
  action plan." We send a generic _"I'll follow up personally"_ note instead.
  That's a broken promise on first contact — the worst possible trust moment.

Everything else below matters, but **closing this loop is the whole point.**

---

## 3. Risks to resolve before we trust the numbers

The scan must be *credibly accurate*. A confident wrong answer ("you have no
SSL / no social") on a business that does, burns the lead and our reputation.

- **False negatives from HTML-only heuristics.** `/api/presence` reads raw HTML
  in one fetch. Sites that render social links via JS, SPAs, sites behind
  Cloudflare bot protection, or that block our user-agent will look like they
  have *no* social, *no* schema, *no* address. We must distinguish
  **"absent" from "couldn't verify"** in both the API and the UI.
- **Score volatility.** PageSpeed scores swing run-to-run; SSL/SEO can transiently
  fail. A grade that changes on refresh looks untrustworthy.
- **The rule engine always sells.** That's fine for conversion, but the "why"
  must be *true for this site*. If we tell a fast, secure, well-ranked site that
  its "biggest opportunity" is something it already does, we look automated and
  lose credibility. Add guards so we never flag a category that passed.

---

## 4. Security & abuse (these are real, fix before public)

- **SSRF.** `/api/presence` (and `/api/audit|ssl|seo`) fetch an arbitrary
  user-supplied URL server-side with no allow/deny list. An attacker can point
  it at `http://169.254.169.254/…` (cloud metadata) or internal hosts. **Block
  private/link-local/loopback IP ranges and non-http(s) schemes** before fetch.
- **No rate limiting on this branch.** The new endpoints aren't rate-limited
  here (only `/api/ada` is, and the broader rate-limit work lives on an unmerged
  branch). Unbounded scans = PageSpeed quota burn + a free DoS amplifier.
- **HTML injection in capture email.** `email`/`name`/`context` are interpolated
  raw into the notification HTML in `/api/capture`. Escape them.
- **Weak email validation + no bot defense.** `email.includes("@")` lets junk in,
  and the intake form has no honeypot/captcha → bot lead spam straight into the
  follow-up pipeline.

---

## 5. The strategic fork (decide before P2+)

**Should freemium stay a one-time lead magnet, or evolve into an ongoing free
product?**

- **Option A — Lead magnet (status quo).** One scan, instant result, human
  follow-up. Cheap, simple, no accounts. Ceiling: each visitor is one touch.
- **Option B — Free monitoring product.** Save the scan, give a shareable
  results link, and *re-scan monthly* with an email when the score changes
  ("your speed dropped to 41 — here's why"). This manufactures recurring,
  *specific* reasons to reach out and keeps CopperBay top-of-mind without Duke
  lifting a finger. Requires lightweight persistence + a cron + optional account.

**Recommendation:** ship **A done right** (P0–P2), then layer **B** (P3) as the
expansion. B is the highest-ROI growth move because it converts a one-time magnet
into a renewable lead stream — but only after the basic loop is trustworthy.

---

## 6. Phased plan

### P0 — Must-fix before deploy (hard gate)
1. **SSRF guard** shared helper: reject private/loopback/link-local IPs and
   non-http(s) URLs; apply to presence/audit/ssl/seo.
2. **Rate-limit** all scan endpoints + `/api/capture` (per-IP, e.g. 10/min) —
   reuse `src/lib/rate-limit.ts`.
3. **Escape user input** in `/api/capture` notification HTML.
4. **Real email validation** (zod) on `/api/capture` and the intake form.
5. **Honeypot field** on the intake form (cheap bot filter).
6. **"Couldn't verify" states** end-to-end: presence/audit/ssl/seo return a
   `verified: boolean`, and the UI renders unverifiable categories as neutral
   ("we couldn't check this") instead of a red 0.
7. **Rule-engine guards**: never surface a "biggest opportunity" for a category
   that scored as passing; have a credible fallback ladder.

### P1 — Close the loop (the actual value)
8. **Audit → CRM bridge.** Make `/api/capture` (or a new
   `/api/business-analysis/submit`) create/update a CRM lead with: scores,
   letter grade, biggest-opportunity service, source `"Business Analysis"`, and
   first-touch attribution. Wire to the same store the CRM reads.
9. **Deliver the promised report.** Generate the full report server-side and
   email it (HTML + link), so the on-page promise is real. Re-use the scan data;
   don't recompute in the browser only.
10. **Pre-tag the lead** with the recommended service so Duke's outreach template
    (`{demoUrl}`, service pitch) is pre-filled.
11. **Follow-up sequence hook.** Drop the lead into a 3-step drip (day 0 report,
    day 2 nudge, day 5 "want me to fix the #1 thing?") — depends on the CRM
    sequence engine (see project backlog).

### P2 — Conversion optimization (measure, then tune)
12. **Analytics + funnel events**: page view → submit → scan complete → CTA
    click → booking. Without this we're flying blind. (Blocks honest iteration.)
13. **A/B the headline + CTA** ("biggest opportunity" framing vs. full grade).
14. **Social proof on the results page** (real testimonials/case studies once the
    fake `/work` content is replaced — see backlog #legal).
15. **Speed up perceived scan**: stream/stagger results as each check returns
    instead of waiting for all four; show progress per category.
16. **Graceful single-check failure**: never blank the whole report if one API
    times out (mostly handled — verify + add retries on transient SSL/SEO fails).
17. **"Email me my report" even if they bounce** before results render (we
    already capture on submit — confirm it always fires first).

### P3 — Expand to a renewable product (Option B)
18. **Persist scans** (keyed by URL+email) with a shareable read-only results
    page (`/business-analysis/r/[id]`) — also great for sharing/SEO.
19. **Monthly re-scan cron** + "your score changed" email (Vercel Cron).
20. **Lightweight account / magic-link** so a business can see history + trends.
21. **Score badge** they can embed ("Verified by CopperBay") — soft viral loop.
22. **Benchmark vs. local competitors** in their niche/city (huge perceived value,
    leans on the scraper + scan data we already have).

---

## 7. Success metrics (instrument in P2)

- **Scan completion rate** (submit → results rendered).
- **Lead → CRM rate** (should be ~100% after P1; today it's 0% structured).
- **Results → CTA click** and **CTA → booking** rates.
- **Lead → reply / booked-call** rate from the freemium source specifically
  (tag the source so we can compare against contact-form and tool leads).
- **Report email open/click** once delivery is wired.

---

## 8. TL;DR

The freemium product looks finished but is **not deployable yet**: it has live
SSRF + no rate limiting, it makes a promise (full report email) it doesn't keep,
and it drops the scored lead on the floor instead of into the CRM. Do **P0
(security + trust)** and **P1 (close the loop)** before any public launch; P2
makes it convert; P3 turns it into a renewable lead stream.
