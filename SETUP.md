# Setting up your CRM

This guide gets the Copper Bay Tech CRM live and ready for your sales team.
No coding required — you'll mostly be copying a few keys into your hosting
settings. Plan for about **15 minutes**.

> **Tip:** Once the app is running, sign in as admin and open the **Setup** tab.
> It shows a live green / amber / red checklist of everything below, so you
> always know what's working.

---

## What you need

There are only **three required** things to go live:

| # | Setting | What it does |
|---|---------|--------------|
| 1 | **Database** | Stores your leads, reps, and sales |
| 2 | **Login security** | Lets your team sign in safely |
| 3 | **Admin account** | Creates your own owner login |

Everything else (real email sending, faster audits) is optional and can be
added later.

You configure all of these as **environment variables** in your hosting
provider (Vercel, Netlify, etc.). There's a copy-paste template in
[`.env.example`](./.env.example).

---

## Step 1 — Database (required)

This is where everything is stored. It's free.

1. Go to **[console.upstash.com](https://console.upstash.com)** and sign up.
2. Click **Create Database** and choose the **Redis** type.
3. Open the database, scroll to the **REST API** section, and copy these two
   values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

Keep them handy for Step 4.

---

## Step 2 — Login security (required)

This is a secret string that keeps sign-ins safe.

- Make any long random string (40+ characters).
- Easiest way: open a terminal and run `openssl rand -base64 48`, then copy
  the result. (Or just mash together a long, random mix of letters and
  numbers.)

This is your `SESSION_SECRET`.

---

## Step 3 — Your admin account (required)

These create **your** owner login the first time you sign in:

- `ADMIN_EMAIL` — a real email you control (e.g. `you@copperbaytech.com`)
- `ADMIN_PASSWORD` — a strong password

---

## Step 4 — Add the keys to your host

Paste everything from Steps 1–3 into your hosting provider's **Environment
Variables** settings.

**On Vercel**, for example:

1. Open your project → **Settings** → **Environment Variables**.
2. Add each name and value (one per row):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `SESSION_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
3. Click **Save**, then **redeploy** so the new settings take effect.

---

## Step 5 — Sign in and confirm

1. Go to **`/crm/login`** on your site.
2. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you chose. This
   activates your admin account.
3. Open the **Setup** tab. Everything required should show a green check ✅.
   If anything is amber or red, it tells you exactly which setting to add.

---

## Step 6 — Add your sales reps

1. In the admin dashboard, open the **Sales Reps** tab.
2. Click **Add Sales Rep** and enter their name, email, password, and
   commission rate.
3. Send them to **`/crm/login`** — they sign in with that email and password
   and get their own private workspace (their own leads, calls, and
   commissions).

That's it — your team is live. 🎉

---

## Optional add-ons (any time)

These aren't needed to go live. Add them when you're ready.

### Send real outreach emails — `RESEND_API_KEY`
Until this is set, outreach runs in **safe practice mode**: emails appear in
**Admin → Email** but aren't actually delivered. To send for real:

1. Sign up at **[resend.com](https://resend.com)**.
2. Verify your sending domain (Resend walks you through it).
3. Create an **API Key** and add it as `RESEND_API_KEY`.

### Faster website audits — `PAGESPEED_API_KEY`
The audit tools work without this, but may be rate-limited. A free Google key
raises the limits — see
[Google's guide](https://developers.google.com/speed/docs/insights/v5/get-started).

### GitHub lead webhooks — `GITHUB_WEBHOOK_SECRET`
Only needed if you connect GitHub to push leads into the CRM automatically.

---

## Troubleshooting

**"SESSION_SECRET not configured" when I try to sign in**
→ You haven't added `SESSION_SECRET` yet (Step 2), or you didn't redeploy
after adding it.

**"Invalid credentials" with the right email and password**
→ Make sure `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set and you redeployed. The
admin account is created the first time you sign in after they're set.

**Nothing saves / pages error out**
→ The database isn't connected. Re-check the two Upstash values from Step 1.
The **Setup** tab will tell you if the connection failed.

**A rep can't sign in**
→ Confirm you added them in the **Sales Reps** tab and that their account is
marked active.

Still stuck? The **Setup** tab is the fastest way to see what's missing.
