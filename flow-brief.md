# flow brief — premium UI pass on the Copper Bay Tech public site

Run this with the `flow` subagent once its capabilities are finished building out.
Repo: `C:\Users\dukot\projects\Duke` (Next.js on Vercel). Live: https://www.copperbaytech.com

---

## Prompt to feed flow

```
flow — make the entire public-facing Copper Bay Tech site feel jaw-dropping-premium on
BOTH desktop and mobile, while keeping it fast and unbreakable. Repo:
C:\Users\dukot\projects\Duke (Next.js on Vercel). Live: https://www.copperbaytech.com

READ FIRST: C:\Users\dukot\projects\Duke\AGENTS.md — this is a NON-STANDARD Next.js fork.
Read the relevant guide in node_modules/next/dist/docs/ before writing any code. Match the
existing design tokens / styling system; don't add heavy deps unless you justify it.

GOAL: a client lands on any page and goes "oh my god this looks incredible" — and it works
flawlessly on phones. Mobile parity is a hard requirement, not an afterthought: every effect
must be touch-friendly, never cause layout shift or horizontal scroll, and degrade gracefully.
Always honor prefers-reduced-motion. Never regress LCP/CLS or the conversion path.

SCOPE = all forward-facing pages a client can navigate. Because the site is template-driven,
prioritize SHARED components so polish propagates everywhere, then hand-tune the marquee pages.

OUT OF SCOPE (do not touch): src/app/crm/** and CRM components, any Labs/dev tooling,
src/middleware.ts, and API routes.

Work in this order:

1) GLOBAL LAYER (touches every page) — src/app/layout.tsx, Nav.tsx, Footer.tsx, ScrollCTA.tsx,
   StickyCTA.tsx: slim scroll-progress bar, a reveal-on-scroll utility, tasteful text-gradient
   headline treatment, polished sticky nav (shrink/blur on scroll), magnetic/shine CTAs.

2) TEMPLATES (fan out to hundreds of pages) — CityPage.tsx, ServiceCityPage.tsx,
   IndustryPage.tsx: animated mesh-gradient/glow hero background, count-up stats, 3D-tilt +
   cursor-spotlight feature cards with gradient borders, staggered scroll reveals.

3) HOME + SHARED SECTIONS — Hero.tsx (mesh gradient + glow orbs + rotating headline word +
   magnetic CTA, kept light for LCP), SocialProof.tsx (logo marquee if logos exist),
   Services.tsx (tilt + spotlight + gradient-border cards), Stats.tsx (count-up), HowItWorks.tsx
   (self-drawing SVG connector + staggered reveals), ToolsTeaser.tsx (bento + hover lift),
   Testimonials.tsx (card lift + reveal), Contact.tsx (glow band + shine-sweep button). Also
   About, WhyUs, Problem, GamePlan, Portfolio, CaseStudies, Comparison, Industries, FAQ
   (smooth grid-rows accordion).

4) BLOG — BlogIndex.tsx (hover-lift cards, reveals), ArticleHeader.tsx (gradient title, reading
   feel), BlogTOC.tsx (scroll-spy highlight), BlogEmailCapture.tsx (glow CTA).

5) TOOLS & FUNNELS — polish chrome only, do NOT break interactivity: tools/* pages,
   PricingEstimator, ITQuiz, AuditResults, GetStartedFunnel, schedule/assessment/thank-you.

Follow your loop: DETECT stack/tokens, AUDIT, PROPOSE a prioritized plan grouped by the phases
above and let me approve/trim before implementing, then IMPLEMENT on a branch (read-before-edit,
smallest change, reduced-motion + perf + a11y, mobile tested), then VERIFY with a production
build before reporting. Quality bar = the AVISP / Copper Bay sites. At most one hero-grade
effect per viewport; motion guides the eye, never competes with the conversion action.
```

---

## Scope reference

**In scope — everything a client navigates:**
- **Global (every page):** `layout.tsx`, `Nav.tsx`, `Footer.tsx`, `ScrollCTA.tsx`, `StickyCTA.tsx`
- **Home + shared sections:** Hero, SocialProof, Services, Stats, HowItWorks, Testimonials, ToolsTeaser, Contact, About, WhyUs, Problem, GamePlan, Portfolio, CaseStudies, Comparison, Industries, FAQ
- **Templates (fan out to hundreds of pages):** `CityPage.tsx` (all locations), `ServiceCityPage.tsx` (all cybersecurity-/it-support-/web-design-× city combos), `IndustryPage.tsx` (industries)
- **Blog:** `BlogIndex.tsx`, `ArticleHeader.tsx`, `BlogTOC.tsx`, `BlogEmailCapture.tsx`
- **Free tools & funnels (polish, don't break interactivity):** `/tools/*`, `PricingEstimator`, `ITQuiz`, `AuditResults`, `GetStartedFunnel`, schedule/assessment/thank-you

**Out of scope:** `src/app/crm/**` (admin, login, dashboard) + CRM components, any Labs/dev tooling, API routes, `src/middleware.ts`.

## Section → effect map (homepage)

| Section | Component | Effect(s) |
|---|---|---|
| Hero | `Hero.tsx` | Mesh-gradient + glow orbs, rotating headline word, magnetic CTA (light for LCP) |
| Social proof | `SocialProof.tsx` | Logo marquee / ticker |
| Services | `Services.tsx` | 3D tilt + spotlight + gradient border, reveal-on-scroll |
| Stats | `Stats.tsx` | Count-up numbers when in view |
| How it works | `HowItWorks.tsx` | Self-drawing SVG connector + staggered reveals |
| Testimonials | `Testimonials.tsx` | Card lift + reveal |
| Free tools | `ToolsTeaser.tsx` | Bento grid + spotlight + hover lift |
| Contact CTA | `Contact.tsx` | Glow band + shine-sweep submit button |
| Global | `layout.tsx` | Scroll-progress bar, reveal utility, text-gradient headlines |

## Notes
- `AGENTS.md` warns this is a non-standard Next.js fork — flow must read `node_modules/next/dist/docs/` before coding.
- Mobile + desktop parity is a hard requirement; honor `prefers-reduced-motion`; never regress LCP/CLS.
- Effect catalog + copy-pasteable demos: `C:\Users\dukot\demos\flow\FEATURES.md` and `showcase.html`.
