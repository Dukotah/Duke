import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import ArticleHeader from "@/components/ArticleHeader";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How Much Should a Small Business Website Cost? (Honest Answer) | Copper Bay Tech",
  description: "Website pricing ranges wildly — from $500 DIY to $50,000 agency builds. Here's what actually drives the cost and what Sonoma County small businesses should realistically expect to pay.",
  alternates: {
    canonical: "https://copperbaytech.com/blog/how-much-does-a-website-cost-sonoma-county",
  },
  openGraph: {
    title: "How Much Should a Small Business Website Cost? (Honest Answer) | Copper Bay Tech",
    description: "Website pricing ranges wildly — from $500 DIY to $50,000 agency builds. Here's what actually drives the cost and what Sonoma County small businesses should realistically expect to pay.",
    url: "https://copperbaytech.com/blog/how-much-should-a-small-business-website-cost",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function WebsiteCostPost() {
  return (
    <div className="min-h-screen bg-ink-0">
      <JsonLd schema={blogPostingSchema({ title: "How Much Should a Small Business Website Cost? (Honest Answer)", description: "Website pricing ranges wildly — from $500 DIY to $50,000 agency builds. Here's what actually drives the cost and what Sonoma County small businesses should realistically expect to pay.", url: "https://copperbaytech.com/blog/how-much-should-a-small-business-website-cost", datePublished: "2026-04-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Small Business Website Cost" }])} />
      <Nav light />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <ArticleHeader tag="Web Development" title="How Much Should a Small Business Website Cost? (Honest Answer)" date="April 1, 2026" readTime="5 min read" />

          <div className="prose prose-zinc max-w-none" style={{ fontFamily: "var(--font-body)" }}>
            <p>
              If you&apos;ve gotten quotes for a new website recently, you&apos;ve probably seen prices that range from a few hundred dollars to tens of thousands — for what sounds like roughly the same thing. Here&apos;s a breakdown of what&apos;s actually going on.
            </p>

            <h2>The four website options and what you&apos;re actually buying</h2>

            <h3>DIY website builders ($0–$50/month)</h3>
            <p>
              Squarespace, Wix, GoDaddy Website Builder. You pick a template, drag and drop content, and you&apos;re live in a weekend. Total annual cost: $150–$600.
            </p>
            <p><strong>Best for:</strong> Businesses that genuinely just need an online presence — a basic contact page, your hours, your phone number. Sole proprietors, side projects, businesses where the website is purely informational and rarely updated.</p>
            <p><strong>The limitations:</strong> Templates mean your site looks like a lot of other sites. Performance is often mediocre. Customization quickly hits walls. SEO capabilities are limited. You&apos;re also at the mercy of the platform — if Squarespace changes their pricing or kills a feature, that&apos;s your problem.</p>

            <h3>WordPress with a premium theme ($500–$3,000)</h3>
            <p>
              A WordPress install with a premium theme (Divi, Elementor, etc.) and some customization. Usually built by a freelancer or a lower-cost web design shop.
            </p>
            <p><strong>Best for:</strong> Businesses that need more customization than a drag-and-drop builder allows but have a limited budget.</p>
            <p><strong>The limitations:</strong> WordPress requires ongoing maintenance — plugin updates, security patches, hosting management. Many themes are bloated and slow. You often end up dependent on the freelancer who built it. The &ldquo;easy to edit yourself&rdquo; promise is often oversold.</p>

            <h3>Custom designed, professionally built ($3,000–$15,000)</h3>
            <p>
              A site built to spec — custom design, clean code, properly optimized for performance and SEO. This is what a boutique agency like Copper Bay Tech builds.
            </p>
            <p><strong>Best for:</strong> Businesses where the website actively generates leads or revenue, where first impressions matter, or where performance (speed, SEO) is important to their market position.</p>
            <p><strong>What you get:</strong> A site that&apos;s fast, looks like your brand, is built for your specific goals, and doesn&apos;t have 47 plugins that need updating. Typically includes content, SEO setup, analytics, and launch support.</p>

            <h3>Full agency build ($15,000–$100,000+)</h3>
            <p>
              Large agencies with project managers, UX researchers, copywriters, and senior developers. Appropriate for complex web applications, enterprise e-commerce, or organizations with large content teams.
            </p>
            <p><strong>Best for:</strong> Honestly, not most small businesses. The overhead is priced in, and you&apos;re often paying for a process that&apos;s more than your project needs.</p>

            <h2>What actually drives the price up</h2>
            <p>When a developer or agency quotes higher than you expect, it&apos;s usually because of one or more of these:</p>
            <ul>
              <li><strong>E-commerce:</strong> Online stores are significantly more complex — product management, payment processing, shipping calculations, inventory, order management. Add $2,000–$8,000+ to any base estimate.</li>
              <li><strong>Custom functionality:</strong> Booking systems, client portals, custom calculators, database integrations — anything that&apos;s not standard marketing pages.</li>
              <li><strong>Content:</strong> If you need someone to write your copy, that&apos;s additional work. A 10-page site with professional copywriting can add $1,500–$3,000.</li>
              <li><strong>Design iteration:</strong> More rounds of revision = more time = higher cost.</li>
              <li><strong>Timeline:</strong> Rush projects cost more.</li>
            </ul>

            <h2>What you should actually pay for a typical small business site</h2>
            <p>
              For a professional service business (lawyer, dentist, plumber, accountant, consultant, realtor) that needs a fast, attractive, lead-generating website:
            </p>
            <ul>
              <li><strong>5–8 pages:</strong> Home, About, Services, Contact, maybe a blog — $2,500–$5,000</li>
              <li><strong>8–15 pages with more content:</strong> Multiple service pages, case studies, team bios — $4,000–$9,000</li>
              <li><strong>E-commerce (small catalog):</strong> Under 50 products, standard checkout — $6,000–$15,000</li>
            </ul>
            <p>
              Anyone charging significantly less than this for a &ldquo;custom&rdquo; site is either using page builders (nothing wrong with that, but know what you&apos;re getting) or underpricing in a way that usually catches up with you — slow delivery, poor quality, or disappearing when you need support.
            </p>

            <h2>The ongoing costs most people forget</h2>
            <p>The build price is one thing. Make sure you account for:</p>
            <ul>
              <li><strong>Hosting:</strong> $10–$50/month for most sites. Don&apos;t cheap out here — slow hosting makes your site slow.</li>
              <li><strong>Domain renewal:</strong> $15–$20/year</li>
              <li><strong>SSL certificate:</strong> Usually included with hosting now</li>
              <li><strong>Maintenance and updates:</strong> WordPress sites especially need regular updates. Factor in $50–$200/month if you want someone else to handle this.</li>
              <li><strong>Future edits:</strong> Budget $500–$1,500/year for routine content updates if you can&apos;t or don&apos;t want to do them yourself.</li>
            </ul>

            <h2>How to evaluate a quote</h2>
            <p>Before you sign anything, ask:</p>
            <ol>
              <li>What&apos;s the platform? (WordPress, Webflow, Next.js, Squarespace, etc.) — and why did you choose it for my project?</li>
              <li>What does the performance look like? Can you show me PageSpeed scores for past projects?</li>
              <li>What&apos;s included for SEO?</li>
              <li>Who handles hosting and maintenance after launch?</li>
              <li>What happens if I need a change six months after launch?</li>
              <li>Can you share examples in a similar industry?</li>
            </ol>

            <h2>The honest pitch</h2>
            <p>
              We build sites in the $2,500–$8,000 range for most small businesses in Sonoma County. Custom-coded, fast, properly SEO&apos;d, launched in 2–3 weeks. We don&apos;t use templates or page builders, and we don&apos;t disappear after launch.
            </p>
            <p>
              If that fits what you&apos;re looking for — or if you just want a second opinion on a quote you&apos;ve received — we&apos;re happy to talk.
            </p>
          </div>

          <div className="mt-12 rounded-2xl p-6 border border-hairline bg-ink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-2" style={{ fontFamily: "var(--font-heading)" }}>Get an Estimate</p>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Estimate your project cost in 2 minutes</h3>
            <p className="text-zinc-400 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Our pricing estimator asks a few questions about your project and gives you a realistic ballpark — no email required.
            </p>
            <Link href="/tools/website-cost-estimator" className="inline-block bg-copper hover:bg-copper-bright text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Try the Estimator
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
