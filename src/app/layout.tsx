import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
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
  title: "Copper Bay Tech | IT Consulting & Web Development | Sonoma County",
  description:
    "Custom websites, IT support, and cybersecurity for Sonoma County businesses. Serving Petaluma, Santa Rosa, Sebastopol, Rohnert Park, Sonoma, and the greater North Bay.",
  keywords:
    "IT consulting Sonoma County, web development Sonoma County, cybersecurity Petaluma, small business IT support North Bay",
  metadataBase: new URL("https://copperbaytech.com"),
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
        alt: "Copper Bay Tech — IT Consulting & Web Development, Sonoma County",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Copper Bay Tech | Sonoma County IT & Web Development",
    description: "Custom-built technology for Sonoma County businesses.",
    images: ["/og-image.png"],
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Copper Bay Tech",
              description:
                "Custom websites, IT support, and cybersecurity for Sonoma County small businesses.",
              url: "https://copperbaytech.com",
              telephone: "+17072396725",
              email: "hello@copperbaytech.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Petaluma",
                addressRegion: "CA",
                addressCountry: "US",
              },
              areaServed: [
                "Petaluma, CA",
                "Santa Rosa, CA",
                "Sebastopol, CA",
                "Rohnert Park, CA",
                "Sonoma, CA",
                "Sonoma County, CA",
              ],
              serviceType: [
                "IT Consulting",
                "Web Development",
                "Cybersecurity",
                "Managed IT Support",
              ],
              priceRange: "$$",
              openingHours: "Mo-Fr 09:00-17:00",
              sameAs: ["https://www.linkedin.com/company/copper-bay-tech"],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
