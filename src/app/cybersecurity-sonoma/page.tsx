import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-sonoma";

export const metadata: Metadata = {
  title: "Cybersecurity Sonoma CA | Plaza-Area Small Business Security | Copper Bay Tech",
  description:
    "Cybersecurity for Sonoma Plaza tasting rooms, boutique inns, restaurants, and event venues. PCI compliance, guest Wi-Fi segmentation, and flat-fee security audits. Call (707) 239-6725.",
  keywords:
    "cybersecurity Sonoma CA, cybersecurity Sonoma Plaza, PCI compliance tasting room, small business cybersecurity Sonoma, guest WiFi security Sonoma, ransomware protection Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Sonoma Plaza Businesses | Copper Bay Tech",
    description:
      "Flat-fee security audits and ongoing protection for Sonoma tasting rooms, inns, restaurants, and event venues handling Bay Area visitor payment data.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecuritySonoma() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Sonoma"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical security for Sonoma Plaza tasting rooms, boutique inns, restaurants, and event venues — PCI-compliant card handling, segmented guest Wi-Fi, and ransomware protection that keeps your busiest weekends running."
      intro={[
        "The Sonoma Plaza draws a steady flow of Bay Area visitors every weekend, and nearly every transaction they make — tasting fees, lunch tabs, inn reservations, wine-club sign-ups — runs through a card reader or online booking system. That volume of payment data flowing through historic downtown storefronts, repurposed Victorian buildings, and open-courtyard venues creates real security exposure. PCI compliance at the tasting-room POS, separating guest Wi-Fi from the network where reservation and wine-club data lives, and locking down the seasonal staff accounts that rotate through every summer and harvest season are not optional extras — they&apos;re the baseline for operating safely here.",
        "Ransomware is the threat Sonoma hospitality businesses talk about the least and should take the most seriously. A venue locked out of its reservation system on a Saturday in August — when the Plaza is packed and every room is booked — faces an ugly choice: pay the ransom or turn away guests. The attack surface is broader than most owners realize: a single shared login used by a temp worker, an unpatched point-of-sale terminal, or guest Wi-Fi that bleeds into the back-office network can be the entry point. We audit exactly these gaps, explain what we find in plain English, and fix what matters most — without overselling tools you don&apos;t need.",
      ]}
      includesTitle="What Sonoma businesses get"
      includes={[
        "PCI compliance review for tasting-room and restaurant card readers and POS systems",
        "Guest Wi-Fi segmentation — isolating visitor traffic from reservation and wine-club networks",
        "Seasonal and temporary staff account controls, offboarding, and access audits",
        "Ransomware readiness: offline backups, endpoint protection, and recovery planning",
        "Online booking and reservation system security review (e-commerce, wine-club portals)",
        "Historic-building network assessment — identifying shadow IT and legacy hardware",
        "Ongoing flat-monthly monitoring with plain-English monthly reports",
        "Flat-fee security audit quoted upfront — no hourly billing, no surprise invoices",
      ]}
      industriesTitle="Who we help in Sonoma"
      industries={[
        "Tasting rooms & wineries",
        "Boutique inns & B&Bs",
        "Plaza restaurants & cafes",
        "Wedding & event venues",
        "Specialty wine & food retail",
        "Wine-club e-commerce operations",
        "Tour & experience operators",
        "Spa & wellness studios",
      ]}
      faqs={[
        {
          q: "Do tasting rooms actually need to be PCI compliant?",
          a: "Yes — any business that accepts credit or debit cards is in scope for PCI DSS, regardless of size. For Sonoma tasting rooms that run cards all weekend, the exposure is real: a card-data breach can trigger fines from your payment processor, mandatory forensic audits, and loss of the ability to accept cards. The good news is that most small tasting rooms qualify for the simplest PCI compliance path (SAQ A or SAQ B), and getting there is mostly about locking down your card reader configuration and making sure guest Wi-Fi can&apos;t touch your POS network.",
        },
        {
          q: "We hire seasonal staff every harvest. How do we keep accounts secure when staff turns over?",
          a: "Temporary accounts that never get removed are one of the most common entry points we see. We set up a simple offboarding checklist tied to your hire dates, ensure seasonal workers have role-limited accounts rather than shared admin credentials, and audit active accounts after each season closes. The goal is that no departed temp worker can still log in to your reservation system or wine-club portal after their last shift.",
        },
        {
          q: "Can you separate our guest Wi-Fi from the network where our reservation and wine-club data lives?",
          a: "Yes, and this is one of the most important fixes for Plaza-area hospitality businesses. Many historic buildings in Sonoma were wired before network segmentation was standard practice, so guest Wi-Fi and business systems often share the same network. We assess your current setup, implement VLAN segmentation or a separate guest network, and verify that a visitor&apos;s laptop or phone on your public Wi-Fi has no path to the systems holding reservation data, wine-club records, or financial information.",
        },
        {
          q: "What happens if ransomware hits us during a busy Plaza weekend?",
          a: "Recovery speed depends entirely on what you had in place before the attack. With a current, tested, offline backup you can often be back up within hours. Without one, you&apos;re negotiating with criminals or rebuilding from scratch while guests are waiting. We implement a layered approach: endpoint protection to catch threats early, automated backups that can&apos;t be encrypted by the same ransomware that hits your main systems, and a documented recovery plan so your team knows what to do and who to call before it happens — not after.",
        },
        {
          q: "What does a security audit cost for a small Sonoma business?",
          a: "We quote flat fees upfront — no hourly billing. A security audit for a typical Sonoma tasting room, inn, or restaurant is scoped to your actual size and systems, and the quote covers everything from the initial assessment through a written findings report and a remediation call to walk you through priorities. Ongoing flat-monthly monitoring is also available if you want eyes on your environment year-round. Start with a free 30-minute call at (707) 239-6725 and we&apos;ll tell you honestly what we&apos;d look at and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/it-support-sonoma", label: "IT support in Sonoma" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
