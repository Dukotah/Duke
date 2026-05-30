import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://copperbaytech.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/audit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog/why-slow-websites-hurt-sonoma-county-businesses`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.8 },
  ];
}
