import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Google Business Profile Tips That Actually Get You Found Locally | Copper Bay Tech",
  description:
    "Most local businesses leave their Google Business Profile half-filled. Here's exactly what to do to show up when customers are searching nearby.",
};

export default function Article() {
  return (
    <>
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
              Google Business Profile Tips That Actually Get You Found Locally
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              6 min read · March 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                When someone in Santa Rosa searches "electrician near me" or a tourist in Healdsburg searches "best lunch," Google decides which businesses to show in the local pack — those prominent map results at the top of the page. Your Google Business Profile is the single biggest lever you control in that decision. Here's how to use it.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Fill out every single field — completely
              </h2>
              <p className="mb-6">
                Google rewards completeness. A profile with every field filled out ranks better than one that's half-done. Most businesses skip the fields that feel unimportant — and those gaps quietly hurt their visibility.
              </p>
              <p className="mb-6">
                Go through every section:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Business name:</strong> Use your real business name — not stuffed with keywords. "Joe's Plumbing Santa Rosa CA Licensed" violates Google's guidelines and can get your listing suspended.</li>
                <li><strong>Categories:</strong> Choose a primary category carefully — it matters most. Add secondary categories that genuinely apply. Being listed as "Restaurant" and "Wine Bar" both helps if both are accurate.</li>
                <li><strong>Description:</strong> 750 characters. Write naturally for humans. Include what you do, who you serve, and what makes you different. Mention your city or neighborhood.</li>
                <li><strong>Hours:</strong> Keep them accurate, including holiday hours. Wrong hours are one of the most common causes of 1-star reviews.</li>
                <li><strong>Attributes:</strong> These include things like "Women-owned," "Outdoor seating," "Accepts credit cards." Customers filter by these.</li>
                <li><strong>Services/menu:</strong> If applicable, list your services or menu items with descriptions. This gives Google more content to match against search queries.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Photos: more than you think you need
              </h2>
              <p className="mb-6">
                Listings with photos receive 42% more requests for directions and 35% more clicks to websites, according to Google's own data. More importantly, photos help customers decide before they even visit your website.
              </p>
              <p className="mb-6">
                Upload at minimum:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>A clear, professional cover photo (this appears prominently in search results)</li>
                <li>Your storefront from the street (helps people find you)</li>
                <li>Interior photos showing the space</li>
                <li>Product or work photos — food dishes, finished projects, team at work</li>
                <li>Your team, if you're a service business (it builds trust)</li>
              </ul>
              <p className="mb-6">
                Add new photos regularly. Google sees activity as a signal of an engaged, active business.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Reviews: volume, recency, and response matter
              </h2>
              <p className="mb-6">
                Reviews are one of the strongest local ranking signals Google uses. More reviews, higher average rating, and recent reviews all contribute. But there's a more important point: <strong>how you respond to reviews signals engagement to both Google and future customers.</strong>
              </p>
              <p className="mb-6">
                Practical tactics:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>Generate a short review link from your Google Business Profile dashboard and put it in your email signature, on receipts, or on a table card with a QR code.</li>
                <li>Ask verbally at the point of highest satisfaction — right after a great meal, right after completing a project.</li>
                <li>Respond to every review within a few days. For positive reviews, be warm and specific. For negative ones, be professional, acknowledge the concern, and invite them to resolve it directly.</li>
                <li>Never respond to negative reviews with defensiveness or excuses — future readers are watching.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Posts: the underused feature that signals activity
              </h2>
              <p className="mb-6">
                Google Business Profile has a "Posts" feature that lets you publish updates — promotions, events, new products, announcements. Most businesses don't use it at all.
              </p>
              <p className="mb-6">
                Posts appear directly in your search listing and show up for 7 days (or longer for events). Posting once or twice a week signals to Google that your business is active. It also gives customers a reason to engage with your listing rather than bounce to a competitor's.
              </p>
              <p className="mb-6">
                Keep posts short, include a photo, and add a call-to-action button (Book, Order online, Learn more). A lunch special, a weekend event, or a seasonal promotion takes two minutes to post and keeps your listing fresh.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Q&A: answer questions before they're asked
              </h2>
              <p className="mb-6">
                The Q&A section on your Google listing is publicly editable — anyone can post a question, and anyone can answer it. If you don't monitor it, well-meaning but inaccurate answers from strangers can appear on your listing.
              </p>
              <p className="mb-6">
                Log in and proactively post the questions customers ask most often — parking, reservations, accessibility, payment methods, whether you're dog-friendly — and answer them yourself. This fills out your listing with useful information and reduces the chance of incorrect community answers.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Google Business Profile is free, and most of your competitors aren't using it well. Spend two hours getting it fully set up, then 15 minutes a week on maintenance. The local visibility payoff is significant.
                </p>
              </div>
            </div>

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
