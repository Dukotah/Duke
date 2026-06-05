import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Cost Estimator — What Should a Small-Business Website Cost? | Copper Bay Tech",
  description:
    "Free instant website cost estimator for Sonoma County small businesses. Pick your pages and features and get an honest ballpark price in seconds — no contact form, no sales call required.",
  keywords:
    "website cost estimator, how much does a website cost, small business website price, web design cost Sonoma County, website quote calculator",
  alternates: { canonical: "/tools/website-cost-estimator" },
  openGraph: {
    title: "What Should Your Website Cost? — Free Estimator | Copper Bay Tech",
    description:
      "Pick your pages and features and get an honest website price in seconds. Built on the same numbers we quote real Sonoma County businesses.",
    url: "https://copperbaytech.com/tools/website-cost-estimator",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Website Cost Estimator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Should Your Website Cost? — Free Estimator",
    description: "Get an honest website price in seconds. No contact form, no sales call.",
    images: ["/og-image.png"],
  },
};

export default function WebsiteCostEstimatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
