import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const URL = "https://copperbaytech.com/blog/redesign-vs-rebuild-your-website";

export const metadata: Metadata = {
  title: "Website Redesign vs. Rebuild | Copper Bay Tech",
  description: "Redesign or rebuild your website? A redesign reskins what works; a rebuild replaces the foundation. Here is how to tell which your site actually needs.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Website Redesign vs. Rebuild | Copper Bay Tech",
    description: "Redesign or rebuild your website? A redesign reskins what works; a rebuild replaces the foundation. Here is how to tell which your site actually needs.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Website Redesign vs. Rebuild: Which Does Your Site Need?", description: "Redesign or rebuild your website? A redesign reskins what works; a rebuild replaces the foundation. Here is how to tell which your site actually needs.", url: URL, datePublished: "2026-06-27" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Redesign vs. Rebuild" }])} />
      <JsonLd schema={faqSchema([{ q: "Is a redesign cheaper than a rebuild?", a: "Almost always, because a redesign reuses the existing engineering and only changes the look and content, while a rebuild replaces the underlying code and platform too. A redesign is the economical choice when the foundation is sound. The costly mistake is redesigning a site that actually needs a rebuild, because the underlying problems come back and you end up paying twice." }, { q: "How do I know if my website's foundation is still good?", a: "Check four things: does it load fast, is the platform current and still getting security updates, can your team make edits without something breaking, and does it work cleanly on phones. If those are healthy and the site just looks dated, you need a redesign. If one or more is failing, you are likely looking at a rebuild." }, { q: "Can a redesign improve my Google rankings, or do I need a rebuild?", a: "A redesign can help with on-page content and clearer structure. But if rankings are suffering because of slow load times, broken code, or poor mobile performance, those are foundation issues a reskin cannot fix, and a rebuild is the real remedy. Speed and technical health tend to move search results more than visuals do." }, { q: "Will I lose my content or SEO if I rebuild?", a: "Not if it is done carefully. A good rebuild migrates your existing content and preserves your page URLs, or sets up proper redirects, so your search rankings carry over. Losing traffic after a rebuild is usually a sign the redirects and migration were handled poorly, not an unavoidable cost of rebuilding." }, { q: "How long does each one take?", a: "A focused redesign of a small-business site often takes a few weeks, since the engineering already exists. A full rebuild typically runs several weeks to a few months, longer if it includes custom features like online booking, customer accounts, or integrations with your other tools." }])} />
      <Nav />
      <main>
        <ArticleHeader tag={"Web Development"} title={"Website Redesign vs. Rebuild: Which Does Your Site Need?"} date="June 27, 2026" readTime={"7 min read"} />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">A redesign changes how your website looks; a rebuild changes how it works underneath. If your site loads fast, runs on solid software, and simply looks dated or off-brand, a redesign (reskin) is usually enough. If it is slow, hard to update, breaks when you touch it, or sits on a platform you have outgrown, you need a rebuild from the ground up. The fastest way to decide is to look past the visuals and ask one thing: is the foundation sound? Cosmetic problems call for a redesign. Structural problems call for a rebuild. Below are the exact signals for each, what they cost in time and money, and the questions that tell them apart.</p>

              <div className="rounded-xl border border-hairline bg-ink-1 p-6 mb-10">
                <p className="text-sm font-semibold text-copper uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-heading)" }}>Key takeaways</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-300">
                  <li>A redesign reskins the surface and keeps the existing foundation; a rebuild replaces the underlying code and platform.</li>
                  <li>Choose a redesign when the problem is how the site looks; choose a rebuild when the problem is how it works.</li>
                  <li>Three quick checks decide it: is the problem looks or function, can you safely edit it today, and will it support the business in two years.</li>
                  <li>Redesigning a site that needs a rebuild is the expensive mistake; you pay twice when the underlying problems return.</li>
                  <li>A custom-coded site is easier and cheaper to redesign later because there is no tangle of template and plugin code to fight.</li>
                </ul>
              </div>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Redesign vs. rebuild: what is the actual difference?</h2>
              <p className="mb-6">A redesign keeps your site&apos;s existing code and structure and changes the surface: layout, colors, typography, imagery, and content. Think of it as renovating the inside of a house with a good frame and foundation. The plumbing and wiring stay; the rooms look new.</p>
              <p className="mb-6">A rebuild replaces the foundation itself. New code, new structure, often a new platform or content management system, with the design built fresh on top. This is the choice when the framing is rotten, the wiring is unsafe, or the layout simply cannot support how you operate now.</p>
              <p className="mb-6">Most owners judge the building by its paint, and that is the trap. A site can look beautiful and still be a maintenance nightmare underneath, or look dated while running on perfectly healthy code. The right call depends on the foundation, not the finish.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>When a redesign (reskin) is enough</h2>
              <p className="mb-6">A redesign is the right move when the bones are good and the problem is mostly how the site looks or reads. In our experience, these signals point to a reskin rather than a teardown:</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>It looks dated, not broken</strong> The design feels stuck a few years back, but pages load quickly and nothing is actually malfunctioning.</li>
                <li><strong>Your brand has evolved</strong> New logo, new colors, a sharper message, or a new audience: the site just needs to catch up to who you are now.</li>
                <li><strong>The content is stale, not the code</strong> Outdated copy, old photos, services you no longer offer, all fixable by rewriting and re-shooting rather than re-engineering.</li>
                <li><strong>It works on your phone but feels clunky</strong> Mobile basically functions; it needs tighter layout and spacing, not a new responsive framework.</li>
                <li><strong>You can still update it without fear</strong> Your team can change text and images without something else breaking. The platform is healthy, just unfashionable.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>When you need a full rebuild</h2>
              <p className="mb-6">A rebuild is warranted when the problems live in the foundation, where no amount of new paint will help. These are the signs the structure itself has to be replaced:</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>It is slow no matter what you do</strong> Pages crawl, images never load right, and speed fixes only buy a few seconds. The underlying code is the bottleneck.</li>
                <li><strong>Editing anything feels dangerous</strong> Changing one thing breaks another, or every small edit means calling a developer because the build is fragile.</li>
                <li><strong>You have outgrown the platform</strong> A template or page builder that fit a one-page brochure cannot support the booking, accounts, integrations, or scale you need now.</li>
                <li><strong>It is not secure or no longer supported</strong> Out-of-date software, abandoned plugins, or a platform that no longer gets security updates is a real liability, not a cosmetic one.</li>
                <li><strong>Search engines can barely read it</strong> Broken structure, messy code, and poor mobile performance drag rankings down in ways a reskin cannot repair.</li>
                <li><strong>You do not own or control it</strong> You are locked into a proprietary system, cannot move your content, or cannot get into the code when you need to.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Three questions that settle the decision</h2>
              <p className="mb-6">When the answer is not obvious, these three questions cut through it fast.</p>
              <p className="mb-6">First: is the problem how it looks, or how it works? Looks point to a redesign. How it works, meaning speed, editing, security, and capability, points to a rebuild. If both are broken, the foundation wins and you rebuild.</p>
              <p className="mb-6">Second: can you safely make changes today? If your team can update content without fear and the platform is healthy and supported, you likely just need a reskin. If every edit is a gamble or requires a specialist, the foundation is failing.</p>
              <p className="mb-6">Third: will this site support where the business is going in two years? If the platform can grow with you, redesign and move on. If you already know you will need features it fundamentally cannot handle, such as online booking, customer accounts, internal tools, or integrations, paying for a redesign now means paying for a rebuild again soon.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What each option costs in time and money</h2>
              <p className="mb-6">A redesign is the lighter lift because the engineering already exists. For a typical small-business site, a focused reskin often lands in the lower-thousands to low-five-figure range and a few weeks of work, depending on page count and how much new content and photography you need. You are paying for design and content, not re-engineering.</p>
              <p className="mb-6">A rebuild costs more and takes longer because you are rebuilding the foundation and the finish together. For a custom-coded small-business site, expect a wider range and a timeline measured in weeks to a few months, longer if it includes custom features like booking, accounts, or integrations with the other tools you run.</p>
              <p className="mb-6">The expensive mistake is redesigning a site that needs a rebuild. You spend real money making a failing foundation look nice, then spend it again within a year or two when the underlying problems resurface. When the structure is sound, a redesign is the smart, economical choice. When it is not, a rebuild is cheaper than two redesigns.</p>
              <p className="mb-6">One factor tilts the math: how your site is built. A custom-coded site, with no bloated templates or page-builder plugins stacked on top, is faster, more secure, and far easier to redesign later because there is no tangle of third-party code to fight. That is a large part of why we build every site custom: today&apos;s redesign should not lock you into tomorrow&apos;s rebuild.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>How to move forward without overspending</h2>
              <p className="mb-6">Start with an honest audit, not a wishlist. Measure load speed, check whether the platform is current and supported, test how easily your team can make edits, and confirm the site works cleanly on phones. Those four checks usually reveal whether you are looking at a cosmetic problem or a structural one.</p>
              <p className="mb-6">Then match the fix to the problem. Do not rebuild a healthy site because a competitor&apos;s looks shinier; a redesign gets you there for far less. And do not keep redesigning a site that fights you at every turn; that is money poured into a foundation that will not hold.</p>
              <p className="mb-6">If you are genuinely unsure, that uncertainty is worth a conversation with someone who will look under the hood and tell you straight, even when the honest answer is the cheaper one. The goal is not the biggest project. It is the right-sized one you will not have to redo.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Frequently asked questions</h2>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Is a redesign cheaper than a rebuild?</h3>
              <p className="mb-6">Almost always, because a redesign reuses the existing engineering and only changes the look and content, while a rebuild replaces the underlying code and platform too. A redesign is the economical choice when the foundation is sound. The costly mistake is redesigning a site that actually needs a rebuild, because the underlying problems come back and you end up paying twice.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How do I know if my website&apos;s foundation is still good?</h3>
              <p className="mb-6">Check four things: does it load fast, is the platform current and still getting security updates, can your team make edits without something breaking, and does it work cleanly on phones. If those are healthy and the site just looks dated, you need a redesign. If one or more is failing, you are likely looking at a rebuild.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Can a redesign improve my Google rankings, or do I need a rebuild?</h3>
              <p className="mb-6">A redesign can help with on-page content and clearer structure. But if rankings are suffering because of slow load times, broken code, or poor mobile performance, those are foundation issues a reskin cannot fix, and a rebuild is the real remedy. Speed and technical health tend to move search results more than visuals do.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Will I lose my content or SEO if I rebuild?</h3>
              <p className="mb-6">Not if it is done carefully. A good rebuild migrates your existing content and preserves your page URLs, or sets up proper redirects, so your search rankings carry over. Losing traffic after a rebuild is usually a sign the redirects and migration were handled poorly, not an unavoidable cost of rebuilding.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How long does each one take?</h3>
              <p className="mb-6">A focused redesign of a small-business site often takes a few weeks, since the engineering already exists. A full rebuild typically runs several weeks to a few months, longer if it includes custom features like online booking, customer accounts, or integrations with your other tools.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Related reading</h2>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><Link href="/web-development" className="text-copper hover:text-copper-bright underline">custom web development</Link></li>
                <li><Link href="/web-design-sonoma-county" className="text-copper hover:text-copper-bright underline">web design in Sonoma County</Link></li>
                <li><Link href="/blog/how-much-does-a-website-cost-for-a-small-business" className="text-copper hover:text-copper-bright underline">how much a small-business website costs</Link></li>
                <li><Link href="/pricing" className="text-copper hover:text-copper-bright underline">see our pricing</Link></li>
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
