# Email Deliverability — the 30-minute "do it today" version

Cold email from an **unverified domain** goes to spam and damages your domain
reputation. You must do this **before sending any cold email.** (Cold *calling*
and warm-network texts need none of this — go do those today regardless.)

This is the critical path. Full detail + sending best-practices live in
[`../../DELIVERABILITY.md`](../../DELIVERABILITY.md).

## Do these in order

### 1. Add the domain in Resend (5 min)
- Resend dashboard → **Domains → Add Domain** → `copperbaytech.com`.
- Resend shows you DNS records (a **DKIM** key + an SPF/return-path on a `send.`
  subdomain). Keep that tab open.

### 2. Paste the records into Cloudflare (10 min)
- Cloudflare → `copperbaytech.com` → **DNS → Records**.
- Add **each record Resend gave you, exactly.** Set every one to **DNS only
  (grey cloud)** — never proxied/orange (proxying breaks mail auth).

### 3. Add DMARC yourself (2 min)
Add one more TXT record in Cloudflare:
```
Name:  _dmarc
Type:  TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@copperbaytech.com; fo=1
```
(Start at `p=none` / monitor mode. Tighten to `quarantine` then `reject` after a
week or two of clean reports.)

### 4. Catch replies + reports (5 min)
Cloudflare → **Email Routing**:
- `contact@copperbaytech.com` → forward to your real inbox (so you see replies).
- `dmarc@copperbaytech.com` → forward to you (for the DMARC reports).

### 5. Wait for "Verified" (minutes–hours)
Back in Resend, wait until the domain flips to **Verified**. Done.

## Then send like a human, not a spammer
- **Ramp slowly:** ~10–20/day week 1, 30–50 week 2, 75–100 week 3, up to the
  200/day cap after. A new domain blasting 200 looks exactly like spam.
- **Only email real business addresses** (the CRM flags `email_owned` = Business).
  Avoid `info@`/gmail guesses — bounces wreck reputation.
- **Keep it plain + personal** — few links, no images, no link shorteners. The
  built-in templates already do this.
- **Set up [Google Postmaster Tools](https://postmaster.google.com)** to watch
  your spam rate (stay under ~0.3%).

## Already handled by the app (no action)
One-click unsubscribe headers, visible opt-out + mailing address, suppression
list (auto-skips opt-outs), reply-to set to contact@. ⚠️ One to-do: set a real
`MAILING_ADDRESS` in `src/config/site.ts` (CAN-SPAM) before bulk sending.

---
**Bottom line:** ~30 minutes of DNS today unlocks cold email. Until it's
**Verified**, stick to calls + warm network (which are faster anyway).
