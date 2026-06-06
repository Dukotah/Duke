import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-glen-ellen";

export const metadata: Metadata = {
  title: "Cybersecurity Glen Ellen CA | Small Winery & Inn Security | Copper Bay Tech",
  description:
    "Cybersecurity for Glen Ellen wineries, tasting rooms, fine-dining restaurants, and rustic-luxury inns. PCI compliance, guest Wi-Fi separation, and wine-club data protection. Flat-fee audits. Call (707) 239-6725.",
  keywords:
    "cybersecurity Glen Ellen, small business security Glen Ellen CA, winery cybersecurity Sonoma Valley, PCI compliance tasting room, guest wifi inn security, wine club data protection Glen Ellen",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Glen Ellen Businesses | Copper Bay Tech",
    description:
      "Flat-fee security audits, PCI compliance, and guest Wi-Fi separation for Glen Ellen wineries, restaurants, and boutique inns.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityGlenEllen() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Glen Ellen"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical, plain-English security for Glen Ellen's family wineries, fine-dining restaurants, and boutique inns — protecting cardholder data, wine-club records, and the heritage reputation that took decades to build."
      intro={[
        "Glen Ellen sits at the quieter, more intimate end of Sonoma Valley, and that intimacy is the point. The businesses here — small family wineries, destination restaurants like the Fig Cafe, and rustic-luxury hideaways nestled in the Sonoma Mountains — earn their reputation one guest at a time, over many years. A data breach or a weekend of payment-system downtime doesn't just cost money; it can fracture the trust that a boutique brand spends a generation building. Cybersecurity here isn't about fending off nation-state hackers. It's about making sure that the card readers at your tasting room, the reservation records for your inn, and the wine-club database you've grown over ten harvests are handled with the same care you put into everything else.",
        "The rural-historic character of Glen Ellen adds a layer that flat-land businesses don't think about. Many properties operate out of converted barns, century-old farmhouses, or multi-building estates where running structured cabling is impractical and Wi-Fi is the only option — which means guest networks, POS systems, and back-office computers often end up sharing the same connection unless someone deliberately separates them. Seasonal staff, visiting harvest crews, and event contractors regularly need temporary access to systems that shouldn't be left open after they leave. These aren't exotic IT problems; they're the everyday reality of running a premium hospitality business in a working agricultural landscape. We handle them in plain language, on a flat-fee schedule, without turning a security conversation into a sales pitch.",
      ]}
      includesTitle="What Glen Ellen businesses get"
      includes={[
        "Flat-fee security audit — one clear price, written findings, no upsell pressure",
        "PCI DSS scope review for tasting-room and restaurant card readers",
        "Guest Wi-Fi network separated from POS, reservations, and back-office systems",
        "Wine-club and e-commerce customer data inventory and access controls",
        "Seasonal and event staff onboarding and offboarding procedures",
        "Reservation and property-management system credential hygiene",
        "Phishing-awareness training sized for a small team, not a corporate department",
        "Flat monthly monitoring so problems surface before guests notice them",
      ]}
      industriesTitle="Who we help in Glen Ellen"
      industries={[
        "Family wineries & tasting rooms",
        "Fine-dining & farm-to-table restaurants",
        "Boutique inns & vacation rentals",
        "Wine-club direct-to-consumer operations",
        "Event & wedding venues on agricultural estates",
        "Specialty food producers & farm stands",
        "Spa & wellness retreats",
        "Short-term rental property managers",
      ]}
      faqs={[
        {
          q: "Our tasting room uses a tablet-based POS. Do we actually have PCI obligations?",
          a: "Yes. Any time you store, process, or transmit cardholder data — including swiping or tapping a card on a tablet reader — PCI DSS applies. For a small tasting room the scope is usually limited, which works in your favor: a point-to-point encrypted reader and a properly segmented network can shrink your annual compliance burden to a short self-assessment questionnaire. We walk you through which SAQ tier fits your setup and what you'd need to change, if anything, to qualify for the simplest path.",
        },
        {
          q: "We have a historic farmhouse property where running cable is nearly impossible. How do you handle security on an all-Wi-Fi network?",
          a: "Wi-Fi-only properties are common in Glen Ellen's older buildings, and they're workable — they just require deliberate network segmentation. We set up separate SSIDs (or VLANs on the access points you already have) so that a guest's phone, your POS terminal, and your back-office computer are on logically isolated networks that can't talk to each other. A guest who connects to your inn's Wi-Fi can reach the internet; they can't reach your reservation system. It's a straightforward configuration change, not a construction project.",
        },
        {
          q: "We have a wine club with several hundred members. What&apos;s our exposure if that data were compromised?",
          a: "Wine-club records typically contain names, email addresses, shipping addresses, and stored payment methods — exactly the combination that makes them valuable to bad actors and that triggers California's data-breach notification law (CCPA/Cal. Civ. Code 1798.82) if exposed. Beyond the legal obligation, the reputational harm to a small heritage brand is the bigger concern: your wine-club members are your most loyal customers, and a breach letter to them is a trust event you can't easily walk back. We audit how that data is stored, who can access it, and whether your e-commerce or club-management platform is configured to minimize exposure.",
        },
        {
          q: "We hire harvest crews and event staff seasonally. How do we handle their system access safely?",
          a: "Temporary access that never gets revoked is one of the most common small-business security gaps we find. We help you set up a simple offboarding checklist — shared passwords rotated at season's end, individual accounts disabled, any Wi-Fi credentials changed — so that former staff don't retain access to systems they no longer need. It takes an afternoon to implement and becomes a routine you run every harvest. For event contractors we set up a time-limited guest-level account or a separate VLAN so they can do their job without touching anything sensitive.",
        },
        {
          q: "What does a security audit cost for a small Glen Ellen business?",
          a: "We price audits as a flat fee quoted upfront, not by the hour. For a typical small winery, tasting room, restaurant, or inn the range is roughly $500 to $1,500 depending on the number of locations, systems, and staff — you'll know the number before we start. Ongoing flat-monthly monitoring for a small business generally runs a few hundred dollars a month. We'll tell you honestly in a free 30-minute call what tier of service actually makes sense for your size, and what, if anything, is worth fixing first.",
        },
      ]}
      nearby={[
        { href: "/it-support-glen-ellen", label: "IT support in Glen Ellen" },
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
