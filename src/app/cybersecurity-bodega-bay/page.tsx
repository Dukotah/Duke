import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-bodega-bay";

export const metadata: Metadata = {
  title: "Cybersecurity Bodega Bay CA | Coastal Business Security Audits | Copper Bay Tech",
  description:
    "Practical cybersecurity for Bodega Bay fishing charters, vacation rentals, seafood restaurants, and coastal inns. PCI compliance, guest Wi-Fi segmentation, and resilient backups built for remote-coastal realities. Call (707) 239-6725.",
  keywords:
    "cybersecurity Bodega Bay, small business cybersecurity Bodega Bay CA, PCI compliance Bodega Bay, guest Wi-Fi security coastal business, vacation rental data security Sonoma Coast, fishing charter cybersecurity",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Bodega Bay Small Businesses | Copper Bay Tech",
    description:
      "Flat-fee security audits for Bodega Bay charters, vacation rentals, inns, and seafood businesses — built around the real risks of a remote coastal operation.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityBodegaBay() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Bodega Bay"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical, plain-English cybersecurity for Bodega Bay&apos;s fishing charters, vacation rentals, coastal inns, and seafood businesses — flat-fee audits, no fear-based selling, and backup strategies built for places where the internet goes out."
      intro={[
        "Bodega Bay runs a hospitality economy built on trust: guests hand over their credit cards at the charter dock, share payment details when booking a vacation rental, and connect to inn Wi-Fi the moment they check in. That combination — card transactions, reservation data, and open guest networks — is exactly what security auditors flag first for coastal hospitality businesses. Add in seasonal staffing that turns over every spring and fall, and the odds that a shared password or an unsecured tablet point-of-sale gets overlooked go up considerably. A breach here isn&apos;t just a business problem; in a village this small, word travels fast and the reputational damage lands harder than the recovery cost.",
        "There&apos;s also a connectivity reality unique to this stretch of coast: Bodega Bay businesses routinely cope with unreliable fixed-line internet — and when the main connection drops, staff pivot to mobile hotspots and personal phones to keep operations running. That&apos;s understandable, but each personal device that touches your reservation system or payment processor is an unmanaged endpoint outside your control. Similarly, a cloud-only backup strategy sounds modern until the internet goes down for a day and you realize your last verified backup is locked behind a connection that no longer exists. We help coastal businesses build layered, local-plus-cloud backup plans that keep data recoverable even during outages, and we close the endpoint gaps that open up when everyone&apos;s working off their own hotspot.",
      ]}
      includesTitle="What Bodega Bay businesses get"
      includes={[
        "Flat-fee security audit with a written, prioritized findings report — no hourly billing",
        "PCI DSS compliance review for charter and restaurant card readers, online booking checkouts, and vacation rental payment flows",
        "Guest Wi-Fi segmentation so visitor devices never share a network with your POS, booking system, or reservations data",
        "Layered backup setup — local plus cloud — so data stays recoverable during coastal internet outages",
        "Endpoint review covering staff personal devices and mobile hotspots used when the main connection drops",
        "Seasonal-staff account hygiene: onboarding and offboarding checklists so ex-employees don&apos;t retain access",
        "MFA rollout and password-manager guidance for small teams and shared accounts",
        "Plain-English written summary owners can share with their accountant, insurance carrier, or property manager",
      ]}
      industriesTitle="Who we help in Bodega Bay"
      industries={[
        "Sport-fishing & whale-watching charters",
        "Vacation rentals & coastal inns",
        "Seafood restaurants & oyster bars",
        "Seafood markets & fish processors",
        "Kayak & outdoor outfitters",
        "Lodges & small resorts",
        "Coastal event & wedding venues",
        "Specialty coastal retail",
      ]}
      faqs={[
        {
          q: "We run a vacation rental and take bookings through Airbnb and our own site. What&apos;s our real security exposure?",
          a: "Your exposure comes from two directions. First, any payment data collected directly on your own site — through a booking widget or direct-inquiry payment link — puts you in scope for PCI compliance, and most small rental operators haven&apos;t formally reviewed that. Second, the guest Wi-Fi network is a genuine risk: if your same router serves both guests and whatever device you use to manage reservations, finances, or owner communications, a technically motivated guest could potentially reach those systems. We segment those networks so guest traffic is completely isolated, and we review your direct-booking payment setup so you know exactly what&apos;s in scope and what&apos;s already handled by Airbnb or VRBO on your behalf.",
        },
        {
          q: "Our internet goes out regularly in winter storms. Does that affect our backups?",
          a: "It does, if your backup strategy is cloud-only. Many small businesses set up a cloud backup service and assume the job is done — but if the internet is down during a ransomware event or an accidental deletion, that cloud backup is out of reach until the connection comes back. We set up a layered approach: a local backup on a dedicated external drive or NAS that&apos;s always reachable on-site, plus a cloud backup that syncs when you&apos;re connected. We also run a test restore with you so you&apos;ve actually seen your data come back, not just assumed it will. For a coastal business where outages are a regular seasonal fact, that local layer isn&apos;t optional — it&apos;s the insurance policy.",
        },
        {
          q: "We hire seasonal deckhands and dock staff every spring. How do we handle account security around that turnover?",
          a: "Seasonal offboarding is one of the most commonly skipped security steps in hospitality, and it&apos;s usually not negligence — it&apos;s just that the end of season is chaotic and no one has a checklist. We build you a simple onboarding and offboarding procedure: what accounts get created when someone starts, what gets revoked the day they leave, and how to verify it&apos;s done. We also set up your team on a password manager so seasonal staff are never sharing credentials directly — they get access through managed sharing that you can revoke instantly at season&apos;s end. It takes one afternoon to set up and saves a real headache if a former employee&apos;s credentials ever show up somewhere they shouldn&apos;t.",
        },
        {
          q: "When the fixed internet drops, our staff use their own phones as hotspots to keep the charter booking system running. Is that a problem?",
          a: "It&apos;s a practical workaround that creates a real gap: personal mobile hotspots are unmanaged networks with no business-grade controls, and any traffic flowing through them — including reservation data or payment confirmations — is outside the protections your business network normally provides. We don&apos;t tell you to stop doing it, because keeping operations running during an outage is genuinely important. Instead, we put guardrails around it: VPN configurations for staff devices, clear guidance on what should and shouldn&apos;t flow over a personal hotspot, and — for businesses where outages are frequent enough to be a real problem — a cellular failover device that&apos;s managed and secured rather than improvised.",
        },
        {
          q: "What does a security audit cost, and what do I get at the end?",
          a: "We charge a flat fee quoted upfront before we start — no hourly rate, no bill that surprises you at the end. Most Bodega Bay small-business audits land between $500 and $1,500 depending on how many systems, payment flows, and people are in scope. At the end you get a written findings report that ranks each issue by priority, explains the actual risk in plain English, and tells you what you can handle yourself versus what we can take care of for you. There&apos;s no obligation to hire us for the fixes — some owners take the report and act on it themselves, and that&apos;s a completely fine outcome.",
        },
      ]}
      nearby={[
        { href: "/it-support-bodega-bay", label: "IT support in Bodega Bay" },
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
