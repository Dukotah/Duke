import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import JsonLd, { organizationSchema, websiteSchema } from "@/components/JsonLd";
import MobileCTABar from "@/components/MobileCTABar";

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
    alternates: {
          canonical: "/",
    },
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
                    <JsonLd schema={[organizationSchema(), websiteSchema()]} />
                    {children}
                    <MobileCTABar />
                    <Analytics />
                    <SpeedInsights />
                  </body>
          </html>
        );
}
