import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const BASE = SITE_URL;

// Blog posts with their publish/update dates. Keep in sync with src/app/blog/*.
const blogPosts: Array<{ slug: string; lastModified: string; priority: number }> = [
  { slug: "5-signs-your-business-website-is-costing-you-customers", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "how-to-choose-an-it-company-sonoma-county", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "is-my-small-business-website-hipaa-compliant", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "how-much-does-a-website-cost-sonoma-county", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "managed-it-support-vs-break-fix-sonoma-county", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "hipaa-security-checklist-sonoma-county-healthcare", lastModified: "2026-05-01", priority: 0.7 },
];

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
    { url: `${BASE}/web-design-rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-windsor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-healdsburg`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/audit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/thank-you`, lastModified: now, changeFrequency: "never", priority: 0.1 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: "yearly",
    priority: post.priority,
  }));

  return [...staticRoutes, ...blogRoutes];
}
