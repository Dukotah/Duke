import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Reviews | Copper Bay Tech — Sonoma County IT & Web",
  description:
    "Read what Sonoma County business owners say about Copper Bay Tech. 5-star IT support and web development reviews from local clients across Petaluma, Santa Rosa, Healdsburg, and more.",
};

const aggregateRatingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "14",
    bestRating: "5",
    worstRating: "1",
  },
};

const reviews = [
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

const reviewsJsonLd = reviews.map((r) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  author: {
    "@type": "Person",
    name: r.name,
  },
  reviewBody: r.quote,
  reviewRating: {
    "@type": "Rating",
    ratingValue: "5",
    bestRating: "5",
  },
  itemReviewed: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
  },
}));

function StarRow() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill="#F97316" stroke="none" />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingJsonLd) }}
      />
      {reviewsJsonLd.map((r, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }}
        />
      ))}
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
              Real results.{" "}
              <span style={{ color: "#F97316" }}>Real businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-6" style={{ fontFamily: "var(--font-body)" }}>
              Sonoma County business owners trust Copper Bay Tech for IT support, cybersecurity, and web development. Here&apos;s what they have to say.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#F97316" stroke="none" />
                ))}
              </div>
              <span className="text-white font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                5.0
              </span>
              <span className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                — 14 reviews
              </span>
            </div>
          </div>
        </section>

        {/* Reviews grid */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl bg-white border border-[#18181B]/10 p-7 shadow-sm flex flex-col gap-4"
                >
                  <StarRow />
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
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
