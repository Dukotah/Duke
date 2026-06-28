<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:copperbay-ops (maintained by Claude — verified 2026-06-27) -->
# Copper Bay Tech — operating brief (read before working)

## Where production is
- **Live site:** https://copperbaytech.com (apex 307-redirects to www).
- **Source of truth:** THIS repo (`github.com/Dukotah/Duke`), branch **`origin/main`**.
- **Deploy:** Vercel project **`duke`** — auto-deploys on push to `main`. Resend email keys live in that Vercel project; the CRM "Send" button sends **real** email in prod from `contact@copperbaytech.com`. Do not judge email config from a local empty `.env.local`.

## ⚠️ Sync first — local drifts behind prod
`git fetch origin && git status` BEFORE editing. Local checkouts have lagged `origin/main` (the mobile launch shipped to prod while local sat on an old branch). Always reconcile to `origin/main` first, or your edits target code users never see. `main` is the only deployed ref; the many `flow/*`, `crm-*`, `claude/*` branches are unmerged/stale.

## Two surfaces, two codebases
- **Desktop site:** standard React components (`src/components/Hero.tsx`, `Services.tsx`, `Stats.tsx`, …).
- **Mobile landing (`/` on phones):** a SEPARATE bespoke "molten copper" build (`.cbtm-root`, Space Mono accents, intro preloader), launched 2026-06 and upgraded to v2 (trail glow, scroll-heat, weight morph, haptics). **Mobile changes must target the mobile build, not just the desktop components** — editing one does not change the other.

## Related repo
- `github.com/Dukotah/copperbay-crm` is a separate **CRM-consolidation** repo. The live **site + CRM** run from THIS (`Duke`) repo. Canonical home for ongoing CRM work is unconfirmed — verify before splitting effort.

## Known-open product gaps (verified live 2026-06-27)
- **Trust vacuum (highest ROI):** homepage shows no testimonials/reviews/stars/Google badge — only "42 businesses." `/reviews` + `/testimonials` pages exist but aren't surfaced on `/`.
- **Booking friction:** `/schedule` is a request form, not an instant scheduler (no Calendly embed).
<!-- END:copperbay-ops -->
