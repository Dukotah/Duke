# Getting Clients — Operating Playbook (Copper Bay Tech)

_Last updated: 2026-06-04 · Owner: Dukotah_

You've already **built** a cold-outreach machine most freelancers never have:
the Sonoma lead scraper → CRM (`/crm`) → power dialer → tracked email, plus
free audit tools. This doc is the **operating manual** that turns it into a
daily routine — plus the three plays the machine doesn't cover (warm network,
founding-client offer, referral partners).

> **North Star (next 60 days):** not "leads" — your **first 3 paying clients.**
> They become the reviews + case studies + referrals that unlock SEO, the
> review schema, and inbound. Engineer them on purpose, then the flywheel spins.

Targeting: **broad** (any local business with an obvious site/security problem).
Channels: **phone + email.** Budget: **$0** (organic only).

---

## Before you send a single cold email — deliverability gate

Cold email from an unverified domain goes straight to spam and can burn your
domain. Do this once, first:

- Verify the sending domain in **Resend** (SPF, DKIM, DMARC). See
  `DELIVERABILITY.md` in the repo.
- Warm up: keep volume low at first (20–30/day), real personalized sends.
- Never email the same person twice in the suppression list. The CRM already
  enforces a daily cap + suppression — don't override it.

---

## The daily routine (≈2 focused hours)

| Block | Time | What you do |
|------|------|-------------|
| **Source** | 15 min | In `/crm`, pull the hottest unworked leads (the queue sorts by heat — worst websites first = easiest sells). Aim for ~20 fresh leads. |
| **Call** | 60 min | Power-dial the hot list. The CRM shows a **per-lead script** (`buildScript`) that opens with *their* worst problem + an **objection bank**. Log every call's disposition — that's what advances the pipeline and schedules callbacks. |
| **Email** | 30 min | For no-answers and "just email me," send **touch 1** of the sequence (problem-led, auto-generated per lead). Queue follow-ups (see cadence below). |
| **Follow-up** | 15 min | Work today's due callbacks + follow-ups the CRM surfaces. **80% of wins are in the follow-up** — don't skip this block. |

**Weekly:** 2–3 referral-partner conversations, 1 networking event, send the
warm-network batch until the list is exhausted.

---

## Play 1 — Warm-network blitz (do this Week 1; highest conversion)

People who already trust you convert 10× a cold lead. List **30–50** people:
former coworkers/bosses, friends/family who own or work at a business, anyone
local. This is a *referral* ask, not a sales pitch.

**Template (text or email — keep it personal, edit per person):**

> Hey [name] — quick one. I just launched Copper Bay Tech: I build websites and
> handle IT/security for small businesses here in Sonoma County. I'm taking on a
> few founding clients at a steep discount to build up my portfolio.
> Do you know anyone whose website is a mess, who has no site, or who's worried
> about getting hacked? I'll give them a free audit, no strings. Even just a name
> would mean a lot. Thanks! — Duke

Goal: 30–50 sent in week 1 → a handful of intros → your easiest first clients.

---

## Play 2 — Audit-led cold outreach (your main engine, Weeks 1–4)

The machine is built; here's how to run it:

1. **Filter for real pain.** The scraper scores leads by website signals. Work
   the **hot band first**: no website, no SSL ("Not Secure"), not mobile-friendly,
   very slow, broken links, stale footer. A broken site is the easiest sale.
2. **Lead with their problem, never a pitch.** The opener is literally "I was on
   [business]'s site and noticed [specific problem] — that's why I'm calling."
   Specific + true + helpful = not spam. The script writes this for you per lead.
3. **Multi-touch or it doesn't work.** One email ≈ no reply. The sequence engine
   now generates a **4-touch cadence** per lead:
   - **Touch 1 (day 0):** problem-led intro.
   - **Touch 2 (day 3):** bump + offer the free audit.
   - **Touch 3 (day 7):** new angle — "the faster site in [town] gets the call."
   - **Touch 4 (day 14):** breakup ("last note") — surprisingly high reply rate.
4. **Phone beats email.** A real local person who clearly did their homework
   closes faster than any funnel. Email is the warm-up; the call is the close.
5. **Always offer the free audit as the fallback close.** It's your foot in the
   door even when they're not ready to buy.

**Numbers that work:** ~20–30 researched touches/day (not 500 blasts) →
~10–15 audit calls booked over a month → 2–3 closes.

---

## Play 3 — The "founding client" offer (breaks the chicken-and-egg)

You need clients to get reviews, and reviews to get clients. Break it by
**buying proof**: offer your first **3–5** clients a founding rate.

**The offer:**
> I'm taking on a few founding clients to build my portfolio. You get [50% off /
> a free starter site / your first month of IT support free]. In exchange, if
> you're happy, I'd ask for: (1) a short Google review, (2) permission to feature
> the before/after as a case study, and (3) an intro to one other business owner.

Why it works: the revenue matters less right now than the **review + case study
+ referral** each founding client produces. Make it explicitly limited ("first 5
businesses") so it has urgency and doesn't anchor your real pricing low forever.

When a founding client says yes and is happy: add their approved quote to
`src/lib/reviews.ts` (turns on star schema) and send them your Google review
link (`GOOGLE_REVIEW_URL`).

---

## Play 4 — Referral partners (compounding, Weeks 2–8)

The best long-term channel for services. Partner with people who serve the same
small businesses but **don't compete** with you:

- Marketing / branding agencies (they need a developer)
- Bookkeepers & accountants (trusted advisors to every SMB)
- Commercial realtors & business brokers
- Business coaches / consultants
- IT hardware vendors, POS installers, signage/print shops

**Outreach template:**

> Hi [name] — I run Copper Bay Tech (web + IT + security for Sonoma County small
> businesses). We serve the same clients but don't overlap. When one of your
> clients needs a website fixed or IT help, I'd love to be your go-to — and I pay
> a referral fee / send work back your way. Worth a quick coffee?

One good partner = a steady trickle of pre-warmed leads. Also: join the
**Petaluma Area Chamber** and one networking group (BNI). Local services close
on relationship — show up in person.

---

## 30-day plan

- **Week 1:** Deliverability verified. Warm-network list (30–50) sent. ~50 hot
  audit-targets queued in the CRM. Founding-client offer finalized.
- **Weeks 1–4:** Daily routine above. 20–30 touches/day, every lead on the 4-touch
  cadence, every call dispositioned. 3+ referral-partner chats.
- **Targets:** 10–15 audit calls booked → **2–3 founding clients closed** →
  2–3 Google reviews + 1–2 case studies collected.
- **Then:** add the reviews to the site, point new outreach at your proof, and
  let SEO + referrals start compounding.

## What NOT to do yet

- Don't pour time into SEO/blogging/social *for leads* — slow on a young domain.
  It's a long-term asset, not a Q1 client source. (It's already built; let it bake.)
- Don't buy generic lead lists or blast un-personalized email — kills your domain.
- Don't discount your real pricing publicly; the founding rate is private + limited.
- Don't wait for the site to be "perfect." It already converts. Go talk to people.

## The flywheel

Founding clients → reviews + case studies → outreach gets easier + SEO/stars turn
on → referrals compound → raise prices → repeat. The first 3 clients are the
whole game. Everything here exists to get you those three.
