import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const URL = "https://copperbaytech.com/blog/do-i-still-need-a-website-in-2026";

export const metadata: Metadata = {
  title: "Do You Still Need a Website in 2026? | Copper Bay Tech",
  description: "Yes, you still need a website in 2026 even with Facebook and a Google Business Profile. Here's why social and a Google listing aren't enough on their own.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Do You Still Need a Website in 2026? | Copper Bay Tech",
    description: "Yes, you still need a website in 2026 even with Facebook and a Google Business Profile. Here's why social and a Google listing aren't enough on their own.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Do You Still Need a Website in 2026 if You Have Social Media and a Google Profile?", description: "Yes, you still need a website in 2026 even with Facebook and a Google Business Profile. Here's why social and a Google listing aren't enough on their own.", url: URL, datePublished: "2026-06-27" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Do You Still Need a Website in 2026?" }])} />
      <JsonLd schema={faqSchema([{ q: "Can I just use a Google Business Profile instead of a website?", a: "A Google Business Profile is great for local discovery and reviews, but it is a fixed listing you do not control, and it cannot rank for the specific services people search, show your full offering, or close the sale. Most listings exist to point people to a website to learn more, so a profile works best alongside a real site, not in place of one." }, { q: "Is a Facebook or Instagram page enough to replace a website?", a: "No. Social pages are rented space governed by an algorithm that throttles your reach to sell ads, and they are hard for search engines and AI assistants to cite. They are excellent for staying in front of people who already know you, but they cannot rank in search or convert strangers the way a website built for that job can." }, { q: "How much does a small business website cost in 2026?", a: "It depends on scope. A simple, professional brochure site costs far less than a custom web app with booking or e-commerce, and the price scales with the pages, features, and integrations you need. We publish honest pricing ranges so you can plan before you commit." }, { q: "Will a website still matter if everyone uses AI to search?", a: "Yes, and it matters more. AI answer engines pull their recommendations from clear, structured, crawlable web pages. A focused website gives those tools clean content to quote, while a locked social feed gives them almost nothing, so a good site is how you stay in the AI's answers." }])} />
      <Nav />
      <main>
        <ArticleHeader tag={"Business Strategy"} title={"Do You Still Need a Website in 2026 if You Have Social Media and a Google Profile?"} date="June 27, 2026" readTime={"8 min read"} />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">Yes, you still need a website in 2026, even with a busy Facebook page and a strong Google Business Profile. Those channels are great for getting found and collecting reviews, but they are rented space you do not control, and they do a different job than your own website. Social media and Google handle discovery; your website is the one place online that you own outright, that ranks for the specific things people search, and that an AI assistant can actually read and quote, which is where discovery turns into a paying customer.</p>

              <div className="rounded-xl border border-hairline bg-ink-1 p-6 mb-10">
                <p className="text-sm font-semibold text-copper uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-heading)" }}>Key takeaways</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-300">
                  <li>Yes, you still need a website in 2026; social media and a Google Profile handle discovery, not conversion.</li>
                  <li>Social and Google are rented space you do not control and cannot rank for the services people search.</li>
                  <li>A website is the only asset you own outright, and the one AI assistants can read and recommend.</li>
                  <li>Word-of-mouth referrals still check your site before they buy; a thin social page cools the lead.</li>
                  <li>The winning setup is a custom website hub with a Google Business Profile and social channels pointing to it.</li>
                </ul>
              </div>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What is the real difference between a website, social media, and a Google Business Profile?</h2>
              <p className="mb-6">These three get lumped together as your online presence, but they do very different jobs. Treating one as a substitute for the others is where most small businesses leave money on the table.</p>
              <p className="mb-6">Think of it as a chain. Each link has one job, and your website is the link that closes the loop.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Google Business Profile</strong> is your map and reputation listing. It is excellent for local discovery, hours, directions, photos, and reviews, but it is a fixed format you cannot customize, and it exists to point people somewhere else to learn more.</li>
                <li><strong>Social media</strong> is your relationship and reminder channel. It keeps you in front of people who already know you, but it is built to keep users scrolling on the platform, not to send them to you.</li>
                <li><strong>Your website</strong> is your storefront, salesperson, and proof file in one place. It is the destination the other two channels send people to, and the only one you own and control completely.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Where do social media and a Google Profile fall short?</h2>
              <p className="mb-6">Both are genuinely useful, and we tell most clients to keep them. The problem starts when you rely on them as your entire web presence.</p>
              <p className="mb-6">Here is what they cannot do, no matter how many followers or five-star reviews you collect.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>You do not own the audience.</strong> Algorithms change, accounts get suspended by mistake, and reach gets throttled to push paid ads. A page with thousands of followers may reach only a fraction of them on a given post, and you have no recourse.</li>
                <li><strong>They cannot rank for what people actually search.</strong> A Facebook page rarely shows up for &apos;emergency plumber in Petaluma&apos; or &apos;commercial HVAC maintenance contract.&apos; A website built around those terms can, and that traffic is yours to keep.</li>
                <li><strong>They flatten your business into a template.</strong> Every Google Profile and Facebook page looks the same. You cannot tell your story, lay out your full service menu, explain pricing, or guide a visitor toward booking the way a custom page can.</li>
                <li><strong>They are hard for AI assistants to cite.</strong> When someone asks ChatGPT or Google&apos;s AI for a recommendation, those tools pull from clear, crawlable web pages far more readily than from a social feed locked behind a login.</li>
                <li><strong>They make you look smaller than you are.</strong> Plenty of buyers still check for a real website before trusting you with a serious project. No site, or only a social page, quietly signals &apos;side hustle&apos; even when you run a serious operation.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What does a real website do that the others cannot?</h2>
              <p className="mb-6">A website is the only asset on this list that works for you around the clock, answers questions before a prospect ever calls, and turns a curious visitor into a booked job. It is the hub; everything else is a spoke pointing back to it.</p>
              <p className="mb-6">Built properly, it quietly does the work of a full-time salesperson.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>It captures leads on your terms.</strong> Contact forms, quote requests, online booking, and click-to-call buttons route inquiries straight to you instead of into a platform inbox you might miss.</li>
                <li><strong>It ranks in Google search.</strong> Well-structured pages and helpful content earn visibility for the exact problems your customers type in, not just for your business name.</li>
                <li><strong>It answers the buying questions.</strong> Services, pricing ranges, your process, real project examples, and proof of expertise all live in one place a prospect can read at 11 p.m. without talking to anyone.</li>
                <li><strong>It builds trust fast.</strong> A clean, fast, professional site tells visitors you are legitimate and that you sweat the details.</li>
                <li><strong>It feeds the new search engines.</strong> AI answer engines increasingly decide who gets recommended, and a clear, well-organized site is what they read and quote.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Is a website worth it if I get most of my work from word of mouth?</h2>
              <p className="mb-6">It is, maybe more so. Word of mouth does not end when someone hears your name; it ends after they look you up. In our experience, the first thing a referred customer does is search your business, and if all they find is a thin social page, the referral cools off fast.</p>
              <p className="mb-6">A website is where you convert the trust someone else built for you. A friend says you do great work, the prospect Googles you, lands on a site that confirms it with real examples and clear next steps, and books. Without that page, you are leaning on the prospect to chase you down, and many will not.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>How do AI assistants change the math in 2026?</h2>
              <p className="mb-6">More people now start with an AI assistant instead of a page of blue links. They ask a question in plain language and get a direct answer, often with a recommendation or two attached. That shift makes a clear, well-structured website more valuable, not less.</p>
              <p className="mb-6">These tools favor content they can read and lift a clean sentence from: direct answers, plain headings, real specifics. A locked social feed gives them almost nothing to work with; a focused website gives them everything. It is one reason we build every site as custom code rather than a heavy page builder, so the content stays fast, clean, and easy for both people and machines to parse.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What is the right setup for a small business in 2026?</h2>
              <p className="mb-6">You do not have to choose between a website, social media, and Google. The winning move is to run all three, with the website as the hub they point to.</p>
              <p className="mb-6">A practical, low-maintenance setup looks like this.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>A custom website as the hub.</strong> Fast, mobile-first, built around the services and locations you actually want to win, with clear ways to contact or book you.</li>
                <li><strong>A fully filled-out Google Business Profile.</strong> Accurate hours, categories, and photos, a steady habit of asking happy customers for reviews, and a link back to your site.</li>
                <li><strong>One or two social channels you can keep up with.</strong> Pick the platforms your customers actually use, post consistently, and treat every profile as a funnel back to the website.</li>
                <li><strong>One owner accountable for it all.</strong> Someone who keeps the pieces connected and the information consistent, so a customer gets the same answer whether they find you on a map, a feed, or a search result.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Frequently asked questions</h2>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Can I just use a Google Business Profile instead of a website?</h3>
              <p className="mb-6">A Google Business Profile is great for local discovery and reviews, but it is a fixed listing you do not control, and it cannot rank for the specific services people search, show your full offering, or close the sale. Most listings exist to point people to a website to learn more, so a profile works best alongside a real site, not in place of one.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Is a Facebook or Instagram page enough to replace a website?</h3>
              <p className="mb-6">No. Social pages are rented space governed by an algorithm that throttles your reach to sell ads, and they are hard for search engines and AI assistants to cite. They are excellent for staying in front of people who already know you, but they cannot rank in search or convert strangers the way a website built for that job can.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How much does a small business website cost in 2026?</h3>
              <p className="mb-6">It depends on scope. A simple, professional brochure site costs far less than a custom web app with booking or e-commerce, and the price scales with the pages, features, and integrations you need. We publish honest pricing ranges so you can plan before you commit.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Will a website still matter if everyone uses AI to search?</h3>
              <p className="mb-6">Yes, and it matters more. AI answer engines pull their recommendations from clear, structured, crawlable web pages. A focused website gives those tools clean content to quote, while a locked social feed gives them almost nothing, so a good site is how you stay in the AI&apos;s answers.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Related reading</h2>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><Link href="/blog/how-much-does-a-website-cost-for-a-small-business" className="text-copper hover:text-copper-bright underline">what a custom small business website actually costs</Link></li>
                <li><Link href="/web-design-sonoma-county" className="text-copper hover:text-copper-bright underline">our approach to custom web design</Link></li>
                <li><Link href="/ai-integration-small-business" className="text-copper hover:text-copper-bright underline">how AI integration helps small businesses</Link></li>
                <li><Link href="/schedule" className="text-copper hover:text-copper-bright underline">book a free call</Link></li>
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
