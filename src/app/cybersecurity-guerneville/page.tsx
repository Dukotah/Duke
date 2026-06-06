import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-guerneville";

export const metadata: Metadata = {
  title: "Cybersecurity Guerneville CA | Vacation Rental & Restaurant Security | Copper Bay Tech",
  description:
    "Cybersecurity for Guerneville vacation rentals, riverside restaurants, lodges, and outfitters. PCI compliance, guest Wi-Fi separation, flood-proof backups, and flat-fee security audits. Call (707) 239-6725.",
  keywords:
    "cybersecurity Guerneville, cybersecurity Guerneville CA, vacation rental security Russian River, PCI compliance Guerneville, network security Sonoma County, small business cybersecurity Guerneville",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Guerneville Businesses | Copper Bay Tech",
    description:
      "PCI compliance, guest Wi-Fi isolation, and tested off-site backups for Guerneville vacation rentals, restaurants, and river-town hospitality businesses.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityGuerneville() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Guerneville"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical, plain-English cybersecurity for Guerneville&apos;s vacation rentals, riverside restaurants, lodges, and outfitters — covering PCI compliance, guest Wi-Fi isolation, seasonal-staff access controls, and tested off-site backups before the river rises."
      intro={[
        "Guerneville runs on hospitality — vacation rentals packed from Memorial Day through the jazz and beer festivals, riverside bars and restaurants processing hundreds of card transactions on a busy summer Saturday, lodges turning over seasonal staff every few months. That rhythm creates real security exposure: payment card data flowing through point-of-sale systems, booking-platform credentials shared across rotating crews, and guest Wi-Fi networks that may not be properly separated from the business systems behind them. A cardholder data breach at a riverside restaurant or a ransomware hit that locks up a vacation rental management platform on the Fourth of July weekend isn&apos;t a hypothetical — it&apos;s a genuine operational risk for the kind of businesses that keep this town running.",
        "There&apos;s also a risk unique to the Russian River corridor that most cybersecurity providers don&apos;t mention: physical. When the river floods — and it does — on-site servers and NAS drives can be destroyed before anyone has time to grab them. A business that loses its on-site hardware and has no tested off-site backup loses years of customer records, reservation history, and financial data along with the equipment. We treat off-site backup and a written recovery plan as core security requirements here, not add-ons. Our work in Guerneville is grounded in what actually threatens river-town hospitality businesses: card data exposure, compromised guest networks, over-permissioned seasonal accounts, and the very real possibility that a January storm could take out everything in your back office.",
      ]}
      includesTitle="What Guerneville businesses get"
      includes={[
        "Flat-fee security audit — a written report of real findings, not a scare-tactic sales pitch",
        "PCI DSS scoping for card-processing restaurants, bars, and vacation rental operators",
        "Guest Wi-Fi physically and logically separated from your business network",
        "Seasonal and part-time staff access controls — least-privilege accounts, simple offboarding",
        "Tested off-site backup with a written recovery plan built for a flood or power-loss scenario",
        "Endpoint protection and patch management for front-desk computers and POS terminals",
        "Multi-factor authentication on booking platforms, reservation systems, and email",
        "Flat monthly monitoring so someone is watching even when you&apos;re busy running the summer season",
      ]}
      industriesTitle="Who we help in Guerneville"
      industries={[
        "Vacation rental operators",
        "Riverside restaurants & bars",
        "Lodges & inns",
        "Outfitters & river-tour operators",
        "Event venues & retreat centers",
        "Campgrounds & RV parks",
        "Retail shops & boutiques",
        "Wellness & spa businesses",
      ]}
      faqs={[
        {
          q: "Do vacation rental operators in Guerneville actually need to worry about cybersecurity?",
          a: "If you process card payments directly, store guest data, or use a property-management platform like Hostaway, Lodgify, or Guesty — yes, it matters. Booking credentials are a common target because they give an attacker the ability to redirect guest payments or cancel reservations. Rotating seasonal staff who share login credentials to the management platform is the most common gap we find. We help you set up individual accounts with appropriate access, enable multi-factor authentication on the platforms that support it, and make sure offboarding a summer employee doesn&apos;t leave an active credential behind.",
        },
        {
          q: "My restaurant has a guest Wi-Fi network. Is that enough to protect my POS system?",
          a: "Only if the guest network is genuinely isolated from the network your point-of-sale terminal sits on — and in many small restaurants, it isn&apos;t. A guest who connects to your Wi-Fi and your POS are on the same flat network by default with many consumer routers. PCI DSS requires that cardholder data environments be segmented from public-access networks. We check that the isolation is real (not just a different SSID on the same router), and fix it if it isn&apos;t — which is usually a straightforward configuration change, not a big equipment purchase.",
        },
        {
          q: "What happens to our data if the river floods and destroys our on-site equipment?",
          a: "If you only have on-site backups — a NAS drive in the back office, a local server under the desk — a flood or a fire takes your backup along with your primary system. We set up automated off-site backups (cloud-based, encrypted, tested) so your guest records, financial data, and reservation history are recoverable even if everything in the building is lost. We also help you write a one-page recovery plan so you know exactly what to do on day one after a disaster, rather than figuring it out while you&apos;re also dealing with the flood.",
        },
        {
          q: "We hire a lot of seasonal staff in summer. How do we manage their access safely?",
          a: "Seasonal hiring is one of the most common cybersecurity gaps in Russian River hospitality. The practical answer is individual accounts (not shared logins), with access limited to what each role actually needs — a server doesn&apos;t need access to owner-level financials in your POS. When the season ends and staff leave, those accounts get disabled immediately. We set this up in a way that&apos;s easy for you to manage without a dedicated IT person: a simple checklist for onboarding and offboarding so nothing falls through the cracks when it&apos;s busy.",
        },
        {
          q: "What does a security audit cost, and what do I actually get?",
          a: "We charge a flat fee for the audit — quoted upfront, no hourly billing. You get a plain-English written report that lists what we found, ranked by actual risk, and what we&apos;d recommend fixing and in what order. We don&apos;t manufacture urgency around low-risk findings to sell you more work. If there&apos;s nothing critical, we&apos;ll tell you that. If there&apos;s something that genuinely needs attention before your busy season, we&apos;ll say so clearly. Start with a free 30-minute call at (707) 239-6725 and we&apos;ll tell you honestly whether an audit makes sense for where you are right now.",
        },
      ]}
      nearby={[
        { href: "/it-support-guerneville", label: "IT support in Guerneville" },
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
