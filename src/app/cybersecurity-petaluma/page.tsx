import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-petaluma";

export const metadata: Metadata = {
  title: "Cybersecurity Petaluma CA | Small Business Security | Copper Bay Tech",
  description:
    "Cybersecurity for Petaluma small businesses — security audits, ransomware protection, email security, and PCI support. Local team, flat-fee, plain English. Call (707) 239-6725.",
  keywords:
    "cybersecurity Petaluma, IT security Petaluma CA, ransomware protection Petaluma, small business cybersecurity Sonoma County, PCI compliance Petaluma",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Petaluma Businesses | Copper Bay Tech",
    description: "Security audits, ransomware protection, and email security for Petaluma small businesses.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityPetaluma() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Petaluma"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="We&apos;re local to Sonoma County — and we help Petaluma businesses lock down their data, email, and payments without the enterprise price tag or the fear-mongering."
      intro={[
        "Petaluma has always punched above its weight in tech — but most of the businesses that make this town tick are small: downtown retailers, restaurants and food producers, manufacturers and trades along the river, and the professional offices in between. Almost none of them have a security person on staff, which is exactly the gap attackers count on.",
        "We're local, so this isn't a faceless helpdesk in another time zone. We sit down with Petaluma owners, look at how email, payments, and customer data actually flow through the business, and fix the few things that matter most first — strong logins, tested backups, and email that can't be easily spoofed in your name.",
      ]}
      includes={[
        "Plain-English security audit of your network, devices, and accounts",
        "Ransomware protection: tested backups you can actually restore from",
        "Multi-factor authentication (MFA) across email and key apps",
        "Email spoofing & phishing protection (SPF / DKIM / DMARC)",
        "Payment-card (PCI) basics for shops and restaurants that take cards",
        "Wi-Fi and point-of-sale hardening for retail and hospitality",
        "Security training your team will actually remember",
        "Flat-fee pricing — local, honest, no scare-tactic upsells",
      ]}
      industries={[
        "Downtown retail & boutiques",
        "Restaurants & food producers",
        "Manufacturers & trades",
        "Wineries & breweries",
        "Professional services",
        "Real estate & property mgmt",
        "Medical & dental practices",
        "Nonprofits",
      ]}
      faqs={[
        {
          q: "Why hire someone in Petaluma instead of a national service?",
          a: "Because we'll actually show up and we know the local business community. When your point-of-sale goes down on a Saturday or you get a suspicious wire request, you get a direct line to a real person in town — not a ticket in a queue three time zones away.",
        },
        {
          q: "My shop takes credit cards — do I need to worry about PCI?",
          a: "If you accept cards, yes. We'll walk you through the PCI basics, make sure your payment setup and Wi-Fi are segmented and secured, and flag anything that puts you (or your customers' cards) at risk — in plain language, without the compliance jargon.",
        },
        {
          q: "We're a small manufacturer — what's the real risk for us?",
          a: "Mostly two things: ransomware that halts production, and business-email compromise where an attacker poses as a vendor or your owner to redirect a payment. We focus on backups, MFA, and email authentication so a single click or fake invoice can't shut you down or drain an account.",
        },
        {
          q: "What does it cost to get started?",
          a: "A free 30-minute call to understand your setup, then a flat-fee audit based on your size — no open-ended hourly billing. You get a written report of what to fix first whether or not you hire us for the work.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-santa-rosa", label: "Santa Rosa" },
        { href: "/it-support-petaluma", label: "IT support in Petaluma" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
