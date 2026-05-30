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
  },
  twitter: {
    card: "summary_large_image",
    title: "Copper Bay Tech | Sonoma County IT & Web Development",
    description:
      "Custom websites, IT support, and cybersecurity for Sonoma County small businesses.",
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
