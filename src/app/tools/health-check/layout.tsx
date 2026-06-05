import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Website Health Check — Speed, SSL, SEO, Links & Mobile Audit | Copper Bay Tech",
  description:
    "Run a full website health check in seconds. Instantly audit your site's PageSpeed score, SSL certificate, SEO meta tags, broken links, and mobile responsiveness — all in one free tool, no signup required.",
  keywords:
    "website health check, free website audit, PageSpeed score, SSL certificate checker, SEO audit tool, broken link checker, mobile responsiveness test",
  alternates: { canonical: "/tools/health-check" },
  openGraph: {
    title: "Free Full Website Health Check — 5 Audits at Once | Copper Bay Tech",
    description:
      "Enter your URL and get a complete website audit: speed, SSL, SEO, broken links, and mobile readiness — all at once, free, no signup.",
    url: "https://copperbaytech.com/tools/health-check",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Free Website Health Check",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Website Health Check — Speed, SSL, SEO, Links & Mobile",
    description: "Instant 5-point website audit. No signup. Results in seconds.",
    images: ["/og-image.png"],
  },
};

export default function HealthCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
