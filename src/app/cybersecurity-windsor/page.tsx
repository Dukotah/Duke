import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-windsor";

export const metadata: Metadata = {
  title: "Cybersecurity Windsor CA | Small Business Security | Copper Bay Tech",
  description:
    "Practical cybersecurity for Windsor small businesses — phishing defense, ransomware protection, MFA setup, and tested backups. Flat-fee audits, plain-English advice. Call (707) 239-6725.",
  keywords:
    "cybersecurity Windsor CA, small business cybersecurity Windsor, phishing protection Windsor, ransomware protection Sonoma County, business email compromise, MFA setup Windsor, IT security Windsor California",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Windsor Small Businesses | Copper Bay Tech",
    description:
      "Affordable, plain-English cybersecurity for Windsor offices, trades, and medical practices — flat-fee audits, MFA, backups, and real protection against phishing and ransomware.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityWindsor() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Windsor"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical, affordable cybersecurity for Windsor's small professional offices, home-services trades, and medical practices — real protection against phishing, ransomware, and business-email compromise, without the enterprise price tag."
      intro={[
        "Windsor has grown fast over the past decade into one of Sonoma County's busiest small-business corridors, and that growth has brought the same cyber threats that hit every community — just without the in-house IT staff to deal with them. The typical Windsor business owner is running a dental practice off Old Redwood Highway, a plumbing company out of their home, or a small insurance or real-estate office on Windsor Road. They have QuickBooks, a shared email account, maybe a cloud drive, and customer records they are legally obligated to protect. What they almost never have is someone watching for the phishing email that looks exactly like a DocuSign request or a vendor invoice — the kind that drains a business bank account or locks every file on the network before anyone notices.",
        "The security problems Windsor businesses face are not dramatic or exotic — they are ordinary and preventable. Business-email compromise is the top financial threat: an employee forwards a fraudulent wire instruction, and the money is gone within hours. Ransomware hits small offices because attackers know small businesses rarely have tested backups. Patient and client records at medical, dental, and financial offices carry HIPAA and PCI obligations that most owners know they have but are not sure they are actually meeting. We work with Windsor businesses the same way a good contractor works: we show up, tell you honestly what needs fixing, quote a flat fee, and do the work. No retainer required to get an assessment; no jargon to obscure a simple problem.",
      ]}
      includesTitle="What Windsor businesses get"
      includes={[
        "Flat-fee security audit — we document every gap and prioritize by actual risk, not worst-case scenarios",
        "Phishing and business-email-compromise training tailored to the scams targeting small Sonoma County businesses right now",
        "Multi-factor authentication setup across email, banking logins, and cloud accounts",
        "Tested backup system — we verify restores actually work, not just that files are copying somewhere",
        "Password manager deployment and credential hygiene for the whole team",
        "HIPAA-ready controls for medical and dental practices — policies, encryption, access logs",
        "Work-from-home and hybrid device hardening for owners and employees on personal or shared machines",
        "Ongoing flat-monthly monitoring option if you want eyes on the network without hiring full-time IT",
      ]}
      industriesTitle="Who we help in Windsor"
      industries={[
        "Medical & dental practices",
        "Insurance & financial services",
        "Real estate offices",
        "Home-services trades (plumbing, HVAC, electrical)",
        "Veterinary clinics",
        "Retail & local specialty shops",
        "Accounting & bookkeeping firms",
        "Family-owned professional offices",
      ]}
      faqs={[
        {
          q: "My Windsor business is small — are we really a target?",
          a: "Small businesses are the primary target for phishing and ransomware, not an afterthought. Attackers prefer small offices precisely because they lack dedicated IT staff to catch attacks quickly. In Sonoma County, business-email compromise — where a fraudulent invoice or wire instruction is sent from a spoofed address — is among the most common and costly incidents we see. Size is not protection; it is actually the reason you need basic controls in place.",
        },
        {
          q: "We are a dental practice in Windsor. What does cybersecurity actually mean for us under HIPAA?",
          a: "HIPAA requires a documented risk analysis, technical safeguards like encryption on devices that touch patient records, access controls so staff only see what they need, and an audit trail. It also requires a written response plan if a breach happens. Most small practices have some of this in place informally but could not produce documentation if asked by an auditor. We walk through the required controls, identify what is missing, and help you close the gaps without overhauling your entire workflow.",
        },
        {
          q: "What is the biggest risk for a home-based or hybrid Windsor business?",
          a: "Personal devices and home routers are the two weak points. A work email account accessed on a family laptop that also downloads games or clicks on ad links is a real exposure. Home routers almost never get firmware updates and often run with default passwords. We harden the devices and accounts that matter most — usually email, cloud storage, and financial logins — so you get solid protection without buying enterprise equipment.",
        },
        {
          q: "How much does a security audit cost?",
          a: "We charge a flat fee, not an hourly rate, so you know the number before we start. For a typical Windsor small business — five to twenty people, one office location, standard cloud apps — an audit runs in the range of what you would pay for a few months of a software subscription. We quote after a free 30-minute call where we ask about your setup. Larger practices or multi-location offices cost more; we will tell you honestly before anything is signed.",
        },
        {
          q: "Do we need ongoing monthly security service, or is a one-time audit enough?",
          a: "A one-time audit is a meaningful starting point — it closes the gaps that exist today. Whether you need ongoing service depends on your risk level. Medical and financial offices handling regulated data benefit from continuous monitoring because the threat landscape changes and staff turnover introduces new exposure. A trades company with five employees and a basic email setup may just need the audit, solid backups, and MFA turned on. We will tell you honestly which category you are in rather than pitch a recurring contract you do not need.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/it-support-windsor", label: "IT support in Windsor" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
