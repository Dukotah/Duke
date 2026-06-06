// Which service × city landing pages actually exist, so a service-city page can
// auto-link the OTHER services available in the same city (matrix-driven internal
// linking + cross-sell). Keep in sync when adding pages.
//
// URL pattern is consistent: web → /web-design-<slug>, it → /it-support-<slug>,
// cyber → /cybersecurity-<slug>.

export const SERVICE_CITIES: Record<
  string,
  { slug: string; web: boolean; it: boolean; cyber: boolean }
> = {
  "Santa Rosa": { slug: "santa-rosa", web: true, it: true, cyber: true },
  "Petaluma": { slug: "petaluma", web: true, it: true, cyber: true },
  "Healdsburg": { slug: "healdsburg", web: true, it: true, cyber: true },
  "Windsor": { slug: "windsor", web: true, it: true, cyber: true },
  "Rohnert Park": { slug: "rohnert-park", web: true, it: true, cyber: true },
  "Sebastopol": { slug: "sebastopol", web: true, it: true, cyber: true },
  "Sonoma": { slug: "sonoma", web: true, it: true, cyber: true },
  "Guerneville": { slug: "guerneville", web: true, it: true, cyber: true },
  "Bodega Bay": { slug: "bodega-bay", web: true, it: true, cyber: true },
  "Glen Ellen": { slug: "glen-ellen", web: true, it: true, cyber: true },
  "Cotati": { slug: "cotati", web: true, it: true, cyber: false },
};

export const SERVICE_META = {
  web: { prefix: "web-design", label: "Web Design" },
  it: { prefix: "it-support", label: "IT Support" },
  cyber: { prefix: "cybersecurity", label: "Cybersecurity" },
} as const;
