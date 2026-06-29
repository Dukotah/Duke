import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const URL = "https://copperbaytech.com/blog/how-to-choose-a-web-designer";

export const metadata: Metadata = {
  title: "How to Choose a Web Designer | Copper Bay Tech",
  description: "A plain-spoken buyer's guide to choosing a web designer. The 9 questions that separate a real web partner from a cheap one, plus the red flags to avoid.",
  alternates: { canonical: URL },
  openGraph: {
    title: "How to Choose a Web Designer | Copper Bay Tech",
    description: "A plain-spoken buyer's guide to choosing a web designer. The 9 questions that separate a real web partner from a cheap one, plus the red flags to avoid.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How to Choose a Web Designer: 9 Questions to Ask Before You Hire", description: "A plain-spoken buyer's guide to choosing a web designer. The 9 questions that separate a real web partner from a cheap one, plus the red flags to avoid.", url: URL, datePublished: "2026-06-27" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Choosing a Web Designer" }])} />
      <JsonLd schema={faqSchema([{ q: "How much should a small business website cost?", a: "A straightforward professional small-business site commonly runs in the low thousands of dollars, with custom-functionality builds running higher. Ongoing care or support plans are typically a modest monthly amount. Be cautious of quotes that are only a few hundred dollars, which usually means a template with no support, and of five-figure quotes for simple brochure sites, which usually fund agency overhead. Always get a written scope so you know exactly what is included." }, { q: "Is it better to hire a freelancer or a web design company?", a: "It depends on how much accountability and ongoing support you want. A solo freelancer can be cheaper but may vanish when life gets busy. A large agency offers depth but often hands your project to junior contractors. An independent owner-led shop aims for the best of both: one accountable person who writes real code and stays reachable after launch. Whichever you choose, insist on a single named point of contact." }, { q: "What questions should I ask a web designer before hiring?", a: "Ask who will actually do the work, whether the site is custom-coded or a template, who owns the domain and code when it is finished, whether you can see live work and references, how the site will be found and how fast it loads, whether you can update it yourself, what the total and monthly price include, what support looks like after launch, and whether they understand your business goals, not just design." }, { q: "Should my website be custom-coded or built on a template like Squarespace?", a: "Templates are fine if your needs are simple and your budget is small, but they tend to load slower, lock you into monthly platform fees, and limit what your site can do. Custom-coded sites load faster, do exactly what your business needs, and do not depend on a third-party platform. The right choice depends on your goals, so ask any candidate to explain their approach in plain English." }, { q: "Who should own my website and domain name?", a: "You should. Your domain, content, code, and hosting accounts all belong to you, and that should be confirmed in writing before any money changes hands. If a designer registers your domain under their own account or builds on a platform you can never leave, you lose control of your own business asset. Hesitation on this question is a serious red flag." }])} />
      <Nav />
      <main>
        <ArticleHeader tag={"Web Development"} title={"How to Choose a Web Designer: 9 Questions to Ask Before You Hire"} date="June 27, 2026" readTime={"9 min read"} />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">To choose the right web designer, hire the person who can clearly answer four things: who owns the project, who owns the finished website, how it is built, and what happens after launch. The best partner is not the cheapest bid or the flashiest portfolio. It is the one who asks about your business before they talk about design, gives you a written scope and price, builds something you can actually update, and replies when you need them. Below are the nine questions that quickly separate a real web partner from a cheap one, plus the red flags worth walking away from.</p>

              <div className="rounded-xl border border-hairline bg-ink-1 p-6 mb-10">
                <p className="text-sm font-semibold text-copper uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-heading)" }}>Key takeaways</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-300">
                  <li>The right web designer answers ownership, build method, and support clearly in writing, and that matters more than the cheapest bid or flashiest portfolio.</li>
                  <li>Insist on one accountable person who does the actual work and replies fast after launch.</li>
                  <li>You must own your domain, code, and content, full stop, and get it confirmed before paying.</li>
                  <li>Custom-coded sites load faster and avoid platform lock-in; templates are fine only for simple needs and tiny budgets.</li>
                  <li>Compare written proposals on owner, ownership, build method, inclusions, monthly cost, and response time, with price as the tiebreaker.</li>
                </ul>
              </div>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What kind of web designer do you actually need?</h2>
              <p className="mb-6">Before you compare anyone, get clear on what you are buying, because &apos;web designer&apos; covers wildly different things. A freelancer on a marketplace, a template site builder, a large agency, and an independent custom developer all use the title, and they are not interchangeable.</p>
              <p className="mb-6">Most small and medium businesses fall into one of three buckets. Knowing yours saves weeks of mismatched conversations.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Brochure site</strong> A handful of pages that explain who you are and turn visitors into calls or emails. Almost anyone can build this, so the real differentiator is reliability and how easy it is to update later.</li>
                <li><strong>Lead-generation site</strong> A site engineered to rank, load fast, and convert, with clear calls to action and tracking. This needs someone who understands marketing and performance, not just looks.</li>
                <li><strong>Custom functionality</strong> Booking, customer portals, payments, dashboards, or anything that does real work for your business. This is software, and you want a developer who writes code, not a page-builder operator.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 1: Who will I actually be working with?</h2>
              <p className="mb-6">Ask point-blank who does the work and who you call when something breaks. At many agencies you sell to a polished account manager, then your project is handed to a rotating cast of junior contractors you never meet. Insist on one accountable owner from the first call to launch, no matter who you hire. At Copper Bay Tech, that is the model on every project.</p>
              <p className="mb-6">The answer you want is a specific human name, not a department. One accountable owner means nothing falls through the cracks and you are never re-explaining your business to a stranger.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 2: Will the site be custom-coded or built on a template?</h2>
              <p className="mb-6">This single question filters out a huge share of low-value offers. A great deal of cheap web design is a recycled template with your logo dropped in, built on a page builder that runs slow, bloats with plugins, and locks you into a monthly platform fee forever.</p>
              <p className="mb-6">There is nothing wrong with a template if your needs are simple and your budget is tiny, just know that is what you are paying for. We custom-code every site, with no templates and no page builders, so it loads faster, does exactly what your business needs, and is not held hostage by a third-party platform. Ask any candidate to explain, in plain English, how they build and why.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 3: Who owns the website when it is done?</h2>
              <p className="mb-6">You should own your domain, your content, your code, and your hosting accounts, full stop. Some designers register your domain under their own account, build on a proprietary platform you can never leave, or hold the files until you keep paying. That is a trap.</p>
              <p className="mb-6">Get the ownership answer in writing before any money changes hands. A trustworthy partner will happily confirm that everything is yours and that you can take it elsewhere if the relationship ever ends. If someone hesitates here, walk away.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 4: Can I see real work and talk to real clients?</h2>
              <p className="mb-6">Look past the pretty screenshots. Ask to see live sites you can click through today, ideally for businesses similar in size to yours, and ask for a reference or two you can actually call.</p>
              <p className="mb-6">While you are at it, run their portfolio sites through a free speed and mobile test like Google PageSpeed Insights. A designer who builds slow, clunky sites for other clients will build a slow, clunky site for you. Fast, clean, working examples tell you far more than an awards page.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 5: How will the site be found, and how fast will it load?</h2>
              <p className="mb-6">A beautiful site nobody can find is an expensive business card. Ask how they handle the technical foundations of getting found: clean code, fast load times, mobile responsiveness, proper page structure, and basic on-page SEO.</p>
              <p className="mb-6">There is also a newer wrinkle worth raising. AI answer engines and chat assistants now send real traffic, and they tend to cite pages that are fast, well-structured, and clearly written. You do not need a designer who promises to game any algorithm, but you do want one who builds on solid technical ground so search engines and AI tools can read your site easily.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 6: Will I be able to update it myself?</h2>
              <p className="mb-6">Decide upfront how hands-on you want to be, then make sure the build matches. Some owners want to change their own hours, prices, and photos. Others never want to touch it and would rather send an email and have it handled.</p>
              <p className="mb-6">Both are fine, but the wrong setup is miserable. Ask whether you will get a simple way to make everyday edits, and what small changes cost if you would rather they do it. The goal is a site you are not afraid of and not locked out of.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 7: What is the real, total price, and what does it include?</h2>
              <p className="mb-6">Get a written scope and a clear price, not a vague hourly hand-wave. The cheap-versus-good gap usually hides in what is left out: copywriting, stock or custom photos, contact forms, revisions, training, and especially what you pay every month after launch.</p>
              <p className="mb-6">For context, a straightforward professional small-business site commonly runs in the low thousands, custom-functionality builds run higher, and ongoing care plans are typically a modest monthly amount. Be suspicious of both extremes. A few hundred dollars usually means a template with no support; a five-figure quote for a five-page brochure site usually means agency overhead you are funding. Ask exactly what is and is not included so you can compare apples to apples.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Always ask</strong> Is copywriting included, or am I writing everything myself?</li>
                <li><strong>Always ask</strong> How many rounds of revisions before changes cost extra?</li>
                <li><strong>Always ask</strong> What is the monthly cost after launch, and what does it cover?</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 8: What happens after launch?</h2>
              <p className="mb-6">Launch day is the start, not the finish. Websites need updates, security patches, backups, and the occasional fix when something on the internet changes. Ask what ongoing support looks like and how fast they respond when you reach out.</p>
              <p className="mb-6">A real answer includes who to contact, how quickly they reply, and what is covered. We reply within one business day, the kind of concrete commitment you should expect in writing. A designer who disappears after the invoice clears leaves you stranded the first time something breaks.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Question 9: Do they understand my business, or just web design?</h2>
              <p className="mb-6">The best web partners ask about your customers, your goals, and how you actually make money before they say a word about colors or layout. A website is a tool to win business, and someone who only talks aesthetics is solving the wrong problem.</p>
              <p className="mb-6">If a candidate spends your first conversation asking smart questions about your business, that is the strongest signal of all. It means the finished site will be built to do a job, not just to look nice in their portfolio.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Red flags worth walking away from</h2>
              <p className="mb-6">A few warning signs reliably predict regret. Spotting them early saves you money and a painful do-over.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>Prices that sound too good to be true, with no written scope behind them.</li>
                <li>Refusal to put ownership of your domain, code, and content in writing.</li>
                <li>No live examples or references, only mockups and stock imagery.</li>
                <li>You can never reach the person doing the actual work.</li>
                <li>Pressure to sign today, or a long lock-in contract you cannot exit.</li>
                <li>Everything is built on a proprietary platform you can never take with you.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>A simple way to make the final call</h2>
              <p className="mb-6">Get two or three written proposals, then compare them on the same terms: owner, ownership, build method, what is included, monthly cost, and support response time. Price matters, but it should be the last tiebreaker, not the first filter.</p>
              <p className="mb-6">The right web designer feels like a partner who happens to know code, not a vendor selling you a product. If someone answers these nine questions clearly, shows real work, puts it in writing, and treats your business like it matters, you have found your person.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Frequently asked questions</h2>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How much should a small business website cost?</h3>
              <p className="mb-6">A straightforward professional small-business site commonly runs in the low thousands of dollars, with custom-functionality builds running higher. Ongoing care or support plans are typically a modest monthly amount. Be cautious of quotes that are only a few hundred dollars, which usually means a template with no support, and of five-figure quotes for simple brochure sites, which usually fund agency overhead. Always get a written scope so you know exactly what is included.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Is it better to hire a freelancer or a web design company?</h3>
              <p className="mb-6">It depends on how much accountability and ongoing support you want. A solo freelancer can be cheaper but may vanish when life gets busy. A large agency offers depth but often hands your project to junior contractors. An independent owner-led shop aims for the best of both: one accountable person who writes real code and stays reachable after launch. Whichever you choose, insist on a single named point of contact.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>What questions should I ask a web designer before hiring?</h3>
              <p className="mb-6">Ask who will actually do the work, whether the site is custom-coded or a template, who owns the domain and code when it is finished, whether you can see live work and references, how the site will be found and how fast it loads, whether you can update it yourself, what the total and monthly price include, what support looks like after launch, and whether they understand your business goals, not just design.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Should my website be custom-coded or built on a template like Squarespace?</h3>
              <p className="mb-6">Templates are fine if your needs are simple and your budget is small, but they tend to load slower, lock you into monthly platform fees, and limit what your site can do. Custom-coded sites load faster, do exactly what your business needs, and do not depend on a third-party platform. The right choice depends on your goals, so ask any candidate to explain their approach in plain English.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Who should own my website and domain name?</h3>
              <p className="mb-6">You should. Your domain, content, code, and hosting accounts all belong to you, and that should be confirmed in writing before any money changes hands. If a designer registers your domain under their own account or builds on a platform you can never leave, you lose control of your own business asset. Hesitation on this question is a serious red flag.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Related reading</h2>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><Link href="/blog/squarespace-vs-custom-website-for-small-business" className="text-copper hover:text-copper-bright underline">compare Squarespace versus a custom website</Link></li>
                <li><Link href="/blog/how-much-does-a-website-cost-for-a-small-business" className="text-copper hover:text-copper-bright underline">see what a small business website actually costs</Link></li>
                <li><Link href="/web-design-sonoma-county" className="text-copper hover:text-copper-bright underline">how we approach web design</Link></li>
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
