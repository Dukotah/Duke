import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-cotati";

export const metadata: Metadata = {
  title: "Web Design Cotati CA | Affordable Local Business Websites | Copper Bay Tech",
  description:
    "Custom website design for Cotati restaurants, bars, shops, and service businesses. Fast, mobile-first sites that win 'near me' searches and capture the community crowd. Call (707) 239-6725.",
  keywords:
    "web design Cotati, website design Cotati CA, small business website Cotati, Cotati web designer, Sonoma County web design, affordable website Cotati, local SEO Cotati",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Cotati Small Businesses | Copper Bay Tech",
    description:
      "Affordable, mobile-first websites for Cotati restaurants, bars, shops, and local service businesses — built to win local searches and reflect the community identity around La Plaza Park.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignCotati() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Cotati"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Mobile-first websites for Cotati's restaurants, bars, shops, and service businesses — built to show up in local searches and reflect the tight-knit community identity that makes this town different from every other dot on the 101."
      intro={[
        "Cotati is one of those Sonoma County towns that locals love precisely because it hasn't tried to be anything other than itself. The hexagonal La Plaza Park at the center of town is genuinely rare — one of only a handful of such parks in the country — and the Cotati Accordion Festival that fills it each August has become a regional institution with a loyal following that spans generations. The live-music bar scene along Old Redwood Highway and East Cotati Avenue keeps the town lively year-round, and a core of independent restaurants, service businesses, and small retail shops serve a community that includes longtime residents, Sonoma State commuters, and working families squeezed between Rohnert Park and Petaluma. These businesses don't rely on tourist foot traffic — they rely on repeat local customers who find them on their phones while sitting in a parking lot.",
        "That distinction matters for web design. A Cotati business doesn't need an aspirational lifestyle homepage aimed at weekend visitors from the Bay Area — it needs a fast, credible site that shows up when someone nearby searches 'auto repair near me,' 'Cotati happy hour,' or 'hair salon Cotati CA.' We build straightforward, mobile-first sites that load quickly even on a spotty connection, make it trivial for someone to call or get directions, and include the local context — proximity to the Plaza, ties to the Accordion Festival, the neighborhood feel — that turns a generic search result into a business a customer actually trusts. Flat-fee pricing between $2,500 and $7,500 means no billing surprises for businesses that don't have an enterprise budget.",
      ]}
      includesTitle="What Cotati businesses get"
      includes={[
        "Custom-coded — not a recycled template that looks like every other small-town site",
        "Mobile-first build: loads fast on phones in the La Plaza parking lot or on the 101",
        "Local SEO targeting Cotati and Sonoma County 'near me' searches from day one",
        "Google Business Profile setup so you appear in map results before competitors",
        "Click-to-call and directions built in — the two things local customers need most",
        "Event and promotion sections ideal for Accordion Festival specials or live-music nights",
        "Flat fee quoted upfront — no hourly billing, no scope creep invoices",
        "Live in 2–3 weeks, with 30 days of post-launch support included",
      ]}
      industriesTitle="Who we help in Cotati"
      industries={[
        "Bars & live-music venues",
        "Restaurants & cafes",
        "Auto repair & smog shops",
        "Hair & nail salons",
        "Independent retail shops",
        "Contractors & home services",
        "Health & wellness practices",
        "Professional & personal services",
      ]}
      faqs={[
        {
          q: "My customers are mostly locals — do I really need a website?",
          a: "Yes, and the reason is how locals actually find businesses today. Even repeat customers check a business's site or Google listing before driving over — to confirm hours, look at a menu, or get a phone number. If your site is missing, outdated, or hard to use on a phone, you're losing customers to the competitor one street over who made it easy. In a small community like Cotati where word-of-mouth still matters, a credible site reinforces the trust neighbors already have in you.",
        },
        {
          q: "Can you help my business show up in searches for Cotati specifically?",
          a: "That's exactly what we build for. We structure your site content and metadata around Cotati and the surrounding area, set up your Google Business Profile correctly, and make sure the signals Google uses for local map rankings are all in order. For a business that serves customers within a few miles, showing up in those local map results is often more valuable than any amount of national SEO.",
        },
        {
          q: "We do a lot of business around the Accordion Festival and summer events — can the site handle that?",
          a: "Absolutely. We can build in a simple events or promotions section that you or we can update when the Accordion Festival weekend approaches, or when you're running a live-music night or seasonal special. Because the sites we build are custom-coded on fast, modern hosting rather than a heavy template platform, they stay quick even during traffic spikes — you won't have a slow or crashed site right when the most people are looking you up.",
        },
        {
          q: "What's the difference between what you build and a Squarespace or Wix site?",
          a: "Template platforms are fine for some uses, but they carry a lot of code weight that makes pages load slowly — and page speed directly affects where Google ranks you. We custom-code your site so it's lean and fast, structured exactly for what your business needs and nothing it doesn't. You also own the code outright, not a subscription to someone else's platform. For a Cotati business competing for local searches against businesses with more marketing resources, that performance difference is real.",
        },
        {
          q: "What does a website cost, and how long does it take?",
          a: "We quote a flat fee before any work starts — no hourly billing and no surprise invoices. Most local-business sites land between $2,500 and $7,500 depending on page count and features. We typically have a site live within two to three weeks of kickoff, and we include 30 days of support after launch. Start with a free 30-minute call at (707) 239-6725 and we'll tell you honestly what we'd build and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/web-design-rohnert-park", label: "web design in Rohnert Park" },
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
