/**
 * Renders a JSON-LD structured data block.
 *
 * Drop one (or more) of these into a page body to emit schema.org markup.
 * Use the small builder helpers below for the common schema types so the
 * shape stays consistent with the LocalBusiness data in Footer.tsx.
 */
import {
  SOCIAL_URLS,
  BUSINESS_NAME,
  PHONE_E164,
  EMAIL,
  SITE_URL,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  POSTAL_CODE,
  ADDRESS_COUNTRY,
  GEO,
  OPENING_HOURS,
} from "@/config/site";

// Local aliases keep the builders below terse; identity now flows from the
// single source of truth in config/site.ts (no more drift between files).
const PHONE = PHONE_E164;
const SITE = SITE_URL;

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
      "IT consulting, web development, and cybersecurity for small businesses — based in Sonoma County, CA, serving clients nationwide.",
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "$$",
    // Service-area business — city/region/postal published for local relevance,
    // but no street address (SAB guidance; mail suite is not a storefront). The
    // locality must match the Google Business Profile city.
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS_LOCALITY,
      addressRegion: ADDRESS_REGION,
      postalCode: POSTAL_CODE,
      addressCountry: ADDRESS_COUNTRY,
    },
    // Geographic anchor (Sonoma County) — AI/search use this to resolve a
    // service-area business with no street address.
    geo: {
      "@type": "GeoCoordinates",
      latitude: GEO.latitude,
      longitude: GEO.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...OPENING_HOURS.days],
        opens: OPENING_HOURS.opens,
        closes: OPENING_HOURS.closes,
      },
    ],
    // Nationwide (remote) plus the North Bay cities we also cover on-site — the
    // city list keeps local-pack relevance while "United States" signals reach.
    areaServed: [
      "United States",
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
    // The set of profiles that are the SAME entity (LinkedIn, GBP, Crunchbase,
    // Clutch, …). Emitted only when real URLs are configured in config/site.ts —
    // a sameAs to a dead/wrong profile corrupts the entity graph. This is the
    // strongest on-page lever for converting anonymous citations into named ones.
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
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
    // Based in Santa Rosa, CA (service-area — city/region/postal, no street),
    // working remotely with clients nationwide, so areaServed is the country.
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS_LOCALITY,
      addressRegion: ADDRESS_REGION,
      postalCode: POSTAL_CODE,
      addressCountry: ADDRESS_COUNTRY,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    // Only emit sameAs once real profile URLs are configured in config/site.ts —
    // linking to profiles that 404 or aren't ours corrupts the entity graph.
    ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      areaServed: "US",
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
