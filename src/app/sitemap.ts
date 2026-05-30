import type { MetadataRoute } from "next";

const BASE = "https://copperbaytech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/assessment`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pricing`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools`,      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/privacy`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,      lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const blogPosts: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/blog/how-to-choose-an-it-company-sonoma-county`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/is-my-small-business-website-hipaa-compliant`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog/5-signs-your-business-website-is-costing-you-customers`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  return [...staticPages, ...blogPosts];
}
