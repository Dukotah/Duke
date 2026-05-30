import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://copperbaytech.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${base}/blog/how-to-choose-an-it-company-sonoma-county`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/is-my-small-business-website-hipaa-compliant`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/5-signs-your-business-website-is-costing-you-customers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sebastopol`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sonoma`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
