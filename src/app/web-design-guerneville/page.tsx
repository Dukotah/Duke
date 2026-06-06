import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-guerneville";

export const metadata: Metadata = {
  title: "Web Design Guerneville CA | River & Resort Websites | Copper Bay Tech",
  description:
    "Custom website design for Guerneville vacation rentals, lodges, riverside restaurants, and river outfitters. Mobile-first, booking-ready sites for the Russian River's LGBTQ-welcoming resort destination. Call (707) 239-6725.",
  keywords:
    "web design Guerneville, website design Guerneville CA, vacation rental website Russian River, lodge website design Sonoma County, river resort web design, LGBTQ business website Guerneville, canoe rental website, Guerneville restaurant website",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Guerneville Businesses | Copper Bay Tech",
    description:
      "Booking-ready, image-rich websites for Guerneville vacation rentals, lodges, restaurants, and river outfitters.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignGuerneville() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Guerneville"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Custom-built websites for Guerneville vacation rentals, lodges, river restaurants, and outdoor outfitters — fast, mobile-first, and ready to take reservations from Bay Area visitors planning their Russian River getaway."
      intro={[
        "Guerneville runs on weekend trips. From Memorial Day through Labor Day — and during signature events like Lazy Bear Week, Women's Weekend, and the Russian River Jazz and Blues Festival — the town fills with visitors who planned everything on their phones before they ever left the Bay Area. They searched for cabin rentals near the river, found a restaurant with outdoor seating, booked a canoe from an outfitter near Monte Rio, and checked whether the beach at Johnson's was open. Every one of those decisions happened on a website. If yours was slow to load, hard to navigate on a small screen, or didn't make booking obvious, someone else got that reservation.",
        "The Russian River valley has a specific identity that generic web templates can't capture: redwood canopy, river light, an unapologetically inclusive and welcoming community, and a relaxed, unpretentious vibe that draws a loyal repeat crowd. Winters are genuinely quiet — sometimes flood-affected — so your site also needs to handle seasonal messaging gracefully: communicating closures, updated availability, or reopening dates without making the business look unreliable. We build sites for Guerneville businesses that nail the summer-and-event rush, stay honest through the off-season, and carry the warm, inclusive personality that makes this stretch of the Russian River unlike anywhere else in Sonoma County.",
      ]}
      includesTitle="What Guerneville businesses get"
      includes={[
        "Custom-coded — no Squarespace, no Wix, no generic resort templates",
        "Mobile-first design built for Bay Area visitors browsing on their phones",
        "Booking and reservation integration (Airbnb, Vrbo, direct booking, OpenTable, and more)",
        "Seasonal messaging tools — communicate closures, events, and availability changes cleanly",
        "Image-rich layouts that show off river views, redwood settings, and outdoor spaces",
        "Local SEO targeting Russian River, Guerneville, and West Sonoma County search terms",
        "Google Business Profile setup so you surface in 'near me' searches during event weekends",
        "Flat fee quoted upfront — no hourly billing, live in 2–3 weeks with 30 days of post-launch support",
      ]}
      industriesTitle="Who we build for in Guerneville"
      industries={[
        "Vacation rentals & cabins",
        "Lodges & resorts",
        "Riverside restaurants & bars",
        "Canoe, kayak & beach outfitters",
        "Event venues & campgrounds",
        "Boutique retail & gift shops",
        "Wellness & retreat centers",
        "Tour guides & experience operators",
      ]}
      faqs={[
        {
          q: "My guests book through Airbnb or Vrbo — do I even need my own website?",
          a: "Having your own site lets you take direct bookings without paying platform fees, build an email list for repeat guests, and tell your property's full story — the specific redwood grove it sits in, the fire pit, the walk to the river — in a way Airbnb's listing template never can. Many Guerneville rental owners use platforms to fill shoulder-season gaps while driving loyal repeat guests to book direct, where both sides save money. A clean, fast site with a simple booking widget is usually the highest-ROI web investment a rental host can make.",
        },
        {
          q: "How do we handle the big event weekends like Lazy Bear Week and Women's Weekend?",
          a: "We build event-aware capacity messaging into your site so you can flag that a weekend is sold out, link to a waitlist, or promote adjacent dates — without needing a developer every time. During peak event weeks your site traffic can spike sharply; because we host on fast, modern infrastructure rather than shared-hosting templates, load times stay solid when you can least afford a slow site.",
        },
        {
          q: "Our business is quiet November through March — can the site reflect that honestly?",
          a: "Yes, and it should. A site that clearly communicates limited winter hours, seasonal closures, or flood-related access changes builds trust rather than eroding it. We design sites with easy-to-update seasonal banners and availability notices so you can keep visitors informed without making the business look unreliable. Guests who feel respected by honest messaging tend to become the loyal return visitors Guerneville businesses depend on.",
        },
        {
          q: "How do we make sure visitors find us when they're searching for things to do on the Russian River?",
          a: "We build local SEO in from the start — page structure, metadata, and content tuned to the search terms real visitors use: 'Russian River cabin rental,' 'Guerneville restaurants,' 'canoe rental near Guerneville,' and similar. We also set up or optimize your Google Business Profile so you appear in the local map pack when someone nearby searches during the weekend. That map placement is often the first click a walk-in customer makes.",
        },
        {
          q: "What does a new website cost for a Guerneville business?",
          a: "We quote a flat fee upfront based on what you actually need — no hourly billing and no surprises mid-project. Most small-business sites we build fall between $2,500 and $7,500 depending on page count and features like direct booking integration or an online store. Start with a free 30-minute call and we'll tell you honestly what we'd build, why, and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/web-design-sebastopol", label: "web design in Sebastopol" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
