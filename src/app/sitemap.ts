import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const BASE = SITE_URL;

const blogPosts: Array<{ slug: string; lastModified: string; priority: number }> = [
  // June 2026
  { slug: "how-ai-helps-sonoma-county-small-businesses", lastModified: "2026-06-02", priority: 0.8 },
  { slug: "small-business-cybersecurity-threats-sonoma-county", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "google-business-profile-setup-sonoma-county", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "google-workspace-vs-microsoft-365-small-business", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "how-to-rank-on-google-maps-local-business", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "how-to-speed-up-your-business-website", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "small-business-website-cost-guide", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "what-is-a-managed-service-provider", lastModified: "2026-06-01", priority: 0.8 },
  { slug: "why-your-business-needs-mfa", lastModified: "2026-06-01", priority: 0.8 },
  // May 2026
  { slug: "best-website-for-a-sonoma-county-winery", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "hipaa-security-checklist-sonoma-county-healthcare", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "how-much-does-a-website-cost-sonoma-county", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "how-much-does-it-support-cost-for-small-business", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "how-to-back-up-your-small-business-data", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "how-to-choose-an-it-company-sonoma-county", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "managed-it-support-vs-break-fix-sonoma-county", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "ransomware-protection-small-business", lastModified: "2026-05-01", priority: 0.7 },
  { slug: "why-slow-websites-hurt-sonoma-county-businesses", lastModified: "2026-05-01", priority: 0.7 },
  // April 2026
  { slug: "how-much-should-a-small-business-website-cost", lastModified: "2026-04-01", priority: 0.7 },
  { slug: "is-my-small-business-website-hipaa-compliant", lastModified: "2026-04-01", priority: 0.7 },
  { slug: "signs-you-need-a-new-website", lastModified: "2026-04-01", priority: 0.7 },
  { slug: "winery-cybersecurity-sonoma-county", lastModified: "2026-04-01", priority: 0.7 },
  // March 2026
  { slug: "5-signs-your-business-website-is-costing-you-customers", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "cloud-vs-local-server-small-business", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "google-business-profile-tips-local-business", lastModified: "2026-03-01", priority: 0.6 },
  { slug: "restaurant-technology-guide-sonoma-county", lastModified: "2026-03-01", priority: 0.6 },
  // Feb 2026
  { slug: "do-small-businesses-need-cybersecurity", lastModified: "2026-02-01", priority: 0.6 },
  { slug: "what-is-managed-it-support", lastModified: "2026-02-01", priority: 0.6 },
  { slug: "what-is-ransomware-and-how-do-you-stop-it", lastModified: "2026-02-01", priority: 0.6 },
  { slug: "why-your-google-business-profile-matters", lastModified: "2026-02-01", priority: 0.6 },
  // Jan 2026
  { slug: "how-much-does-a-website-cost-for-a-small-business", lastModified: "2026-01-01", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/web-design-sonoma-county`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/it-support-sonoma-county`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cybersecurity-small-business`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ai-integration-small-business`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/web-design-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-healdsburg`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-windsor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-sebastopol`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-healdsburg`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-windsor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-rohnert-park`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-sebastopol`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-sebastopol`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-sonoma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-sonoma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-sonoma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-guerneville`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-bodega-bay`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-glen-ellen`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-guerneville`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-guerneville`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-bodega-bay`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-bodega-bay`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-glen-ellen`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-glen-ellen`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/web-design-cotati`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-cotati`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-windsor`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-support-healdsburg`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-santa-rosa`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/cybersecurity-petaluma`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/missed-call-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/website-cost-estimator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/schedule`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/get-started`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/it-health-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/audit`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Industry pages
    { url: `${BASE}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries/healthcare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries/wineries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries/restaurants`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries/law-firms`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/industries/real-estate`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Services hub
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Free tools
    { url: `${BASE}/tools/health-check`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/compliance`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/email-headers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/password`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // Case study detail pages
    { url: `${BASE}/case-studies/petaluma-home-staging`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/case-studies/santa-rosa-insurance`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/case-studies/sebastopol-family-dental`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    // City / service-area landing pages
    ...[
      "petaluma",
      "santa-rosa",
      "sebastopol",
      "rohnert-park",
      "sonoma",
      "bodega-bay",
      "cotati",
      "windsor",
      "healdsburg",
      "glen-ellen",
      "guerneville",
      "novato",
    ].map((city) => ({
      url: `${BASE}/${city}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: "yearly",
    priority: post.priority,
  }));

  return [...staticRoutes, ...blogRoutes];
}
