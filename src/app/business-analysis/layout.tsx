import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Business Analysis | Website, Google & Branding Audit | Copper Bay Tech",
  description:
    "Get a free, instant analysis of your business's online presence — website, Google profile, social media, and branding — plus the single biggest improvement you can make to grow. No cost, no obligation.",
  keywords:
    "free business analysis, online presence audit, Google Business Profile review, website analysis small business, branding audit Sonoma County, Copper Bay Tech",
  alternates: { canonical: "/business-analysis" },
  openGraph: {
    title: "Free Business Analysis | Copper Bay Tech",
    description:
      "Instant analysis of your website, Google presence, social media, and branding — and the #1 improvement to grow your business.",
    url: "https://copperbaytech.com/business-analysis",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Free Business Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Business Analysis | Copper Bay Tech",
    description:
      "Instant analysis of your website, Google presence, social media, and branding — and the #1 improvement to grow.",
    images: ["/og-image.png"],
  },
};

export default function BusinessAnalysisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
