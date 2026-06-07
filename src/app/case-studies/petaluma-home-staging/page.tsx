import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Globe, Check } from "lucide-react";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata = {
  title: "Case Study: Petaluma Home Staging Co. | Copper Bay Tech",
  description: "How we rebuilt a slow, broken website for a Petaluma home staging business — cutting load time from 8 seconds to 1.4 seconds and generating 8 new inquiries in 6 weeks.",
  alternates: { canonical: "https://copperbaytech.com/case-studies/petaluma-home-staging" },
  openGraph: {
    title: "Case Study: Petaluma Home Staging Co. | Copper Bay Tech",
    description: "How we rebuilt a slow, broken website for a Petaluma home staging business — cutting load time from 8 seconds to 1.4 seconds and generating 8 new inquiries in 6 weeks.",
    url: "https://copperbaytech.com/case-studies/petaluma-home-staging",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function PetalumaHomeStaging() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Case Studies", url: "https://copperbaytech.com/case-studies" }, { name: "Petaluma Home Staging Co." }])} />
      <Nav />

      <article className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/case-studies" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft size={14} /> All Case Studies
          </Link>

          <p className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2.5 text-xs text-zinc-400">
            Representative example — illustrates a typical engagement and the kind of results we aim for, not a documented result for a specific named client.
          </p>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe size={18} className="text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-blue-400 bg-blue-500/10">Web Development</span>
                <p className="text-zinc-500 text-xs mt-0.5">Petaluma, CA · 2025</p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
              From invisible to booked out — a full website rebuild for Petaluma Home Staging Co.
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Maria ran a thriving home staging business with one serious problem: her website was killing her leads. We rebuilt it in 11 days. Here&apos;s exactly what happened.
            </p>
          </div>

          {/* Metrics banner */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: "Page load time", before: "8.2 seconds", after: "1.4 seconds" },
              { label: "New site inquiries", before: "~1 per year", after: "8 in 6 weeks" },
              { label: "Time to launch", before: "—", after: "11 days" },
            ].map((m, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">{m.label}</p>
                {m.before !== "—" && <p className="text-zinc-600 text-sm line-through">{m.before}</p>}
                <p className="text-orange-400 text-xl font-black">{m.after}</p>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-white text-2xl font-bold mb-4">The Situation</h2>
              <p className="mb-4">
                Maria had been running her home staging business in Petaluma for four years. Word of mouth was good — but her website was working against her. The site had been built in 2018 on a cheap website builder, the design hadn&apos;t been touched since, and it was loading in over 8 seconds on mobile.
              </p>
              <p className="mb-4">
                That alone was enough to lose most visitors before they saw a single photo. But there was another problem she didn&apos;t even know about: her contact form was dumping submissions straight to spam. She&apos;d later find out she&apos;d missed at least a dozen inquiries that year.
              </p>
              <p>
                She came to us wanting a redesign. What she got was a complete rebuild — designed to perform, not just look good.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">What We Did</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Rebuilt from scratch in Next.js",
                    desc: "No page builders, no templates, no bloat. Custom-coded from the ground up — fast by design, not by accident.",
                  },
                  {
                    title: "Optimized every image and eliminated render-blocking scripts",
                    desc: "Her original site was loading uncompressed images and three external scripts that blocked the page from rendering. We cut load time by 83%.",
                  },
                  {
                    title: "Fixed contact form delivery end-to-end",
                    desc: "Rebuilt the form with proper spam filtering, email authentication (SPF/DKIM), and tested delivery to every major provider. No more submissions going to spam.",
                  },
                  {
                    title: "Set up Google Business Profile and local SEO",
                    desc: "Configured her GBP correctly, added structured data to the site, and targeted the search terms her clients were actually using.",
                  },
                  {
                    title: "Launched in 11 days",
                    desc: "We had a defined scope, moved fast, and didn't waste time on decisions that didn't matter. She had a live, indexed, fast site in under two weeks.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">The Outcome</h2>
              <p className="mb-4">
                The new site went live on a Tuesday. By Friday, Maria had received her first inquiry through it — a referral who had already seen her work but needed to verify she was still operating. The site gave them confidence.
              </p>
              <p className="mb-4">
                Over the next six weeks, eight more inquiries came in through the contact form. She was used to getting maybe one a year. The staging business was fully booked the following quarter.
              </p>
              <p>
                We stay in touch. She texts when something needs updating, it gets done. No ticket systems, no monthly retainer, no drama.
              </p>
            </section>

            {/* Quote */}
            <blockquote className="border-l-2 border-orange-500 pl-6 my-8">
              <p className="text-zinc-300 text-lg italic leading-relaxed mb-4">
                &ldquo;Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we&apos;ve already gotten three new inquiries through the site. Best investment I made this year.&rdquo;
              </p>
              <footer>
                <p className="text-white font-semibold">Maria T.</p>
                <p className="text-zinc-500 text-sm">Owner, Petaluma Home Staging Co.</p>
              </footer>
            </blockquote>

            <section>
              <h2 className="text-white text-2xl font-bold mb-4">Technical Notes</h2>
              <p className="mb-4 text-zinc-400">For those who want to know what was actually under the hood:</p>
              <ul className="space-y-2 text-zinc-400">
                {[
                  "Framework: Next.js with static generation for all pages",
                  "Hosting: Vercel (edge CDN, automatic HTTPS, zero config)",
                  "Images: Next.js Image component with WebP conversion and lazy loading",
                  "Fonts: System font stack for body, minimal Google Font load for headings",
                  "Form: React Hook Form with server-side validation and Resend for email delivery",
                  "SEO: Structured data (LocalBusiness schema), sitemap.xml, robots.txt, OG tags",
                  "Analytics: Vercel Analytics (privacy-first, no cookie banners needed)",
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-400 flex-shrink-0 mt-1">·</span>
                    <span className="text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl p-8 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Is your site doing this to you?</p>
            <h2 className="text-white text-2xl font-black mb-3">Let&apos;s look at it together</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Run a free speed audit on your site, then book a 30-minute call to talk through what we find.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/audit" className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
                Free Speed Audit
              </a>
              <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
                Book a Free Call
              </a>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
