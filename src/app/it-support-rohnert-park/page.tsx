import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-rohnert-park";

export const metadata: Metadata = {
  title: "IT Support Rohnert Park CA | Managed IT for Offices & Small Business | Copper Bay Tech",
  description:
    "Flat-rate managed IT support for Rohnert Park offices, medical practices, retailers, and nonprofits. No ticket queues — talk to a real tech. Serving businesses near Sonoma State, the business parks, and SMART train corridor. Call (707) 239-6725.",
  keywords:
    "IT support Rohnert Park, managed IT Rohnert Park CA, computer support Rohnert Park, small business IT Rohnert Park, network support Rohnert Park, IT services Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Rohnert Park Businesses | Copper Bay Tech",
    description:
      "Flat-rate managed IT for Rohnert Park offices, medical practices, retailers, and nonprofits — direct access, no ticket queue.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportRohnertPark() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Rohnert Park"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-rate managed IT support for Rohnert Park offices, medical and dental practices, retailers, and nonprofits — direct access to a real tech, no ticket queue, no long-term contract."
      intro={[
        "Rohnert Park runs on workday business. The stretch along Commerce Boulevard, the business parks near the SMART train station, the medical and dental offices clustered around Rohnert Park Expressway, the insurance agencies, accounting firms, and law offices spread across the city — these are operations where a downed server, a locked-out account, or a failed Wi-Fi access point means real money and real frustration on a Tuesday afternoon. Sonoma State University anchors the city's identity, but the economic backbone is professional services and light commerce, not tourism, and the IT problems those businesses face are squarely workday problems: network reliability, device management, cloud file access, and keeping patient or client data compliant and secure.",
        "What most Rohnert Park businesses tell us they want isn't elaborate — they want someone to pick up the phone. The managed IT model we offer gives your team a direct line to a local technician who already knows your setup, not a rotating help-desk queue overseas. We handle flat monthly pricing, so you're not dreading the invoice after a hard month. And because we don't do long-term contracts, we stay because the service is worth keeping, not because you're locked in. If you're running a practice near Sonoma State, a retail franchise off Commerce, a nonprofit on the east side, or a light-industrial operation near the railroad tracks, we're built for the way Rohnert Park actually works.",
      ]}
      includesTitle="What Rohnert Park businesses get"
      includes={[
        "Flat monthly rate — no surprise invoices after a hard month",
        "Direct phone and remote access to a local technician who knows your setup",
        "Managed antivirus, patch management, and endpoint monitoring",
        "Office and retail Wi-Fi design, installation, and ongoing support",
        "Cloud migration and Microsoft 365 / Google Workspace management",
        "HIPAA-aware network and data practices for medical and dental offices",
        "Backup and disaster recovery so a failed drive doesn't cost you a week",
        "No long-term contract — month-to-month because we earn it each month",
      ]}
      industriesTitle="Who we help in Rohnert Park"
      industries={[
        "Insurance & financial services",
        "Medical & dental practices",
        "Accounting & tax firms",
        "Legal offices",
        "Retail & franchise locations",
        "Nonprofits & community orgs",
        "Light industrial & distribution",
        "Professional services near SSU",
      ]}
      faqs={[
        {
          q: "Do you actually come on-site in Rohnert Park, or is everything remote?",
          a: "Both. We handle most day-to-day issues remotely — faster and less disruptive to your workday. But when something needs hands on hardware, a new workstation setup, or a Wi-Fi walk-through of your office, we come to you. Rohnert Park is in our regular service area, so there's no travel surcharge tacked on.",
        },
        {
          q: "We have a medical office. Can you handle HIPAA requirements?",
          a: "We work with medical and dental practices and understand the practical IT side of HIPAA — encrypted storage, access controls, audit-ready logs, secure remote access for providers, and business-associate agreement paperwork. We're not a compliance law firm, so for formal legal compliance review you'd engage a healthcare attorney, but on the technical controls side we know what auditors look for and we build those in from the start.",
        },
        {
          q: "Our office Wi-Fi is unreliable and we have staff complaining. What does that usually cost to fix?",
          a: "Most small-office Wi-Fi problems come down to a consumer-grade router trying to cover too much space, or access points placed without a signal plan. A proper business-grade setup — the kind with real access points and a managed controller — typically runs $500 to $1,500 in hardware for a small office, plus installation. We assess the space first so you know the number before anything gets ordered. Monthly support is included in your flat IT plan.",
        },
        {
          q: "What's a realistic price for flat-rate IT support?",
          a: "For a small Rohnert Park office of five to twenty workstations, flat monthly managed IT typically runs in the range of a few hundred dollars a month depending on device count and the level of support you need. We quote a specific number after a free assessment call — no vague ranges that balloon later. Security audits are priced as a one-time flat fee.",
        },
        {
          q: "We're still running some things on old local servers. Should we move to the cloud?",
          a: "Sometimes yes, sometimes no — it depends on what the server is actually doing. File storage and email are almost always cheaper and more reliable in the cloud for a small office. Line-of-business software, point-of-sale systems, or medical practice-management software sometimes have on-premise requirements or licensing that makes a full move complicated. We'll look at what you have and give you an honest assessment of what makes sense to migrate and what's better left where it is.",
        },
      ]}
      nearby={[
        { href: "/web-design-rohnert-park", label: "web design in Rohnert Park" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
