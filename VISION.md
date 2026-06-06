# Vision — Copper Bay Tech (Duke)

_Written: 2026-06-06_

## What this project is

Duke is the operating system for Copper Bay Tech, a one-person IT/cybersecurity/web-dev shop
serving small businesses in Sonoma County, CA. It does two jobs simultaneously:

1. **Inbound engine** — a marketing site optimized to rank locally (city pages, blog, schema markup)
   and convert visitors into leads via free audit tools, a contact form, and a booking funnel.

2. **Sales machine** — a private CRM + email-automation platform that captures those leads,
   lets the owner (or reps) work them through a power-dialer flow, and sends tracked outreach
   via Resend while staying CAN-SPAM compliant.

The stack is Next.js 16 / React 19 / Upstash Redis / Resend / Vercel. Everything is serverless
by design so the owner pays nothing at low volume and scales without ops work.

## Current state (as of June 2026)

The foundation is solid:
- Marketing site is live with 36+ blog posts, 10+ city pages, full schema markup
- CRM data model complete (contacts, activities, email events in Redis)
- Outreach sending works (Resend, tracking pixel, unsubscribe footer, suppression list)
- Power-dialer UI functional (lead queue, call logging, email compose, activity timeline)
- Admin dashboard has health checks, rep management, leaderboard, broadcast
- 98 unit/integration tests passing; build clean

What is NOT done yet:
- No drip sequences (no cron/automated follow-up after first touch)
- No lead scoring UI (score calculated but not visually surfaced to reps)
- No calendar booking integration (the /schedule page links out but doesn't embed Cal.com)
- CRM auth is session-based (good) but password reset flow is missing
- No CI pipeline (GitHub Actions)
- No error monitoring (Sentry or equivalent)
- Admin setup tab shows health checks but no one-click fix actions
- Several audit tools make external HTTP requests without timeout enforcement

## What "fully functional" means

The loop closes end-to-end without manual intervention:
1. Visitor → audit tool → email captured → CRM contact created (already works)
2. Rep sees lead, makes call/sends email from dashboard (already works)
3. No reply after 3 days → automated follow-up sequence fires (MISSING)
4. Open/click/reply events update status in real time (already works)
5. Lead scores rise as engagement increases, bubbling hot leads to top of queue (scoring exists, display partial)
6. Meeting booked → auto-logged as CRM activity (MISSING)
7. All of this visible in admin leaderboard / revenue tracker (partially works)

## What winning looks like (beyond functional)

- **Speed**: The site scores 90+ on PageSpeed. Audit tool results load < 3s for a cold hit.
- **Inbox placement**: Outreach emails land in the primary tab. DMARC, SPF, DKIM all pass.
- **Zero-touch follow-up**: A new inbound lead gets a sequence of 3 emails over 7 days
  automatically, without the owner touching the keyboard.
- **Rep delight**: The CRM dashboard shows exactly who to call next and why. No ambiguity.
- **Owner confidence**: The admin setup tab shows green checkmarks for every integration.
  Any red = actionable error message with fix instructions.
- **Local SEO dominance**: Copper Bay ranks page 1 for "IT support [city]" across all
  10 Sonoma County target cities.
- **Compounding content**: Blog posts published at 2/month cadence, each targeting a
  specific keyword with internal links to services and city pages.
