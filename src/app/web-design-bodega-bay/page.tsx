import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-bodega-bay";

export const metadata: Metadata = {
  title: "Web Design Bodega Bay CA | Charter, Lodging & Coastal Business Websites | Copper Bay Tech",
  description:
    "Custom website design for Bodega Bay fishing charters, vacation rentals, inns, seafood restaurants, and coastal businesses. Fast, mobile-first sites built for travelers checking on Highway 1. Call (707) 239-6725.",
  keywords:
    "web design Bodega Bay, website design Bodega Bay CA, fishing charter website Bodega Bay, vacation rental website Sonoma Coast, coastal restaurant web design, Bodega Bay small business website",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Bodega Bay Businesses | Copper Bay Tech",
    description:
      "Conversion-focused websites for Bodega Bay charters, vacation rentals, inns, and seafood restaurants.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignBodegaBay() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Bodega Bay"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Custom-coded websites for Bodega Bay fishing charters, vacation rentals, coastal inns, and seafood businesses — built to load fast on spotty Highway 1 cell and turn a curious day-tripper into a confirmed booking before they even reach the harbor."
      intro={[
        "Bodega Bay runs on a rhythm that no inland Sonoma town does: the morning charter boats heading out past the Bodega Head, the oyster trucks rolling in from Tomales Bay, the whale-watching crowd lining the bluff in February, and the summer fog rolling back just in time for a weekend seafood lunch. Nearly every visitor comes from the Bay Area — they drive Highway 1 on a whim or plan a trip on their phone days ahead — and that's exactly where your website either earns the booking or loses it. A slow or confusing site means they call the charter one listing down, or book the vacation rental that had a clear calendar and an easy checkout.",
        "The coastal cell signal between Jenner and Bodega Bay is notoriously patchy, and travelers are often checking your site mid-drive or standing in the harbor parking lot. Page speed isn't a technical nicety here — it's lost revenue if you ignore it. We build sites that are genuinely fast on mobile, that show off the drama of the Sonoma Coast with high-quality photography without sacrificing load time, and that give visitors exactly what they came for: availability, pricing, a map to your dock or front door, and a button that books the trip in two taps.",
      ]}
      includesTitle="What Bodega Bay businesses get"
      includes={[
        "Custom-coded — no Squarespace, no Wix, no off-the-shelf templates",
        "Mobile-first design optimized for spotty coastal cell coverage on Highway 1",
        "Booking and reservation integration for charters, lodging, and dining",
        "90+ Google PageSpeed score so the site loads before visitors give up",
        "Striking coastal photography layout that doesn't sacrifice speed",
        "Local SEO targeting Bodega Bay, Sonoma Coast, and Bay Area trip-planning searches",
        "Google Business Profile setup so visitors find you before they arrive",
        "Flat fee quoted upfront — no hourly billing, live in 2–3 weeks",
      ]}
      industriesTitle="Who we build for in Bodega Bay"
      industries={[
        "Sport-fishing & whale-watching charters",
        "Vacation rentals & coastal inns",
        "Seafood restaurants & oyster bars",
        "Seafood markets & fish processors",
        "Coastal event & wedding venues",
        "Kayak & outdoor adventure outfitters",
        "Bodega Bay lodges & resorts",
        "Surf shops & coastal retail",
      ]}
      faqs={[
        {
          q: "My charter or rental site gets visitors mostly on mobile — does that change how you build it?",
          a: "It shapes everything. The majority of people booking a Bodega Bay fishing trip or weekend rental are on their phones, often with a weak signal on Highway 1 or a slow connection at the harbor. We build mobile-first by default: the layout, images, and booking flow are all designed for a small screen and a slow connection first, then scaled up for desktop. That means faster load times, fewer dropped visitors, and more completed bookings — especially for last-minute same-week searches.",
        },
        {
          q: "Can you connect my site to an online booking or reservation system?",
          a: "Yes. Charter and tour operators commonly use FareHarbor or Bookeo for trip reservations; vacation rental owners often use Lodgify, Hostfully, or a direct VRBO/Airbnb calendar sync; restaurants use OpenTable or Resy. We integrate whichever system you already use so visitors can check availability and book without leaving your site or bouncing to a clunky third-party page. Every extra step between 'I want to book' and 'booking confirmed' loses customers, and coastal visitors in trip-planning mode are impatient.",
        },
        {
          q: "Bodega Bay is seasonal — does it make sense to invest in a website if it's slow in winter?",
          a: "Bodega Bay's 'slow season' is actually whale-watching season, and whale-watching draws a specific crowd actively searching online from November through April. Beyond that, the shoulder-season visitors — storm-watchers, birders, off-season crabbers — often book earlier and stay longer than summer crowds. A well-built site captures those bookings year-round, and the SEO value you build during slow months pays off when summer demand spikes. A weak site in January is a weak site in July too.",
        },
        {
          q: "Will my site show up when someone searches for things to do in Bodega Bay or on the Sonoma Coast?",
          a: "That's a core part of what we build. We structure your site around the exact search terms Bay Area visitors actually type — 'Bodega Bay fishing charters,' 'Sonoma Coast vacation rental,' 'whale watching Bodega Bay' — and set up your Google Business Profile so you appear in local map results when someone searches nearby or en route on Highway 1. We focus on searches with real trip-planning intent, not generic terms with no realistic path to ranking.",
        },
        {
          q: "What does a website cost?",
          a: "We charge a flat fee quoted before we start — no hourly billing, no surprise invoices. Most small-business sites land between $2,500 and $7,500 depending on page count and features like booking integration or a property gallery. Start with a free 30-minute call and we'll tell you honestly what we'd build, what it would cost, and whether the investment makes sense for your season and volume.",
        },
      ]}
      nearby={[
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/web-design-guerneville", label: "web design in Guerneville" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
