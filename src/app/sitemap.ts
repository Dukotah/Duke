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
    { url: `${base}/web-development`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/it-support`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cybersecurity`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${base}/blog/ransomware-protection-small-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/best-website-for-a-sonoma-county-winery`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/how-much-does-it-support-cost-for-small-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sebastopol`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sonoma`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/healdsburg`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/windsor`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/novato`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    {
      url: `${base}/blog/google-business-profile-setup-sonoma-county`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/google-workspace-vs-microsoft-365-small-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/how-to-rank-on-google-maps-local-business`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
