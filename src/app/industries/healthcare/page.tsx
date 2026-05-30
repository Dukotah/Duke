import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = {
  title: "HIPAA-Compliant IT & Websites for Sonoma County Medical Practices | Copper Bay Tech",
  description:
    "IT support and websites for Sonoma County dentists, therapists, chiropractors, and medical offices. HIPAA-compliant setup, no long-term contracts.",
  openGraph: {
    url: "https://copperbaytech.com/industries/healthcare",
  },
};

export default function HealthcarePage() {
  return (
    <IndustryPage
      industry="Medical & Dental Practices"
      tagline="HIPAA-compliant technology for patient-facing businesses."
      description="Medical and dental practices handle sensitive patient data every day — and the technology supporting that data has to meet a higher standard. We help Sonoma County practices build secure, compliant IT infrastructure without the enterprise price tag."
      painPoints={[
        "You're not sure if your website or intake forms are HIPAA compliant",
        "Your EHR or practice management software has recurring IT issues",
        "Staff share login credentials because \"it's easier\"",
        "Patient data is stored on a local server with no offsite backup",
        "Your website doesn't rank for local searches like \"dentist Petaluma\"",
        "You've never had a formal security audit",
      ]}
      services={[
        {
          title: "HIPAA-Compliant Websites",
          blurb:
            "Intake forms with encryption, privacy policy compliance, and appointment booking that meets HIPAA requirements.",
        },
        {
          title: "Managed IT for Practices",
          blurb:
            "EHR support, workstation management, and secure remote access so your staff can work without friction.",
        },
        {
          title: "Security & Compliance Audits",
          blurb:
            "HIPAA gap analysis, staff training documentation, and a prioritized remediation plan you can act on immediately.",
        },
      ]}
      relatedPosts={[
        {
          slug: "is-my-small-business-website-hipaa-compliant",
          title: "Is My Small Business Website HIPAA Compliant? A Plain-English Checklist",
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
