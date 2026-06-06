import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-cotati";

export const metadata: Metadata = {
  title: "IT Support Cotati CA | Small Business Managed IT | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Cotati small businesses — restaurants, music venues, retail shops, and home-based offices near the SSU corridor. No ticket queues, no long-term contracts. Call (707) 239-6725.",
  keywords:
    "IT support Cotati, managed IT Cotati CA, small business IT Cotati, computer support Cotati, network setup Cotati, cybersecurity Cotati, Google Workspace Cotati, IT support Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Cotati Small Businesses | Copper Bay Tech",
    description:
      "Right-sized, affordable managed IT for Cotati restaurants, bars, retail shops, and home-based businesses — flat monthly, no contracts, real humans.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportCotati() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Cotati"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-monthly managed IT for Cotati's restaurants, music spots, small shops, and home-based businesses — right-sized support with a real person to call, not a ticket queue."
      intro={[
        "Cotati is built around La Plaza, the only hexagonal town square in California, and the community identity that radiates from it. The businesses here — the bars and live-music venues that host the Accordion Festival crowd, the local restaurants on Old Redwood Highway, the independent retail shops, the solo practitioners and home-based consultants tucked into the neighborhoods between Rohnert Park and Penngrove — are not large organizations. They run on small teams, tight margins, and the expectation that the technology they pay for actually works without drama. When the Wi-Fi goes down before a Friday-night set or the POS freezes during a lunch rush, there is no internal IT department to call.",
        "That gap is exactly what we fill. Copper Bay Tech offers flat-monthly managed IT built for very small Cotati businesses: basic networks and reliable Wi-Fi, cloud setup on Google Workspace or Microsoft 365, automated backups, multi-factor authentication, and POS troubleshooting for the food-and-drink spots. We keep the scope honest — no enterprise upsells, no year-long contracts — and we answer the phone when something breaks. Cotati is close-knit and word travels fast; our job is to earn a reputation for showing up and fixing things the same day.",
      ]}
      includesTitle="What Cotati businesses get"
      includes={[
        "Flat monthly fee quoted upfront — no hourly surprises or long-term lock-in",
        "Network and Wi-Fi setup sized for a small shop, venue, or home office",
        "Google Workspace and Microsoft 365 setup, migration, and ongoing management",
        "Automated cloud backups so a crashed laptop does not cost you your business data",
        "Multi-factor authentication and basic security hardening against credential theft",
        "POS system support for restaurants and bars — setup, updates, and break-fix",
        "Same-day response for outages; a real person answers, not a ticketing system",
        "Remote monitoring so we often catch problems before you notice them",
      ]}
      industriesTitle="Who we help in Cotati"
      industries={[
        "Bars & live-music venues",
        "Restaurants & cafes",
        "Independent retail shops",
        "Home-based consultants & freelancers",
        "Personal-service businesses",
        "Small professional offices",
        "Wellness & fitness studios",
        "Local nonprofits & community orgs",
      ]}
      faqs={[
        {
          q: "We are a small bar with maybe three or four staff — is managed IT overkill for us?",
          a: "Not if you have a POS, a Wi-Fi network, or business email. Those three things alone create real problems when they break on a busy night. A flat monthly arrangement means you have someone to call before the Friday doors open, not scrambling for a Yelp referral at 6 p.m. The cost is built around what a very small venue actually needs, not an enterprise package.",
        },
        {
          q: "Can you help us switch from a mess of personal Gmail accounts to something more professional?",
          a: "Yes, and it is one of the most common first jobs we do for small Cotati businesses. We migrate your team to Google Workspace or Microsoft 365, set up shared drives, give each person a business email address at your domain, and configure basic security so a phished password does not compromise everyone at once. It typically takes a day and the disruption is minimal.",
        },
        {
          q: "Our internet goes out occasionally and we lose the POS. How do you prevent that?",
          a: "We look at your router, your ISP setup, and whether a cellular backup makes sense for your location and volume. For a Cotati food-and-drink business, a low-cost 4G failover that kicks in automatically when your main line drops can mean the difference between a smooth Saturday and a cash-only evening. We will tell you honestly whether the fix is a $50 router replacement or something more involved.",
        },
        {
          q: "Do you require a long-term contract?",
          a: "No. We work month-to-month. We keep clients by being useful, not by making it painful to leave. If the fit is not right after the first few months, you can walk away without penalty. That said, most of the value in managed IT accumulates over time as we get to know your setup and catch problems early, so most clients stay.",
        },
        {
          q: "What does IT support cost for a small Cotati business?",
          a: "Flat monthly managed IT for a very small business — one to five people, basic network, cloud email, and backups — typically runs in a range that is less than a single hour of lost revenue during a POS outage. We quote a specific number after a free 30-minute call where we look at what you have and what actually needs attention. No pressure, and we will tell you honestly if your setup is fine and you do not need us.",
        },
      ]}
      nearby={[
        { href: "/web-design-cotati", label: "web design in Cotati" },
        { href: "/it-support-rohnert-park", label: "IT support in Rohnert Park" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
