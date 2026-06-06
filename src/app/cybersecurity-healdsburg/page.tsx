import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-healdsburg";

export const metadata: Metadata = {
  title: "Cybersecurity Healdsburg CA | Tasting Room & Hospitality Security | Copper Bay Tech",
  description:
    "Cybersecurity for Healdsburg wineries, tasting rooms, inns, and restaurants. PCI-compliant card reader setup, guest Wi-Fi isolation, and flat-fee security audits that protect payment data and your brand. Call (707) 239-6725.",
  keywords:
    "cybersecurity Healdsburg, cybersecurity Healdsburg CA, PCI compliance tasting room, winery cybersecurity Sonoma County, guest wifi security Healdsburg, small business cybersecurity Healdsburg",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Healdsburg Businesses | Copper Bay Tech",
    description:
      "Flat-fee security audits and ongoing protection for Healdsburg wineries, tasting rooms, inns, and restaurants — because a data breach during harvest weekend is the worst kind of headline.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityHealdsburg() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Healdsburg"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Plain-English security for Healdsburg tasting rooms, boutique inns, and restaurants — PCI-compliant card readers, isolated guest Wi-Fi, and protection that holds up during a packed harvest weekend."
      intro={[
        "Healdsburg runs on hospitality, and hospitality runs on trust. Every tasting room swipe, every online wine-club order, every inn reservation carries a guest&apos;s payment data — and most of those businesses process cards through a mix of tablet-based POS systems, e-commerce platforms, and third-party reservation software that wasn&apos;t necessarily set up with security in mind. That&apos;s a real exposure: a single compromised card reader or an open Wi-Fi network that lets a guest&apos;s device touch your POS system can trigger a PCI violation and the kind of breach-notification letter no premium brand ever wants to send.",
        "The seasonal rhythm here adds another layer of complexity. Harvest brings temporary crush-crew staff and event workers who need system access — often in a hurry, with shortcuts taken on passwords and permissions. Summer weekends push every venue to capacity, which is exactly when a ransomware incident or a locked reservation system does the most damage. We help Healdsburg businesses build simple, realistic security habits: separated networks for guests and staff, properly scoped POS environments, and policies seasonal employees can actually follow — without turning your tasting room into an airport security checkpoint.",
      ]}
      includesTitle="What Healdsburg businesses get"
      includes={[
        "Flat-fee security audit — one clear report, no hourly billing, no upsell pressure",
        "PCI scope review for tasting-room card readers and wine-club e-commerce",
        "Guest Wi-Fi isolation so visitor devices never touch your POS or back-office network",
        "Reservation-system access controls and credential hygiene for seasonal staff",
        "Ransomware resilience: tested backups, patching schedule, and a recovery playbook",
        "Email security (SPF, DKIM, DMARC) to stop spoofed messages that impersonate your brand",
        "Staff security training sized for a small hospitality team — clear, practical, not a lecture",
        "Flat monthly monitoring option for ongoing threat detection and response",
      ]}
      industriesTitle="Who we help in Healdsburg"
      industries={[
        "Wineries & tasting rooms",
        "Boutique hotels & inns",
        "Fine dining & farm-to-table restaurants",
        "Wedding & event venues",
        "Wine-club & DTC e-commerce",
        "Art galleries & boutiques",
        "Specialty food & wine retail",
        "Tour & experience operators",
      ]}
      faqs={[
        {
          q: "Do tasting rooms actually need to worry about PCI compliance?",
          a: "Yes — any business that accepts credit or debit cards is subject to PCI DSS requirements, regardless of size. For a tasting room or inn, the main risks are unsegmented networks (where a guest&apos;s device can reach the same network as your card reader), outdated POS software, and default or shared passwords on payment terminals. A breach doesn&apos;t have to be dramatic to trigger card-brand fines and mandatory notification; a skimmer or a misconfigured system is enough. Our audit checks the most common gaps and gives you a prioritized, plain-English list of what to fix.",
        },
        {
          q: "We offer free Wi-Fi to guests. Is that a security problem?",
          a: "It can be if the guest network and your staff network aren&apos;t properly isolated. When a tasting-room visitor connects to the same Wi-Fi your POS tablet uses, there&apos;s a path — however indirect — between their device and your payment data. The fix is straightforward: a properly configured guest VLAN that keeps visitor traffic completely separate from business systems. We set this up correctly the first time and verify the isolation actually holds.",
        },
        {
          q: "We hire extra staff during harvest and summer. How do we handle their access securely?",
          a: "Temporary workers are one of the most common sources of credential exposure — shared passwords, accounts that never get deactivated, and permissions granted in a rush that never get reviewed. We help you build a simple onboarding and offboarding checklist: role-limited accounts, a password manager your seasonal team will actually use, and a ten-minute deactivation process when someone&apos;s shift ends. It doesn&apos;t require new software in most cases — just consistent habits.",
        },
        {
          q: "What happens if ransomware locks our reservation system on a holiday weekend?",
          a: "That&apos;s the scenario that keeps hospitality owners up at night, and it&apos;s a real one — ransomware operators deliberately time attacks around peak business periods. The honest answer is that no security layer eliminates the risk entirely, but a tested off-site backup means you have something to restore from instead of paying a ransom. We audit your current backup setup, close the gaps, and document a step-by-step recovery plan before an incident happens, so you&apos;re not making decisions under pressure.",
        },
        {
          q: "What does a cybersecurity audit cost for a Healdsburg business?",
          a: "We quote a flat fee before any work starts — no hourly billing and no scope creep. For a small hospitality business (a tasting room, inn, or restaurant), an audit typically covers network segmentation, POS environment review, email security, and staff access controls. Ongoing monthly monitoring is a separate flat monthly fee. Start with a free 30-minute call and we&apos;ll tell you honestly what we&apos;d look at and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/it-support-healdsburg", label: "IT support in Healdsburg" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
