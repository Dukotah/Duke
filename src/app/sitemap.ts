import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://copperbaytech.com";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/blog/how-to-choose-an-it-company-sonoma-county`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/is-my-small-business-website-hipaa-compliant`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/5-signs-your-business-website-is-costing-you-customers`,
      lastModified: new Date("2026-03-01"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/tools`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
