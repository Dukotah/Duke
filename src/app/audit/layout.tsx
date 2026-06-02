import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Website Audit | Speed & Performance Report | Copper Bay Tech",
  description:
    "Get a free, instant website audit. We run Google PageSpeed Insights to score your site's performance and Core Web Vitals, then show you exactly what to fix.",
  keywords:
    "free website audit, website speed test, PageSpeed Insights report, Core Web Vitals checker, Sonoma County web performance",
  alternates: { canonical: "/audit" },
  openGraph: {
    title: "Free Website Audit | Copper Bay Tech",
    description:
      "Instant website performance audit powered by Google PageSpeed Insights. See your score and what to fix.",
    url: "https://copperbaytech.com/audit",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Free Website Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Audit | Copper Bay Tech",
    description:
      "Instant website performance audit powered by Google PageSpeed Insights. See your score and what to fix.",
    images: ["/og-image.png"],
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
