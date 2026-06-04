import type { Metadata } from "next";
import Link from "next/link";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Why a Slow Website Is Costing Your Sonoma County Business Customers | Copper Bay Tech",
  description: "If your site takes more than 3 seconds to load, more than half your visitors are already gone. Here's what's slowing you down and how to fix it.",
  openGraph: {
    title: "Why a Slow Website Is Costing Your Sonoma County Business Customers",
    description: "More than half of visitors leave a site that takes over 3 seconds to load. Here's what's hurting Sonoma County businesses in Google search.",
    url: "https://copperbaytech.com/blog/why-slow-websites-hurt-sonoma-county-businesses",
    type: "article",
  },
};

export default function Post() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Why a Slow Website Is Costing Your Sonoma County Business Customers", description: "If your site takes more than 3 seconds to load, more than half your visitors are already gone. Here's what's slowing you down and how to fix it.", url: "https://copperbaytech.com/blog/why-slow-websites-hurt-sonoma-county-businesses", datePublished: "2026-05-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Slow Websites Hurt Your Business" }])} />
      <main className="max-w-2xl mx-auto px-6 py-24">
      <Link href="/blog" className="text-sm text-[#F97316] hover:underline mb-10 inline-block" style={{ fontFamily: "var(--font-heading)" }}>
        ← All posts
      </Link>

      <span className="text-xs font-semibold uppercase tracking-widest text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>
        Web Performance
      </span>

      <h1 className="text-3xl md:text-4xl font-bold text-[#18181B] mt-3 mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        Why a Slow Website Is Costing Your Sonoma County Business Customers
      </h1>

      <p className="text-sm text-[#3F3F46]/40 mb-10" style={{ fontFamily: "var(--font-body)" }}>
        May 30, 2026 · By Duke, Copper Bay Tech
      </p>

      <div className="prose-content space-y-6 text-[#3F3F46] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

        <p className="text-lg text-[#3F3F46]/80">
          Here&apos;s a number that should make you uncomfortable: <strong className="text-[#18181B]">53% of mobile visitors abandon a site that takes more than 3 seconds to load.</strong> More than half. Gone before they even see what you offer.
        </p>

        <p>
          For a restaurant in Petaluma or a contractor in Santa Rosa, that&apos;s not an abstract statistic — that&apos;s a customer who found you on Google, clicked your link, waited two seconds, and went to your competitor instead.
        </p>

        <h2 className="text-xl font-bold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          Google ranks fast sites higher
        </h2>
        <p>
          Since 2021, Google uses something called <strong>Core Web Vitals</strong> as a direct ranking factor. These are speed and user experience metrics — how fast your page loads, how quickly it becomes usable, how much the layout shifts around while loading.
        </p>
        <p>
          If your site scores poorly, Google pushes you down in local search results. That means when someone in Rohnert Park searches &quot;plumber near me,&quot; a faster competitor shows up above you — even if you&apos;ve been in business for 20 years and they just opened.
        </p>

        <h2 className="text-xl font-bold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          What&apos;s usually causing it
        </h2>
        <p>
          After auditing dozens of Sonoma County business websites, I see the same problems over and over:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Uncompressed images</strong> — a photo taken on a phone or DSLR and uploaded directly can be 5–10MB. It should be under 100KB for web use.</li>
          <li><strong>Cheap shared hosting</strong> — many local businesses are on $5/month hosting plans where their site shares a server with thousands of others. When that server is busy, your site slows to a crawl.</li>
          <li><strong>Page builders and templates</strong> — Wix, GoDaddy, and even some WordPress themes load enormous amounts of code that visitors never use. A custom-built site loads only what it needs.</li>
          <li><strong>No caching</strong> — every visit to your site rebuilds the page from scratch instead of serving a stored version. This is a simple fix that makes a dramatic difference.</li>
          <li><strong>Third-party scripts</strong> — live chat widgets, booking plugins, social media feeds — each one adds load time. Most aren&apos;t worth what they cost in speed.</li>
        </ul>

        <h2 className="text-xl font-bold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          How to check your own site right now
        </h2>
        <p>
          Go to <strong>copperbaytech.com/audit</strong> and enter your URL. You&apos;ll get a free Google PageSpeed score in about 15 seconds — the same score Google uses to rank your site. Anything below 50 is actively hurting your visibility.
        </p>
        <p>
          You can also use Google&apos;s own tool at <strong>pagespeed.web.dev</strong> for more detail.
        </p>

        <h2 className="text-xl font-bold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          What a real fix looks like
        </h2>
        <p>
          Depending on what&apos;s causing your slow score, the fix ranges from a few hours of optimization work to a full rebuild. Here&apos;s a rough guide:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Score 70–89:</strong> Usually fixable with image compression, caching, and removing unused scripts. A few hours of work.</li>
          <li><strong>Score 50–69:</strong> Likely needs hosting improvements and code-level optimization. A day or two of work.</li>
          <li><strong>Score below 50:</strong> Often a sign the site needs to be rebuilt. Template-based sites in this range rarely get meaningfully faster without starting over.</li>
        </ul>

        <div className="bg-[#FAFAF9] border border-[#18181B]/8 rounded-xl p-6 mt-10">
          <p className="font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Want to know exactly what&apos;s holding your site back?
          </p>
          <p className="text-sm text-[#3F3F46]/60 mb-4">
            I offer a free 15-minute call where I&apos;ll walk through your audit results and tell you honestly what I&apos;d recommend — whether that&apos;s a quick fix, a bigger project, or nothing at all.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a free call
          </Link>
        </div>

      </div>
    </main>
    </>
  );
}
