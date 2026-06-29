// Which service × city landing pages actually exist, so a service-city page can
// auto-link the OTHER services available in the same city (matrix-driven internal
// linking + cross-sell). Keep in sync when adding pages.
//
// URL pattern is consistent: web → /web-design-<slug>, it → /it-support-<slug>,
// cyber → /cybersecurity-<slug>, custom → /software-development-<slug>.

export const SERVICE_CITIES: Record<
  string,
  { slug: string; web: boolean; it: boolean; cyber: boolean; custom: boolean }
> = {
  "Santa Rosa": { slug: "santa-rosa", web: true, it: true, cyber: true, custom: true },
  "Petaluma": { slug: "petaluma", web: true, it: true, cyber: true, custom: true },
  "Healdsburg": { slug: "healdsburg", web: true, it: true, cyber: true, custom: true },
  "Windsor": { slug: "windsor", web: true, it: true, cyber: true, custom: true },
  "Rohnert Park": { slug: "rohnert-park", web: true, it: true, cyber: true, custom: true },
  "Sebastopol": { slug: "sebastopol", web: true, it: true, cyber: true, custom: true },
  "Sonoma": { slug: "sonoma", web: true, it: true, cyber: true, custom: true },
  "Guerneville": { slug: "guerneville", web: true, it: true, cyber: true, custom: true },
  "Bodega Bay": { slug: "bodega-bay", web: true, it: true, cyber: true, custom: true },
  "Glen Ellen": { slug: "glen-ellen", web: true, it: true, cyber: true, custom: true },
  "Cotati": { slug: "cotati", web: true, it: true, cyber: false, custom: true },
};

export const SERVICE_META = {
  web: { prefix: "web-design", label: "Web Design" },
  it: { prefix: "it-support", label: "IT Support" },
  cyber: { prefix: "cybersecurity", label: "Cybersecurity" },
  custom: { prefix: "software-development", label: "Custom Software" },
} as const;
