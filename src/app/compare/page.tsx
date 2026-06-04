import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "Website Competitor Analysis Tool | Copper Bay Tech",
  description: "Compare your website against competitors. Check speed, SSL, SEO, and mobile scores side by side — free tool from Copper Bay Tech.",
  alternates: { canonical: "https://copperbaytech.com/compare" },
  openGraph: {
    title: "Website Competitor Analysis | Copper Bay Tech",
    description: "Compare your site against competitors on speed, SSL, SEO, and mobile.",
    url: "https://copperbaytech.com/compare",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ComparePage() {
  return <CompareClient />;
}
