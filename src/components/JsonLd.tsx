/**
 * Renders a JSON-LD structured data block.
 *
 * Drop one (or more) of these into a page body to emit schema.org markup.
 * Use the small builder helpers below for the common schema types so the
 * shape stays consistent with the LocalBusiness data in Footer.tsx.
 */

import {
  PHONE_HREF,
  EMAIL as SITE_EMAIL,
  SITE_URL,
  BUSINESS_NAME as SITE_BUSINESS_NAME,
  CITY,
  REGION,
  COUNTRY,
} from "@/config/site";

// Re-derive the local constants from the single source of truth in site.ts so
// the NAP (name / address / phone) stays in sync with Footer.tsx.
const PHONE = PHONE_HREF.replace("tel:", "");
const EMAIL = SITE_EMAIL;
const SITE = SITE_URL;
const BUSINESS_NAME = SITE_BUSINESS_NAME;

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
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressRegion: REGION,
      addressCountry: COUNTRY,
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
        addressLocality: CITY,
        addressRegion: REGION,
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
