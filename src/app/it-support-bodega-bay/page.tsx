import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-bodega-bay";

export const metadata: Metadata = {
  title: "IT Support Bodega Bay CA | Coastal Business IT & Connectivity | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Bodega Bay seafood restaurants, charter operators, vacation rentals, and inns. Redundant connectivity, POS uptime, and salt-air-hardened equipment on the Sonoma Coast. Call (707) 239-6725.",
  keywords:
    "IT support Bodega Bay, managed IT Bodega Bay CA, Sonoma Coast IT support, coastal business IT, internet failover Bodega Bay, POS support Bodega Bay, vacation rental IT Sonoma Coast",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Bodega Bay Businesses | Copper Bay Tech",
    description:
      "Reliable IT support built for Bodega Bay&apos;s coastal realities — spotty cellular, salt air, weekend day-tripper rushes, and POS uptime when it matters most.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportBodegaBay() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Bodega Bay"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-monthly IT support engineered for the Sonoma Coast — redundant connections so your POS and booking systems stay online through the weekend rush, even when the cell signal fades at the harbor."
      intro={[
        "Bodega Bay runs on a different rhythm than any inland Sonoma County town. On a foggy Tuesday the harbor is quiet — a handful of sport-fishing charters prepping bait, a few kayak rentals waiting for a weather window, and the seafood markets restocking from the morning boats. By Saturday noon, Highway 1 is stacked with day-trippers from the Bay Area, every table at the waterfront restaurants is full, the whale-watching boats are sold out, and the vacation rental check-ins start rolling in. Your technology has to carry that swing without complaint, and it has to do it on the thin, unpredictable internet infrastructure that coastal Sonoma actually has — not the fiber-rich bandwidth assumptions most IT vendors make.",
        "The defining IT challenge here is connectivity. Wired broadband options along the coast are limited, cellular coverage drops in the coves and at the harbor docks, and a single-provider outage at the wrong moment means a restaurant that can&apos;t run credit cards during the Saturday dinner rush, a charter company that can&apos;t process a last-minute booking, or a vacation rental management desk that goes dark right when guests need check-in instructions. We build redundant connections — primary wired plus cellular or Starlink failover — so your operation stays live when one path wobbles. Add salt-air hardware selection, proactive monitoring, and a flat monthly rate with no surprise invoices, and you get IT that fits the actual coast rather than a generic small-business template.",
      ]}
      includesTitle="What Bodega Bay businesses get"
      includes={[
        "Redundant internet setup — primary wired plus cellular or Starlink failover so a single outage never takes you down",
        "Salt-air-rated hardware selection: routers, switches, and access points built to survive coastal humidity and corrosion",
        "POS system support and uptime monitoring — credit-card processing stays live through weekend day-tripper rushes",
        "Online booking and reservation system reliability for charter operators, vacation rentals, and inns",
        "Remote monitoring and after-hours alerts so problems are caught before guests or customers notice",
        "Secure guest Wi-Fi networks isolated from your business systems — essential for vacation rentals and inns",
        "Flat monthly pricing with no hourly billing, no surprise invoices, and no per-incident fees",
        "A local technician who can drive out to the coast — not a remote-only helpdesk that&apos;s never seen a harbor",
      ]}
      industriesTitle="Who we support in Bodega Bay"
      industries={[
        "Seafood restaurants & fish markets",
        "Sport-fishing & whale-watching charters",
        "Vacation rentals & property managers",
        "Coastal inns & bed-and-breakfasts",
        "Kayak & outdoor adventure rentals",
        "Bait shops & marine supply",
        "Highway 1 retail & gift shops",
        "RV parks & campgrounds",
      ]}
      faqs={[
        {
          q: "Our internet goes out several times a month. Can you actually fix that on the coast?",
          a: "You probably can&apos;t get a second wired provider out here, but you don&apos;t need one. We set up a primary wired connection paired with a cellular or Starlink failover that kicks in automatically within seconds of a dropout. Your POS, payment terminal, and booking software stay online even when your main ISP is having a bad day. Starlink in particular has been a game-changer for coastal and rural businesses that had no good backup option before.",
        },
        {
          q: "Our router and switches keep corroding out near the water. Is that a normal IT problem?",
          a: "It&apos;s very normal on the Sonoma Coast and largely ignored by inland IT vendors who spec consumer-grade equipment. Salt air accelerates corrosion on circuit boards, fan bearings, and port contacts — especially in anything near the waterfront or in unventilated storage rooms. We select commercial-grade, coastal-rated hardware with sealed enclosures where needed, and we account for ventilation and placement during setup so you&apos;re not replacing gear every eighteen months.",
        },
        {
          q: "We run a vacation rental property management office. What does IT support look like for that?",
          a: "For vacation rental operators the big needs are reliable guest Wi-Fi at each property (isolated from any management systems), a stable connection at the main office for your property management software and booking channels, and secure remote access so you can handle check-in issues from wherever you are. We handle the network design, equipment, monitoring, and ongoing support — and because we know the coastal connectivity constraints, we build redundancy in from the start rather than as an afterthought when something breaks mid-check-in.",
        },
        {
          q: "Our charter boats use mobile card readers and booking apps on the dock. Do you support that?",
          a: "Yes. Dock and harbor environments are exactly where single-carrier cellular dependency bites you — one carrier has a weak signal at the fuel dock, another drops out in the cove. We can set up a Wi-Fi network that reaches the dock from your office using weatherproof access points, or help you configure a multi-carrier failover so your crew&apos;s payment devices and booking tablets stay connected regardless of which carrier is strongest that day. We also support the software side: Square, Clover, FareHarbor, and similar platforms charter and tour operators commonly use.",
        },
        {
          q: "What does flat-monthly IT support actually cost for a small coastal business?",
          a: "Monthly IT support is priced based on the number of devices and users we&apos;re covering and whether you need on-site visits or remote-only service. We quote a single flat number before you sign anything — no hourly rates, no per-ticket fees, no surprise charges when something breaks at 6 PM on a Saturday. Start with a free 30-minute call and we&apos;ll give you an honest assessment of your current setup and a specific number for ongoing support.",
        },
      ]}
      nearby={[
        { href: "/web-design-bodega-bay", label: "web design in Bodega Bay" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
      ctaBlurb="Free 30-minute call. We&apos;ll assess your connectivity and IT setup honestly, tell you what we&apos;d fix first, and give you a flat monthly number — no pressure."
    />
  );
}
