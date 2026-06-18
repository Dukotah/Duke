# ELEVATED_DESIGN_PLAYBOOK.md
**The design north star for the copperbaytech.com rebuild**
_"Websites, handled — for life." · Next.js 16 · Tailwind v4 · Framer Motion · Dark + rationed copper_

> The site **is** the portfolio. Every decision below serves one test: *is this the best-looking thing the prospect sees today, and does it still convert on a mid-range phone over 4G?*

---

## 0. Design tokens (the non-negotiable foundation)

```css
/* canvas / depth — opacity STACKING, never black shadows */
--bg-0:      #0E0E11;   /* deepest canvas */
--bg-1:      #131316;   /* base surface */
--bg-2:      #17171B;   /* raised surface (cards) */
--bg-3:      #1E1E22;   /* hover / active surface */

/* accent — RATIONED. CTAs, active states, borders, focus only. */
--copper:        #C07A3E;   /* base */
--copper-bright: #DB9355;   /* hover / emphasis / count-up numbers */
--copper-dim:    rgba(192,122,62,0.30);
--copper-glow:   rgba(219,147,85,0.40);

/* text — warm off-white, never pure white */
--text:      #F4F1EC;
--text-2:    rgba(244,241,236,0.70);   /* secondary / meta */
--text-3:    rgba(244,241,236,0.45);   /* labels / disabled */
--hairline:  rgba(244,241,236,0.08);   /* borders instead of shadows */
```

Fonts: **Space Grotesk** (display/h1–h3) · **Inter** (body, 400–500 min) · **JetBrains Mono** (labels, prices, step numbers, stat units).

---

## 1. The curated Top 30 references — one technique to steal from each

### Group A — Rationed-accent on dark (the brand thesis)
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 1 | Lando Norris | landonorris.com | Single vibrant accent on dark carries an entire site — color *rarity* = impact |
| 2 | Spotify | spotify.com | Accent appears ONLY on the action (play); everything else is monochrome depth |
| 3 | Netflix | netflix.com | Three-tier dark hierarchy (#000 → #141414 → text) with red used functionally, never decoratively |
| 4 | Vercel | vercel.com | Confidence in near-pure black/white; interaction states change *contrast*, not hue |
| 5 | Linear | linear.app | Elevation via lighter surfaces over dark — zero drop-shadows |
| 6 | Raycast | raycast.com | Borders (not shadows) for depth; luminance hierarchy; 100–200ms snappy keyframes |

### Group B — Premium SaaS micro-interaction craft
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 7 | Stripe | stripe.com | CTA hover = 15–20% top-left white overlay (light hitting the button), not a recolor |
| 8 | Framer | framer.com | Card hover lifts on Y-axis only (no scale); shadow deepens subtly |
| 9 | Resend | resend.com | Hero with zero decoration — headline + subhead + CTA; one interactive detail per card |
| 10 | Clerk | clerk.com | Input focus = border shift + 2px glow, nothing more; success flashes then fades |
| 11 | Fathom AI | fathom.ai | Compliance/scale badges + metric-anchored credibility ("6+ hours saved") |
| 12 | Qase | qase.io | Atmospheric glow that *tells a story* rather than clutters |

### Group C — Scroll choreography & motion-as-system
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 13 | Sidewave | awwwards.com/sites/sidewave | Motion as a *system*, not one-off effects — the thing that actually wins awards |
| 14 | Cappen | cappen.com | Cinematic single-narrative scroll journey; layered scroll-triggered reveals |
| 15 | Locomotive | locomotive.ca | Asymmetric scroll reveals; smooth-scroll discipline (9.4kB, not a 60kB tax) |
| 16 | Phantom | phantom.land | Gradient orbs that react to interaction; DOM↔motion bridging |
| 17 | Supersolid | supersolid.agency | Numbered nav (01–06) establishing hierarchy; work-first / effect-second |
| 18 | Igloo Inc. | igloo.inc | Award-winning *without* loud effects — typography + hierarchy + restraint |

### Group D — Editorial / typography / portfolio reveal
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 19 | Obys Agency | obys.agency | Oversized glyphs + grid tiles that bloom into full-bleed media on hover |
| 20 | Pentagram | pentagram.com | Portfolio-first, heritage as proof, soft CTA ("New Business Inquiries") |
| 21 | Pixelmatters | pixelmatters.com | Depth from geometry/parallax on a two-color canvas, not from color |
| 22 | Studio Chapeaux | topcssgallery.com/gallery/studio-chapeaux | Seamless project-to-project transitions that never overwhelm the craft |
| 23 | Ugmonk | ugmonk.com | Philosophy-first + scarcity/social proof; pricing framed as investment |

### Group E — Conversion architecture (premium + sells)
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 24 | Webflow | webflow.com | Dual-audience CTA branching; case-study carousel for self-paced proof |
| 25 | Miro | miro.com | Trust-signal architecture (certs + scale + named clients) |
| 26 | Figma | figma.com | One unified value prop + modular sub-offerings + recognizable client logos |
| 27 | Stripe (pricing) | stripe.com | Defer pricing below the value-proof; build trust through what it *doesn't* do |

### Group F — One-show-piece immersion (aspire, don't copy literally)
| # | Site | URL | Steal this |
|---|------|-----|-----------|
| 28 | Messenger by Abeto | messenger.abeto.co | ONE hero-grade immersive moment > many weak micro-animations |
| 29 | La Revoltosa | awwwards.com/sites/la-revoltosa | Two-color radical restraint + 3D *only* on the core product cards |
| 30 | Elva | awwwards.com/sites/elva | Behavioral interaction *states* on a single persona element; restrained palette wins creativity |

**The synthesis:** Groups A–B set the floor (must-have craft). Group C–D define the ceiling we reach for. Group E keeps it selling. Group F is the single flagship moment — and we take its *philosophy* (one show-piece) without its *cost* (WebGL).

---

## 2. The 5 principles the rebuild obeys

### P1 — Ration the copper like it's expensive
Copper appears only on: primary CTAs, active nav state, focus rings, count-up numbers, featured-tier borders, and one hero accent. Everything else is `--bg-*` surfaces + warm off-white text. Hierarchy and depth come from **opacity stacking and luminance**, never from new hues. If you're reaching for a second color, you're wrong.

### P2 — One hero-grade effect per viewport
Each viewport gets at most **one** show-piece (mesh hero, OR self-drawing connectors, OR the count-up, OR the spotlight cards) plus quiet micro-interactions (≤200ms hover lifts, focus glows). Stack two hero effects and both cheapen. Motion is a *system* (Sidewave) with consistent easing/duration tokens, not a grab-bag.

### P3 — Depth without shadows
Dark-mode depth = lighter surfaces over darker (`--bg-1 → --bg-2 → --bg-3`) + 1px `--hairline` borders + glow on accent elements only. No `box-shadow: 0 x black`. Glassmorphism only where there's a gradient behind it to refract (nav over hero, footer over orb).

### P4 — Mobile parity is a feature, not a downgrade
Every effect ships a defined mobile behavior *before* it ships desktop. Cursor-tracking → static tap/focus state. 3D tilt → 2D depth. Pinned scroll → unpinned stacked sections. Blur radius halved. This is a **hard gate**: no effect merges without its `(hover:none)` and `prefers-reduced-motion` branch.

### P5 — Never tax LCP/CLS or the conversion path
Hero text paints first, always (target LCP < 2.5s on a Pixel 4a / 4G). Backgrounds are CSS-only (no image, no WebGL). Every scroll-reveal uses `once: true` + reserved space (`aspect-ratio`/min-height) so nothing shifts. The primary CTA is always reachable without animation completing. `prefers-reduced-motion` is honored everywhere, by design not by afterthought.

---

## 3. Technique playbook by component

> Conventions used below — **HERO EFFECT** = the one show-piece for that viewport. **Quiet** = always-on micro-interaction. Every entry lists Build / Mobile / RM (reduced-motion) / LCP-CLS.

### Nav
- **Quiet:** Sticky shrink + blur-backdrop + conditional hairline border. Frosted glass *only* once scrolled over the hero gradient (Stripe/Linear). Active link = copper underline indicator; CTA = magnetic + Stripe-style overlay shine.
- **Build:** Framer Motion `useScroll` → `useTransform` for height `80→60px` and bg opacity `0→0.85`; `backdrop-filter: blur(8px)` toggled via IntersectionObserver on the hero sentinel; border-bottom `--hairline` fades in after ~200px. CTA overlay = `::before` radial white 15% on `whileHover`.
- **Mobile:** Start at 60px, shrink to 48px; blur 4px; magnetic OFF (`@media (hover:hover)` gate) → tap = opacity 0.98. CTA never overlaps content; `env(safe-area-inset)` respected.
- **RM:** Drop blur animation → instant opacity step; no magnetic; border appears without transition.
- **LCP/CLS:** Nav is `position: sticky` with fixed reserved height — zero CLS. `will-change` only while scroll-active.

### Hero  → see §4 for the full flagship spec.
- **HERO EFFECT:** CSS mesh-gradient + glow orbs + scroll-coupled headline reveal. One effect, nothing else competes.

### Services (3-card)
- **HERO EFFECT (this viewport):** Cursor-spotlight gradient-border cards (Linear-magnetic) + Framer Y-lift. Copper glow follows the pointer; card lifts 8px on a spring.
- **Build:** Track `mousemove` per card → set `--mx/--my` (throttle to RAF). Border layer = `radial-gradient(600px at var(--mx) var(--my), var(--copper-glow), transparent 60%)` clipped to a `padding-box` border pseudo-element. Lift = `whileHover={{ y:-8 }}`, `spring stiffness:300 damping:30`. Service name text-gradient-clips to `--copper-bright` on enter. Bento option: featured tier spans 2 cols, `rounded-3xl` (24px).
- **Mobile:** Spotlight OFF on touch → static `--copper-dim` top-left glow on tap/active. No Y-lift (avoid flicker) → opacity/bg-tint only. Bento collapses to 1-col, radius → 16px.
- **RM:** No tracking, no lift → static `rgba(192,122,62,0.10)` card bg + instant text color.
- **LCP/CLS:** Cards are below fold; borders are pseudo-elements (no layout impact). Single delegated listener, not 3.

### Stats
- **HERO EFFECT:** Count-up on scroll-in + thin copper progress underline that fills in sync (Resend/Vercel).
- **Build:** Framer `useInView` → animate proxy `0→target` over 2s, `snap` to int, `toLocaleString()`; underline `scaleX 0→1`, `origin-left`, same duration. Numbers in JetBrains Mono, `--copper-bright`. `once: true`.
- **Mobile:** Duration 1.5s; underline 1px (vs 2px); all three fire together (no stagger).
- **RM:** Render final value instantly; underline at full width, no animation.
- **LCP/CLS:** Final values present in markup (animation is CSS/JS overlay) — reserve width with `tabular-nums` so the count-up doesn't reflow. `will-change:auto` after completion.

### HowItWorks
- **HERO EFFECT:** Self-drawing SVG copper connectors between steps + staggered step-card reveal (Framer/Linear). Validates the "built by hand" narrative without WebGL.
- **Build:** SVG paths, `pathLength` 1, animate `strokeDashoffset → 0` over 1.2–1.5s via `whileInView`; stagger steps 150–200ms (`staggerChildren`). Step number = JetBrains Mono copper; stroke 2px copper. `once: true`.
- **Mobile:** Replace horizontal SVG with a **CSS vertical dashed line** (cheaper, no janky path render); cards stack and reveal in sequence; stagger 0.05s; stroke 1.5px where SVG kept.
- **RM:** Show full strokes + all cards instantly.
- **LCP/CLS:** `viewBox` + `preserveAspectRatio` (no fixed px); `once:true` prevents re-draw CLS; below fold so no LCP exposure.

### Testimonials
- **Quiet:** Metric-anchored cards (outcome in `--copper-bright` Mono first, then quote, then attribution) with staggered reveal (metric 0ms → quote 150ms → attribution 300ms). Optional self-paced carousel.
- **Build:** Data `{quote, metric, name, title, company, logo}`. Reveal via `whileInView`. Carousel = AnimatePresence, 1 card mobile / 2–3 desktop, `translateX` GPU transitions, swipe via drag handlers; **no auto-advance on mobile**, 6s desktop. Frosted-glass quote panel over a faint gradient for depth.
- **Mobile:** Metric + 1-sentence quote; full quote on tap/accordion; swipe threshold 50px; dots hidden < 360px.
- **RM:** No stagger, no auto-advance; carousel becomes a static stacked list.
- **LCP/CLS:** Lazy-load logos with fixed `aspect-ratio`; carousel uses `transform` not `left`.

### ToolsTeaser / bento
- **Quiet:** Bento grid (asymmetric, `rounded-3xl`) with per-tile hover variants (one lifts, one glows, one reveals text) + a **logo marquee** (infinite, mask-faded edges, pause-on-hover) for the tech stack.
- **Build:** CSS Grid + `span` for 2x tiles; `data-variant` → mapped `whileHover` preset. Marquee = duplicated row, CSS `@keyframes scroll` `translateX(-50%)`, `mask-image` edge fade, `animation-play-state:paused` on hover. Keep logos < 5KB SVG.
- **Mobile:** Bento → 1-col, no spanning, hover→tap-reveal; marquee 30s+ and 4 logos, no pause-on-hover.
- **RM:** Marquee static 4-logo grid; tiles fully visible, no variant motion.
- **LCP/CLS:** Marquee below fold + `loading:lazy`; transform-based = no CLS; gap `24→16px` mobile.

### Contact
- **Quiet:** Progressive-disclosure form (3 fields → conditional branch) + focus-glow inputs (Clerk) + magnetic submit. Dual-audience: "Get Your Free Audit" primary vs "See Our Work" secondary link.
- **Build:** Conditional render via `show_if(formData)`; height animates with `layout`/`layoutId`. Input focus = border→copper + `0 0 0 2px var(--copper-glow)`. Submit focus = `focusGlow` 600ms fade-out. `inputMode` per field. Success = slide-out form → confirmation + calendar link.
- **Mobile:** 2 initial fields; sticky 48px full-width submit; native keyboards via `inputMode`; never fixed-position over the keyboard.
- **RM:** Instant field reveals; no glow animation (keep static focus border for a11y).
- **LCP/CLS:** Reserve container height or animate `height:auto` from a measured value to avoid shift; never push the footer.

### ServiceCityPage template (→ 35+ pages) & City/Industry pages
- **HERO EFFECT (template-level, propagates everywhere):** Lightweight parallax hero (city/industry name foreground lags background) + the **shared global mesh-gradient** tinted per-vertical. Self-drawing city-silhouette accent optional but RM/mobile-gated.
- **Build:** All motion lives in shared components (`<RevealOnScroll>`, `<MeshHero>`, `<CountUp>`, `<Connectors>`) so 100+ pages inherit identical, guard-railed behavior — author the guardrail **once**. Parallax via `useScroll` → `useTransform` y, multiplier 0.3 desktop.
- **Mobile:** Parallax multiplier 0.1 (or off); `will-change:transform` + GPU; no `position:fixed` parallax (iOS Safari stutter).
- **RM:** All layers scroll at normal speed; silhouette draws instantly.
- **LCP/CLS:** Hero is CSS gradient (no per-city image as LCP), or if a photo is used, `next/image priority` with explicit dimensions. Because this is a template, **any regression multiplies by 100+** — measure once, win everywhere.

### PricingEstimator
- **Quiet:** Three tiers, featured "Most Popular" gets copper border + subtle rotating conic glow; outcome/ROI anchor under each price; live estimate count-up `$0→total` as inputs change. Pricing sits at ~60% scroll depth, after proof.
- **Build:** Tier cards bento-style, featured full-width copper border. Live total = same count-up proxy on input change. Annual/monthly = radio (not tiny switch). Conic glow via `@property --angle` spin 3s, paused when off-viewport (IntersectionObserver + `animation-play-state`).
- **Mobile:** One tier per card / swipe; prices ≥ 28px bold Mono; toggle as radios; no horizontal scroll.
- **RM:** Static border (no conic rotation); estimate updates instantly.
- **LCP/CLS:** Reserve tier heights; estimate uses `tabular-nums`; conic stops when not visible (battery).

### Blog (BlogIndex / ArticleHeader / TOC)
- **Quiet:** Scroll-progress bar (top, copper); ArticleHeader title scroll-coupled gradient reveal (one effect); BlogIndex featured-image slow-parallax vs accelerating title; sticky TOC with smooth-scroll active-section highlight (copper).
- **Build:** Progress bar = `useScroll scrollYProgress` → `scaleX`. TOC active state via IntersectionObserver on headings. Title gradient-clip `--copper → --copper-bright`.
- **Mobile:** TOC collapses to a top dropdown; clip gradient to a single word to avoid oversized bounding boxes; parallax reduced.
- **RM:** Progress bar stays (functional, not decorative); title renders solid copper, no reveal.
- **LCP/CLS:** Article body text is the LCP — it must not wait on any animation; reserve image `aspect-ratio`.

---

## 4. The flagship hero — the signature moment

**Concept: "The site builds itself for you."** Push the flow-brief's mesh-gradient + glow-orb idea into a *single choreographed 4-second loadance* that doubles as the brand proof — the homepage literally assembles in front of the prospect, then settles into a calm, living ambient state. It demonstrates craft *as* the hero, the way Messenger/Elva make one element carry the page — but at **zero WebGL cost**.

### The moment (desktop)
1. **0.0s** — Near-black canvas (`--bg-0`). Headline **"Websites, handled —"** paints *immediately* as plain `--text` (this is the LCP, it never waits).
2. **0.2–1.0s** — Mesh gradient fades up behind it: 3 CSS radial orbs — copper `#C07A3E` 40% (top-left), copper-bright `#DB9355` 20% (bottom-right), warm off-white `#F4F1EC` 10% (center), each `filter: blur(80px)`, `mix-blend-mode: screen`.
3. **0.4–1.4s** — The second line **"for life."** reveals word-by-word with a copper→copper-bright gradient-clip (Framer staggerChildren 40ms).
4. **0.8–2.0s** — A single self-drawing copper hairline underlines the headline (the "handled" gesture — one connector, drawn by hand).
5. **2.0s+** — **Ambient living state:** orbs drift 2–4% over a 20s loop AND respond to cursor — a large soft spotlight (`radial-gradient(circle 600px at var(--mx) var(--my), var(--copper-glow), transparent 80%)`) follows the pointer across the hero, so the background feels *alive and reactive* without a single canvas/3D node.
6. CTA **"Start a free audit"** (magnetic + Stripe shine) + soft "See our work" text link sit below the visual. A scale metric — *"Trusted by 42 Sonoma County businesses"* (copper) — anchors trust before the ask.

### Buildable spec
- **Stack:** Pure CSS gradients + Framer Motion. No Three.js, no canvas.
- Orbs = 3 absolutely-positioned `div`s (or `::before/::after`), `position:absolute` (never affecting layout), animated via CSS `@keyframes` translate.
- Cursor spotlight = single `mousemove` → RAF → `--mx/--my` on the hero element; gradient layer at `mix-blend-mode: screen`, `z-index` below text.
- Headline reveal = `motion.span` per word, `initial {opacity:0,y:8}` → `whileInView`/on-load, `staggerChildren`.
- Self-drawing underline = inline SVG path, `pathLength:1`, `animate strokeDashoffset→0`.

### Mobile
- Orbs: 1–2 max, `blur(40px)`. **Cursor spotlight OFF** (`@media (hover:hover)` gate) — orbs keep their gentle keyframe drift only. Headline stacks; word-stagger kept (it's cheap, in-markup). Metric truncates to "42+ clients" if it wraps. CTA appears *after* the visual, never overlaid (protects LCP/tap target).

### Reduced-motion fallback
- Static mesh gradient (no drift, no spotlight, no draw). Headline appears solid (gradient-clip kept, animation dropped). Underline shown complete. The hero is still beautiful sitting perfectly still — that's the test of a good fallback.

### LCP/CLS guardrail
- Headline text is in the server-rendered markup and styled to paint before any gradient — **LCP element is the `<h1>`, target < 2.5s on Pixel 4a / 4G**. All orbs are `position:absolute` → **CLS 0**. `will-change:filter/transform` applied only during the 0–2s intro, removed after (`requestIdleCallback`) to free GPU. Spotlight throttled to RAF (60fps cap, 30fps on lower-end).

**Why this beats the original flow-brief hero:** it turns the ambient gradient from *decoration* into a *demonstration of craft and reactivity* (the Elva/Messenger "one living element" win), keeps the entire effect CSS-only (mobile-parity + LCP-safe), and the choreography literally narrates the value prop ("handled").

---

## 5. What to add vs. avoid

### Add (high impact / low risk)
- CSS mesh-gradient + glow orbs (no images, LCP-safe) — the flagship.
- Cursor-spotlight gradient-border cards (desktop) with static mobile fallback.
- Count-up + sync progress underline; self-drawing SVG connectors (`once:true`).
- Sticky shrink/blur nav; magnetic + Stripe-shine CTAs; focus-glow inputs.
- Logo marquee (CSS transform, masked edges); bento grids; progressive-disclosure form.
- Opacity-stacked dark surfaces + hairline borders for depth.
- Metric-anchored testimonials; trust-badge row; dual-audience CTA branching; deferred pricing.

### Avoid (and why)
- **Full WebGL / Three.js worlds** (Bruno Simon, Lusion). GPU/payload cost tanks LCP on SMB-grade phones and adds nothing to a *conversion* path. We take the *philosophy* (one show-piece) via CSS, not the engine.
- **Scroll-hijacking / wheel-jacking & section snapping.** Breaks the conversion path, fights mobile inertia, hurts a11y. Premium ≠ taking control of the scrollbar.
- **Pinned scroll-choreography on mobile.** iOS Safari jump/flicker. Use unpinned stacked sections below 768px.
- **Animating `backdrop-filter`, `blur`, or large `filter` regions on scroll.** Repaint cost → jank + CLS risk. Blur is toggled (on/off), never tweened.
- **Parallax via `background-attachment:fixed` / `position:fixed` on mobile.** Stutters on iOS. Reduce multiplier or disable.
- **3D tilt on touch; cursor effects on touch.** No pointer to track — wasted JS + battery. Static fallback only.
- **Second accent color, rainbow gradients, multi-color cards.** Violates P1 — the rationing *is* the brand.
- **Countdown timers / artificial scarcity / auto-advancing carousels on mobile.** Cheapens premium positioning; disorienting on touch.
- **Re-running text-split on resize** (LCP regression) and any effect without `once:true` (re-animation CLS).

---

## 6. Sequenced application

Build in layers so guardrails are authored **once** and inherited by 100+ pages.

### Phase 0 — Tokens & primitives (foundation)
Ship `globals.css` tokens (§0) + Tailwind v4 theme. Build the shared, guard-railed primitives every page imports:
`<RevealOnScroll>` · `<MeshHero>` · `<CountUp>` · `<SelfDrawingConnectors>` · `<SpotlightCard>` · `<MagneticCTA>` · `<LogoMarquee>` · `useReducedMotion()` + `useHoverCapable()` hooks. **Every primitive ships its mobile + RM branch on day one** — this is the gate. Nothing downstream re-implements motion.

### Phase 1 — Global layer (every page)
Nav (sticky/blur), Footer, scroll-progress bar, sticky CTA, trust-badge row. Lock LCP/CLS budget here with Lighthouse + WebPageTest on a throttled Pixel 4a profile. This profile becomes CI's pass/fail.

### Phase 2 — Homepage marquee build
Flagship Hero (§4) → Services spotlight cards → Stats count-up → HowItWorks connectors → Testimonials → ToolsTeaser/bento → Contact. Enforce **one hero-effect per viewport** during review. This page is the reference implementation everything else is judged against.

### Phase 3 — Templates (propagate to 100+ pages)
ServiceCityPage → City → Industry. Because these multiply, measure LCP/CLS on the *template* and on 3 sampled generated pages before generating the full set. A 50ms regression here = 100× the damage. Per-vertical = gradient tint + copy only; motion is inherited, never re-authored.

### Phase 4 — Marquee content pages
PricingEstimator (live count-up, conic featured tier), Blog (BlogIndex/ArticleHeader/TOC + progress bar). Pricing deferred below value-proof; article body is the LCP and waits on nothing.

### Phase 5 — Tools / funnels
Apply the same primitives to lead-gen tools and funnels: progressive-disclosure forms, focus-glow inputs, magnetic submits, dual-audience branching. Funnels prioritize the conversion path over flourish — borrow Phase-0 primitives, add **zero** new hero effects.

### Standing review checklist (every PR)
- [ ] ≤ one hero-grade effect in any viewport
- [ ] Copper used only on CTA/active/focus/featured/count-up
- [ ] `(hover:none)` fallback defined
- [ ] `prefers-reduced-motion` honored (and still looks good static)
- [ ] `once:true` + reserved space → CLS 0
- [ ] LCP element paints before any animation; < 2.5s on Pixel 4a/4G
- [ ] Depth via surface/opacity + hairlines, no black drop-shadows
- [ ] Primary CTA reachable without any animation completing

---

_The constraint is the brand. Dark canvas, rationed copper, one living moment per viewport, flawless on a phone. Build the proof, then ask._