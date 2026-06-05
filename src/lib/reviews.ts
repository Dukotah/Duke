// Single source of truth for REAL, client-approved reviews.
//
// ⚠️ LEGAL + SEO GUARDRAIL: only genuine reviews that a client has given you
// written permission to publish belong in `REAL_REVIEWS`. Review /
// AggregateRating structured data is emitted *only* when this array is
// non-empty — so the site never ships star-rating schema it can't back up.
// Publishing fake/AI reviews as real violates the FTC rule on deceptive
// endorsements (16 CFR Part 465) and Google's structured-data policy (which
// can earn a manual penalty). Keep this honest and the stars are pure upside.
//
// HOW TO ADD A REAL REVIEW
//   1. Get the client's explicit OK to publish their words + name/business.
//   2. Add an entry below (rating 1–5, the date they gave it, the source).
//   3. That's it — the reviews page renders it and the rich-result schema
//      (stars in search) turns on automatically across the site.
//
// Best source of a steady stream: your Google Business Profile. Set
// GOOGLE_REVIEW_URL in src/config/site.ts and the "Leave a review" CTA will
// point happy clients straight at it.

export interface ClientReview {
  /** Real name, published with permission. */
  author: string;
  business: string;
  city: string;
  /** 1–5. */
  rating: number;
  quote: string;
  /** ISO date (YYYY-MM-DD) the review was given. */
  date: string;
  source?: "Google" | "Yelp" | "Direct";
}

// Empty until you have genuine, approved reviews. See header.
export const REAL_REVIEWS: ClientReview[] = [];

export function hasRealReviews(): boolean {
  return REAL_REVIEWS.length > 0;
}

export interface Aggregate {
  ratingValue: number; // average, 1 decimal
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

/** Computed aggregate, or null when there are no real reviews yet. */
export function aggregateRating(): Aggregate | null {
  if (!REAL_REVIEWS.length) return null;
  const sum = REAL_REVIEWS.reduce((t, r) => t + r.rating, 0);
  return {
    ratingValue: Math.round((sum / REAL_REVIEWS.length) * 10) / 10,
    reviewCount: REAL_REVIEWS.length,
    bestRating: 5,
    worstRating: 1,
  };
}

type Json = Record<string, unknown>;

const SITE = "https://copperbaytech.com";
const BUSINESS_NAME = "Copper Bay Tech";

/**
 * LocalBusiness schema carrying real reviews + their aggregate, the
 * Google-recommended way to earn review rich results. Returns null when there
 * are no real reviews, so callers can `{schema && <JsonLd schema={schema} />}`.
 */
export function reviewsSchema(): Json | null {
  const agg = aggregateRating();
  if (!agg) return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_NAME,
    url: SITE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: agg.ratingValue,
      reviewCount: agg.reviewCount,
      bestRating: agg.bestRating,
      worstRating: agg.worstRating,
    },
    review: REAL_REVIEWS.map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.quote,
    })),
  };
}
