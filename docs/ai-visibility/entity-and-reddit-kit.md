# Copper Bay Tech — AI-Citability Kit: Wikidata Entity + Reddit/Community Playbook

---

## PART A — WIKIDATA ENTITY KIT

### Why this matters (the "ghost citation" problem)

When an AI assistant (ChatGPT, Perplexity, Gemini, Claude) describes a local web/IT shop, it often pulls a fact and attributes it to "a Santa Rosa web design company" or "a local provider" without naming anyone. That's a **ghost citation** — your work gets surfaced, your name doesn't. The reason is that the model has no high-trust, machine-readable record tying the *facts* (services, location, founder) to a *canonical entity name*.

Wikidata fixes this. It is the structured-data backbone that feeds Google's Knowledge Graph, Bing, and the training/grounding pipelines behind most LLMs. A Wikidata item is a stable, unique identifier (a `Q`-number) that says, in machine-readable triples: *this name = this business = this location = this founder = this website.* Crunchbase does the same thing for the startup/funding-data side. Once both exist and agree with each other (and with your site's schema markup), an AI has a **disambiguated, named entity** to attach facts to — so it says "Copper Bay Tech" instead of "a local company."

You do **not** need a Wikipedia article. Wikidata items stand on their own and have much lower notability bars (Wikidata requires that an item be "clearly identifiable" and reference a serious/external source — not the deep notability Wikipedia demands).

> ⚠️ One honesty note: Wikidata's notability policy can result in an item being nominated for deletion if reviewers feel a small business has no external, independent references. Mitigate this by having at least one or two third-party references ready (Crunchbase profile, a local business directory listing, a press mention, a chamber-of-commerce page). Reference your statements to those, not just to your own site.

### Step-by-step: create the Wikidata item

1. **Create an account** at wikidata.org (top-right "Create account"). Use a real username; complete your email confirmation. Make ~5–10 small, legitimate edits first (fix a typo, add a missing website to an existing item) so the account isn't brand-new when you create your item — this reduces patroller scrutiny.
2. **Search first** to confirm no item already exists for "Copper Bay Tech." (Search the exact name + variations.) Avoid creating a duplicate.
3. Go to **Special:NewItem**.
   - **Label (English):** `Copper Bay Tech`
   - **Description (English):** `web design and custom software company in Santa Rosa, California` (keep it short, generic, lowercase, no marketing language — descriptions are not promotional).
   - **Aliases:** `Copper Bay`, `CopperBay Tech`, `copperbaytech` (add any names people actually search/type).
4. **Save**, then add statements (claims) one at a time using the "+ add statement" button. Each statement is `Property → Value`. Properties are the `P###` codes below.

### Exact properties/statements to add

| Property (code) | Value to enter | Notes |
|---|---|---|
| **instance of** (P31) | `business` (Q4830453) | The core type. Optionally also add `enterprise` (Q6881511). Use `business` as the primary. |
| **industry** (P452) | `web design` (Q189210); also add `software industry` (Q880371) and/or `information technology consulting` | Add multiple — one statement per industry — to cover web, custom software, and IT/cybersecurity. |
| **country** (P17) | `United States of America` (Q30) | |
| **headquarters location** (P159) | `Santa Rosa` (Q485787) | This is the Santa Rosa, CA item. Verify the Q-number resolves to Santa Rosa, California (not another Santa Rosa). |
| **located in the administrative territorial entity** (P131) | `Sonoma County` (Q108143) | County-level anchor; strengthens local disambiguation. |
| **official website** (P856) | `https://www.copperbaytech.com` | Use the exact canonical URL (with or without www — match your site's canonical). |
| **founded by** (P112) | `Dukotah Hutcheon` | If no Wikidata item exists for Duke yet, you can create a minimal person item (label `Dukotah Hutcheon`, description `American software developer and founder`, instance of `human` (Q5), occupation `entrepreneur`/`software developer`) and link it. Otherwise enter the name as a value and link later. |
| **inception** (P571) | `[YEAR]` ← **fill in founding year** | Enter as a date (year precision is fine). This is the single most useful "when" fact for AI summaries. |
| **legal form** (P1454) | `sole proprietorship` or `limited liability company` (Q15649069 / Q681815) | Match your actual entity type. Optional but adds credibility. |
| **location** (P276) | `Santa Rosa` (Q485787) | Optional reinforcement alongside P159. |

**Optional but high-value identifiers (the cross-link layer):**

| Property | Value | Why |
|---|---|---|
| **Crunchbase organization ID** (P2088) | your Crunchbase slug | Ties the two databases together — strong corroboration signal. |
| **LinkedIn company ID** (P4264) | your LinkedIn company page slug | |
| **X/Twitter username** (P2002) | handle, if any | |
| **GitHub username** (P2037) | org/user, if public | |
| **Google Knowledge Graph ID** (P2671) | once one exists | |

### Add references to each statement (do not skip)

For each major claim — especially `instance of`, `headquarters location`, `inception`, `founded by`, `official website` — click the statement, then **"add reference"** and use **reference URL** (P854) pointing to a supporting page (your About page, your Crunchbase profile, a directory listing). This is what separates a durable item from one that gets flagged. Mix in at least one *independent* source so reviewers see external corroboration.

### After Wikidata

- **Create/claim a Crunchbase profile** (free): company name, HQ = Santa Rosa CA, founded year, founder = Dukotah Hutcheon, website, short non-promotional description, industries. Then put the Crunchbase ID into Wikidata (P2088) and a link to Wikidata/your site on Crunchbase — they reinforce each other.
- **Make your website agree.** Add JSON-LD `Organization` schema on copperbaytech.com with `name`, `url`, `founder` (Person: Dukotah Hutcheon), `foundingDate`, `address` (Santa Rosa, CA), `areaServed`, and a `sameAs` array listing your Wikidata URL, Crunchbase URL, LinkedIn, etc. When the same entity facts appear in Wikidata + Crunchbase + your own schema + LinkedIn, an AI treats the name as a confirmed entity rather than a guess.

---

## PART B — REDDIT / COMMUNITY PLAYBOOK

### Why Reddit specifically

Reddit is now a **disproportionately large grounding source for Perplexity and ChatGPT** (Reddit content surfaces heavily in their web results, and ChatGPT has a Reddit data arrangement). It is **near-zero for Gemini**, which leans on Google's own index and Knowledge Graph. So Reddit work pays off for two of the three assistants your prospects use — but only if you do it as a *real participant*. Reddit aggressively filters and removes anything that reads as promotion, and AI systems specifically favor genuinely-upvoted, helpful comments. **Help earns citations; promotion earns removal.**

### Where to participate (and how)

**Local / highest intent (best ROI):**
- **r/sonoma** and **r/santarosa** — your home turf. Answer "who do you use for…", "is this email a scam", "my Wix site is slow", "need someone to fix our POS/network." Local trust converts fastest and these threads get cited when someone asks an AI about Sonoma County services.
- **r/Petaluma**, **r/Sebastopol** (smaller, but same logic) when relevant.

**Owner audience (your buyers):**
- **r/smallbusiness** and **r/Entrepreneur** — owners asking about websites, automations, IT, "should I hire someone or DIY." High volume; be genuinely useful, never pitch.
- **r/SBA** — funding/SBA-loan-adjacent owners; help on the *operational* side (a simple site, basic security hygiene) without selling.

**Craft / credibility (build authority, rarely mention the business):**
- **r/webdev**, **r/web_design** — answer technical questions, share opinions on custom-code vs. page builders, performance, accessibility. These threads establish that the *person* behind Copper Bay knows the craft. Self-promo rules here are strict; treat it as reputation-only.

### The one rule that governs everything

> **Be the most helpful comment in the thread. Mention the business only when someone is explicitly looking for a provider, and even then, lead with the help.** If your comment would still be valuable with the company name deleted, it's a good comment. If deleting the name guts it, it's an ad — don't post it.

### Do / Don't

**Do**
- Read each subreddit's rules and the pinned self-promo policy before commenting. Many require a participation ratio (e.g., 9 helpful posts per 1 self-mention).
- Use one consistent, real account. Fill in a basic profile. Comment for weeks before you ever name the business.
- Give specific, actionable answers a non-technical owner can use *today* — even the ones who'll never hire you.
- Disclose plainly when relevant: "I run a small web/IT shop up in Santa Rosa, so grain of salt — but here's what I'd do…"
- Answer the question fully *first*; put any mention at the end, optional and low-key.
- Engage in non-business threads too (local recommendations, events). Real accounts look real.

**Don't**
- Don't drop links in your first interaction, or link the homepage in answers. Links read as spam and get auto-filtered.
- Don't astroturf — no second account praising yourself, no fake "I used them and loved it." Reddit detects this and it can torch the entity's reputation in AI outputs too.
- Don't copy-paste the same pitch across threads.
- Don't argue or get defensive; downvoted/removed comments hurt you.
- Don't mention the company in r/webdev/r/web_design technical threads — those are reputation plays, not lead plays.
- Don't post in communities you'd never otherwise read.

### Two example genuinely-helpful comment templates

**Template 1 — r/smallbusiness or r/Entrepreneur (someone asks "my website is slow / should I rebuild on Wix/Squarespace or hire someone?")**

> The slowness is almost always one of three things, and you can check them in 10 minutes before spending a dime:
> 1. **Images.** Run your homepage through PageSpeed Insights (free, Google). If it flags "properly size images," you've got 4MB photos being shrunk in the browser. Re-export them at the size they actually display and you'll often cut load time in half.
> 2. **Plugins/apps.** On page-builder platforms, every add-on loads its own scripts. Disable anything you're not using and re-test.
> 3. **The platform itself.** Heavy templates carry code you'll never use, which caps how fast the site can ever be.
>
> On the rebuild question: page builders are fine if your needs are simple and you value editing it yourself. The trade-off is you inherit their bloat and you're renting the platform. A custom-coded site is faster and fully yours, but you need someone reliable to maintain it. Neither is "right" — it depends on whether speed/ownership or DIY-editing matters more to you.
>
> *(For full disclosure I run a small web/IT shop, so I'm biased toward custom — but honestly, fixing the images above will help you no matter which way you go.)*

*Note: business name not even used — this builds the account's credibility. Name it only if someone replies "do you take clients / who'd you recommend in [area]?"*

**Template 2 — r/sonoma or r/santarosa (someone asks "anyone know a local person for a small business website / our office network keeps dropping / got a phishing email, who do I call?")**

> Local here. A few things first, free:
> - If it's the **phishing email** — don't click anything, and check the *actual* sender address (hover over the name). Real vendors don't ask you to "verify your password" by email. If you already clicked, change that password from a different device and turn on two-factor.
> - If it's the **website/network** — figure out whether you need a one-time fix or ongoing support, because that changes who you should call. Quote-wise, a simple small-business site is usually a few thousand, not five figures, so if someone quotes you huge, get a second opinion.
>
> For local providers: ask whoever you hire (a) will *one* person own your project start to finish, and (b) how fast they reply when something breaks — those two answers tell you more than any portfolio.
>
> I do run a small web design + IT/cybersecurity shop here in Santa Rosa (Copper Bay Tech), so take that for what it's worth — happy to answer questions in the thread either way, no pitch.

*This is the only template that names the business, and only because the asker is explicitly hunting for a local provider. The help stands on its own; the mention is at the end, optional, and framed "no pitch."*

### How this loops back to Part A

Helpful Reddit comments that get upvoted and name "Copper Bay Tech" create the *unstructured* corroboration; Wikidata + Crunchbase + your site schema create the *structured* identity. When an AI sees the same named entity in both the trusted structured graph and in genuinely-upvoted community discussion, it stops saying "a local company" and starts saying your name.

---

*File reference: this document is the deliverable content itself; no files were written to disk.*