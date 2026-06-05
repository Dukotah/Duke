import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Header Analyzer — Check SPF, DKIM, DMARC & Trace Delivery Path | Copper Bay Tech",
  description:
    "Free browser-based email header analyzer. Paste raw email headers to verify SPF, DKIM, and DMARC authentication, trace the full delivery path, and detect spoofing indicators — your headers never leave your browser.",
  keywords:
    "email header analyzer, SPF DKIM DMARC checker, email authentication tool, email header parser, trace email delivery path, email spoofing detector, free email header tool",
  alternates: { canonical: "/tools/email-headers" },
  openGraph: {
    title: "Free Email Header Analyzer — SPF, DKIM, DMARC & Delivery Path | Copper Bay Tech",
    description:
      "Paste raw email headers to check authentication, trace hops, and spot spoofing. Runs entirely in your browser — nothing is sent to our servers.",
    url: "https://copperbaytech.com/tools/email-headers",
    siteName: "Copper Bay Tech",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Copper Bay Tech — Email Header Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Email Header Analyzer — SPF, DKIM, DMARC & Delivery Path",
    description: "Verify email authentication and trace delivery hops. Runs in-browser, no server uploads.",
    images: ["/og-image.png"],
  },
};

export default function EmailHeadersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
