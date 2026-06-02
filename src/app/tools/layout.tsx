import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Website Tools | Speed, SSL, DNS & Security Checks | Copper Bay Tech",
  description:
    "Free instant tools for your website: speed and performance scoring, SSL certificate and DNS checks, security header scans, broken-link detection, and SEO schema checks.",
  keywords:
    "free website tools, SSL checker, DNS lookup, security headers scanner, broken link checker, website speed test, SEO schema checker",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Website Tools | Copper Bay Tech",
    description:
      "Free instant checks for speed, SSL, DNS, security headers, broken links, and SEO schema.",
    url: "https://copperbaytech.com/tools",
    siteName: "Copper Bay Tech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Tools | Copper Bay Tech",
    description:
      "Free instant checks for speed, SSL, DNS, security headers, broken links, and SEO schema.",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
