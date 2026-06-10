import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight } from "lucide-react";
import ArticleHeader from "@/components/ArticleHeader";

const blogSchema = blogPostingSchema({
  title: "5 AI Automations That Actually Save Sonoma County Small Businesses Time",
  description:
    "Concrete, no-hype AI workflows that work for local service businesses — from answering missed calls to clearing after-hours admin. What to try first, what to skip, and what to expect.",
  url: "https://copperbaytech.com/blog/ai-automations-sonoma-county-small-business",
  datePublished: "2026-06-10",
});

export const metadata: Metadata = {
  title: "5 AI Automations That Actually Save Small Businesses Time | Copper Bay Tech",
  description:
    "Concrete, no-hype AI workflows that work for Sonoma County service businesses — answering missed calls, instant lead replies, review requests, quote drafts, and inbox triage. Where to start.",
  keywords:
    "AI automation small business, AI for small business Sonoma County, small business automation Petaluma, AI tools local business, missed call automation",
  alternates: {
    canonical: "https://copperbaytech.com/blog/ai-automations-sonoma-county-small-business",
  },
  openGraph: {
    title: "5 AI Automations That Actually Save Small Businesses Time | Copper Bay Tech",
    description:
      "Concrete, no-hype AI workflows that work for Sonoma County service businesses — answering missed calls, instant lead replies, review requests, quote drafts, and inbox triage. Where to start.",
    url: "https://copperbaytech.com/blog/ai-automations-sonoma-county-small-business",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const automations = [
  {
    num: "01",
    title: "Missed-call text-back",
    who: "Any service business: plumbers, contractors, salons, landscapers, HVAC",
    what: "When a call goes unanswered, an automated text fires back within seconds: \"Hey, this is [Business] — sorry we missed you. What can we help with?\" The caller responds, the conversation continues, and you're notified. No voicemail, no callback tag.",
    honest:
      "This one is worth doing purely on economics. If you miss even a handful of calls a week and each job is worth a few hundred dollars, the math is obvious. It requires almost no setup and runs without ongoing attention.",
  },
  {
    num: "02",
    title: "Instant lead-form response",
    who: "Any business with a contact form on their website",
    what: "The moment someone fills in your contact form, they get a personal-sounding reply — answering their question if it's a common one, confirming you can help, and offering a next step. This can come from a real email address, not a \"no-reply\" bot address.",
    honest:
      "Speed matters here. In most service categories, the business that responds first has a significant advantage. An AI reply that goes out in under two minutes beats a manual reply sent three hours later, even if the manual reply is more polished.",
  },
  {
    num: "03",
    title: "Post-job review request",
    who: "Any local business where Google reviews influence customer decisions",
    what: "After a job closes, an automated message goes to the customer: a thank-you and a direct link to leave a Google review. The timing — a day or two after the work wraps — is when satisfaction is highest. Happy customers who would have forgotten to review often do, when asked at the right moment.",
    honest:
      "This is one of the highest-leverage things a local business can do for its search ranking. Reviews influence where you appear in the Google Maps pack, which drives calls and walk-ins. Most businesses never ask, or ask inconsistently. Automating the ask makes it consistent.",
  },
  {
    num: "04",
    title: "Quote and estimate drafting",
    who: "Contractors, consultants, service providers who write estimates regularly",
    what: "You take notes during a site visit or discovery call. An AI tool turns those notes into a properly formatted, on-brand quote in a few minutes — line items, terms, totals. You review, adjust anything that needs adjusting, and send. The draft gets you 80% of the way there without starting from a blank page.",
    honest:
      "This saves real time when you're writing multiple estimates a week. The AI is only useful here because it's working from your own templates and your own pricing — it's not inventing numbers. You still own the final document.",
  },
  {
    num: "05",
    title: "Inbox triage and draft replies",
    who: "Any owner spending an hour or more per day on routine email",
    what: "An AI assistant reads your inbox, surfaces the emails that need your attention, and drafts replies to the ones it can handle — appointment confirmations, \"what are your hours,\" \"do you service [area].\" You approve and send, or edit and send. The AI drafts; you decide.",
    honest:
      "This one has more variability than the others. It works well for businesses with predictable, repeat-pattern emails. It works less well if every email is unique or sensitive. Start with a narrow category — just appointment-related emails, for example — before broadening.",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", url: "https://copperbaytech.com" },
          { name: "Blog", url: "https://copperbaytech.com/blog" },
          { name: "AI Automations for Small Business" },
        ])}
      />
      <Nav />
      <main>
        <ArticleHeader
          tag="AI &amp; Automation"
          title="5 AI Automations That Actually Save Sonoma County Small Businesses Time"
          date="June 10, 2026"
          readTime="7 min read"
        />

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-lg text-[#3F3F46]/70 leading-relaxed mb-8">
                There&apos;s a lot of noise about AI right now, and most of it isn&apos;t aimed at a plumber in Rohnert Park or a salon in Petaluma. This post is. These are five specific automations that a local service business can actually implement, what they cost in setup time, and what you should realistically expect from each. No fabricated statistics, no vague promises about &ldquo;10x productivity.&rdquo;
              </p>

              <div className="space-y-8 mb-10">
                {automations.map((a) => (
                  <div key={a.num} className="rounded-xl border border-[#18181B]/10 p-6 bg-[#FAFAF9]">
                    <div className="flex items-start gap-4 mb-3">
                      <span
                        className="text-3xl font-bold text-[#18181B]/10 leading-none select-none"
                        style={{ fontFamily: "var(--font-heading)" }}
                        aria-hidden="true"
                      >
                        {a.num}
                      </span>
                      <h2
                        className="text-lg font-bold text-[#18181B] mt-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {a.title}
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-[#3F3F46]/50 uppercase tracking-widest mb-3">
                      Good fit: {a.who}
                    </p>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed mb-3">{a.what}</p>
                    <div className="border-t border-[#18181B]/8 pt-3">
                      <p className="text-xs font-semibold text-[#18181B]/50 uppercase tracking-widest mb-1">
                        Honest take
                      </p>
                      <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{a.honest}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2
                className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What to skip (for now)
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                A few categories that get heavily marketed to small businesses but are worth being cautious about:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Fully automated social media posting — AI content on autopilot tends to feel generic, and your local customers notice. Better to post less and sound like yourself.",
                  "AI tools that give prices or make commitments without a human check — if the AI quotes a job wrong, you own the error. Keep anything involving money in human hands.",
                  "Any tool where you can't clearly see where your customer data is stored and who can access it. Read the privacy terms before connecting a customer list.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18181B]/30 flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2
                className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How to decide where to start
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                The best starting point is the one that addresses your most obvious leak. For most service businesses, that&apos;s one of two things: missed calls or slow lead response. Both are fixable with straightforward tools, both show results quickly, and neither requires replacing your existing workflow — they layer on top of it.
              </p>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                The trap to avoid is trying to implement everything at once. Add one automation, watch it for a few weeks, confirm it&apos;s working, then add the next. Each piece should clearly earn its keep before you build on it.
              </p>

              <div className="bg-[#18181B] rounded-xl p-6 text-center">
                <p
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Want to know which of these fits your business?
                </p>
                <p className="text-white/60 text-sm mb-5" style={{ fontFamily: "var(--font-body)" }}>
                  Free 30-minute call — we&apos;ll look at where your time actually goes and tell you honestly which automation would have the most impact first.
                </p>
                <Link
                  href="/ai-integration-small-business"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Explore AI Integration <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
