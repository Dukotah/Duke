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
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Audit | Copper Bay Tech",
    description:
      "Instant website performance audit powered by Google PageSpeed Insights. See your score and what to fix.",
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return children;
}
