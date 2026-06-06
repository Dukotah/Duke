import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-healdsburg";

export const metadata: Metadata = {
  title: "Web Design Healdsburg CA | Winery & Hospitality Websites | Copper Bay Tech",
  description:
    "Custom website design for Healdsburg wineries, tasting rooms, inns, and restaurants. Fast, mobile-first sites that turn destination visitors into reservations and wine-club members. Call (707) 239-6725.",
  keywords:
    "web design Healdsburg, website design Healdsburg CA, winery web design Healdsburg, tasting room website, restaurant website Healdsburg, hospitality web design Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Healdsburg Businesses | Copper Bay Tech",
    description:
      "Conversion-focused websites for Healdsburg wineries, tasting rooms, inns, and restaurants.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignHealdsburg() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Healdsburg"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Custom-coded websites for Healdsburg wineries, tasting rooms, inns, and restaurants — built to look as premium as the experience you deliver and to turn destination visitors into reservations."
      intro={[
        "In Healdsburg, the booking decision happens before anyone arrives. A couple in San Francisco planning a weekend around the Plaza decides which tasting rooms to visit, where to have dinner, and where to stay — all from their phone, days in advance. If your site is slow, dated, or hard to book from, they choose the place down the street that made it easy. Your website isn't a brochure here; it's the front door tourists walk through first.",
        "Healdsburg also punches above its size online. You're not just competing with the winery next door — you're competing with Napa, downtown Sonoma, and every other destination fighting for the same wine-country weekend. That's a high bar, and a generic Wix or Squarespace template doesn't clear it. We build fast, image-rich, mobile-first sites that match the premium, design-forward feel Healdsburg visitors expect, and that make reserving a tasting, booking a table, or joining the wine club take one tap instead of three.",
      ]}
      includesTitle="What Healdsburg businesses get"
      includes={[
        "Custom-coded — no Squarespace, no Wix, no off-the-shelf themes",
        "Image-rich design that loads fast even on a phone in the Plaza",
        "Reservation & booking integration (Tock, Resy, OpenTable, wine-club signups)",
        "90+ Google PageSpeed score, mobile-first — most wine-country traffic is mobile",
        "Local SEO for Healdsburg and 'wine country' search terms travelers actually use",
        "Google Business Profile setup so you show up when visitors search nearby",
        "Flat fee quoted upfront — no hourly billing",
        "Live in 2–3 weeks, with 30 days of post-launch support included",
      ]}
      industriesTitle="Who we build for in Healdsburg"
      industries={[
        "Wineries & tasting rooms",
        "Boutique hotels & inns",
        "Fine dining & farm-to-table restaurants",
        "Wedding & event venues",
        "Art galleries & boutiques",
        "Spas & wellness",
        "Specialty food & wine retail",
        "Tour & experience operators",
      ]}
      faqs={[
        {
          q: "Can you connect my site to my reservation or tasting-booking system?",
          a: "Yes. We integrate the booking platforms Healdsburg hospitality businesses actually use — Tock, Resy, and OpenTable for restaurants and tasting reservations, plus wine-club and e-commerce signups — so a visitor can go from your homepage to a confirmed booking without leaving for a clunky third-party page. Reducing that friction is usually the single biggest lift to reservations.",
        },
        {
          q: "My current site looks fine on a computer but bad on a phone. Does that matter?",
          a: "It matters a lot here. Most people planning a Healdsburg visit are browsing on their phones — on the couch at home, or standing on the Plaza deciding where to go next. We build mobile-first, so your site looks and works beautifully on the device your customers are actually holding. A site that's hard to use on a phone is quietly costing you walk-ins and bookings.",
        },
        {
          q: "Will the site hold up during harvest and peak summer traffic?",
          a: "Yes. Because we custom-code on fast, modern hosting rather than a heavy template, your site stays quick even during the August–October crush season and busy summer weekends when traffic spikes. Slow load times during your highest-demand window are exactly when you can least afford to lose a booking.",
        },
        {
          q: "How do I get found by people searching for things to do in Healdsburg?",
          a: "We build local SEO in from the start — structured content around Healdsburg and wine-country search terms, proper metadata, and Google Business Profile setup so you appear in the local map results when nearby visitors search. We focus on the terms real travelers use to plan a trip, not generic keywords you'll never rank for.",
        },
        {
          q: "What does a website cost?",
          a: "We quote a flat fee upfront based on the size and features of your site — no hourly billing and no surprises. Most small-business sites land between $2,500 and $7,500 depending on page count and features like booking integration or e-commerce. Start with a free 30-minute call and we'll tell you honestly what we'd build and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/it-support-healdsburg", label: "IT support in Healdsburg" },
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/industries/wineries", label: "wineries" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
