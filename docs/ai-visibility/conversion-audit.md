# Copper Bay Tech — Conversion Audit (lead generation focus)

*Audited live on 2026-06-27: homepage, /pricing, /schedule, /work, /web-development, /reviews, /audit. Goal of this audit: more booked calls and captured leads, not more traffic.*

**One important correction to the known context:** the homepage now *does* show three testimonials (Maya R., Jordan K., Elena S.) — so the problem isn't "no social proof," it's that the social proof you have is **weak, unverifiable, and self-contradicting** (details in P0-1). Meanwhile `/reviews` is still empty ("Reviews from happy clients are coming — check back soon"). That combination is arguably worse than nothing, because a skeptical buyer who goes looking for proof finds a "coming soon" page.

---

## P0 — Fix first (these are actively leaking your highest-intent visitors)

### P0-1. The free audit / tools run with "no signup" — you give away your best lead magnet and capture nothing
- **Issue:** Your hero's primary CTA is "Start a free audit," and `/audit` proudly says *"…for any website — free, no signup."* You have **9 high-intent tools** (Website Audit, Missed-Call ROI, Cost Estimator, IT Health Check, Security Check, Email Inspector, Password Lab, Business Analysis, Compare). A visitor types in their own domain, gets a real Lighthouse/SEO/security verdict, and leaves — and you never learn who they were.
- **Why it costs leads:** Someone auditing *their own site* is the warmest lead you will ever get. "No signup" is great UX but terrible lead-gen. You're funneling your strongest traffic into a dead end.
- **Fix:** Keep the on-screen score instant (don't kill the UX), but capture the lead to *unlock the full report / email a PDF*. Example: after the score renders, show *"Want the full fix-list? We'll email you a 1-page action plan + a free 15-min review — no pitch."* Field: email + (optional) phone. Then auto-trigger a follow-up. Also add a one-line bridge from result → call: *"Score under 90? That's costing you customers. Book a free 15-min teardown →."* Bonus: in the Missed-Call ROI and Cost Estimator tools, show the dollar figure, then immediately offer to book.

### P0-2. /schedule is a "request a time and wait" form, not a real scheduler
- **Issue:** `/schedule` says *"Tell us your preferred time and we'll confirm within a few hours."* The buyer picks a preference, submits, then waits for a human to confirm. No live availability, no instant calendar invite.
- **Why it costs leads:** Intent is perishable. The moment someone decides "okay, I'll talk to them" is the moment to lock the slot. "We'll confirm in a few hours" injects delay and doubt — by the time you confirm, they've cooled off or booked a competitor who let them grab a slot in 20 seconds. You're also doing manual scheduling labor for a one-person shop.
- **Fix:** Embed a real-time scheduler (Cal.com / Calendly / SavvyCal) that shows open slots and sends an instant calendar invite + confirmation. Keep your 4 meeting types (Website 45m, IT 30m, Security 45m, General 30m) — those map perfectly to event types. Change the promise from *"we'll confirm within a few hours"* to *"Pick a time. You'll get an instant calendar invite."* Keep the current request form only as a fallback for "none of these times work."

### P0-3. Social proof is unverifiable and contradicts itself; the /reviews page is empty
- **Issue:** The three testimonials are first-name + last-initial only (Maya R., Jordan K., Elena S.), no business names, no photos, no links, no star rating, no Google badge. **Elena S. is in Austin, TX** — directly contradicting the banner *"Trusted by 42 Sonoma County businesses."* And `/reviews` (a page a cautious buyer *will* click) shows *"Reviews from happy clients are coming — check back soon."*
- **Why it costs leads:** For a web/IT/**cybersecurity** buyer, trust is the whole sale. Anonymous, unverifiable quotes read as fabricated. An empty reviews page signals "new and unproven." The Austin/Sonoma mismatch is a small crack that makes a careful reader question the "42." Each of these quietly tells the visitor "don't bet your business on this."
- **Fix (do these in order):**
  1. **Get 3–5 real Google reviews this week** (you already link "Leave us a Google review"). Then embed the **live Google rating + star badge + review count** on the homepage, directly under the hero and again next to the pricing/booking CTA.
  2. Replace placeholder testimonials with **full name + business name + city + photo or logo** for at least the local ones. e.g. use the real, specific result you already have on `/web-development`: *"Petaluma Home Staging Co. — load time 8s → 1.4s, 8 new inquiries in 6 weeks, launched in 11 days."* That single quantified quote is more persuasive than all three current ones combined — promote it to the homepage.
  3. **Don't ship an empty /reviews page.** Either populate it now or remove it from nav/links until it has content. Replace "coming soon" with the real reviews + a "verified on Google" link.
  4. Fix the contradiction: either drop the out-of-market testimonial from the "Sonoma County" context or reframe the badge as *"Trusted by 42 businesses across Sonoma County and beyond."*

---

## P1 — High impact, do next

### P1-1. /work has one project (your own site) and "case studies coming soon" — no proof of client outcomes
- **Issue:** The portfolio shows only copperbaytech.com (Lighthouse 95+) plus *"Detailed case studies are being prepared with client approval."* "See our work" is a top-two homepage CTA, so you're sending people to a near-empty room.
- **Why it costs leads:** A custom-code shop lives or dies on "show me what you've built." One self-referential project doesn't clear that bar.
- **Fix:** Publish 3–6 real projects, even if lightweight: screenshot + 1-line problem + 1-line result + metric. You already have the Petaluma Home Staging numbers — make that the flagship case study with a before/after load-time visual. If client logos can't be shown yet, do anonymized "Sonoma County med-spa" cards with the *metrics* (metrics sell harder than logos anyway).

### P1-2. Too many competing CTAs dilute the path to a booked call
- **Issue:** Across the homepage I count: "Start a free audit," "See our work," "Book a free consultation," "Open the builder," "Run free audit," "View all free tools." Six different actions.
- **Why it costs leads:** Choice overload. Every extra CTA splits attention and lowers the click rate on the one that matters (the booked call). "Open the builder" vs "Try the instant cost estimator" vs "Run free audit" also overlap confusingly.
- **Fix:** Pick **one primary action per section.** Make "Book a free consultation" the single dominant (solid, high-contrast) button site-wide; demote everything else to secondary/ghost styling or text links. Two-path hero is fine — one primary ("Book a free 15-min call"), one secondary ("Run a free site audit") — but stop there.

### P1-3. No persistent / sticky path to book on long pages
- **Issue:** Service and pricing pages are long; the booking action lives in specific blocks. (Phone (707) 239-6725 appears but isn't a persistent click-to-call on mobile in the content I pulled.)
- **Why it costs leads:** When someone is convinced mid-scroll, the CTA needs to be one tap away, not a scroll-hunt.
- **Fix:** Add a sticky header/footer bar on mobile and desktop: **"Book a free call"** + tap-to-call **(707) 239-6725**. Ensure the phone number is a real `tel:` link everywhere it appears.

### P1-4. Pricing CTAs all say "Get a Fixed-Price Quote" — but the next step is unclear
- **Issue:** Strong pricing page (flat pricing, "no hourly billing ever," "cancel anytime" — excellent). But every package button says "Get a Fixed-Price Quote," which implies a form/wait, not a conversation.
- **Why it costs leads:** "Get a quote" feels like committing to a sales process. The lighter ask ("book a quick call") usually converts better, and you already offer "Zero obligation, no sales call."
- **Fix:** Change package CTAs to **"Book a 15-min call about this plan"** (carry the selected tier into the scheduler) or **"Start a fixed quote — 2 questions."** Add one short testimonial *next to the pricing buttons* (proof at the point of decision). Reinforce the risk reversal right under the buttons: *"Fixed quote before any work starts. No hourly billing, ever."*

---

## P2 — Polish / compounding gains

- **P2-1. Response-time microcopy at every form.** You promise "one business day" — say it *at the point of action*: under each form/CTA add *"Real reply from Duke within one business day — usually same day."* Reduces "will I get ghosted?" hesitation.
- **P2-2. Add a trust strip.** Near hero and footer: Google rating badge, "Founder-led," "No lock-in contracts," "100% custom-coded," and any security creds. You list these as text — make them scannable icon chips.
- **P2-3. Pricing FAQ.** Pre-empt objections that block booking: "What if I need more pages?", "Do I own the site?", "What's not included?", "What happens if I cancel a care plan?" Each answered objection is a saved lead.
- **P2-4. Tighten the hero.** "More customers. Handled for life." is memorable but abstract. Pair it with a concrete sub-line for non-technical owners: *"Custom-coded websites that get you found on Google and turn visitors into phone calls — built in 2–3 weeks, then hosted and maintained for you."* (You already have the ingredients; lead with the outcome + timeline.)
- **P2-5. Exit-intent / scroll offer on tool pages.** When a free-tool user goes to leave, offer the emailed report (ties into P0-1).
- **P2-6. Local SEO landing pages → booking.** You serve named North Bay towns; ensure each city/service page ends in the same single booking CTA, with one locally-relevant testimonial.
- **P2-7. Analytics check.** Make sure form submits, tool completions, and tap-to-call are tracked as conversion events so you can see where the funnel actually leaks after these fixes.

---

### If you only do three things this week
1. **Capture the lead on the free audit/tools** (P0-1) — your biggest, easiest leak.
2. **Swap /schedule for an instant calendar with auto-confirm** (P0-2).
3. **Get 5 real Google reviews live and put the star badge on the homepage; kill or fill the empty /reviews page** (P0-3).

Relevant pages reviewed: https://copperbaytech.com , /pricing , /schedule , /work , /web-development , /reviews , /audit