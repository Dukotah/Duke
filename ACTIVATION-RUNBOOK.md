# Activation Runbook — turn the pipeline ON

**Goal:** send the first real outreach batch end-to-end and start measuring the only
metric that matters: **replies / booked calls.** Today that number is ~0 because nothing
has been sent in production — the machine is built but never ignited.

**Scope of this runbook:** the *activation* half (CRM + outreach + the seam). The
*site builder* (`projects/Websites`) is being fixed by a separate agent. These two
tracks meet at one contract — see "Seam contract" below. Lock it or the halves drift.

Owner: dukotah@gmail.com · CRM: `projects/Duke` (Next.js/Vercel) · Factory: `projects/Websites`

---

## Order of operations (dependencies matter)

```
1. Ship the needs-review GATE  ──┐  (safety belt: must land BEFORE send is live)
2. Verify the Resend DOMAIN    ──┤  (ignition: DNS — only you can do this)
3. Wire the SYNC as a step     ──┤  (fuel line: factory output → CRM New tab)
4. First SEND (5 leads)        ──┘  (the actual test)
5. Fix the landing TRUST gap      (parallel — clicks die here otherwise)
```

---

## Step 1 — Ship the needs-review gate  *(do first; ~15 min)*

The server-side block that refuses to email any lead whose demo is flagged
`needs-review`. The UI hides the Send button, but the API is the real authority —
this stops a stale client or the bulk composer from leaking an unreviewed demo into
an inbox. The diff is clean (fails closed, checks `lead_previews` server-side,
handles both `needs_review` and `needs-review` spellings).

```bash
cd C:/Users/dukot/projects/Duke
git add src/app/api/crm/outreach/route.ts
git commit -m "CRM: server-side gate — never email a needs-review demo"
git push                      # Vercel auto-deploys the live CRM
```

The unpushed `d5c92df` (clear-demos.mjs) rides along on the same push — harmless.
The two untracked `winery-*.mjs` scripts are one-offs; leave them untracked.

> **This push deploys the production CRM.** Confirm before running if reps are mid-session.

---

## Step 2 — Verify the Resend domain  *(ignition — only you; ~30 min + DNS propagation)*

Until this is done, **every "send" is silently track-only** — logged, never delivered.
Full steps in `Duke/DELIVERABILITY.md`. Short version:

1. Resend dashboard → **Domains → Add Domain** → `copperbaytech.com`. Copy the DKIM +
   `send.` SPF/return-path records it shows you.
2. Cloudflare → DNS → add each record **DNS only (grey cloud), never proxied.**
3. Add DMARC yourself, monitor mode first:
   ```
   Name: _dmarc   Type: TXT
   Value: v=DMARC1; p=none; rua=mailto:dmarc@copperbaytech.com; fo=1
   ```
4. Wait for Resend to show **Verified** (minutes to a few hours).
5. Set these env vars in **Vercel → Duke → Settings → Environment Variables**:
   ```
   RESEND_API_KEY=<from Resend>
   OUTREACH_DOMAIN_VERIFIED=true
   MAILING_ADDRESS=<a mailbox address — CAN-SPAM footer, P.O. box is fine>
   RESEND_WEBHOOK_SECRET=<from Resend → Webhooks>   # so opens/clicks/bounces track
   ```
   Optional: `OUTREACH_DAILY_CAP` (the warm-up ramp auto-limits week 1→20/day anyway).

DNS done once. After this the machine can actually deliver mail.

---

## Step 3 — Wire the factory→CRM sync as a real step  *(~15 min)*

`scripts/sync-demos-to-crm.mjs` already exists and reads the factory's
`data/outreach-links.json`, upserts each prospect as a custom lead, and attaches the
demo preview. Today it's a hand-run script. Make running it the last line of every
batch (or a small scheduled job) so the builder agent's output auto-lands in your New tab.

```bash
cd C:/Users/dukot/projects/Duke
node scripts/sync-demos-to-crm.mjs                            # dry-run — see what would land
node scripts/sync-demos-to-crm.mjs --commit --only-ready \
     --owner dukotah@gmail.com                                # write only verified demos
```

`--only-ready` skips needs-review demos at sync time — belt-and-suspenders with the
Step 1 gate. Needs `Duke/.env.local` to hold the Upstash creds (it already reads it).

---

## Step 4 — First real send: 5 leads  *(the test)*

1. In the CRM New tab, pick **5** leads that have a `ready` demo attached (from the
   builder agent's finished batch — not 50; you want signal, not volume).
2. Send via the outreach composer. Week-1 cap is 20/day, so 5 is safe.
3. Watch the lead cards: `opened` / `clicked` stamps arrive via the Resend webhook
   (tracking is already wired). A click is your hottest signal.
4. Reply-handling is manual — that's fine for 5.

**Five real sends teach you more than another week of factory work.** Expand based on
what converts, not on what's fun to build.

---

## Step 5 — Fix the landing-page trust gap  *(parallel — or clicks die)*

Per the prior site audit, copperbaytech.com has a "trust vacuum": no reviews, no real
photos, no Google Business Profile. A prospect who clicks the demo lands here next and
bounces. The owner-only items (collect 3–5 reviews, real headshot/photos, claim GBP,
Calendly link, clear pricing) block conversion regardless of how good the outreach is.
Don't let Steps 1–4 succeed into a dead end.

---

## Seam contract — lock this before the builder agent refactors

The factory and CRM meet at **one file shape**: `Websites/data/outreach-links.json`.
The CRM matches demos to leads by **normalized business name** and gates sending on
**demo status**. If the builder agent renames fields, changes the status strings, or
alters slug↔name normalization, the CRM silently stops matching — you'll either attach
nothing or (worse) send unreviewed sites.

**Frozen contract — each entry must keep these keys and meanings:**

| Field | Meaning | Consumed by |
|---|---|---|
| `name` | business name (the join key) | `previewKey(name)` match in CRM |
| `slug` | stable demo id | preview link + thumbnail |
| `link` | `https://demos.copperbaytech.com/p/<slug>` | the URL emailed to the prospect |
| `status` | `ready` \| `needs_review` \| `needs-review` | **the send gate** (Step 1) |
| `email`, `category`, `area`, `thumbnailUrl` | lead enrichment | CRM lead card |

Tell the builder agent: **don't change these names or the `status` vocabulary.** If the
factory must evolve the manifest, add fields — never rename or repurpose these.

---

## What only you can do vs. what an agent can run

- **You:** Step 2 DNS + Vercel env vars; the Step 4 send decision; Step 5 reviews/GBP/photos.
- **An agent (with your go on the prod push):** Step 1 commit+push, Step 3 sync wiring,
  drafting the Step 4 lead shortlist, and pinning the Step 5 code-side fixes.

**Definition of done:** 5 real emails delivered (not track-only), opens/clicks landing
on the cards, and the landing page no longer a dead end.
