import type { Metadata, Viewport } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import StickyCTA from "@/components/StickyCTA";
import AttributionTracker from "@/components/AttributionTracker";
import ThemeToggle from "@/components/ThemeToggle";
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

// viewport-fit=cover is the keystone that makes every existing
// env(safe-area-inset-*) (StickyCTA, Nav, drawer) actually resolve to a
// non-zero value on notched phones — without it those insets are silently 0.
// Inert on desktop/non-notched devices (insets are 0 there), so this changes
// nothing on desktop. Pinch-zoom is left enabled for accessibility.
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://copperbaytech.com"),
    // Per-route titles already include the "| Copper Bay Tech" suffix, so we
    // intentionally avoid a global `title.template` here to prevent a doubled
    // brand suffix. New routes follow the same full-title convention.
    title: "Copper Bay Tech | Websites, IT & Cybersecurity for Small Business",
    description:
          "Custom websites, managed IT support, and cybersecurity for small businesses across the U.S. Enterprise-grade thinking without the enterprise price tag — based in Sonoma County, CA.",
    keywords:
          "small business web development, custom website design, managed IT support, small business cybersecurity, AI integration for small business, remote IT support",
    applicationName: "Copper Bay Tech",
    authors: [{ name: "Copper Bay Tech" }],
    creator: "Copper Bay Tech",
    publisher: "Copper Bay Tech",
    manifest: "/manifest.webmanifest",
    // File-based icon conventions (src/app/favicon.ico, icon.png, apple-icon.png)
    // are auto-served by Next.js and generate their own <link> tags without
    // explicit metadata. The entry below adds only the SVG favicon from /public
    // (SVG is supported by all modern browsers and has no file-size constraints).
    icons: {
          icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    // NOTE: no global `alternates.canonical` here. A site-wide canonical of "/"
    // is inherited by every route that doesn't override it, telling Google every
    // page is a duplicate of the home page. Each route sets its own canonical;
    // the home page sets its canonical in app/page.tsx.
    openGraph: {
          title: "Copper Bay Tech | Websites, IT & Cybersecurity for Small Business",
          description:
                  "Custom-built technology for small businesses — websites, IT support, and cybersecurity. Based in Sonoma County, CA, serving clients nationwide.",
          url: "https://copperbaytech.com",
          siteName: "Copper Bay Tech",
          locale: "en_US",
          type: "website",
          images: [
            {
                      url: "/og-image.png",
                      width: 1200,
                      height: 630,
                      alt: "Copper Bay Tech — Custom Websites, IT & Cybersecurity for Small Business",
            },
                ],
    },
    twitter: {
          card: "summary_large_image",
          title: "Copper Bay Tech | Websites, IT & Cybersecurity for Small Business",
          description:
                  "Custom-built technology for small businesses — websites, IT support, and cybersecurity. Based in Sonoma County, CA, serving clients nationwide.",
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
    // INTENTIONAL pentest marker for our own authorized self-scan (tyto engagement
    // CBT-SELF-001). This is NOT a real credential — the value is a benign string
    // shaped like an AWS access-key ID so our secret-scanner has a known "flag" to
    // find on a live run, proving end-to-end scanning works. Spells TYTO-LIVE-SCAN-FLAG.
    // Safe to remove once the scanner is validated. Renders an invisible <meta> tag.
    other: {
          "x-tyto-authorized-scan-flag": "AKIATYTOLIVESCANFLAG",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
          <html lang="en" className={`${dmSans.variable} ${lora.variable} h-full antialiased`}>
                  <head>
            {/* No-flash theme init: apply the saved dark/bright choice before paint. */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "(function(){try{if(localStorage.getItem('cbt-theme')==='light'){var r=document.documentElement,v={'--bg-0':'#FBF9F6','--bg-1':'#FFFFFF','--bg-2':'#F4F1EA','--bg-3':'#E8E1D6','--text-warm':'#1C1814','--text-2':'rgba(28,24,20,.7)','--text-3':'rgba(28,24,20,.45)','--hairline':'rgba(28,24,20,.12)','--copper':'#B5703C','--copper-bright':'#A85F2A','--copper-dim':'rgba(168,95,42,.32)','--color-white':'#1C1814','--color-zinc-300':'#3F3F46','--color-zinc-400':'#52525B','--color-zinc-500':'#6B6B72','--color-zinc-600':'#3F3F46'};r.setAttribute('data-theme','light');r.style.colorScheme='light';for(var k in v)r.style.setProperty(k,v[k]);}}catch(e){}})();",
              }}
            />
                  </head>
                  <body className="min-h-full flex flex-col">
          {/* WCAG 2.4.1 — skip link: first focusable element, hidden until focused */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#18181B] focus:text-white focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline focus:outline-2 focus:outline-[#F97316]"
          >
            Skip to main content
          </a>
          {/* Content wrapper — skip-link target. Pages supply their own <main>;
              this div avoids double-nesting a second <main> in the layout while
              still giving keyboard users a landmark to jump to. */}
          <div id="main-content" className="flex flex-col flex-1">
            {children}
          </div>
          {/* Shared mobile bottom spacer so the fixed StickyCTA never covers footer content. */}
          <div className="h-16 md:hidden" aria-hidden="true" />
          {/* One-tap call/book bar on mobile — site-wide, hidden on /crm + utility routes. */}
          <StickyCTA />
          {/* Floating dark/bright toggle (flips the --bg-* ink ramp). */}
          <ThemeToggle />
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
