/**
 * Renders a JSON-LD structured data block.
 *
 * Drop one (or more) of these into a page body to emit schema.org markup.
 * Use the small builder helpers below for the common schema types so the
 * shape stays consistent with the LocalBusiness data in Footer.tsx.
 */

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
    name: BUSINESS_NAME,
    description:
      "IT consulting, web development, and cybersecurity for Sonoma County businesses.",
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petaluma",
      addressRegion: "CA",
      addressCountry: "US",
    },
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
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    ...(opts.url ? { url: opts.url } : {}),
    provider: {
      "@type": "LocalBusiness",
      name: BUSINESS_NAME,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Petaluma",
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
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    datePublished: opts.datePublished,
    author: { "@type": "Organization", name: BUSINESS_NAME },
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
    logo: `${SITE}/logos/logo-horizontal.png`,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petaluma",
      addressRegion: "CA",
      postalCode: "94952",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 38.2324,
        longitude: -122.6367,
      },
      geoRadius: "80000",
    },
    // Update sameAs with real profile URLs once accounts are confirmed live.
    sameAs: [
      "https://www.linkedin.com/company/copper-bay-tech",
      "https://www.facebook.com/copperbaytech",
      "https://www.yelp.com/biz/copper-bay-tech-petaluma",
    ],
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
