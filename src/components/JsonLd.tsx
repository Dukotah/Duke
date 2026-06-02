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

// Stable @id anchors so the LocalBusiness / Organization / WebSite nodes can
// reference one another instead of duplicating the entity. This is what helps
// search and AI engines treat "Copper Bay Tech" as a single, well-defined brand.
const ORG_ID = `${SITE}/#organization`;
const LOCAL_BUSINESS_ID = `${SITE}/#localbusiness`;

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
    "@id": LOCAL_BUSINESS_ID,
    name: BUSINESS_NAME,
    description:
      "IT consulting, web development, and cybersecurity for Sonoma County businesses.",
    url: SITE,
    telephone: PHONE,
    email: EMAIL,
    // Coarse price band (under 100 chars) — Google recommends priceRange for
    // LocalBusiness. "$$" signals mid-market without publishing exact figures.
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petaluma",
      addressRegion: "CA",
      addressCountry: "US",
    },
    // Petaluma, CA — public coordinates, improves "near me" matching.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.2324,
      longitude: -122.6367,
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
 * Organization — emit once, site-wide. This is the brand/publisher entity that
 * search and AI engines use to disambiguate "Copper Bay Tech". When real social
 * profiles exist (Google Business Profile, LinkedIn, etc.), add their URLs to
 * `sameAs` to strengthen entity recognition.
 */
export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BUSINESS_NAME,
    url: SITE,
    email: EMAIL,
    telephone: PHONE,
    logo: `${SITE}/logos/logo-square.png`,
    image: `${SITE}/og-image.png`,
    description:
      "IT support, web development, and cybersecurity for small businesses in Sonoma County, California.",
    founder: { "@type": "Person", name: "Duke Hutcheon" },
    areaServed: { "@type": "AdministrativeArea", name: "Sonoma County, California" },
    // sameAs: ["https://www.linkedin.com/company/...", "https://g.page/..."],
  };
}

/** WebSite — emit once, site-wide. Clarifies branded search and ties to the Org. */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: BUSINESS_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/**
 * BreadcrumbList — use on location and blog pages. Purely structural (no data
 * to fabricate) and eligible for breadcrumb rich results. Omit `url` on the
 * final (current-page) crumb, per Google's guidance.
 */
export function breadcrumbSchema(items: { name: string; url?: string }[]): Json {
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
