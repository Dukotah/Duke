import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-santa-rosa";

export const metadata: Metadata = {
  title: "Cybersecurity Santa Rosa CA | Small Business Security | Copper Bay Tech",
  description:
    "Cybersecurity for Santa Rosa small businesses — security audits, ransomware protection, HIPAA support, and business continuity. Local, plain-English, no jargon. Call (707) 239-6725.",
  keywords:
    "cybersecurity Santa Rosa, IT security Santa Rosa CA, ransomware protection Santa Rosa, HIPAA compliance Santa Rosa, small business security Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Santa Rosa Businesses | Copper Bay Tech",
    description: "Security audits, ransomware protection, and HIPAA support for Santa Rosa small businesses.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecuritySantaRosa() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Santa Rosa"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Protect your Santa Rosa business from ransomware, phishing, and data breaches — with a local team that explains everything in plain English, not scare tactics."
      intro={[
        "Santa Rosa is the business hub of Sonoma County — and that makes its small businesses a bigger target than most owners realize. Healthcare practices, insurance and accounting offices, law firms, and retailers here all hold exactly the kind of customer and patient data attackers want, usually without a dedicated IT security person watching the door.",
        "If the 2017 and 2019 wildfires taught Santa Rosa businesses anything, it's that continuity matters: a ransomware attack that locks your files is its own kind of disaster. We help you get the fundamentals right — tested backups, multi-factor authentication, email protection, and a written recovery plan — so one bad click doesn't take the whole business down.",
      ]}
      includes={[
        "Plain-English security audit of your network, devices, and accounts",
        "Ransomware protection: tested, offline backups you can actually restore from",
        "Multi-factor authentication (MFA) rolled out across email and key apps",
        "Phishing and email-spoofing protection (SPF / DKIM / DMARC)",
        "HIPAA security-rule support for medical and dental practices",
        "Business-continuity and incident-response planning",
        "Staff security training that doesn't put people to sleep",
        "Flat-fee pricing — no hourly billing, no fear-based upsells",
      ]}
      industries={[
        "Medical & dental practices",
        "Insurance & accounting offices",
        "Law firms",
        "Real estate offices",
        "Retail & e-commerce",
        "Nonprofits",
        "Property management",
        "Professional services",
      ]}
      faqs={[
        {
          q: "Do small businesses in Santa Rosa really get targeted?",
          a: "Yes — and more than large ones. Attackers automate their attacks, so a two-person insurance office in Santa Rosa gets hit by the same phishing and ransomware as a Fortune 500. Small businesses are appealing precisely because they usually have weaker defenses and no security staff.",
        },
        {
          q: "I run a medical or dental practice — can you help with HIPAA?",
          a: "Yes. We do a HIPAA security-rule risk assessment, fix the gaps (encryption, access controls, backups, MFA), and give you written documentation you can show an auditor. We explain every step in plain language — you don't need to be technical.",
        },
        {
          q: "What does a security audit cost?",
          a: "We start with a free 30-minute call to understand your setup, then quote a flat fee for the audit based on your size — no open-ended hourly billing. You get a clear written report of what we found and what to fix first, whether or not you hire us for the fixes.",
        },
        {
          q: "We got hit with ransomware — can you help right now?",
          a: "Call (707) 239-6725. We'll help you contain it, assess what's recoverable from backups, and get you operating again — then put protections in place so it doesn't happen twice.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-petaluma", label: "Petaluma" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
