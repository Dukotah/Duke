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

### Send real outreach emails — `RESEND_API_KEY` + `OUTREACH_DOMAIN_VERIFIED`
Until both of these are set, outreach runs in **safe practice mode**: emails
appear in **Admin → Email** and on each lead's timeline, but aren't actually
delivered.

> **Why two steps?** Sending real mail from a domain that isn't verified (no
> SPF/DKIM/DMARC records) is the quickest way to get flagged as spam — and a
> burned domain reputation is hard to recover. So real sending stays **locked**
> until you explicitly confirm the domain is verified.

To send for real:

1. Sign up at **[resend.com](https://resend.com)**.
2. Add your sending domain in Resend and add the **SPF, DKIM, and DMARC** DNS
   records it gives you. Wait until Resend shows the domain as **Verified**.
3. Create an **API Key** and add it as `RESEND_API_KEY`.
4. Set **`OUTREACH_DOMAIN_VERIFIED=true`**. This is the switch that unlocks
   real delivery — only flip it once step 2 shows "Verified".
5. *(Optional)* Set **`OUTREACH_DAILY_CAP`** to warm the domain up slowly —
   start around `25`–`50` and raise it over a couple of weeks. Defaults to 200.

Before all that, you can send freely in practice mode — every email is tracked
on the lead's timeline (marked **logged · not delivered**) so nothing is lost.

### Durable CRM storage (Neon Postgres) — `DATABASE_URL`

By default the CRM uses a local **SQLite** database. That's perfect for local
development, but on Vercel the filesystem is **ephemeral** — the SQLite file is
wiped on every redeploy (and between serverless invocations), so leads, reps,
and call activity would not persist. To keep your data safe in production, point
the CRM at a hosted **Neon Postgres** database.

1. Go to **[neon.tech](https://neon.tech)** and sign up (free tier is fine).
2. Click **Create Project**, pick a region close to your Vercel deployment, and
   create it.
3. In the project, open **Connection Details** and copy the **pooled**
   connection string (the host contains `-pooler`). It looks like:
   `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`
4. On **Vercel** → your project → **Settings** → **Environment Variables**, add
   it as **`DATABASE_URL`**.
5. Apply the schema by running the migration **once** (from your local machine
   with `DATABASE_URL` set, or via a one-off job):

   ```bash
   npm run db:migrate
   ```

   This runs `src/lib/crm/migrate.ts`, which applies
   `src/lib/crm/store.schema.sql` (creating the `reps`, `leads`, and
   `activities` tables). It is safe to re-run — the schema is idempotent.
6. Redeploy. The CRM now reads and writes to Postgres.

**Without `DATABASE_URL`**, the app falls back to the local SQLite store. That's
fine locally, but remember it's **ephemeral on Vercel** — don't rely on it for
real data in production.

**Forcing the local store:** set **`CRM_STORE=sqlite`** to use SQLite even when
`DATABASE_URL` is present (useful when running locally against a copy of your
production environment). Set **`CRM_STORE=pg`** to require Postgres. Leaving
`CRM_STORE` blank auto-selects: Postgres when `DATABASE_URL` is set, SQLite
otherwise. See [`docs/CRM_STORAGE.md`](./docs/CRM_STORAGE.md) for how the store
seam works under the hood.

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

**Emails show as "logged" but aren't being delivered**
→ This is the spam safeguard working as intended. Real sending stays locked
until you've (1) added `RESEND_API_KEY`, (2) verified your domain in Resend,
and (3) set `OUTREACH_DOMAIN_VERIFIED=true` — then redeployed. The **Setup**
tab's *Email delivery* row tells you which of these is still missing.

Still stuck? The **Setup** tab is the fastest way to see what's missing.
