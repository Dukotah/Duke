import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Star, ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { GOOGLE_REVIEW_URL } from "@/config/site";
import { REAL_REVIEWS, hasRealReviews, aggregateRating, reviewsSchema } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Client Reviews | Copper Bay Tech — Sonoma County IT & Web",
  description:
    "Reviews of Copper Bay Tech's IT support, web development, and cybersecurity work for Sonoma County small businesses.",
};

// Illustrative samples shown ONLY until real, client-approved reviews exist in
// src/lib/reviews.ts (REAL_REVIEWS). Once that array is populated, the page
// renders the real reviews instead and emits Review/AggregateRating schema.
// We never emit rating schema for these samples — see src/lib/reviews.ts.
const SAMPLE_REVIEWS = [
  {
    name: "Maria Santos",
    business: "Petaluma Bakery",
    city: "Petaluma",
    quote:
      "Duke completely transformed our online presence. Our old website was embarrassing — slow, hard to navigate, and not mobile-friendly. The new site looks amazing and we've been getting so many more calls and orders through it. Worth every penny.",
  },
  {
    name: "James Reilly",
    business: "Windsor Law Office",
    city: "Windsor",
    quote:
      "We had a serious IT mess on our hands — old hardware, no backups, spotty internet. Copper Bay Tech came in, assessed everything, and had us on a proper managed IT plan within a week. We haven't had a single outage since. I wish we'd called sooner.",
  },
  {
    name: "Nadia Pham",
    business: "Sebastopol Wellness Clinic",
    city: "Sebastopol",
    quote:
      "As a healthcare provider I was genuinely worried about HIPAA compliance. Duke walked us through a full audit, explained everything in plain language, and helped us fix the gaps. I finally feel confident that patient data is protected. Great communicator.",
  },
  {
    name: "Tom Garcia",
    business: "Healdsburg Restaurant",
    city: "Healdsburg",
    quote:
      "We had no website at all — just a Facebook page. Copper Bay Tech built us a beautiful site and helped us set up Google Business. Reservation requests went through the roof. Guests constantly tell us they found us online. Couldn't be happier.",
  },
  {
    name: "Lisa Chen",
    business: "Santa Rosa Real Estate",
    city: "Santa Rosa",
    quote:
      "Fast, professional, and they actually explain what they're doing. I had my laptop crash right before a big listing presentation and Duke had me back up and running in under an hour — remotely! That kind of response time is unheard of.",
  },
  {
    name: "Brian O'Neill",
    business: "Sonoma Winery",
    city: "Sonoma",
    quote:
      "We needed our e-commerce site rebuilt from scratch and wanted someone local who understood our brand. The team at Copper Bay Tech nailed it — the new site is fast, elegant, and our online wine sales have increased significantly since launch.",
  },
  {
    name: "Karen Webb",
    business: "Rohnert Park Dental",
    city: "Rohnert Park",
    quote:
      "Switching IT providers felt daunting but Copper Bay Tech made the transition completely painless. They handled everything — migrated our systems, trained our staff, and set up proper security. Our whole team noticed the difference immediately.",
  },
  {
    name: "Scott Martinez",
    business: "Cotati Auto Repair",
    city: "Cotati",
    quote:
      "I didn't think a small shop like mine needed a real website, but after seeing what Duke built for us and how many new customers mention finding us on Google, I'm a total convert. Simple, clean site — and it actually shows up in search results.",
  },
];

function StarRow({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "#F97316" : "none"}
          stroke={i < rating ? "none" : "#F97316"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const live = hasRealReviews();
  const agg = aggregateRating();
  const schema = reviewsSchema();
  // Normalize to one display shape whether real or sample.
  const displayReviews = live
    ? REAL_REVIEWS.map((r) => ({ name: r.author, business: r.business, city: r.city, quote: r.quote, rating: r.rating }))
    : SAMPLE_REVIEWS.map((r) => ({ ...r, rating: 5 }));

  return (
    <>
      {/* Emits Review + AggregateRating only when REAL_REVIEWS is populated. */}
      {schema && <JsonLd schema={schema} />}
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Client Reviews
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What working with us{" "}
              <span style={{ color: "#F97316" }}>looks like.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Copper Bay Tech helps Sonoma County business owners with IT support, cybersecurity, and web development.{live ? " Here's what they say." : " The examples below illustrate the kind of work and outcomes we aim for."}
            </p>
            {live && agg ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80" style={{ fontFamily: "var(--font-body)" }}>
                <StarRow rating={Math.round(agg.ratingValue)} />
                <span className="font-semibold text-white">{agg.ratingValue.toFixed(1)}</span>
                <span className="text-white/55">· {agg.reviewCount} review{agg.reviewCount === 1 ? "" : "s"}</span>
              </div>
            ) : (
              <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/55" style={{ fontFamily: "var(--font-body)" }}>
                Illustrative sample feedback — not verified client reviews.
              </p>
            )}
          </div>
        </section>

        {/* Reviews grid */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {displayReviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl bg-white border border-[#18181B]/10 p-7 shadow-sm flex flex-col gap-4"
                >
                  <StarRow rating={review.rating} />
                  <p
                    className="text-[#3F3F46]/80 leading-relaxed text-sm flex-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div>
                    <p
                      className="font-bold text-[#18181B] text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {review.name}
                    </p>
                    <p
                      className="text-xs text-[#F97316]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {review.business} &mdash; {review.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to become our next success story?
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Get a free consultation and see what Copper Bay Tech can do for your Sonoma County business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
              {GOOGLE_REVIEW_URL && (
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-white border border-white/25 hover:border-white/50 transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Star size={15} fill="currentColor" stroke="none" /> Leave us a Google review
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
