import type { MetadataRoute } from "next";

const BASE = "https://copperbaytech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/web-design-sonoma-county`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/it-support-sonoma-county`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cybersecurity-small-business`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/web-design-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/audit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: `${BASE}/blog/5-signs-your-business-website-is-costing-you-customers`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/blog/how-to-choose-an-it-company-sonoma-county`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/blog/is-my-small-business-website-hipaa-compliant`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/blog/how-much-does-a-website-cost-sonoma-county`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/managed-it-support-vs-break-fix-sonoma-county`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/hipaa-security-checklist-sonoma-county-healthcare`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/small-business-cybersecurity-threats-sonoma-county`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    { url: `${BASE}/it-support-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/thank-you`, lastModified: now, changeFrequency: "never", priority: 0.1 },
  ];

  return staticRoutes;
}
