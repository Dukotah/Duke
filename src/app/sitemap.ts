import type { MetadataRoute } from "next";

const BASE_URL = "https://copperbaytech.com";

const blogSlugs = [
  "how-to-choose-an-it-company-sonoma-county",
  "is-my-small-business-website-hipaa-compliant",
  "5-signs-your-business-website-is-costing-you-customers",
  "how-much-does-a-website-cost-for-a-small-business",
  "do-small-businesses-need-cybersecurity",
  "what-is-managed-it-support",
  "restaurant-technology-guide-sonoma-county",
  "google-business-profile-tips-local-business",
  "signs-you-need-a-new-website",
  "winery-cybersecurity-sonoma-county",
  "how-to-back-up-your-small-business-data",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homepage: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = [
    "/web-development",
    "/it-support",
    "/cybersecurity",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const industryPages: MetadataRoute.Sitemap = [
    "/industries",
    "/industries/restaurants",
    "/industries/healthcare",
    "/industries/law-firms",
    "/industries/real-estate",
    "/industries/wineries",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = [
    "/petaluma",
    "/santa-rosa",
    "/sebastopol",
    "/rohnert-park",
    "/sonoma",
    "/healdsburg",
    "/windsor",
    "/novato",
    "/cotati",
    "/guerneville",
    "/bodega-bay",
    "/glen-ellen",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogPosts: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const otherPages: MetadataRoute.Sitemap = [
    "/tools",
    "/audit",
    "/reviews",
    "/privacy",
    "/case-studies",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...homepage,
    ...servicePages,
    ...industryPages,
    ...cityPages,
    ...blogIndex,
    ...blogPosts,
    ...otherPages,
  ];
}
