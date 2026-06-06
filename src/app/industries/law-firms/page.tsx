import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = {
  title: "IT Support & Websites for Sonoma County Law Firms | Copper Bay Tech",
  description:
    "Secure IT support and professional websites for Sonoma County attorneys and law firms. Client data protection, compliance, and flat-fee pricing.",
  alternates: {
    canonical: "https://copperbaytech.com/industries/law-firms",
  },
  openGraph: {
    url: "https://copperbaytech.com/industries/law-firms",
  },
};

export default function LawFirmsPage() {
  return (
    <IndustryPage
      industry="Law Firms & Legal Practices"
      tagline="Secure, reliable technology for client-facing legal practices."
      description="Law firms handle confidential client data that must be protected — and your website should generate consultations, not raise doubts. We help Sonoma County attorneys build secure infrastructure and professional digital presence without the enterprise complexity."
      painPoints={[
        "Client data lives on aging workstations with no real backup",
        "Remote access for attorneys is clunky or insecure",
        "Your website looks outdated and doesn't generate inquiries",
        "You've never had a security audit but you handle sensitive client information",
        "IT problems interrupt billable hours",
        "No documented IT systems — if your one tech-savvy person leaves, you're stuck",
      ]}
      services={[
        {
          title: "Professional Legal Websites",
          blurb:
            "Clean, credible design built to generate consultations — with practice area pages, attorney bios, and clear calls to action.",
        },
        {
          title: "Secure IT Infrastructure",
          blurb:
            "Encrypted backups, secure remote access, and multi-factor authentication so client data stays protected.",
        },
        {
          title: "Compliance & Security Audits",
          blurb:
            "Data handling review, access controls documentation, and an incident response plan your firm can actually use.",
        },
      ]}
      relatedPosts={[
        {
          slug: "cybersecurity-for-law-firms-sonoma-county",
          title: "Cybersecurity for Law Firms in Sonoma County: What You Need to Know",
          tag: "Cybersecurity",
        },
        {
          slug: "ransomware-protection-small-business",
          title: "Ransomware Protection for Small Business: What Actually Works",
          tag: "Cybersecurity",
        },
        {
          slug: "how-to-choose-an-it-company-sonoma-county",
          title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
          tag: "IT Support",
        },
      ]}
    />
  );
}
