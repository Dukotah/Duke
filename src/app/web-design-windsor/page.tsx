import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-windsor";

export const metadata: Metadata = {
  title: "Web Design Windsor CA | Local Business Websites | Copper Bay Tech",
  description:
    "Custom website design for Windsor trades, restaurants, family services, and local retailers. Mobile-first sites that turn 'near me' searches into calls and bookings for a growing Sonoma County community. Call (707) 239-6725.",
  keywords:
    "web design Windsor CA, website design Windsor, Windsor small business website, Windsor contractor website, home services website Windsor, web design Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Windsor CA Businesses | Copper Bay Tech",
    description:
      "Conversion-focused websites for Windsor trades, family restaurants, real estate, and local service businesses.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignWindsor() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Windsor"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Mobile-first websites for Windsor trades, family restaurants, and local service businesses — built to rank in 'near me' searches and turn a growing residential population into steady phone calls and booked appointments."
      intro={[
        "Windsor has added thousands of new residents over the past decade and the growth is still going. That means a constant wave of homeowners who need a plumber, a pediatric dentist, a landscaper, or a contractor — and who find them the same way: a quick Google search on their phone while the kids are in the back seat. If your business doesn't appear in those results, or if your site takes five seconds to load and buries the phone number, that customer calls someone else. Windsor's customer base is overwhelmingly local and residential, which makes mobile-first, search-optimized web design a direct revenue tool, not a nice-to-have.",
        "The Town Green at the center of Windsor is the social anchor of the community — weekend farmers markets, free summer concerts, craft breweries and family restaurants ringing the plaza. Businesses in and around that corridor compete for neighbors who live nearby and walk over, not tourists passing through. A website that shows up when Windsor residents search 'brewery near me' or 'family restaurant Windsor CA' and that makes it easy to see hours, a menu, and a parking note will win that foot traffic consistently. We build sites for Windsor businesses that are fast, locally tuned, and honest about what you offer — no bloated templates, no hidden recurring fees, just a site that does its job.",
      ]}
      includesTitle="What Windsor businesses get"
      includes={[
        "Custom-coded — no Wix, no Squarespace, no off-the-shelf themes",
        "Mobile-first build optimized for the on-the-go local searcher",
        "Click-to-call and contact forms above the fold — easy for every device",
        "90+ Google PageSpeed score so you don't lose visitors to slow load times",
        "Local SEO targeting Windsor and surrounding Sonoma County search terms",
        "Google Business Profile setup and optimization for map-pack visibility",
        "Flat fee quoted upfront — no hourly billing, no surprise invoices",
        "Live in 2–3 weeks, with 30 days of post-launch support included",
      ]}
      industriesTitle="Who we build for in Windsor"
      industries={[
        "HVAC, plumbing & electrical",
        "Landscaping & contractors",
        "Family restaurants & breweries",
        "Dental & medical practices",
        "Real estate agents & brokers",
        "Youth sports & recreation",
        "Local retail & boutiques",
        "Pet care & family services",
      ]}
      faqs={[
        {
          q: "Why does my Windsor trade business need a website if I get most work by referral?",
          a: "Referrals still matter, but the first thing a referred customer does is look you up online before they call. A bare or missing website loses that job before the conversation starts. Beyond referrals, Windsor's growing population means thousands of new homeowners who don't have a go-to plumber or HVAC company yet — they search Google and pick whoever looks trustworthy and answers the phone. A clean, fast site with your services, service area, and a prominent phone number captures those calls that referrals alone can't reach.",
        },
        {
          q: "Can you help my restaurant or brewery show up when Windsor residents search nearby?",
          a: "Yes. Local SEO is built into every site we create — properly structured content around Windsor and Sonoma County search terms, correct business schema so Google understands what you are, and Google Business Profile optimization so you appear in the map results when someone searches 'brewery near me' or 'family restaurant Windsor CA.' The Town Green area has strong foot traffic, but residents searching on their phones before they walk out the door are the easiest customers to win — if your listing and site are in order.",
        },
        {
          q: "How much does a small-business website cost?",
          a: "We quote a flat fee upfront based on the scope of your site — no hourly billing and no surprises. Most local service business sites land between $2,500 and $7,500 depending on page count and features. A five-page site for a landscaping company is on the lower end; a site with online booking, a menu, or an e-commerce component is higher. Start with a free 30-minute call and we'll tell you honestly what we'd build and what it would cost.",
        },
        {
          q: "Windsor is growing fast — will my site hold up as my business scales?",
          a: "Yes. Because we build on modern, custom code rather than bloated templates, your site stays fast and easy to update as you add services, staff pages, or new locations. We also handle hosting on infrastructure that scales without you doing anything. Growth shouldn't mean scrambling to rebuild your site — the foundation we build handles it.",
        },
        {
          q: "Do you work with Windsor businesses that already have a site they're unhappy with?",
          a: "That's actually most of what we do. A lot of Windsor small businesses have a site built on a template platform that looked fine at first but is now slow, hard to update, or invisible in search. We'll take an honest look at what you have, tell you what's holding it back, and give you a clear picture of what a rebuild would cost and gain. No obligation — just a straight conversation.",
        },
      ]}
      nearby={[
        { href: "/it-support-windsor", label: "IT support in Windsor" },
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
