import { describe, expect, it } from "vitest";
import {
  REAL_REVIEWS,
  hasRealReviews,
  aggregateRating,
  reviewsSchema,
  type ClientReview,
} from "./reviews";

const sample: ClientReview[] = [
  { author: "A", business: "Biz A", city: "Petaluma", rating: 5, quote: "Great.", date: "2026-05-01" },
  { author: "B", business: "Biz B", city: "Santa Rosa", rating: 4, quote: "Good.", date: "2026-05-02" },
];

describe("reviews — FTC-safe gating", () => {
  // The single most important invariant: no real reviews => no rating schema,
  // ever. This is what keeps the site compliant by default.
  it("ships empty by default so no rating schema is emitted", () => {
    expect(REAL_REVIEWS).toHaveLength(0);
    expect(hasRealReviews()).toBe(false);
    expect(aggregateRating()).toBeNull();
    expect(reviewsSchema()).toBeNull();
  });

  it("returns null for an explicitly empty set", () => {
    expect(aggregateRating([])).toBeNull();
    expect(reviewsSchema([])).toBeNull();
  });
});

describe("reviews — aggregate math", () => {
  it("averages ratings and rounds to one decimal", () => {
    const agg = aggregateRating(sample);
    expect(agg).not.toBeNull();
    expect(agg!.ratingValue).toBe(4.5);
    expect(agg!.reviewCount).toBe(2);
    expect(agg!.bestRating).toBe(5);
    expect(agg!.worstRating).toBe(1);
  });

  it("rounds a repeating average to one decimal", () => {
    const three: ClientReview[] = [
      { ...sample[0], rating: 5 },
      { ...sample[0], rating: 5 },
      { ...sample[0], rating: 4 },
    ];
    expect(aggregateRating(three)!.ratingValue).toBe(4.7); // 14/3 = 4.666…
  });
});

describe("reviews — schema shape", () => {
  it("emits LocalBusiness with AggregateRating + one Review per entry", () => {
    const schema = reviewsSchema(sample) as Record<string, unknown>;
    expect(schema["@type"]).toBe("LocalBusiness");
    const agg = schema.aggregateRating as Record<string, unknown>;
    expect(agg["@type"]).toBe("AggregateRating");
    expect(agg.ratingValue).toBe(4.5);
    expect(agg.reviewCount).toBe(2);
    const review = schema.review as unknown[];
    expect(review).toHaveLength(2);
    const first = review[0] as Record<string, unknown>;
    expect(first["@type"]).toBe("Review");
    expect((first.author as Record<string, unknown>).name).toBe("A");
    expect((first.reviewRating as Record<string, unknown>).ratingValue).toBe(5);
  });
});
