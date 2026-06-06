import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Speed Up Your Business Website (Without a Developer) | Copper Bay Tech",
  description:
    "Five things you can do today without touching code — and three signs it's time to call in a developer.",
  openGraph: {
    url: "https://copperbaytech.com/blog/how-to-speed-up-your-business-website",
  },
};

const diyFixes = [
  {
    num: "01",
    title: "Compress your images",
    desc: "Large, uncompressed images are the #1 cause of slow websites. Use a free tool like Squoosh (squoosh.app) or TinyPNG to compress images before uploading them. Aim for files under 200KB for photos, under 50KB for small graphics. This alone can cut load time in half on image-heavy sites.",
  },
  {
    num: "02",
    title: "Remove unused plugins",
    desc: "Every plugin on a WordPress site adds load time — even if you never use it. Go through your plugins list and deactivate or delete anything that isn't actively serving a purpose. If you're not sure what something does, search the name. Many sites accumulate a dozen \"test\" plugins that are never cleaned up.",
  },
  {
    num: "03",
    title: "Enable caching",
    desc: "Caching stores a static version of your pages so they don't have to rebuild from scratch for every visitor. Most website platforms have this built in or offer free plugins for it (WP Super Cache, W3 Total Cache for WordPress). Enable it and you'll often see immediate improvement.",
  },
  {
    num: "04",
    title: "Upgrade your hosting",
    desc: "Shared hosting plans from budget providers often throttle performance to fit hundreds of sites on one server. If your site has been on the same $5/month hosting plan for years, a move to a better provider (SiteGround, Kinsta, WP Engine) can make a significant difference without changing anything else.",
  },
  {
    num: "05",
    title: "Use a CDN",
    desc: "A content delivery network (CDN) serves your site from servers close to your visitors. Cloudflare offers a free tier that's sufficient for most small business sites. Setup takes about 30 minutes and doesn't require developer help.",
  },
];

const devFixes = [
  {
    title: "Core Web Vitals optimization",
    desc: "Google's Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint) affect your search ranking. Improving them requires code-level changes — optimizing JavaScript loading, deferring offscreen images, fixing render-blocking resources.",
  },
  {
    title: "Code-level optimization",
    desc: "Minifying CSS and JavaScript, removing unused code, splitting large files — these are meaningful but require someone who can safely edit your site's codebase without breaking things.",
  },
  {
    title: "Server-side rendering or static generation",
    desc: "For some sites, especially those built on slow CMS platforms, the right answer is a rebuild using a modern framework that generates static HTML. The performance difference is dramatic, but it's a significant project.",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How to Speed Up Your Business Website (Without a Developer)", description: "Five things you can do today without touching code — and three signs it's time to call in a developer.", url: "https://copperbaytech.com/blog/how-to-speed-up-your-business-website", datePublished: "2026-06-20" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Speed Up Your Business Website" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Web Development
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How to Speed Up Your Business Website (Without a Developer)
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              5 min read · June 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              A one-second delay in page load time reduces conversions by 7%. Google uses page speed as a ranking factor. And visitors — especially on mobile — will leave before your page finishes loading. The good news: several of the biggest improvements don&apos;t require a developer.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Test your speed first
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Before making any changes, run your site through <strong className="text-[#18181B]">PageSpeed Insights</strong> (pagespeed.web.dev) and <strong className="text-[#18181B]">GTmetrix</strong> (gtmetrix.com). Both are free and give you a score plus a prioritized list of what&apos;s slowing your site down. Screenshot your scores before making changes so you can measure improvement.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              A score below 50 on PageSpeed Insights (mobile) means you have significant problems. 50–79 is average. 80+ is good. Most small business sites we see come in at 30–50 on mobile, which means there&apos;s real room for improvement.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              5 things you can do yourself
            </h2>

            <div className="space-y-6 mb-10">
              {diyFixes.map((fix) => (
                <div key={fix.num} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center">
                      <span
                        className="text-sm font-bold text-[#F97316]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {fix.num}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#18181B] mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {fix.title}
                    </h3>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed">{fix.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              3 things that require a developer
            </h2>
            <div className="space-y-4 mb-8">
              {devFixes.map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]"
                >
                  <p
                    className="font-semibold text-[#18181B] text-sm mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </p>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              When it&apos;s time to just rebuild
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Some sites are built on foundations that can&apos;t be meaningfully optimized — bloated page builders, outdated CMS versions, or frameworks that weren&apos;t designed for performance. If you&apos;ve done everything above and still can&apos;t get above a 50 on mobile PageSpeed Insights, the platform itself is the problem.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              A modern rebuild — using a framework like Next.js or a well-configured WordPress setup — will routinely score 90+ out of the box. If your site is older than 4–5 years, a rebuild often makes more sense economically than trying to optimize something that was never built well.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p
                className="text-sm font-semibold mb-2 text-[#F97316]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Want to know exactly what&apos;s slowing your site down?
              </p>
              <p className="text-sm text-white/70 mb-4">
                Our free website audit tool gives you a full technical review — speed, SEO, mobile performance, and security — in about 60 seconds.
              </p>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Run a Free Website Audit <ArrowRight size={14} />
              </Link>
            </div>

            <p className="text-sm text-zinc-500 mt-8">
              Related:{" "}
              <Link href="/services/web-development" className="text-orange-500 hover:text-orange-600">Web Development</Link>
            </p>
            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
