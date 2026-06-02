# Email Deliverability — keeping copperbaytech.com out of spam

Whether your outreach lands in the inbox or the spam folder comes down to two
things:

1. **Authentication** — proving to Gmail/Outlook that mail "from
   copperbaytech.com" really is from you (SPF, DKIM, DMARC). This is DNS setup
   you do once in Cloudflare.
2. **Sending hygiene** — unsubscribe handling, opt-out compliance, sane volume,
   and never re-mailing people who said no. The CRM now does most of this for
   you automatically (see the last section).

If you skip the DNS part, you **will** get flagged. It's the single biggest factor.

---

## 1. Verify the domain in Resend (gives you DKIM + SPF)

1. Resend dashboard → **Domains → Add Domain** → `copperbaytech.com`.
2. Resend shows you a set of DNS records (a DKIM key, an SPF/return-path on a
   `send.` subdomain). Copy them exactly.
3. Add each one in **Cloudflare → DNS** (see next section).
4. Wait until Resend shows the domain as **Verified** (usually minutes, up to a
   few hours).

## 2. Cloudflare DNS records

Add these in **Cloudflare → your domain → DNS → Records**. Set every record to
**DNS only (grey cloud)**, never proxied (orange) — proxying breaks mail auth.

| Type | Name | Value | Notes |
|------|------|-------|-------|
| TXT / CNAME | *(from Resend)* | *(from Resend)* | **DKIM** — paste exactly what Resend gives you. |
| MX + TXT | `send` | *(from Resend)* | Resend's return-path / SPF for the sending subdomain. |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@copperbaytech.com; fo=1` | **DMARC** — add this yourself (see below). |

### DMARC — add this yourself

DMARC is what ties SPF + DKIM together and tells inbox providers what to do
with mail that fails. Without it, Gmail increasingly sends you straight to spam.

Start in **monitor mode** so nothing legitimate gets blocked while you confirm
everything passes:

```
Name:  _dmarc
Type:  TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@copperbaytech.com; fo=1
```

After a week or two of clean reports, tighten the policy:

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@copperbaytech.com; fo=1
```

…and eventually `p=reject` once you're confident. Create the
`dmarc@copperbaytech.com` mailbox (or forward it via Cloudflare Email Routing)
so you actually receive the reports.

## 3. Replies + DMARC reports (Cloudflare Email Routing)

Cloudflare can't *send* mail, but it can *receive* it. Set up routing so:

- `contact@copperbaytech.com` → forwards to your real inbox (so you see replies).
- `dmarc@copperbaytech.com` → forwards to you (or a folder) for the reports.

## 4. Warm-up & sending best practices

A brand-new domain that suddenly blasts 200 cold emails looks exactly like a
spammer. Ramp slowly:

| Week | Max per day |
|------|-------------|
| 1 | 10–20 |
| 2 | 30–50 |
| 3 | 75–100 |
| 4+ | up to the 200/day cap |

Other things that keep you out of spam:

- **Only email real, verified business addresses.** In the lead list, prefer
  leads marked **Business** email (the CRM flags `email_owned`). Avoid scraped
  `info@`/`gmail` guesses with high bounce risk — bounces wreck reputation.
- **Keep it plain and personal.** No big images, no link shorteners, few links.
  The human-sounding templates already do this.
- **Watch your complaint rate.** Stay under ~0.3% marked-as-spam. One bad blast
  can undo weeks of warm-up.
- **Honor opt-outs instantly** — handled automatically now (below).
- **Set up [Google Postmaster Tools](https://postmaster.google.com)** for
  copperbaytech.com to monitor your spam rate and domain reputation.

## 5. What the CRM already handles for you

These are built in as of the latest deploy — no action needed:

- **One-click unsubscribe.** Every outreach email includes the RFC 8058
  `List-Unsubscribe` / `List-Unsubscribe-Post` headers, so Gmail and Outlook
  show their native "Unsubscribe" button. This is now *required* by Gmail/Yahoo
  for bulk senders and is a strong positive signal.
- **Visible opt-out + mailing address** in the email footer (CAN-SPAM
  compliance). ⚠️ Set the `MAILING_ADDRESS` env var to a deliverable postal
  address — a P.O. Box or virtual mailbox is fine (no street office needed).
  Until it's set, live cold outreach stays gated, so no non-compliant mail can
  go out.
- **Suppression list.** Anyone who unsubscribes is recorded and **automatically
  skipped** on every future send (bulk or single). They're counted as "skipped"
  in the send summary.
- **Reply-to set to contact@copperbaytech.com**, so engagement (replies) flows
  back to you — another positive reputation signal.
