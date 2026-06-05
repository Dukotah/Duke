import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADA & HIPAA Website Compliance Checker — Free WCAG Accessibility Scan | Copper Bay Tech",
  description:
    "Instantly scan your website for ADA accessibility violations (WCAG) and HIPAA privacy indicators. Get a scored report with actionable fixes — free automated compliance checker, no signup needed.",
  keywords:
    "ADA compliance checker, HIPAA website compliance, WCAG accessibility scanner, website accessibility audit, ADA WCAG tool, HIPAA privacy check, web accessibility Sonoma County",
  alternates: { canonical: "/tools/compliance" },
  openGraph: {
    title: "Free ADA & HIPAA Website Compliance Checker | Copper Bay Tech",
    description:
      "Scan your site for WCAG accessibility issues and HIPAA privacy indicators. Instant scored report with actionable fixes — free, no signup.",
    url: "https://copperbaytech.com/tools/compliance",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — ADA & HIPAA Website Compliance Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ADA & HIPAA Website Compliance Checker",
    description: "Instant WCAG accessibility + HIPAA privacy scan. Scored report, no signup.",
    images: ["/og-image.png"],
  },
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
