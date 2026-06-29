import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const URL = "https://copperbaytech.com/blog/how-to-hire-a-software-development-company";

export const metadata: Metadata = {
  title: "How to Hire a Software Development Company | Copper Bay Tech",
  description: "A plain-spoken buyer's guide to hiring a software development company: what to look for, the questions to ask, the red flags, and what custom software costs.",
  alternates: { canonical: URL },
  openGraph: {
    title: "How to Hire a Software Development Company | Copper Bay Tech",
    description: "A plain-spoken buyer's guide to hiring a software development company: what to look for, the questions to ask, the red flags, and what custom software costs.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How to Hire a Software Development Company (What to Look For)", description: "A plain-spoken buyer's guide to hiring a software development company: what to look for, the questions to ask, the red flags, and what custom software costs.", url: URL, datePublished: "2026-06-27" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Hire a Software Company" }])} />
      <JsonLd schema={faqSchema([{ q: "How long does it take to build custom software?", a: "A simple automation or internal tool can ship in a few weeks. A custom web app or portal with logins and a database typically takes one to three months. Larger platforms run longer. Building in phases lets you see working results early instead of waiting months for everything at once." }, { q: "Should I hire a local company, or is remote fine?", a: "Both work. Software is built well remotely, so the best partner for your project may not be in your town. What matters more is responsiveness and accountability. We are based in Santa Rosa and work on-site across the North Bay, but build for clients nationwide." }, { q: "Do I own the software after it is built?", a: "You should own all of it: the source code, the hosting and domain accounts, and the data. Get ownership in writing before you sign. If a firm keeps the code so you cannot leave, that is a deal-breaker, not industry standard." }, { q: "What is the difference between custom software and an off-the-shelf product?", a: "Off-the-shelf software is rented per seat and built for the average customer, so you adapt to it. Custom software is built around how your business actually works and you own it outright. Buy off-the-shelf when it covers 90 percent of your needs; build custom for the workflows that are unique to you." }, { q: "How much should I budget for a small custom project?", a: "Focused automations and internal tools often land in the low-to-mid four figures. A custom web app with real workflows usually runs from several thousand into the low five figures. The only reliable number comes from a scoped estimate after a real conversation about your goals." }])} />
      <Nav />
      <main>
        <ArticleHeader tag={"Custom Software"} title={"How to Hire a Software Development Company (What to Look For)"} date="June 27, 2026" readTime={"9 min read"} />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">To hire a software development company, write down the problem you want solved (not the features you think you need), then vet firms on four things: real work you can click through, a clear answer on who owns the code, an honest scope-and-price range before any contract, and a single accountable person who replies fast. The right partner asks more questions than they answer on the first call, gives you straight pricing, and hands you ownership of everything they build. The wrong one hides behind jargon, pads the team with people you never talk to, and quotes a flat price before they understand your business. This guide walks through what to look for, the questions to ask, and the red flags that should end a conversation.</p>

              <div className="rounded-xl border border-hairline bg-ink-1 p-6 mb-10">
                <p className="text-sm font-semibold text-copper uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-heading)" }}>Key takeaways</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-300">
                  <li>Vet on four things: clickable real work, who owns the code, an honest scoped price range, and one accountable person who replies fast.</li>
                  <li>Insist on owning 100 percent of the code, hosting, domain, and data in writing; lock-in is a deal-breaker.</li>
                  <li>Be wary of a firm price quoted before any discovery, and of quotes that are either suspiciously cheap or padded with agency overhead.</li>
                  <li>Custom software ranges from low-four-figure automations to mid-five-figure platforms; phased builds let you start small and expand on evidence.</li>
                  <li>Choose on trust and fit, not price alone, and favor partners where the person selling is the person building.</li>
                </ul>
              </div>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What does a software development company actually do?</h2>
              <p className="mb-6">A software development company builds custom applications for your specific business: internal tools, customer portals, web apps, automations, integrations between systems you already use, and the databases behind them. Unlike off-the-shelf software you rent by the seat, custom software is built around how your business actually works, and you own it.</p>
              <p className="mb-6">Firms range from solo developers and small founder-led shops to large agencies and offshore body-shops. Size is not quality. What matters is whether they can understand your problem, build something maintainable, and still be reachable a year later when you need a change.</p>
              <p className="mb-6">Most small and medium businesses do not need a 30-person agency. They need someone senior enough to make good architectural decisions, accountable enough to own the outcome, and small enough that you are talking to the person who writes the code, not a project manager relaying messages.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>How do you know if you even need custom software?</h2>
              <p className="mb-6">Before you hire anyone, get clear on whether custom is the right call. Custom software earns its cost when off-the-shelf tools force you to change how you work, when you are paying for a stack of subscriptions that do not talk to each other, or when a manual process is eating real hours every week.</p>
              <p className="mb-6">A simple rule: if you can buy something that does 90 percent of what you need for a reasonable monthly fee, buy it. Custom makes sense for the workflows that are unique to your business and give you an edge, or for stitching your existing tools together so data flows automatically.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Repetitive manual work</strong> If a person copies data between systems, rebuilds the same report every week, or re-keys orders by hand, an automation usually pays for itself fast.</li>
                <li><strong>Tools that do not connect</strong> When your CRM, accounting, scheduling, and email all live in separate silos, custom integration removes the busywork and the errors.</li>
                <li><strong>A process no product fits</strong> If you have bent your business to fit generic software, or you are running on spreadsheets that have outgrown themselves, custom is often cheaper than the chaos.</li>
                <li><strong>A product idea of your own</strong> If software is the thing you sell, you need a partner who can build a real, maintainable product, not a throwaway prototype.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What should you look for in a software development company?</h2>
              <p className="mb-6">The strongest signal is relevant, working software you can actually use, not screenshots in a deck. Ask for live links to things they have built and, where possible, a reference you can call. Past work tells you more than any sales pitch.</p>
              <p className="mb-6">Beyond the portfolio, look for these traits. Each one separates a real partner from a vendor who disappears after launch.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>They ask before they quote</strong> A serious firm digs into your problem first. If someone gives you a firm price before understanding your workflow, they are guessing, and you will pay for the guess later.</li>
                <li><strong>One accountable owner</strong> You want a named person responsible for your project from first call to launch and beyond, not a rotating cast of account managers. At Copper Bay Tech every project has one owner, and that is deliberate.</li>
                <li><strong>Plain language</strong> Good developers explain technical tradeoffs in terms of your business: cost, time, risk. If you leave a call more confused than you started, that is a warning, not a sign of their brilliance.</li>
                <li><strong>Custom-coded, not bolted together</strong> Some shops quietly assemble plugins and page builders and call it custom. Ask directly how the software will be built. We write real code so it stays fast, secure, and changeable as you grow.</li>
                <li><strong>They plan for after launch</strong> Software is never done. Ask how updates, fixes, and support work once the project ships. A partner who only talks about launch day has not thought about the years that matter most.</li>
                <li><strong>Fast, human responses</strong> How quickly someone replies during the sales process is the best preview of how they will treat you as a client. We reply within one business day, every time.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What questions should you ask before hiring?</h2>
              <p className="mb-6">Bring these to your first conversation. The answers, and how comfortably they are given, will tell you most of what you need to know.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Who owns the code and accounts?</strong> You should own 100 percent of the source code, the hosting accounts, the domain, and the data. Get it in writing. If a firm keeps the code hostage, you are renting your own business.</li>
                <li><strong>Who exactly will build this?</strong> Ask who writes the code and who you will talk to week to week. Make sure it is not quietly handed to subcontractors you never meet.</li>
                <li><strong>What happens if we part ways?</strong> A confident partner has a clean answer: you keep everything, documented, and another developer could pick it up. Lock-in is a business model, not a feature.</li>
                <li><strong>How do you handle security and data?</strong> Even a simple app handles customer data. Ask how they protect it, where it lives, and how backups work. Vague answers here are a real risk.</li>
                <li><strong>What is the realistic timeline, and what could blow it up?</strong> Honest firms name the risks up front. Anyone who promises a complex build on an aggressive date with no caveats is selling, not planning.</li>
                <li><strong>What does support cost after launch?</strong> Get the ongoing number, not just the build number. Surprise maintenance bills sour good projects.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What does it cost to hire a software development company?</h2>
              <p className="mb-6">Custom software pricing varies widely because every project is different, but ranges help you sanity-check a quote. A focused automation or internal tool often lands in the low-to-mid four figures. A custom web app or customer portal with logins, a database, and real workflows typically runs from several thousand into the low five figures. A larger, multi-feature platform built over months can reach the mid five figures and up.</p>
              <p className="mb-6">Be wary of the extremes. A quote that seems too cheap usually means an offshore body-shop, a template dressed up as custom, or a scope that will balloon. A quote that seems enormous often means agency overhead: layers of managers and salespeople you pay for but never benefit from.</p>
              <p className="mb-6">The honest approach is a scoped estimate after a real conversation, often broken into phases so you can start small, see results, and decide what to build next. You should never feel pressured to commit to a giant number before anyone has proven they understand your business.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What are the red flags?</h2>
              <p className="mb-6">Some warning signs should end the conversation no matter how polished the pitch is.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>They will not let you own the code</strong> This is the biggest one. If you cannot take your software elsewhere, you do not own your business systems.</li>
                <li><strong>A firm price before any discovery</strong> Real scope requires understanding. An instant flat quote means either lowballing to win you or padding to protect themselves.</li>
                <li><strong>You never speak to a developer</strong> If everything routes through sales and account managers, details get lost and you pay for the overhead.</li>
                <li><strong>Jargon instead of answers</strong> Hiding behind buzzwords usually hides thin substance. Clarity is a skill; confusion is a tactic.</li>
                <li><strong>No plan for support</strong> A partner who only talks about launch has not thought about the part of the relationship that lasts longest.</li>
                <li><strong>Pressure and urgency</strong> Manufactured deadlines and limited-time pricing belong in used-car lots, not in a multi-month software partnership.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>How do you make the final decision?</h2>
              <p className="mb-6">Once you have two or three candidates who clear the bar, choose on fit and trust, not price alone. The cheapest bid that you cannot reach in a crisis is the most expensive choice you can make.</p>
              <p className="mb-6">Pick the partner who understood your problem fastest, gave you the straightest answers, and made you feel like the work would actually get owned. A small, founder-led shop often wins here precisely because the person selling is the person building.</p>
              <p className="mb-6">Start with a contained first phase if you can. Build something real, watch how the partner communicates and delivers under pressure, then expand from a position of evidence rather than a brochure. The right software company welcomes that approach, because they are confident the work speaks for itself.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Frequently asked questions</h2>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How long does it take to build custom software?</h3>
              <p className="mb-6">A simple automation or internal tool can ship in a few weeks. A custom web app or portal with logins and a database typically takes one to three months. Larger platforms run longer. Building in phases lets you see working results early instead of waiting months for everything at once.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Should I hire a local company, or is remote fine?</h3>
              <p className="mb-6">Both work. Software is built well remotely, so the best partner for your project may not be in your town. What matters more is responsiveness and accountability. We are based in Santa Rosa and work on-site across the North Bay, but build for clients nationwide.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Do I own the software after it is built?</h3>
              <p className="mb-6">You should own all of it: the source code, the hosting and domain accounts, and the data. Get ownership in writing before you sign. If a firm keeps the code so you cannot leave, that is a deal-breaker, not industry standard.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>What is the difference between custom software and an off-the-shelf product?</h3>
              <p className="mb-6">Off-the-shelf software is rented per seat and built for the average customer, so you adapt to it. Custom software is built around how your business actually works and you own it outright. Buy off-the-shelf when it covers 90 percent of your needs; build custom for the workflows that are unique to you.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How much should I budget for a small custom project?</h3>
              <p className="mb-6">Focused automations and internal tools often land in the low-to-mid four figures. A custom web app with real workflows usually runs from several thousand into the low five figures. The only reliable number comes from a scoped estimate after a real conversation about your goals.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Related reading</h2>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><Link href="/web-development" className="text-copper hover:text-copper-bright underline">custom software and web app development</Link></li>
                <li><Link href="/pricing" className="text-copper hover:text-copper-bright underline">how custom software pricing works</Link></li>
                <li><Link href="/work" className="text-copper hover:text-copper-bright underline">see the work we have shipped</Link></li>
                <li><Link href="/process" className="text-copper hover:text-copper-bright underline">how we work, step by step</Link></li>
              </ul>

              <div className="mt-12 rounded-xl border border-hairline bg-ink-1 p-8 text-center">
                <p className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Thinking about a project?</p>
                <p className="text-zinc-400 mb-6">Copper Bay Tech builds custom websites and software for small businesses &mdash; founder-led, custom-coded, and built to last. Get a straight answer and a free consultation.</p>
                <Link href="/get-started" className="inline-flex items-center gap-2 rounded-lg bg-copper px-6 py-3 font-semibold text-ink-0 hover:bg-copper-bright transition-colors">Get started <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
