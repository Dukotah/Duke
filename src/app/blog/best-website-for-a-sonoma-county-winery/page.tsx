import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "What Makes a Great Website for a Sonoma County Winery? | Copper Bay Tech",
  description:
    "Tasting room visits, wine club signups, and direct-to-consumer sales all start with your website. Here's what Sonoma County wineries get wrong — and what works.",
  alternates: { canonical: "https://copperbaytech.com/blog/best-website-for-a-sonoma-county-winery" },
  openGraph: {
    title: "What Makes a Great Website for a Sonoma County Winery?",
    description:
      "Tasting room visits, wine club signups, and direct-to-consumer sales all start with your website. Here's what Sonoma County wineries get wrong — and what works.",
    url: "https://copperbaytech.com/blog/best-website-for-a-sonoma-county-winery",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const mustHaves = [
  "Tasting room reservation system — integrated, not a PDF form or a phone number buried in the footer",
  "Mobile-first design — most visitors searching 'wine tasting Sonoma' are on their phones, deciding on the spot",
  "Fast load times — slow sites kill impulse visits before they happen",
  "Wine club signup with a clear value proposition above the fold",
  "Online shop with direct-to-consumer shipping capability",
  "Hours, address, and directions instantly visible — not three clicks deep",
  "Event calendar for releases, dinners, and harvest events",
  "Local SEO targeting 'wine tasting [city]' and 'Sonoma County winery' searches",
];

const mistakes = [
  { title: "Flash-heavy or video-autoplay homepages", desc: "They're slow, they frustrate mobile visitors, and they tank your Google ranking. Beautiful doesn't have to mean slow." },
  { title: "No online reservations", desc: "If someone has to call to book a tasting, a percentage of them won't bother. Especially younger buyers who expect instant booking." },
  { title: "A wine shop that doesn't actually work", desc: "Broken checkout, no DTC shipping options, or a third-party shop that looks completely different from your site — all of these lose sales." },
  { title: "Ignoring local SEO", desc: "Tourists and locals search 'wine tasting near me' or 'Sonoma winery open Saturday.' If you're not ranking for those, you're invisible to the highest-intent visitors." },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "What Makes a Great Website for a Sonoma County Winery?", description: "Tasting room visits, wine club signups, and direct-to-consumer sales all start with your website. Here's what Sonoma County wineries get wrong — and what works.", url: "https://copperbaytech.com/blog/best-website-for-a-sonoma-county-winery", datePublished: "2026-05-20" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Best Winery Website Sonoma County" }])} />
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
              What Makes a Great Website for a Sonoma County Winery?
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>5 min read · May 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
              For most Sonoma County wineries, the website is the first — and sometimes only — impression a potential visitor gets before deciding whether to show up. And yet, most winery websites are slow, hard to navigate on a phone, and missing basic things like a functional reservation system or an address that&apos;s easy to find.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              Here&apos;s what actually moves the needle for tasting room visits, wine club signups, and DTC sales.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The non-negotiables
            </h2>
            <ul className="space-y-3 mb-10">
              {mustHaves.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#16A34A" />
                  <span className="text-sm text-[#3F3F46]/70">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The most common mistakes
            </h2>
            <div className="space-y-5 mb-10">
              {mistakes.map((m) => (
                <div key={m.title} className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                  <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{m.title}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What does a winery website actually cost?
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              A professionally built winery site with reservations, an online shop, events calendar, and local SEO typically runs <strong className="text-[#18181B]">$4,000–$7,000</strong>. That&apos;s a fraction of what a single slow weekend costs in missed tasting room revenue.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Template builders like Squarespace and Wix are an option, but they come with real tradeoffs: slow performance, limited reservation integrations, and little control over local SEO. For a winery doing meaningful volume, a custom-built site pays for itself quickly.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
              <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>Quick self-check</p>
              <p className="text-sm text-[#3F3F46]/60">
                Pull out your phone and Google &quot;wine tasting [your city].&quot; Does your winery appear? Click your website. Does it load in under 3 seconds? Is your reservation link immediately visible? If any of those are a no — there&apos;s room to grow.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Get a Free Website Review <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
