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
    metadataBase: new URL("https://copperbaytech.com"),
    title: "Copper Bay Tech | IT & Web | Sonoma County",
    description:
          "Custom websites, IT support, and cybersecurity for Sonoma County businesses. Enterprise-grade thinking without the enterprise price tag.",
    keywords:
          "IT consulting Sonoma County, web development Sonoma County, cybersecurity Petaluma, small business IT support North Bay",
    alternates: {
          canonical: "https://copperbaytech.com",
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
                      url: "https://copperbaytech.com/og-image.png",
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
          images: ["https://copperbaytech.com/og-image.png"],
    },
    robots: {
          index: true,
          follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${dmSans.variable} ${lora.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
