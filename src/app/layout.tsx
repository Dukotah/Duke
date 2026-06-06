import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import StickyCTA from "@/components/StickyCTA";
import AttributionTracker from "@/components/AttributionTracker";
import "./globals.css";

const dmSans = DM_Sans({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const lora = Lora({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://copperbaytech.com"),
    // Per-route titles already include the "| Copper Bay Tech" suffix, so we
    // intentionally avoid a global `title.template` here to prevent a doubled
    // brand suffix. New routes follow the same full-title convention.
    title: "Copper Bay Tech | IT & Web | Sonoma County",
    description:
          "Custom websites, IT support, and cybersecurity for Sonoma County businesses. Enterprise-grade thinking without the enterprise price tag.",
    keywords:
          "IT consulting Sonoma County, web development Sonoma County, cybersecurity Petaluma, small business IT support North Bay",
    applicationName: "Copper Bay Tech",
    authors: [{ name: "Copper Bay Tech" }],
    creator: "Copper Bay Tech",
    publisher: "Copper Bay Tech",
    manifest: "/manifest.webmanifest",
    icons: {
          icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.png", type: "image/png" },
          ],
          apple: [{ url: "/apple-icon.png" }],
    },
    // NOTE: no global `alternates.canonical` here. A site-wide canonical of "/"
    // is inherited by every route that doesn't override it, telling Google every
    // page is a duplicate of the home page. Each route sets its own canonical;
    // the home page sets its canonical in app/page.tsx.
    openGraph: {
          title: "Copper Bay Tech | Sonoma County IT & Web Development",
          description:
                  "Custom-built technology for Sonoma County businesses. Websites, IT support, and cybersecurity.",
          url: "https://copperbaytech.com",
          siteName: "Copper Bay Tech",
          locale: "en_US",
          type: "website",
          images: [
            {
                      url: "/og-image.png",
                      width: 1200,
                      height: 630,
                      alt: "Copper Bay Tech — IT Consulting & Web Development in Sonoma County",
            },
                ],
    },
    twitter: {
          card: "summary_large_image",
          title: "Copper Bay Tech | Sonoma County IT & Web Development",
          description:
                  "Custom-built technology for Sonoma County businesses. Websites, IT support, and cybersecurity.",
          images: ["/og-image.png"],
    },
    robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
          <html lang="en" className={`${dmSans.variable} ${lora.variable} h-full antialiased`}>
                  <body className="min-h-full flex flex-col">
          {children}
          {/* Shared mobile bottom spacer so the fixed StickyCTA never covers footer content. */}
          <div className="h-16 md:hidden" aria-hidden="true" />
          {/* One-tap call/book bar on mobile — site-wide, hidden on /crm + utility routes. */}
          <StickyCTA />
          {/* Records first-touch lead source (UTM/referrer/landing) per session. */}
          <AttributionTracker />
          {/* Privacy-friendly, cookieless analytics. Pageviews flow
              automatically once Web Analytics is enabled in the Vercel project
              dashboard; custom funnel events are forwarded via src/lib/analytics.ts. */}
          <Analytics />
        </body>
          </html>
        );
}
