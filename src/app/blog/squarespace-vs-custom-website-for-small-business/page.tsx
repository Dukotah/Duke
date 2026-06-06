import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Squarespace vs Custom Website for Small Business: An Honest Comparison | Copper Bay Tech",
  description:
    "Squarespace and Wix are fine for some businesses — but not all. Here's an honest look at when a DIY builder makes sense and when a custom-coded site pays off.",
  keywords: [
    "Squarespace vs custom website",
    "Wix vs custom website small business",
    "website builder vs custom site",
    "custom website Sonoma County",
    "small business website cost",
    "web design Sonoma County",
  ],
  alternates: {
    canonical: "https://copperbaytech.com/blog/squarespace-vs-custom-website-for-small-business",
  },
  openGraph: {
    title: "Squarespace vs Custom Website for Small Business: An Honest Comparison | Copper Bay Tech",
    description:
      "Squarespace and Wix are fine for some businesses — but not all. Here's an honest look at when a DIY builder makes sense and when a custom-coded site pays off.",
    url: "https://copperbaytech.com/blog/squarespace-vs-custom-website-for-small-business",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const builderPros = [
  "Low upfront cost — most plans run $200–$400/year all-in",
  "Up and running in a weekend with no developer needed",
  "Built-in hosting, SSL, and software updates handled for you",
  "Decent templates that look professional out of the box",
  "Easy for non-technical owners to update content themselves",
];

const builderCons = [
  "You don't own the platform — if Squarespace changes pricing or shuts down, you start over",
  "Performance ceiling: builder sites tend to load slower due to bloated generic code",
  "SEO is limited — you control title tags and meta descriptions, but technical SEO (Core Web Vitals, structured data, site architecture) is largely out of your hands",
  "Templates constrain your design — it's hard to stand out when thousands of businesses share the same layout",
  "Integrations are limited to what the platform supports",
  "Annual cost compounds: $400/yr over 5 years is $2,000 with nothing to show for it",
];

const customPros = [
  "You own the code — move hosts anytime, no vendor lock-in",
  "Built specifically for your business: your branding, your layout, your integrations",
  "Faster load times — clean, purpose-built code without a page-builder layer on top",
  "Full technical SEO control: Core Web Vitals, schema markup, canonical tags, site structure",
  "Scales with your business without switching platforms",
  "One-time cost means lower total cost of ownership over 3–5 years",
];

const customCons = [
  "Higher upfront cost — typically $2,500–$7,500 depending on scope",
  "You need a developer to make structural changes (content updates are usually easy)",
  "Takes weeks, not days, to build properly",
  "Overkill if your site is genuinely just a digital business card",
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Squarespace vs Custom Website for Small Business: An Honest Comparison", description: "Squarespace and Wix are fine for some businesses — but not all. Here's an honest look at when a DIY builder makes sense and when a custom-coded site pays off.", url: "https://copperbaytech.com/blog/squarespace-vs-custom-website-for-small-business", datePublished: "2026-06-04" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Squarespace vs Custom Website for Small Business" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Web Development
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Squarespace vs Custom Website for Small Business: An Honest Comparison
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>7 min read · June 2026</p>
            <p className="text-sm text-[#3F3F46]/55 mt-1" style={{ fontFamily: "var(--font-body)" }}>Updated June 4, 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              Squarespace, Wix, and similar builders have gotten genuinely good. For some businesses, they&apos;re the right call — full stop. For others, they quietly become the reason the phone doesn&apos;t ring. The difference usually comes down to how much you rely on your website to generate leads.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              This is an honest breakdown — not a pitch for one side. We build custom sites, but we&apos;ll tell you plainly when a builder is the smarter move.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Website Builders (Squarespace, Wix, Weebly)
            </h2>
            <p className="text-[#3F3F46]/60 text-sm mb-6">~$200–$400/year all-in</p>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Builder platforms let you pick a template, drag in your content, and launch — often in a weekend. Hosting, SSL certificates, and software updates are bundled into the subscription. For a business that genuinely just needs a digital presence (contact info, hours, a photo gallery), that&apos;s a reasonable deal.
            </p>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>What builders do well:</h3>
            <ul className="space-y-2 mb-6">
              {builderPros.map((pro) => (
                <li key={pro} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Where they fall short:</h3>
            <ul className="space-y-2 mb-10">
              {builderCons.map((con) => (
                <li key={con} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#18181B]/30 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Custom-Coded Website
            </h2>
            <p className="text-[#3F3F46]/60 text-sm mb-6">$2,500–$7,500 one-time (typical small-business scope)</p>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              A custom site is built from the ground up for your business. The code is purpose-written, the design is yours, and nothing is shared with thousands of other sites running the same template. For businesses in competitive local markets — like most Sonoma County service businesses — that difference shows up in search rankings and conversion rates.
            </p>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>What custom sites do well:</h3>
            <ul className="space-y-2 mb-6">
              {customPros.map((pro) => (
                <li key={pro} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Where they fall short:</h3>
            <ul className="space-y-2 mb-10">
              {customCons.map((con) => (
                <li key={con} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#18181B]/30 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              So which is right for you?
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                <p className="font-bold text-[#18181B] mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>A builder is the right call if:</p>
                <ul className="space-y-2">
                  {[
                    "You&apos;re pre-revenue or testing a new business idea",
                    "Your site is genuinely informational — no lead gen, no local SEO pressure",
                    "Budget is very tight and speed to launch matters most",
                    "You don&apos;t plan to grow the site beyond a few pages",
                  ].map((item) => (
                    <li key={item} className="text-xs text-[#3F3F46]/70 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                <p className="font-bold text-[#18181B] mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>Custom pays off if:</p>
                <ul className="space-y-2">
                  {[
                    "You rely on the site to generate calls, bookings, or quote requests",
                    "You want to rank in local Google searches (Maps, organic)",
                    "Your competitors have strong sites — you need an edge",
                    "You&apos;re planning to add e-commerce, booking, or integrations",
                  ].map((item) => (
                    <li key={item} className="text-xs text-[#3F3F46]/70 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              The SEO ceiling problem
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              This is the one area where the gap between builders and custom sites is most consequential for small businesses. Builders give you the basics — title tags, meta descriptions, a sitemap. But Google&apos;s ranking algorithm cares deeply about page speed (Core Web Vitals), structured data (schema markup), mobile usability, and site architecture. Builder platforms have improved here, but you&apos;re working within constraints you can&apos;t control.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              For a Sonoma County plumber, landscaper, or accountant trying to rank in Santa Rosa, Petaluma, or Healdsburg search results, that ceiling matters. A faster, cleaner, properly structured site is easier for Google to crawl and more likely to earn a top-three local ranking. Check out our <Link href="/web-design-sonoma-county" className="text-[#F97316] hover:underline">Sonoma County web design services</Link> if you want to understand what we optimize for specifically.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              The total cost of ownership question
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Builders feel cheap because the upfront cost is low. But $300/year compounds: over five years that&apos;s $1,500 paid to a platform you don&apos;t own, with no equity in the asset. A custom site built for $3,500 typically has hosting costs of $20–$50/month — much of which you&apos;d pay regardless — and you own the code outright. See our <Link href="/pricing" className="text-[#F97316] hover:underline">pricing page</Link> for current flat-fee ranges.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              None of that math matters if a builder is genuinely enough for your business right now. It only matters when you&apos;re paying for a platform that&apos;s capping your growth.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Lock-in is a real risk
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              One thing most builder comparisons gloss over: when you leave Squarespace or Wix, you start from scratch. Your content doesn&apos;t export cleanly. Your domain transfers, but your design, your pages, your SEO work — none of it migrates to a new platform in usable form. Businesses that outgrow a builder often spend more rebuilding than they would have spent starting with a custom site. That&apos;s not a reason to avoid builders forever, but it&apos;s worth factoring in if you have any plans to scale.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Not sure which direction makes sense?</p>
              <p className="text-sm text-white/70 mb-4">
                We&apos;ll give you a straight answer based on your business, your market, and your budget — no pressure either way. If a builder is genuinely the right call for you right now, we&apos;ll say so.
              </p>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a free consultation <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Free Website Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
