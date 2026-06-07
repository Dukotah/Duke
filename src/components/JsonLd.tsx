/**
 * Renders a JSON-LD structured data block.
 *
 * Drop one (or more) of these into a page body to emit schema.org markup.
 * Use the small builder helpers below for the common schema types so the
 * shape stays consistent with the LocalBusiness data in Footer.tsx.
 */
import { SOCIAL_URLS } from "@/config/site";

const PHONE = "+17072396725";
const EMAIL = "contact@copperbaytech.com";
const SITE = "https://copperbaytech.com";
const BUSINESS_NAME = "Copper Bay Tech";

type Json = Record<string, unknown>;

export default function JsonLd({ schema }: { schema: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** LocalBusiness — use on the home page and any location landing page. */
export function localBusinessSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    // Stable @id so every page's LocalBusiness resolves to ONE entity in
    // Google's graph (entity disambiguation).
    "@id": `${SITE}/#business`,
    name: BUSINESS_NAME,
    description:
      "IT consulting, web development, and cybersecurity for Sonoma County businesses.",
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "$$",
    // Service-area business — no public storefront, so no addressLocality.
    address: {
      "@type": "PostalAddress",
      addressRegion: "CA",
      addressCountry: "US",
    },
    // Geographic anchor (Sonoma County midpoint) — AI/search use this to resolve
    // a service-area business with no street address.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.4405,
      longitude: -122.7144,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      "Petaluma",
      "Santa Rosa",
      "Sebastopol",
      "Rohnert Park",
      "Sonoma",
      "Bodega Bay",
      "Cotati",
      "Windsor",
      "Healdsburg",
    ],
    serviceType: [
      "Web Development",
      "IT Consulting",
      "Cybersecurity",
      "Network Setup",
      "Process Automation",
    ],
  };
}

/** Service — use on service / location landing pages. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  areaServed: Json | string;
  url?: string;
  /** Optional price range (USD) — emitted as a schema.org AggregateOffer. */
  offer?: { low: number; high: number };
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.offer
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice: opts.offer.low,
            highPrice: opts.offer.high,
          },
        }
      : {}),
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        addressRegion: "CA",
      },
    },
    areaServed: opts.areaServed,
  };
}

/** BlogPosting — use on individual blog articles. */
export function blogPostingSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  /** Optional last-modified date (E-E-A-T freshness). Defaults to datePublished. */
  dateModified?: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    // Named expert author (E-E-A-T) — Google prefers a Person for articles.
    author: {
      "@type": "Person",
      name: "Dukotah Hutcheon",
      url: `${SITE}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS_NAME,
      url: SITE,
    },
  };
}

/** FAQPage — use anywhere a list of question/answer pairs is shown. */
export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * WebSite — emit once on the home page. No SearchAction/potentialAction: the
 * site has no working site-search endpoint, and declaring a Sitelinks Searchbox
 * that 404s on `?q=` is invalid and gets ignored/flagged by Google. Add it back
 * only once /blog (or a /search route) actually handles a query parameter.
 */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_NAME,
    url: SITE,
  };
}

/**
 * BreadcrumbList — use on service, location, and blog pages to signal hierarchy.
 * Pass items as [{name, url}] — the last item should omit url (current page).
 */
export function breadcrumbSchema(
  items: { name: string; url?: string }[]
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

/**
 * Organization — emit once on the home page for AI knowledge-graph recognition.
 * Fill in real sameAs URLs once social/directory profiles are live.
 */
export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_NAME,
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/logos/logo-horizontal.png`,
      width: 400,
      height: 60,
    },
    telephone: PHONE,
    email: EMAIL,
    // Service-area business — no public storefront address; we serve a radius
    // (see areaServed below). Omitting addressLocality avoids asserting an HQ city.
    address: {
      "@type": "PostalAddress",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 38.4405,
        longitude: -122.7144,
      },
      geoRadius: "80000",
    },
    // Only emit sameAs once real profile URLs are configured in config/site.ts —
    // linking to profiles that 404 or aren't ours corrupts the entity graph.
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      areaServed: "US-CA",
      availableLanguage: "English",
    },
  };
}

/**
 * AggregateRating — add to the home page once you have real Google / Yelp
 * review data. Replace ratingValue, reviewCount, and bestRating with actuals.
 *
 * Example usage in page.tsx:
 *   <JsonLd schema={aggregateRatingSchema({ ratingValue: 5.0, reviewCount: 14 })} />
 */
export function aggregateRatingSchema(opts: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BUSINESS_NAME,
    url: SITE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue,
      reviewCount: opts.reviewCount,
      bestRating: opts.bestRating ?? 5,
      worstRating: 1,
    },
  };
}
