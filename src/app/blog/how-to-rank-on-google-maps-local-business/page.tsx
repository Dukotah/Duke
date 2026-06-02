import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps | Copper Bay Tech",
  description:
    "The 3 factors Google uses to rank local businesses on Google Maps — and the specific steps you can take to improve your ranking in Sonoma County.",
  openGraph: {
    url: "https://copperbaytech.com/blog/how-to-rank-on-google-maps-local-business",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
  description:
    "The 3 factors Google uses to rank local businesses on Google Maps — and the specific steps you can take to improve your ranking in Sonoma County.",
  author: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  publisher: { "@type": "Organization", name: "Copper Bay Tech", url: "https://copperbaytech.com" },
  datePublished: "2026-06-10",
  url: "https://copperbaytech.com/blog/how-to-rank-on-google-maps-local-business",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://copperbaytech.com" },
    { "@type": "ListItem", position: 2, name: "Resources", item: "https://copperbaytech.com/blog" },
    { "@type": "ListItem", position: 3, name: "How to Get Your Sonoma County Business to Rank Higher on Google Maps", item: "https://copperbaytech.com/blog/how-to-rank-on-google-maps-local-business" },
  ],
};

const factors = [
  {
    label: "Relevance",
    desc: "How well your business matches what the searcher is looking for. Google evaluates your GBP category, description, services, and your website's content to determine relevance.",
  },
  {
    label: "Distance",
    desc: "How far your business is from the searcher (or the location they specified). You can't change your physical location, but you can optimize your service area to capture nearby searches.",
  },
  {
    label: "Prominence",
    desc: "How well-known and well-regarded your business is. This is where reviews, citations, links, and your website's authority all play in. It's also the factor you have the most control over.",
  },
];

const actions = [
  {
    title: "Complete your Google Business Profile — fully",
    body: "Every empty field is a missed ranking signal. Fill in your business hours, services list, description, attributes, and photos. Businesses with complete profiles rank higher, period.",
  },
  {
    title: "Get more reviews — and respond to all of them",
    body: "Reviews are the most powerful prominence signal Google tracks. The volume matters, the rating matters, and the recency matters. Ask every satisfied customer for a review the same day you do the work. Text them a direct link. Make it easy. And respond to every review — positive or negative — within 24 hours.",
  },
  {
    title: "Maintain consistent NAP across all directories",
    body: "NAP stands for Name, Address, Phone. If your business name is spelled differently on Yelp than on your GBP, or your old phone number is still on an industry directory, Google loses confidence in your listing. Audit your top 10 directory listings (Yelp, Yellow Pages, BBB, Nextdoor, etc.) and make sure they match exactly.",
  },
  {
    title: "Build local citations",
    body: "Citations are online mentions of your business name, address, and phone number — even without a link. Getting listed on local directories (Sonoma County Chamber of Commerce, local news sites, neighborhood apps) tells Google you're a real, established local business.",
  },
  {
    title: "Optimize your website for local keywords",
    body: "Your website and your GBP work together. If your site mentions the cities you serve, uses terms like 'Petaluma electrician' or 'Sonoma County IT support,' and has a clear service area, it reinforces your GBP's local relevance. City-specific landing pages can be particularly effective.",
  },
];

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Local SEO
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How to Get Your Sonoma County Business to Rank Higher on Google Maps
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>5 min read · June 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              When someone in Santa Rosa searches "accountant near me," they don&apos;t scroll through ten blue links — they click one of the three businesses in the Map Pack. That map pack is where local search is won or lost, and most small businesses have no idea why they&apos;re not in it.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              Here&apos;s how Google decides which businesses to show — and exactly what you can do to move up.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The 3 factors Google uses to rank local businesses
            </h2>

            <div className="space-y-4 mb-10">
              {factors.map((factor) => (
                <div key={factor.label} className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                  <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{factor.label}</h3>
                  <p className="text-sm text-[#3F3F46]/70 leading-relaxed">{factor.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              Distance is largely out of your control. Relevance and prominence are not. Here&apos;s how to work both.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Actionable steps to rank higher
            </h2>

            <div className="space-y-8 mb-10">
              {actions.map((action, i) => (
                <div key={action.title} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#18181B] flex items-center justify-center">
                      <span className="text-xs font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>0{i + 1}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{action.title}</h3>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed">{action.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              How to ask for reviews without being awkward about it
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Most businesses hesitate here, but the ask is simpler than you think:
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Do the work. Wait until the customer is happy — ideally right after a job well done or a compliment.",
                "Say it out loud first: \"Hey, we really appreciate your business. Would you mind leaving us a Google review? It helps us a lot.\"",
                "Then text or email them the direct link. Don't make them hunt for your business on Google.",
                "Follow up once if you don't hear back. Not more than that.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/10">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#F97316" />
                  <span className="text-sm text-[#3F3F46]/70">{tip}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What timeframe to expect
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Local SEO isn&apos;t instant. A fully optimized GBP with a handful of new reviews typically starts showing ranking improvements within 4–8 weeks. Consistent effort over 3–6 months can move you from invisible to the Map Pack for your most important keywords. For businesses in smaller Sonoma County cities like Sebastopol, Rohnert Park, or Healdsburg, competition is lower and results often come faster than in larger markets.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Find out where you stand</p>
              <p className="text-sm text-white/70 mb-4">
                We offer a free local SEO audit for Sonoma County businesses — we&apos;ll review your GBP, check your citation consistency, and tell you exactly what&apos;s holding your Maps ranking back.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Free local SEO audit <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Free Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
