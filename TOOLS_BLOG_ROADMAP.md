# Stragglers Roadmap — Tools consolidation + Blog declutter (flow/v2)

Goal: finish the dark+copper "flow" redesign by converting the last stragglers
(**/tools, all tool pages, /audit, /blog**) and **consolidate every tool onto one
`/tools` page** — without losing any SEO mapping.

Decisions locked with Duke (2026-06-22):
- **Tools:** keep the thin SEO landing pages, but every one shares ONE `<ToolDeck/>`.
  Zero ranking loss; one tool codebase. (Not a hard 301-merge.)
- **Blog:** presentation redesign only. All 38 post URLs stay. No content deleted.
- **New work:** a fresh batch of blog posts on **AI integration across industries**.

---

## Current tool sprawl (what we're consolidating)

| Route | What it is | Keep as | 
|---|---|---|
| `/tools` | 8-check audit suite (speed/SSL/SEO/headers/DNS/schema/links/mobile) — old orange theme | **Deck home** (Website Audit tab) |
| `/audit` | speed-only audit, `?url=` prefill + `track('audit_run')` | thin SEO page → deck `#audit` (preserve prefill/autorun) |
| `/tools/health-check` | speed-only | thin SEO page → deck `#audit` |
| `/compare` | competitor compare (`CompareClient`) | thin SEO page → deck `#compare` |
| `/it-health-check` | IT quiz (`ITQuiz`) (`/assessment` already 301s here) | thin SEO page → deck `#it-health-check` |
| `/business-analysis` | business analysis tool | thin SEO page → deck `#business-analysis` |
| `/tools/compliance` | security self-check | thin SEO page → deck `#security` |
| `/tools/email-headers` | SPF/DKIM/DMARC inspector | thin SEO page → deck `#email-headers` |
| `/tools/missed-call-calculator` | missed-call ROI | thin SEO page → deck `#missed-call` |
| `/tools/website-cost-estimator` | cost estimator | thin SEO page → deck `#cost-estimator` |
| `/tools/password` | password lab | thin SEO page → deck `#password` |
| `/report` | internal report renderer (noindex) | **leave alone** |

### Canonical tab set (9 tabs, in sales-walkthrough order)
1. Website Audit (`audit`) — the 8-check suite (dedupes /audit + /tools/health-check)
2. Compare (`compare`)
3. Missed-Call ROI (`missed-call`)
4. Cost Estimator (`cost-estimator`)
5. IT Health Check (`it-health-check`)
6. Security Check (`security`)
7. Email Inspector (`email-headers`)
8. Password Lab (`password`)
9. Business Analysis (`business-analysis`)

---

## Architecture

- `src/components/tools/registry.ts` — tab metadata (slug/label/title/tagline/icon).
- `src/components/tools/<Name>Tool.tsx` — each tool's BODY (no Nav/Footer/page shell),
  dark+copper themed. Extracted from its old page.
- `src/components/tools/ToolDeck.tsx` — client tab shell (flow-treated: copper tabs,
  Reveal motion). Syncs active tab to `#slug`. Accepts `initial` + optional `?url=`.
  **Progressive migration:** tabs whose body is already extracted render inline;
  not-yet-extracted tabs link out to their existing page (build stays green every step).
- `/tools/page.tsx` → `<Nav/> + hero + <ToolDeck/> + <Footer/>`. Metadata stays in
  `tools/layout.tsx`.
- Each tool route `page.tsx` → thin SEO hero + `<ToolDeck initial="<slug>"/>`.
  Its `layout.tsx` (metadata) is untouched → **keyword pages preserved**.

## Phases
- **P1 — Deck + tabs (tools consolidation).** registry → ToolDeck scaffold → extract
  each tool body (audit first) → rewire /tools → convert standalones to thin pages.
- **P2 — Wire-up / mapping.** redirects for any retired path → `/tools#tab`; sitemap;
  Nav/Footer labels; verify `?url=` autorun + homepage AuditTeaser still works.
- **P3 — Blog declutter.** `BlogIndex` redesign: category filter, 1 featured, tight
  3-col grid, dark+copper + Reveal motion. All 38 URLs + internal links kept.
- **P4 — New posts.** AI-integration-by-industry batch (see below).

## P4 — AI-integration-by-industry posts (planned)
One post per Sonoma-County-relevant industry, plain-language, lead-gen-oriented,
each cross-linking the relevant tool + a local/service page (preserve internal mesh):
wineries/vineyards, restaurants/hospitality, home services (HVAC/plumbing/electrical),
real estate, healthcare/dental, professional services (legal/accounting), retail,
auto. (Final list TBD with Duke.)

## Constraints
- Next.js 16.2.6 / React 19 / framer-motion 12. **Read `node_modules/next/dist/docs/`
  before novel framework usage** (per AGENTS.md — non-standard Next).
- Client tool pages keep metadata in adjacent `layout.tsx`.
- Dark+copper tokens: `bg-ink-0/1/2/3`, `text-copper`/`text-copper-bright`,
  `border-hairline`, `.card`, `.cbt-rise`; motion from `@/components/motion`.
- WSL: `astro`/dev-server gotchas don't apply here (Next), but keep builds off
  Windows node_modules issues if they surface.
