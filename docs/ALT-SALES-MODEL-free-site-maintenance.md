# Alternative Sales Model — free-site + maintenance (REFERENCE ONLY)

> **Status: NOT the current direction.** Captured 2026-06-19 from a prior planning
> conversation. Duke's decision (2026-06-19): **keep the existing model** —
> percentage / tiered commission on a one-time deal value, no-site/bad-site lead
> priority, paid-build pitch. This document is kept as context to revisit IF we
> ever pivot to the recurring "free website → monthly maintenance" model.
>
> **Where it conflicts with what's currently built (so a future pivot knows the work):**
> - **Commission:** doc wants *flat fee per close*; we built *percentage + tiered
>   by deal value* (`commissionRate`, tiered bands in the submissions accept flow).
> - **Recurring revenue:** doc says the business IS the ~$150/mo maintenance MRR;
>   the CRM currently tracks only one-time deal value + commission — **no contract /
>   MRR / churn / monthly-billing tracking exists.** This is the biggest build gap
>   if we pivot.
> - **Targeting:** doc wants *outdated-site* businesses (they feel the pain), NOT
>   no-site; our tier logic ranks "No Website" as tier A / hottest, and the email
>   templates lead with the "couldn't find your website" pitch.
> - **Pitch:** doc = free site + $150/mo; current templates pitch ~$1,500 builds.
> - Tech assumptions in the doc (Next.js 14, one template) are stale — CRM is
>   Next 16, the site factory is Astro.
>
> What it VALIDATES about current work: rep-ready CRM, territory filtering,
> exclusive lead claiming/assignment, fast warm-handoff — all already built.

---

## Copper Bay Tech — Sales Model & Product Handoff (verbatim)

**Purpose:** Context pass-off for the website-builder agent, CRM-builder agent, and any other agents working the Copper Bay Tech client-acquisition project. This captures the strategic decisions reached in a planning conversation. Treat it as authoritative direction unless Duke overrides it.

---

### The Decision (what we're building toward)

Copper Bay Tech is pivoting its rep-driven sales motion to a **single, sharp, repeatable product**. No more selling a muddled menu of websites + IT + cybersecurity. Reps sell ONE thing. Everything else is internal upsell after the relationship exists.

**The product as sold:** A custom-built website, given away **free**, used as the hook to lock in **monthly recurring maintenance revenue (~$150/mo)**.

The website is the bait. The maintenance contract is the actual business.

### Core Model & Unit Economics

- **Build cost per site:** ~$50 (Claude Code tokens) + ~$5/mo hosting (Vercel) + ~$10/yr domain.
- **Revenue:** ~$150/mo maintenance contract per client.
- **Margin:** Build cost recovered in month one; ~90% margin from month two onward.
- **Scale targets:** 20 clients ≈ $36k/yr; 100 clients ≈ $180k/yr, near-pure profit.
- **Why free works:** Zero friction to say yes; Copper Bay owns the codebase and the relationship, creating real switching costs and lock-in.

### Target Customer (this changed — important)

**Go after businesses with OLD, outdated websites — NOT businesses with no website.**

Rationale: a business with no site doesn't *feel* the pain (they get work word-of-mouth). A business with a 10-year-old site losing bids to competitors with cleaner sites *feels it daily*. That emotional pain is what reps sell against.

- Primary verticals: tradesmen/contractors, roofers, wineries, small local service businesses in Sonoma County.
- Lead source: **sonoma-lead-scraper** — should surface businesses whose existing sites are dated/low-quality, with owner-name enrichment.

### Sales Force

- **Commission-only 1099 independent contractors**, recruited via LinkedIn.
- Reps get: CRM access + a scraped lead list + a templated pitch + a mockup to show.
- **Rep compensation: flat fee per closed deal**, NOT a percentage of the recurring revenue. Keeps Copper Bay's cost predictable and protects margin on the recurring side.
- Classification discipline: control the *outcome*, not *how* reps work (own hours, own approach). Keeps them properly classified as contractors.
- Reality check: expect ~1 in 5 recruited reps to actually produce. Need 10+ to reliably get 2–3 closers.

### Rollout

Start with **3 pilot sites**, free, with the $150/mo contract attached. Prove people actually *pay* the maintenance (vs. ghosting) before recruiting reps. Then recruit the first rep with real numbers to show.

---

### Directives for the Website-Builder Agent

1. **STANDARDIZE THE TEMPLATE.** This is the #1 long-term risk. Do NOT ship 20 bespoke codebases with different Next versions, schemas, and deploy configs — that becomes an unmaintainable nightmare. Build ONE standardized, configurable template (Next.js 14 / TypeScript / Tailwind, the existing stack) that gets themed per client.
2. **Optimize for fast turnaround.** A "maybe" from a prospect dies if the mockup takes a week. Same-day / next-day mockup capability is a requirement, not a nice-to-have.
3. **Keep per-site build cost low** (~$50 token budget target) by leaning on the standardized template rather than from-scratch builds.
4. Design for cheap/zero-marginal-cost hosting (Vercel free tier where possible).

### Directives for the CRM-Builder Agent (the `duke` CRM)

1. **Make it rep-ready.** It's currently built around Duke's own internal workflow. Reps are outsiders — they need clean lead views, simple status updates, and nothing internal-facing or confusing.
2. Surface the scraped lead list (from sonoma-lead-scraper) in a rep-friendly view, ideally filterable by territory.
3. Support a clean warm-handoff flow: rep flags interest → Duke gets notified fast (this model lives or dies on Duke closing behind the rep within hours).
4. Track deal status, commission owed per rep, and which leads are claimed (avoid two reps working the same lead).

---

### Known Risks (build defensively against these)

- **Maintenance is NOT as automatable as it looks.** Simple changes (phone number, hours) automate fine with Claude Code. But "make the hero bigger," "add a testimonials section," "the form's broken" require context and judgment — they're conversation loops, not one-shot prompts. Don't assume blind automation.
- **Support triage burden scales badly.** Someone (currently Duke) has to triage every request: 5-min fix vs. real rebuild. At 20 sites that's ~5 hrs/week; at 100 it drowns him. Tooling should help triage/categorize incoming requests.
- **Rep over-promising.** Commission reps promise turnaround/features to close. Those promises land on Duke. Need ironclad SLAs + rep training baked into onboarding.
- **Churn.** $150/mo recurring is vulnerable — client's business slows, hires a nephew, or forgets. Need to build ongoing *visible value* beyond passive maintenance, or churn eats the model.
- **Tech debt** (see website-builder directive #1) — standardization is the mitigation.

---

### One-line summary

*Copper Bay Tech sells free custom websites to Sonoma County businesses with outdated sites, monetized through ~$150/mo maintenance contracts, sold by commission-only 1099 reps using the CRM + scraper lead list; the website-builder must standardize one themeable template for fast cheap builds, and the CRM must be rep-ready with a fast warm-handoff flow.*
