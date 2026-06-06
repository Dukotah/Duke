import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Why Your Google Business Profile Is the Most Important Page You Don't Own | Copper Bay Tech",
  description: "Most Sonoma County small businesses ignore their Google Business Profile. Here's why it matters more than your website for local search, and exactly what to fix today.",
  alternates: { canonical: "https://copperbaytech.com/blog/why-your-google-business-profile-matters" },
  openGraph: {
    title: "Why Your Google Business Profile Is the Most Important Page You Don't Own | Copper Bay Tech",
    description: "Most Sonoma County small businesses ignore their Google Business Profile. Here's why it matters more than your website for local search, and exactly what to fix today.",
    url: "https://copperbaytech.com/blog/why-your-google-business-profile-matters",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function GoogleBusinessProfilePost() {
  return (
    <div className="min-h-screen bg-white">
      <JsonLd schema={blogPostingSchema({ title: "Why Your Google Business Profile Is the Most Important Page You Don't Own", description: "Most Sonoma County small businesses ignore their Google Business Profile. Here's why it matters more than your website for local search, and exactly what to fix today.", url: "https://copperbaytech.com/blog/why-your-google-business-profile-matters", datePublished: "2026-02-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Google Business Profile Matters" }])} />
      <Nav light />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#3F3F46]/50 hover:text-[#18181B] transition-colors text-sm mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            <ArrowLeft size={14} /> All Articles
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Local SEO</span>
              <span className="text-[#18181B]/20">·</span>
              <span className="text-xs text-[#3F3F46]/40" style={{ fontFamily: "var(--font-heading)" }}>5 min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#18181B] leading-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why Your Google Business Profile Is the Most Important Page You Don&apos;t Own
            </h1>
            <p className="text-sm text-[#3F3F46]/40 mb-3" style={{ fontFamily: "var(--font-body)" }}>Updated February 1, 2026</p>
            <p className="text-[#3F3F46]/60 text-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Most small businesses in Sonoma County treat their Google Business Profile as an afterthought. That&apos;s a mistake. Here&apos;s what it actually controls and what to fix today.
            </p>
          </header>

          <div className="prose prose-zinc max-w-none" style={{ fontFamily: "var(--font-body)" }}>
            <p>
              When someone in Petaluma searches &ldquo;home staging near me&rdquo; or &ldquo;dentist Sebastopol&rdquo; — they almost never click past the first result. And that first result isn&apos;t usually a website. It&apos;s the Google Maps pack: three local business listings with ratings, hours, phone numbers, and photos.
            </p>

            <p>
              Your Google Business Profile (GBP) controls whether you show up there. And most small business owners either haven&apos;t touched theirs since they claimed it, or don&apos;t have one at all.
            </p>

            <h2>What your GBP actually determines</h2>
            <p>Your Google Business Profile controls:</p>
            <ul>
              <li>Whether you appear in &ldquo;near me&rdquo; searches</li>
              <li>The phone number, address, and hours Google shows for your business</li>
              <li>The photos customers see before they even visit your site</li>
              <li>Your star rating and review count (often the first thing people look at)</li>
              <li>Whether Google surfaces you for relevant category searches in your area</li>
            </ul>

            <p>
              This is all separate from your website. You can have a beautiful site that ranks well nationally and still not appear in local searches if your GBP is weak or incomplete.
            </p>

            <h2>The five things most profiles get wrong</h2>

            <h3>1. Wrong or missing business category</h3>
            <p>
              Google uses your primary category to decide what searches to show you for. &ldquo;General contractor&rdquo; and &ldquo;kitchen remodeling contractor&rdquo; are different categories — one is much more specific and will get you in front of people searching for exactly what you do.
            </p>
            <p>
              Pick the most specific category that accurately describes your main business. You can add up to 9 secondary categories.
            </p>

            <h3>2. No photos — or stock photos</h3>
            <p>
              Businesses with 100+ photos on GBP get 520% more calls and 2,717% more direction requests than those with none, according to Google&apos;s own data. Real photos — your storefront, your team, your work product — outperform stock images every time.
            </p>
            <p>
              At minimum: add photos of your exterior (day and night), your interior, your team, and examples of your work.
            </p>

            <h3>3. Stale hours or no holiday hours</h3>
            <p>
              If Google shows you as open when you&apos;re closed, customers will show up at a locked door and leave a one-star review. Keep your hours current, and add special hours for holidays and vacation closures.
            </p>

            <h3>4. No description</h3>
            <p>
              The business description field (750 characters) is prime real estate for explaining who you serve, what makes you different, and what your service area is. Most profiles either leave it blank or paste in their generic tagline.
            </p>
            <p>
              Write it in plain language. Include the geographic areas you serve (Petaluma, Santa Rosa, Sebastopol, etc.) and the specific services customers search for.
            </p>

            <h3>5. Not responding to reviews</h3>
            <p>
              Responding to reviews — positive and negative — signals to Google that you&apos;re active and engaged. It also signals to prospective customers. A business that responds thoughtfully to a negative review almost always looks better than one that ignores it.
            </p>
            <p>
              Respond to every review within 48 hours. Keep it brief, personal, and professional.
            </p>

            <h2>How to check your profile&apos;s health right now</h2>
            <ol>
              <li>Search for your business name on Google and click &ldquo;Edit your Business Profile&rdquo;</li>
              <li>Check that your primary category is as specific as possible</li>
              <li>Count your photos — aim for at least 20 real photos</li>
              <li>Verify your hours are accurate, including holiday hours</li>
              <li>Read your description — does it mention your service area and specific services?</li>
              <li>Check your reviews — are you responding to them?</li>
            </ol>

            <h2>One more thing: posts</h2>
            <p>
              Google Business Profiles support posts — essentially short updates that appear on your profile in search results. They expire after seven days, but posting once a week (a recent project, a seasonal offer, a tip for customers) keeps your profile active and can increase visibility.
            </p>
            <p>
              It takes five minutes. Almost no one does it. That alone is a reason to start.
            </p>

            <h2>The bottom line</h2>
            <p>
              Your Google Business Profile is the most visible thing Google will ever show about your business — and you don&apos;t pay a cent for it. It&apos;s worth spending two hours getting it right.
            </p>
            <p>
              If you&apos;d rather have someone do it for you, that&apos;s a service we offer. We set up and optimize GBPs for Sonoma County businesses as part of our web and SEO work.
            </p>
          </div>

          <div className="mt-12 rounded-2xl p-6 border border-[#18181B]/10 bg-[#FAFAF9]">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2" style={{ fontFamily: "var(--font-heading)" }}>Free Resource</p>
            <h3 className="text-[#18181B] font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Check your website&apos;s SEO health</h3>
            <p className="text-[#3F3F46]/60 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
              Our free tools page checks SEO, speed, SSL, and more in one audit — no signup required.
            </p>
            <a href="/tools/health-check" className="inline-block bg-[#F97316] hover:bg-[#ea6c0a] text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Run a Free SEO Audit
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
