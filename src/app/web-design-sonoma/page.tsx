import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-sonoma";

export const metadata: Metadata = {
  title: "Web Design Sonoma CA | Historic Plaza & Wine-Country Websites | Copper Bay Tech",
  description:
    "Custom website design for Sonoma Plaza businesses — tasting rooms, inns, restaurants, and boutiques. Mobile-first sites with booking integration that turn Bay Area day-trippers into confirmed reservations. Call (707) 239-6725.",
  keywords:
    "web design Sonoma, website design Sonoma CA, Sonoma Plaza website, tasting room web design Sonoma, restaurant website Sonoma, winery website Sonoma, things to do Sonoma, Sonoma historic plaza",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Sonoma Plaza Businesses | Copper Bay Tech",
    description:
      "Conversion-focused websites for Sonoma tasting rooms, inns, restaurants, and boutiques — built for the mobile visitor planning their Plaza day.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignSonoma() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Sonoma"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Custom-built websites for Sonoma Plaza tasting rooms, historic inns, restaurants, and boutiques — mobile-first and booking-ready for the Bay Area visitors who plan their whole Plaza day on their phone before they ever leave home."
      intro={[
        "The city of Sonoma is one of California&apos;s most storied destinations — anchored by the eight-acre Sonoma Plaza, Mission San Francisco Solano, and Sonoma State Historic Park, a UNESCO-recognized cluster of adobe buildings that draws history-minded visitors alongside the wine crowd. That mix matters for your website. The people walking the Plaza on a Saturday morning are Bay Area day-trippers and Wine Country weekenders: they&apos;re value-conscious but discerning, they did their homework on their phone the night before, and they have a dozen options within a short stroll of the Mission. A slow, hard-to-navigate site doesn&apos;t get a second chance — they&apos;ve already moved on to the listing that made it easy to book.",
        "Unlike some Wine Country destinations that skew toward ultra-premium, Sonoma&apos;s Plaza draws a broad, accessible crowd: families visiting Sonoma State Historic Park, couples on a first wine-country trip, regulars who know every tasting room by name, and wedding parties planning ahead. Your website needs to serve all of them clearly — showing what&apos;s available to reserve, what&apos;s happening at the Plaza this weekend, and how to get in the door without friction. We build fast, image-rich, mobile-first sites with real booking integrations (Tock, Resy, OpenTable, wine-club signups) and local SEO tuned for the &apos;things to do in Sonoma&apos; and Plaza-specific searches visitors actually type.",
      ]}
      includesTitle="What Sonoma businesses get"
      includes={[
        "Custom-coded — no Squarespace, no Wix, no off-the-shelf templates",
        "Mobile-first design built for visitors planning their Plaza itinerary on a phone",
        "Booking & reservation integration: Tock, Resy, OpenTable, wine-club signups, event inquiries",
        "Fast image-rich pages that load quickly even on cellular at the Plaza",
        "Local SEO targeting &apos;things to do in Sonoma&apos;, Plaza search terms, and nearby city queries",
        "Google Business Profile setup so you appear in local map results for nearby visitors",
        "Flat fee quoted upfront — no hourly billing, no surprises at invoice time",
        "Live in 2–3 weeks, with 30 days of post-launch support included",
      ]}
      industriesTitle="Who we build for in Sonoma"
      industries={[
        "Tasting rooms & small wineries",
        "Boutique inns & B&Bs",
        "Plaza restaurants & cafes",
        "Wedding & event venues",
        "History & heritage tourism",
        "Retail boutiques & specialty shops",
        "Tour & experience operators",
        "Wellness spas & studios",
      ]}
      faqs={[
        {
          q: "Most of my visitors are Bay Area day-trippers who decide where to go the night before. Does my website really affect that?",
          a: "It&apos;s often the deciding factor. When someone in the East Bay is mapping out their Sonoma Plaza Saturday — which tasting rooms to visit, where to have lunch, whether to book a tour — they&apos;re clicking through several sites quickly on their phone. A site that loads slowly, hides its hours, or buries the reservation link loses that visitor to the place that made it easy. We design for exactly that decision moment: clear hours, a prominent booking button, and a page that feels as welcoming as your front door.",
        },
        {
          q: "Can you connect my site to Tock, Resy, or my wine-club sign-up?",
          a: "Yes. We integrate the reservation and membership platforms Sonoma Plaza businesses actually use — Tock and Resy for tasting and dining reservations, OpenTable for restaurants, and custom wine-club or event-inquiry forms where needed. The goal is a seamless path from your homepage to a confirmed booking, so visitors don&apos;t have to hunt for a link or bounce to a third-party page that looks nothing like your brand.",
        },
        {
          q: "How do I show up when visitors search &apos;things to do in Sonoma&apos; or &apos;tasting rooms near Sonoma Plaza&apos;?",
          a: "We build local SEO in from day one — structured page content around the search terms your visitors actually use, proper metadata, schema markup, and Google Business Profile setup so you appear in the local map pack when someone nearby searches. We focus on terms with real visitor intent (tasting rooms, Plaza restaurants, historic Sonoma) rather than broad keywords you&apos;ll never rank for on a newer domain.",
        },
        {
          q: "My business gets a lot of wedding and special-event inquiries. Can my site handle those?",
          a: "Absolutely. We build event-inquiry and contact flows into the site — venue-specific landing pages, photo-rich galleries, and inquiry forms that collect the details you actually need (date, guest count, type of event) so you&apos;re not playing phone-tag to get basic information. Sonoma&apos;s historic venues and inn courtyards are popular for weddings and private events, so having a purpose-built inquiry path on your site reduces back-and-forth and helps you convert more of those leads.",
        },
        {
          q: "What does a website cost, and what does the process look like?",
          a: "We quote a flat fee upfront before any work begins — no hourly billing and no scope-creep surprises. Most small-business sites in Sonoma land between $2,500 and $7,500 depending on page count and features like booking integrations or e-commerce. The process starts with a free 30-minute call where we learn about your business, tell you honestly what we&apos;d build and what it would cost, and answer your questions — no pressure to sign anything on that call.",
        },
      ]}
      nearby={[
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/it-support-sonoma", label: "IT support in Sonoma" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
