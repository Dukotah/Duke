# Contractor Onboarding Roadmap — hire your first cold-call closer

_Created 2026-06-18. Goal: go from "I hate cold calling" to "an independent
contractor is calling my scraped leads and selling websites for a commission,
safely, through the CRM." This doc is the analysis + the build/operate plan._

---

## TL;DR

The CRM is **already a multi-rep, commission-based sales machine** — far more
built than "create a profile and plug in leads." Reps, roles, per-rep lead
state, lead submissions with deal value, commission rates, payout tracking,
territories, a leaderboard, call logging, and email outreach all exist today.

**You could technically onboard one contractor this week.** The real work is
(1) making it *safe* to hand an outsider access (lead scoping, exclusive
assignment, guardrails), (2) the *operational* layer (script, commission terms,
1099 paperwork, calling-compliance), and (3) only then *scaling* to a team.

---

## Part 1 — What the CRM is

A Next.js 16 / React 19 app deployed on Vercel (Vercel project `duke`, live at
copperbaytech.com). It is two things in one codebase:

1. **The marketing site** — copperbaytech.com (services, blog, free audit tools,
   contact form). Generates inbound leads.
2. **The sales CRM** — under `/crm` (rep app) and `/crm/admin` (your admin
   console). This is the part that matters for hiring callers.

Data lives in **Upstash Redis** (key-value), with a local `.local-db.json`
fallback for dev. There is **no SQL database** — everything is Redis hashes,
sets, and sorted sets. Email is sent via **Resend**.

## Part 2 — How it works (the loop)

```
 Scraped leads (CSV from sonoma-lead-scraper)  ─┐
 Website-factory demos (sync script)           ─┼─▶  CRM lead queue
 Inbound free-tool / contact-form captures     ─┘         │
                                                          ▼
                       Rep works the lead:  call (log outcome) · email · notes
                                                          │
                                          Rep submits a deal "to Duke" ──▶ pending
                                                          │
                          Admin accepts, sets deal value ──▶ commission calculated
                                                          │
                                          Admin marks commission paid (manual)
```

- **Lead sources:** a scraped CSV (`/api/crm/leads`, source =
  `sonoma-lead-scraper` repo, ~35 enriched fields incl. phone, owner name, grade
  A–D, site quality), the website-factory demo sync
  (`scripts/sync-demos-to-crm.mjs`), and inbound captures (`/api/capture`).
- **Lead has a phone** — so cold calling is supported. Call logging exists:
  `CallTimer`, call outcomes, `callCount`, `bestTimeToCall`, `CallQueue`,
  `CallReminders`, activity timeline.
- **Rep dashboard** (`/crm`): lead panel, call queue, pipeline kanban, demo
  queue, reminders, earnings, bulk/single email composer with templates.
- **Admin console** (`/crm/admin`) tabs: Submissions, Reps, Territories,
  Leaderboard, Revenue, Email, Suppression, Setup.

## Part 3 — What already exists for a contractor model

| Capability | Status | Where |
|---|---|---|
| Per-user accounts, roles (`admin`/`rep`) | ✅ Built | `src/lib/db.ts:35`, `/api/crm/admin/users` |
| Login (email+password, JWT cookie, 30-day) | ✅ Built | `src/lib/session.ts`, `src/app/api/crm/login` |
| Role enforcement (reps can't see admin) | ✅ Built | `src/middleware.ts` |
| Commission rate per rep | ✅ Built | `User.commissionRate` |
| Deal submission → admin approval → commission calc | ✅ Built | `Submission`, `/api/crm/admin/submissions` |
| Payout tracking (mark paid) | ✅ Built | `commissionPaid` flag |
| Per-rep earnings dashboard | ✅ Built | `Earnings.tsx`, `getRepStats()` |
| Leaderboard (calls / submissions / earnings) | ✅ Built | `/api/crm/admin/leaderboard` |
| Call logging + outcomes + reminders | ✅ Built | `CallTimer`, activity API |
| Per-rep lead state (own status/notes/followup) | ✅ Built | `lead:{userId}:{leadId}` |
| Soft lead "claim" (30-day TTL) | ⚠️ Partial | `/api/crm/claim` |
| Territory assignment (county + niche) | ⚠️ Built but **not enforced** | `/api/crm/admin/territory` |
| Custom lead add per user | ✅ Built | `/api/crm/custom-leads` |

## Part 4 — The gaps that actually block hiring an outsider

These are the things to decide/build *before* a stranger logs in.

1. **No exclusive lead assignment.** Every rep sees the *entire* scraped CSV.
   Claims exist but are temporary (30-day TTL) and not enforced — two callers
   (or you + the contractor) can call the same business. For cold calling, this
   is the #1 problem: you need each lead to belong to exactly one caller.
2. **No lead-view scoping / data-exfiltration guardrail.** A contractor can see
   and effectively export your whole lead database. That's your most valuable
   asset handed to a 1099 you just met. They should see *only their assigned
   batch*.
3. **Territories are decorative.** You can assign a county/niche to a rep, but
   the lead queue doesn't filter on it. Either enforce territory or use explicit
   assignment (recommended for cold calling).
4. **Email-from-your-domain risk.** Reps can send outreach from
   copperbaytech.com. A new contractor sending sloppy email can burn your domain
   reputation. Decide: cold-callers get **phone only, email disabled**.
5. **No written commission terms / dispute trail.** Deal value is set by you at
   accept time; there's no contractor-visible agreement, no "what counts as a
   closed deal," no claw-back if a client refunds.
6. **Operational/legal layer doesn't exist** (it's not code): 1099 agreement,
   W-9, payout method, and **calling compliance** (see Part 7).

---

## Part 5 — The roadmap

### Phase 0 — Minimum to onboard contractor #1 (this week, mostly config)

Goal: one contractor calling a fixed batch of leads, logging calls, submitting
deals, getting paid. Small and manual is fine for the first hire.

- [ ] **Load real call-ready leads.** Confirm the scraped CSV is populated with
      businesses that have phone numbers in the target niche (no-website / bad-
      website businesses). Verify `/api/crm/leads` returns them. _(Owner +
      check)_
- [ ] **Create the contractor's account.** Admin → Reps → add user with
      `commissionRate` set. Already works today. _(Owner, 2 min)_
- [ ] **Hand them a fixed batch, not the whole DB.** Interim approach until
      assignment is built: give them a defined slice (e.g. by city/niche) and
      tell them to claim each lead before calling. _(Owner)_
- [ ] **Write the call script + value prop** ("we built you a free demo site,
      here's the link, $X to go live"). Pairs with the demo-first model. _(Owner)_
- [ ] **Set commission terms in writing** (% , what's a closed deal, when paid).
      _(Owner — see Part 6)_
- [ ] **Dry-run the full flow yourself** as a fake rep: log a call → submit a
      deal → accept it → mark paid → confirm it shows in Earnings. _(30 min)_

### Phase 1 — Make it safe for an outsider (before/just after they start)

Goal: the contractor sees only their leads, can't walk off with your database,
and can't damage your domain. **This is the real engineering work.**

- [x] **Durable, exclusive lead assignment.** _(done 2026-06-19)_ Added
      `LeadAssignment` (durable, no TTL, exclusive — assigning moves ownership) in
      `src/lib/db.ts` + admin API `POST /api/crm/admin/assign`
      (assign/unassign/reassign, bulk). Admin assign/reassign/unassign control
      lives in the lead panel header (admin-only). Also added `hget`/`hdel` to the
      local Redis shim (fixed a latent `getLeadAction` bug).
- [x] **Scope the lead queue by assignment.** _(done 2026-06-19)_
      `/api/crm/leads` now scopes a non-admin rep to **assigned-to-them ∪
      unassigned-in-their-territory** (+ their own custom leads); a lead assigned
      to another rep is hidden even if in-territory, and the `allTerritories`
      bypass is now admin-only. A rep with no territory + no assignments sees no
      cold leads. Each card carries `assignedTo` for the admin view.
- [x] **Cold-caller permission profile.** _(done 2026-06-19)_ Added
      `User.emailMode` = `full | restricted | off`. **restricted** = templated
      only (server renders from `templateKey`, ignores client edits), one lead at
      a time, own-leads-only (assignment/custom ownership checked), low daily cap
      (`OUTREACH_RESTRICTED_DAILY_CAP`, default 15). **off** = phone only (send
      403'd). Enforced server-side in `/api/crm/outreach` (the real boundary).
      UI: `/api/crm/me` exposes the mode; the single composer locks to approved
      templates, the bulk composer + trigger are hidden for non-full reps; new
      reps default to **restricted** in the Add-Rep form. New reps default
      restricted; admin = full.
- [x] **Rate-limit + audit.** _(done 2026-06-19, armada)_ Per-rep rate limit on
      `/api/crm/leads` (`LEADS_RATE_LIMIT`/`LEADS_RATE_WINDOW_SEC`, default 60/60s,
      fail-open, 429 on exceed) + an audit log (`lead_audit:{userId}`) of every
      fetch (filters + result count) via `logLeadFetch`; admin read endpoint
      `/api/crm/admin/audit`.
- [x] **Contractor-visible commission statement.** _(done 2026-06-19, armada)_
      `Earnings.tsx` now separates PENDING (accepted-unpaid) vs PAID, lifetime
      earned, and per-deal line items (value, commission, paid status, date).

### Phase 2 — Scale to a team (when contractor #1 is working)

- [x] **Bulk / round-robin assignment** _(done 2026-06-19, armada)_ — admin bulk
      assign by county/niche + count, direct or round-robin across reps; extends
      `/api/crm/admin/assign` (`getLeads` now exported for reuse). Single-lead
      LeadPanel flow unchanged.
- [~] **Enforce territories** — effectively handled: the Phase-1 scoping already
      restricts reps to assigned ∪ unassigned-in-territory. No separate work
      needed unless we retire territories entirely. _(Decision, optional)_
- [x] **Rep-to-rep handoff** _(done 2026-06-19, armada)_ — a rep can hand a lead
      they OWN to another rep (`/api/crm/handoff`, ownership verified server-side,
      logs an activity note); LeadPanel "Hand off to…" control; `/api/crm/reps`
      lists active reps for non-admins.
- [x] **Quotas + per-contractor P&L** _(done 2026-06-19, armada)_ — per-rep quota
      (`quota:{userId}`, `/api/crm/admin/quota`) + progress vs quota + per-rep P&L
      (revenue − commission) in the admin dashboard.
- [x] **Tiered commissions** _(done 2026-06-19, armada)_ — deal-value bands →
      rate, admin-settable (`/api/crm/admin/settings`), applied at accept time in
      the submissions route with a live preview in the ResolveModal; falls back to
      the rep's flat rate when no tiers set. _(Split/finder-fee not built — deferred.)_

### Phase 3 — Owner / legal / operational (do in parallel with Phase 0–1)

See Part 6 and Part 7. None of this is code; all of it is required before a real
stranger starts dialing.

---

## Part 6 — Commission & contractor terms (decide before hiring)

- **Commission %** — set `commissionRate` per rep. Decide your number (typical
  for sold-for-you web projects: 10–30% of project value, or a flat $ per close).
- **What is a "closed deal"?** Define it: signed + deposit paid? Define so the
  `accept` step is unambiguous.
- **Payout timing + method** — e.g. paid on the 1st after client pays; via
  PayPal/Stripe/ACH. Track with the existing `commissionPaid` flag.
- **Claw-back** — what happens if a client refunds within N days. (Not built;
  for now handle manually.)
- **1099 paperwork** — collect a **W-9**, use a written **independent
  contractor + commission agreement**, file **1099-NEC** if you pay them ≥ $600
  in a year. Keep them a true contractor (they set their own hours, use their own
  phone) to avoid misclassification.

## Part 7 — Calling compliance (important — flag, don't skip)

You're starting a cold-calling operation. Quick reality check (not legal advice;
confirm with a pro):

- **B2B vs consumer.** Calling *businesses* on their published business lines is
  far less restricted than calling consumers. The National **Do-Not-Call
  Registry** is for residential/personal numbers — most B2B business-line calls
  are exempt, but **business cell numbers and sole-proprietor mobiles are a grey
  area.**
- **TCPA** restricts autodialers/robocalls and pre-recorded messages. **Manual
  dialing by a human is the safe path** — make sure your contractor dials
  manually, no autodialer, no recordings without consent.
- **Calling hours** — keep calls within 8am–9pm in the *prospect's* time zone.
- **Call recording** — if you record calls, California is a **two-party consent**
  state; you must disclose/get consent.
- **Honor opt-outs** — if a business says "don't call again," log it and stop.
  (You already have a suppression list for email; add a do-not-call equivalent.)

Owner action: confirm the above for your exact lead list (B2B business lines in
CA). _(The CRM "do not call" list mechanism is now BUILT — 2026-06-19, armada:
`/api/crm/dnc`, normalized-phone DNC set, reps can mark a lead DNC from the lead
panel, DNC leads are excluded from the call queue. You still confirm the legal
specifics.)_

---

## Armada build log — 2026-06-19

Eight features shipped by a sequential multi-agent build (typecheck + `next build`
both green; nothing committed/pushed):
1. Do-Not-Call list · 2. Per-rep email-mode toggle (Reps list) · 3. Commission
statement clarity (Earnings) · 4. Bulk + round-robin assignment · 5. Rep-to-rep
handoff · 6. Rate-limit + audit on lead fetching · 7. Quotas + per-rep P&L ·
8. Tiered commissions. Plus a security hardening of the user PATCH route
(allowlist + emailMode validation).

Deferred / not built: split (finder vs closer) commissions; in-dashboard editor
for the commission-tier bands (API + modal preview exist; bands set via API);
admin UI surface for the audit log (endpoint + storage exist).

Pre-existing (NOT from this work): 2 ESLint errors in `src/components/motion/`
(`MagneticCTA.tsx`, `RevealOnScroll.tsx`) — flow animation components; do not
block the build.

---

## Part 8 — Who does what

- **Owner (Dukotah):** commission number, "closed deal" definition, W-9 +
  contractor agreement, payout method, calling-compliance confirmation, the call
  script, and the decision on phone-only vs email access. Load/verify the scraped
  call leads.
- **An agent can build:** Phase 1 lead assignment + queue scoping +
  phone-only permission profile + audit/rate-limit, and the Phase 2 scale
  features. All map to known files in `src/lib/db.ts` and `src/app/api/crm/*`.

## Part 9 — Recommended first move

1. Owner: pick the commission number + write the 1-page agreement + script.
2. Agent: build **Phase 1 lead assignment + queue scoping + phone-only profile**
   (this is the single highest-leverage build — it makes handing leads to an
   outsider safe).
3. Onboard one contractor against a small assigned batch. Measure dials → deals.
4. Only then build Phase 2 team-scale features.
