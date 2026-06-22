import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight } from "lucide-react";
import ArticleHeader from "@/components/ArticleHeader";

const blogSchema = blogPostingSchema({
  title: "Managed IT Support vs. Break-Fix: Which Is Right for Your Business?",
  description:
    "Break-fix IT feels cheaper until something breaks at the worst possible moment. Here's how to decide which model makes sense for your Sonoma County business.",
  url: "https://copperbaytech.com/blog/managed-it-support-vs-break-fix-sonoma-county",
  datePublished: "2026-05-01",
});

export const metadata: Metadata = {
  title: "Managed IT Support vs Break-Fix: Which Is Right for Your Business? | Copper Bay Tech",
  description:
    "Break-fix IT feels cheaper until something breaks at the worst possible moment. Here's how to decide which model makes sense for your Sonoma County business.",
  keywords: "managed IT support Sonoma County, break-fix IT, IT support Santa Rosa, IT services small business",
  alternates: { canonical: "https://copperbaytech.com/blog/managed-it-support-vs-break-fix-sonoma-county" },
  openGraph: {
    title: "Managed IT Support vs Break-Fix: Which Is Right for Your Business?",
    description:
      "Break-fix IT feels cheaper until something breaks at the worst possible moment. Here's how to decide which model makes sense for your Sonoma County business.",
    url: "https://copperbaytech.com/blog/managed-it-support-vs-break-fix-sonoma-county",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Managed IT vs Break-Fix" }])} />
      <JsonLd schema={faqSchema([
        { q: "What is managed IT support?", a: "Managed IT support is a flat-fee service where a provider handles your technology proactively — monitoring, maintenance, and help desk — instead of only showing up when something breaks." },
        { q: "Is managed IT or break-fix better for small businesses?", a: "Managed IT is better for most businesses with 5+ employees or critical systems. Break-fix works for very small operations with low tech dependency. The key difference is predictable costs vs. unpredictable emergency bills." },
        { q: "How much does managed IT support cost in Sonoma County?", a: "Managed IT support in Sonoma County typically costs $75–$150 per user per month, depending on the scope of services. Copper Bay Tech offers flat monthly retainers with no long-term contracts." },
        { q: "What does a managed IT provider actually do?", a: "A managed IT provider handles network monitoring, workstation support, software updates, cloud migrations, security, staff onboarding, and acts as your on-call tech resource — all for a predictable monthly fee." },
      ])} />
      <Nav />
      <main>
        <ArticleHeader tag="IT Support" title="Managed IT Support vs. Break-Fix: Which Is Right for Your Sonoma County Business?" date="May 1, 2026" readTime="5 min read" />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                Most small businesses default to break-fix IT — call someone when something breaks, pay them to fix it, move on. It feels like the smart choice until the server goes down on a Monday morning before a big client presentation. Here&apos;s how to actually think about this decision.
              </p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What break-fix actually costs you
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Break-fix feels cheap because there&apos;s no recurring cost. But the math changes when you factor in:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Emergency rates — most IT providers charge 1.5–2x for urgent calls",
                  "Downtime cost — an hour of downtime for a 5-person office at average wages is $300–$600 before you count lost revenue",
                  "The learning curve — whoever fixes it has to relearn your setup every time",
                  "Deferred maintenance — break-fix encourages ignoring problems until they become emergencies",
                  "No relationship — you call someone new every time, explain your whole setup, and hope they're good",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What managed IT support actually means
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Managed IT means you pay a flat monthly fee for a defined scope of services. At minimum, that should include:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Someone who knows your setup and is reachable when something goes wrong",
                  "Proactive monitoring — catching issues before they become outages",
                  "Patch management and firmware updates on a regular schedule",
                  "Clear expectations on response time for different types of issues",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-2 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-zinc-400 leading-relaxed mb-8">
                What it doesn&apos;t mean: an impersonal helpdesk ticket system, a different tech every time, or a long-term contract that&apos;s hard to exit.
              </p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Which model is right for you?
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="border border-hairline rounded-xl p-5 bg-ink-0">
                  <p className="text-sm font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Break-fix makes sense if:</p>
                  <ul className="space-y-1.5">
                    {[
                      "You're a solo operator with minimal IT dependency",
                      "Your \"IT\" is just a laptop and Google Workspace",
                      "You have an in-house tech person",
                      "Downtime doesn't directly cost you revenue",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-2 border-copper rounded-xl p-5 bg-copper/5">
                  <p className="text-sm font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Managed IT makes sense if:</p>
                  <ul className="space-y-1.5">
                    {[
                      "You have 3+ employees relying on shared systems",
                      "Downtime = lost revenue or unhappy clients",
                      "You handle customer data or payments",
                      "Your team calls you when anything breaks",
                      "You want to stop thinking about IT",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="w-1 h-1 rounded-full bg-copper flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What to watch out for in a managed IT contract
              </h2>
              <ul className="space-y-2 mb-8">
                {[
                  "Long-term contracts with painful exit clauses — look for month-to-month",
                  "Vague scope — \"unlimited support\" that excludes everything that actually breaks",
                  "A helpdesk ticket system instead of a direct line to someone who knows your setup",
                  "Pricing tiers that hide what you actually need in an upsell",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-zinc-400 leading-relaxed mb-8">
                Copper Bay Tech&apos;s IT support is month-to-month, flat-fee, and comes with a direct line — not a ticket queue. Plans start at $550/month for small teams, and most clients get the same access a large company&apos;s IT department would provide.
              </p>

              <div className="bg-ink-2 rounded-xl p-6 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Not sure which model fits your situation?</p>
                <p className="text-white/60 text-sm mb-5">Free 30-minute call — no obligation, no sales pressure.</p>
                <Link href="/it-support-sonoma-county" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-copper hover:bg-copper-bright transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Learn About IT Support <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "What is managed IT support?", a: "Managed IT support is a flat-fee service where a provider handles your technology proactively — monitoring, maintenance, and help desk — instead of only showing up when something breaks." },
                { q: "Is managed IT or break-fix better for small businesses?", a: "Managed IT is better for most businesses with 5+ employees or critical systems. Break-fix works for very small operations with low tech dependency. The key difference is predictable costs vs. unpredictable emergency bills." },
                { q: "How much does managed IT support cost in Sonoma County?", a: "Managed IT support in Sonoma County typically costs $75–$150 per user per month, depending on the scope of services. Copper Bay Tech offers flat monthly retainers with no long-term contracts." },
                { q: "What does a managed IT provider actually do?", a: "A managed IT provider handles network monitoring, workstation support, software updates, cloud migrations, security, staff onboarding, and acts as your on-call tech resource — all for a predictable monthly fee." },
              ].map((item) => (
                <div key={item.q} className="border border-hairline rounded-xl p-6 bg-ink-0">
                  <p className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <span className="text-copper-bright mr-2">Q.</span>{item.q}
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-ink-2">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Thinking about switching to managed IT support?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Flat monthly fee, no surprises, direct access to a real person. See what managed IT looks like for a Sonoma County small business.
            </p>
            <Link href="/it-support-sonoma-county" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-copper hover:bg-copper-bright transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              See IT Support Options <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
