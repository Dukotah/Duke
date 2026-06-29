import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { serviceSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import RelatedGuides from "@/components/RelatedGuides";

const URL = "https://copperbaytech.com/software-development";

export const metadata: Metadata = {
  title: "Custom Software Development for Small Businesses | Copper Bay Tech",
  description: "Custom web apps, internal tools, dashboards, portals, and automations built for SMBs. MVP-first, fixed scoped quotes, you own the code. Replies within one business day.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Custom Software Development for Small Businesses | Copper Bay Tech",
    description: "Custom web apps, internal tools, dashboards, portals, and automations built for SMBs. MVP-first, fixed scoped quotes, you own the code. Replies within one business day.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function SoftwareDevelopmentHub() {
  return (
    <>
      <JsonLd schema={serviceSchema({ name: "Custom Software Development", description: "Custom web apps, internal tools, dashboards, portals, and automations built for SMBs. MVP-first, fixed scoped quotes, you own the code. Replies within one business day.", url: URL, areaServed: "United States", offer: { low: 5000, high: 50000 } })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Custom Software Development" }])} />
      <JsonLd schema={faqSchema([{ q: "What does custom software cost?", a: "It depends entirely on scope, but as a rough guide: a focused tool or automation usually starts around $5,000 to $15,000, a solid internal app or portal often runs $20,000 to $75,000, and a larger multi-feature platform can range from $75,000 to $250,000 or more. The honest answer is that we scope your specific project and give you a fixed written quote before you commit a dollar, so you never guess." }, { q: "How long does it take to build?", a: "A small automation or integration can be done in two to four weeks. A first real version of an app or portal typically takes one to three months because we ship an MVP first rather than disappearing for a year. Bigger platforms grow in phases after that. You will have a timeline in writing with your quote." }, { q: "Do I actually own the software?", a: "Yes, completely. The code lives in a repository that belongs to you, and the hosting and service accounts are in your name. You are free to keep working with us, bring in another developer, or hire in-house later. There is no lock-in and nothing held hostage." }, { q: "Should I just use off-the-shelf software instead?", a: "Often, yes, and I will tell you so if that is the right call. Off-the-shelf is great when your needs match what it offers. Custom makes sense when you are bending your business to fit a tool, paying for seats and features you do not use, stuck duct-taping apps together, or doing something your competitors cannot easily copy. We will be straight with you about which side you are on." }, { q: "What is the MVP-first approach and why does it matter?", a: "MVP means we build the smallest version that delivers real value, put it in front of real users quickly, and grow from what we learn. It matters because it gets you a working tool in weeks instead of months, keeps the budget controlled, and means you are steering with real feedback instead of betting everything on a giant spec written before anyone has used it." }, { q: "Where do I start?", a: "Start with a free discovery conversation. Tell me what is slowing your business down or what you wish your software could do, and I will tell you honestly whether custom is the right fit, roughly what it would take, and where to begin. I reply within one business day, and there is no pressure or obligation." }])} />
      <Nav />
      <main className="theme-dark min-h-screen bg-ink-0 text-white">
        <section className="relative pt-32 pb-16 bg-ink-0">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-copper-bright border border-copper-dim">Custom Software Development</span>
            <h1 className="text-4xl md:text-[3rem] font-bold text-white mb-5 leading-[1.1]" style={{ fontFamily: "var(--font-heading)" }}>Custom Software Development for Growing Businesses</h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">Software built around how your business actually works, not the other way around. One accountable developer, a smallest-useful-version-first plan, and code you fully own.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-3 font-semibold text-ink-0 hover:bg-copper-bright transition-colors">Get started <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-lg border border-hairline px-6 py-3 font-semibold text-white hover:bg-ink-1 transition-colors">See pricing</Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-ink-0">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright text-center">Why Copper Bay Tech</p>
            <h2 className="text-3xl font-bold text-white text-center mt-2" style={{ fontFamily: "var(--font-heading)" }}>What you get</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-8">
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Custom-coded, not no-code templates</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Your software is written to fit your process exactly, with no per-seat platform tax and no ceiling you hit at the worst possible moment. When the business changes, the software can change with it.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>One accountable owner</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">You work directly with the person building it: Duke. No account managers, no offshore handoffs, no telephone game. One throat to choke and one inbox that replies within a business day.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>You own the code</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Every line lives in a repository that is yours. You can hand it to another developer, hire in-house later, or keep it with us. There is no lock-in and no hostage situation.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>MVP-first, fixed scoped quotes</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">We build the smallest version that delivers real value, get it in front of real users, and grow from there. Each phase is a fixed, written quote so you always know the number before work starts.</p>
                </div>
              </div>
          </div>
        </section>

        <section className="py-16 bg-ink-1">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright text-center">What we build</p>
            <h2 className="text-3xl font-bold text-white text-center mt-2" style={{ fontFamily: "var(--font-heading)" }}>Software that does real work</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Custom web applications</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Full software products that run in the browser: the core tool your business or your customers use every day, designed and coded from scratch around your workflow.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Internal business tools</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">The app that replaces the tangle of spreadsheets, shared docs, and sticky notes your team uses to run operations, so the right information lives in one place everyone trusts.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Dashboards and reporting</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Live views that pull numbers from your systems into one screen, so you can see sales, jobs, inventory, or KPIs at a glance instead of rebuilding a report every Monday.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Customer and client portals</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">A secure login where your customers check status, view documents, pay invoices, book, or message you, cutting the back-and-forth and making you look bigger than you are.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Booking and scheduling systems</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Online booking, reservations, appointments, or dispatch built for how your operation really schedules, including the rules and edge cases off-the-shelf tools can never handle.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Integrations between tools</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Connecting the software you already pay for, like QuickBooks, Stripe, your CRM, email, and more, so data flows automatically instead of being retyped by hand.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Workflow automations</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Quiet automations that handle the repetitive steps, from follow-up emails to status updates to data entry, giving your team back hours every week.</p>
                </div>
                <div className="rounded-xl border border-hairline bg-ink-1 p-6">
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>Practical AI features</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">AI used where it actually earns its keep: drafting replies, summarizing documents, classifying incoming requests, or answering customer questions from your own content, not hype for its own sake.</p>
                </div>
              </div>
          </div>
        </section>

        <section className="py-16 bg-ink-0">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright text-center">How it works</p>
            <h2 className="text-3xl font-bold text-white text-center mt-2 mb-8" style={{ fontFamily: "var(--font-heading)" }}>A clear, MVP-first process</h2>
            <ol className="space-y-5">
              <li className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper/15 text-copper-bright font-bold flex items-center justify-center">1</span><div><h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Discovery</h3><p className="text-zinc-400 text-sm leading-relaxed">We talk through how your business works today, where the pain is, and what a win looks like. No charge, no obligation, and you leave with a clearer picture even if we never build a thing.</p></div></li>
              <li className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper/15 text-copper-bright font-bold flex items-center justify-center">2</span><div><h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Scope and fixed quote</h3><p className="text-zinc-400 text-sm leading-relaxed">I write down exactly what the first version includes, what it costs, and how long it takes. One fixed, scoped number you approve before any code is written, so there are no surprise invoices.</p></div></li>
              <li className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper/15 text-copper-bright font-bold flex items-center justify-center">3</span><div><h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Build the MVP first</h3><p className="text-zinc-400 text-sm leading-relaxed">We build the smallest useful version and get it into your hands fast, with regular check-ins so you see progress and steer along the way instead of waiting months for a big reveal.</p></div></li>
              <li className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper/15 text-copper-bright font-bold flex items-center justify-center">4</span><div><h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Launch</h3><p className="text-zinc-400 text-sm leading-relaxed">We put it live, move over your real data, train your team, and make sure it holds up under actual use. The code and accounts are yours from day one.</p></div></li>
              <li className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-copper/15 text-copper-bright font-bold flex items-center justify-center">5</span><div><h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>Support and growth</h3><p className="text-zinc-400 text-sm leading-relaxed">Once it is working, we add the next phase on your schedule, fix anything that comes up, and keep it running. Ongoing or as-needed, your call.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="py-16 bg-ink-1">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>Common questions</h2>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>What does custom software cost?</h3>
            <p className="text-zinc-400 leading-relaxed">It depends entirely on scope, but as a rough guide: a focused tool or automation usually starts around $5,000 to $15,000, a solid internal app or portal often runs $20,000 to $75,000, and a larger multi-feature platform can range from $75,000 to $250,000 or more. The honest answer is that we scope your specific project and give you a fixed written quote before you commit a dollar, so you never guess.</p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How long does it take to build?</h3>
            <p className="text-zinc-400 leading-relaxed">A small automation or integration can be done in two to four weeks. A first real version of an app or portal typically takes one to three months because we ship an MVP first rather than disappearing for a year. Bigger platforms grow in phases after that. You will have a timeline in writing with your quote.</p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Do I actually own the software?</h3>
            <p className="text-zinc-400 leading-relaxed">Yes, completely. The code lives in a repository that belongs to you, and the hosting and service accounts are in your name. You are free to keep working with us, bring in another developer, or hire in-house later. There is no lock-in and nothing held hostage.</p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Should I just use off-the-shelf software instead?</h3>
            <p className="text-zinc-400 leading-relaxed">Often, yes, and I will tell you so if that is the right call. Off-the-shelf is great when your needs match what it offers. Custom makes sense when you are bending your business to fit a tool, paying for seats and features you do not use, stuck duct-taping apps together, or doing something your competitors cannot easily copy. We will be straight with you about which side you are on.</p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>What is the MVP-first approach and why does it matter?</h3>
            <p className="text-zinc-400 leading-relaxed">MVP means we build the smallest version that delivers real value, put it in front of real users quickly, and grow from what we learn. It matters because it gets you a working tool in weeks instead of months, keeps the budget controlled, and means you are steering with real feedback instead of betting everything on a giant spec written before anyone has used it.</p>
            <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Where do I start?</h3>
            <p className="text-zinc-400 leading-relaxed">Start with a free discovery conversation. Tell me what is slowing your business down or what you wish your software could do, and I will tell you honestly whether custom is the right fit, roughly what it would take, and where to begin. I reply within one business day, and there is no pressure or obligation.</p>
          </div>
        </section>

        <RelatedGuides
          title="Custom software, explained"
          items={[
            { href: "/blog/how-much-does-custom-software-cost", label: "How much does custom software cost?" },
            { href: "/blog/how-much-does-it-cost-to-build-an-app", label: "How much does it cost to build an app?" },
            { href: "/blog/custom-software-vs-off-the-shelf", label: "Custom software vs. off-the-shelf" },
            { href: "/blog/build-vs-buy-software", label: "Build vs. buy: when custom makes sense" },
            { href: "/blog/what-is-custom-software-development", label: "What is custom software development?" },
            { href: "/blog/how-to-hire-a-software-development-company", label: "How to hire a software development company" },
            { href: "/blog/why-build-an-mvp-first", label: "Why build an MVP first" },
            { href: "/blog/do-i-need-an-app-or-a-website", label: "Do I need an app or a website?" },
          ]}
        />

        <section className="py-20 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>Have a process that should be software?</h2>
            <p className="text-zinc-400 mb-8">Tell me the headache. I&apos;ll tell you honestly what I&apos;d build first, what it would cost, and whether you even need custom software — reply within one business day.</p>
            <Link href="/get-started" className="inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-7 py-3 font-semibold text-ink-0 hover:bg-copper-bright transition-colors">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
