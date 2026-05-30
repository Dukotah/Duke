import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "5 Signs Your Website Is Costing You Customers | Copper Bay Tech",
  description: "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here is how to diagnose them fast.",
};

const signs = [
  {
    num: "01",
    title: "It takes more than 3 seconds to load",
    body: "Studies consistently show that 40% of visitors abandon a page that takes more than 3 seconds to load. You can test yours right now: go to pagespeed.web.dev, enter your URL, and run the test on mobile. A score below 50 means you are actively losing people before they even see your content.",
  },
  {
    num: "02",
    title: "It looks broken on a phone",
    body: "Over 60% of web traffic is mobile. If your site requires pinching and zooming, has text that runs off screen, or has buttons that are impossible to tap — you are telling mobile visitors you don't care about them. Pull out your phone right now and actually browse your site as a customer would.",
  },
  {
    num: "03",
    title: "The contact info is hard to find",
    body: "If a visitor has to scroll to the footer to find your phone number, some of them won't bother. Your phone number, email, and a clear way to contact you should be in the header or visible above the fold. Every second someone spends hunting for your number is a second they might give up.",
  },
  {
    num: "04",
    title: "There is no clear next step",
    body: "A website without a strong call to action is a brochure, not a sales tool. Every page should answer: what do you want this visitor to do next? Book an appointment? Call you? Fill out a form? If the answer isn't obvious within 5 seconds of landing on the page, you are leaving leads on the table.",
  },
  {
    num: "05",
    title: "It hasn't been touched in 2+ years",
    body: "Outdated websites signal to visitors that your business may not be active or trustworthy. This goes beyond aesthetics — old sites often have broken links, expired SSL certificates, plugins with security vulnerabilities, and SEO metadata that hasn't been updated in years. Google also deprioritizes sites that aren't maintained.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "5 Signs Your Business Website Is Costing You Customers Right Now",
  description:
    "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here is how to diagnose them fast.",
  author: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  publisher: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  datePublished: "2026-03-01",
  url: "https://copperbaytech.com/blog/5-signs-your-business-website-is-costing-you-customers",
};

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Web Development
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              5 Signs Your Business Website Is Costing You Customers Right Now
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>4 min read &middot; March 2026</p>
          </div>
        </section>
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-lg text-[#3F3F46]/70 mb-10 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Most business owners don't realize their website is a problem until a customer mentions it — or worse, they never find out because the visitor just left. Here are five things to check right now, no technical knowledge required.
            </p>
            <div className="space-y-8">
              {signs.map((s) => (
                <div key={s.num} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>{s.num}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{s.title}</h2>
                    <p className="text-[#3F3F46]/70 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Quick action</p>
              <p className="text-sm text-white/70 mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Run a free audit at our Website Health Check tool — it checks speed, SSL, SEO, broken links, and mobile readiness in about 30 seconds.
              </p>
              <Link href="/tools" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Run Free Website Audit <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Get Your Site Fixed <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
