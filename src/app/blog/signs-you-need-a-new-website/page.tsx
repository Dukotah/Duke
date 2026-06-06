import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "7 Signs It's Time for a New Business Website (Not Just a Refresh) | Copper Bay Tech",
  description:
    "Some website problems can be patched. Others mean it's time to start over. Here are 7 signs your current site is holding your business back.",
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "7 Signs It's Time for a New Business Website (Not Just a Refresh)", description: "Some website problems can be patched. Others mean it's time to start over. Here are 7 signs your current site is holding your business back.", url: "https://copperbaytech.com/blog/signs-you-need-a-new-website", datePublished: "2026-04-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Signs You Need a New Website" }])} />
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
              7 Signs It&apos;s Time for a New Business Website (Not Just a Refresh)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              6 min read · April 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                There&apos;s a difference between a website that needs a few updates and one that&apos;s fundamentally broken. Tweaking colors and swapping photos on a bad foundation doesn&apos;t fix the foundation. Here are seven signs your business needs a new website — not just a touch-up.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. It doesn&apos;t look right on a phone
              </h2>
              <p className="mb-6">
                More than 60% of web traffic is now on mobile devices. If your website requires pinching and zooming to read, has buttons too small to tap, or has content that overflows off the screen on a phone — you&apos;re losing customers every day. This isn&apos;t a cosmetic problem. Google&apos;s algorithm explicitly favors mobile-friendly sites and penalizes ones that aren&apos;t.
              </p>
              <p className="mb-6">
                Test yours right now: open it on your phone and try to complete the most common action a customer would take (call you, find your hours, submit a form). If it&apos;s frustrating, it&apos;s costing you.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. It loads slowly
              </h2>
              <p className="mb-6">
                Google&apos;s research found that 53% of mobile users abandon a page that takes more than 3 seconds to load. Use Google&apos;s free PageSpeed Insights tool (pagespeed.web.dev) and enter your URL. If you&apos;re scoring below 50 on mobile, you have a real problem — and it&apos;s likely hurting your Google rankings too.
              </p>
              <p className="mb-6">
                Slow sites are often a symptom of bad hosting, unoptimized images, or a bloated WordPress theme with dozens of plugins. Sometimes these can be fixed; often the fastest path is a rebuild on a leaner foundation.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. You can&apos;t update it yourself
              </h2>
              <p className="mb-6">
                If changing your hours, updating your menu, or adding a team member requires emailing a developer and waiting a week, your website is working against you. Modern websites should have a content management system (CMS) that lets you make basic changes without technical help.
              </p>
              <p className="mb-6">
                This matters practically: businesses that can update their own sites keep them current. Businesses that can&apos;t end up with outdated information — closed-down specials, wrong hours, staff who left two years ago — which erodes trust.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Google can&apos;t find you
              </h2>
              <p className="mb-6">
                Type your business name and city into Google. If you don&apos;t show up prominently, or if you show up but rank poorly for your most important service keywords, your site has an SEO problem. This could be technical (missing meta tags, no sitemap, unindexed pages) or structural (thin content, no page targeting your key search terms).
              </p>
              <p className="mb-6">
                Older websites were often built without any SEO consideration. Retrofitting SEO onto a poorly structured site has real limits. Sometimes rebuilding with proper SEO architecture from the start is faster and more effective.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                5. The design looks like 2014
              </h2>
              <p className="mb-6">
                Design trends move, and customers notice. A site with flat, dated graphics, cluttered layouts, stock photos from a decade ago, and small hard-to-read text creates an unconscious impression: if their website looks like this, what does their work look like?
              </p>
              <p className="mb-6">
                You don&apos;t need the flashiest site on the internet. You need one that looks professional, loads cleanly, and communicates competence. A dated site undermines that regardless of how good your actual work is.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                6. You&apos;re embarrassed to share the URL
              </h2>
              <p className="mb-6">
                This is the most honest test. When you hand someone a business card or send a follow-up email, do you think &quot;I hope they don&apos;t actually visit the website&quot;? That feeling is data. Your website is often the first place a prospective customer goes after meeting you. If you already know it won&apos;t make a good impression, it won&apos;t.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                7. Your business has changed but your site hasn&apos;t
              </h2>
              <p className="mb-6">
                You&apos;ve added services, changed your focus, moved locations, hired a team, or shifted your ideal customer — but the website still describes what you did three years ago. A site that doesn&apos;t accurately represent your business creates confusion and mismatched expectations before customers even contact you.
              </p>
              <p className="mb-6">
                Sometimes this is a content problem (fixable with updates). But if the site&apos;s structure, navigation, and overall positioning don&apos;t match where your business is now, a rebuild gives you the chance to start fresh and build something that actually fits.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  If two or more of these apply to your site, a refresh probably won&apos;t fix it. The good news: a well-built new website pays for itself quickly in leads, credibility, and time saved.
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-500 mt-8">
              Related:{" "}
              <Link href="/services/web-development" className="text-orange-500 hover:text-orange-600">Web Development</Link>
            </p>
            <div className="mt-16 rounded-2xl bg-[#18181B] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
