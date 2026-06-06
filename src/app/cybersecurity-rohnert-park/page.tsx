import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-rohnert-park";

export const metadata: Metadata = {
  title: "Cybersecurity Rohnert Park CA | Small Business Security Audits | Copper Bay Tech",
  description:
    "Flat-fee cybersecurity audits and ongoing protection for Rohnert Park professional offices, medical and dental practices, retail franchises, and light industrial businesses. HIPAA, PCI-DSS, and business-email-compromise defense. Call (707) 239-6725.",
  keywords:
    "cybersecurity Rohnert Park, small business cybersecurity Rohnert Park CA, HIPAA compliance Rohnert Park, PCI DSS retail security Rohnert Park, business email compromise protection, ransomware protection Rohnert Park, cybersecurity Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Rohnert Park Businesses | Copper Bay Tech",
    description:
      "Flat-fee security audits and ongoing protection for Rohnert Park professional offices, medical clinics, retail franchises, and light industrial businesses.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecurityRohnertPark() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Rohnert Park"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Plain-English security audits and ongoing protection for Rohnert Park professional offices, medical and dental practices, retail franchises, and distribution businesses — flat-fee pricing, no fear tactics, and honest priorities."
      intro={[
        "Rohnert Park runs on professional services, not pinot. The city&apos;s Commerce Boulevard corridor is lined with insurance agencies, accounting firms, law offices, and medical and dental practices — businesses that process sensitive client data, handle financial records, and depend entirely on email for daily operations. That combination is exactly what business-email-compromise and fraudulent-invoice scams target: a solo accountant or a two-person insurance brokerage has no IT department watching for a spoofed vendor email, and a single misdirected wire transfer can be a six-figure problem. Ransomware operators know this and specifically hunt offices with aging Windows workstations and no managed backups.",
        "The retail and franchise segment along Commerce Boulevard and near the Graton Resort & Casino corridor adds a separate layer of exposure: any business running a card terminal is technically in scope for PCI-DSS, and most small franchises and independent retailers have never had a formal card-data assessment. The medical and dental clusters around the SSU-adjacent professional parks face HIPAA obligations that go well beyond a signed BAA — they require documented access controls, encrypted storage, and annual risk analyses. We work with all of these businesses: a flat-fee audit that tells you exactly where you stand against the relevant standard, a plain-English remediation list ranked by actual risk, and optional flat monthly monitoring so you&apos;re not starting from scratch if something goes wrong.",
      ]}
      includesTitle="What Rohnert Park businesses get"
      includes={[
        "Business-email-compromise (BEC) assessment — SPF, DKIM, DMARC, and staff phishing-awareness review",
        "Ransomware readiness check: backup integrity, endpoint protection, and recovery-time estimates",
        "PCI-DSS scoping for retail and franchise card-processing environments",
        "HIPAA security-rule gap analysis for medical and dental offices",
        "Documented risk report with findings ranked by actual likelihood and impact — not a fear-maximizing list",
        "Remediation roadmap with flat-fee quotes so you can budget before committing",
        "Optional flat monthly monitoring, patching, and incident-response retainer",
        "Free 30-minute discovery call — we&apos;ll tell you the top two or three things we&apos;d fix first, no obligation",
      ]}
      industriesTitle="Who we protect in Rohnert Park"
      industries={[
        "Insurance agencies & brokerages",
        "Accounting & tax firms",
        "Law offices",
        "Medical & family-practice clinics",
        "Dental offices & specialty practices",
        "Retail franchises & franchise groups",
        "Light industrial & distribution",
        "SSU-adjacent professional services",
      ]}
      faqs={[
        {
          q: "Our office only has five employees. Do we really need a security audit?",
          a: "Small offices are disproportionately targeted precisely because attackers assume there&apos;s no IT oversight. Business-email-compromise fraud — where a scammer impersonates a vendor or executive to redirect a payment — hits professional-services firms of every size, and a five-person accounting or insurance office often processes more financial data per employee than a larger company. An audit doesn&apos;t have to be complex: we scope it to your actual environment, give you a prioritized list of what to fix, and quote each item flat. Most small offices have three to five high-priority gaps that can be closed in a few weeks.",
        },
        {
          q: "We accept credit cards at our retail location. What does PCI-DSS actually require of us?",
          a: "For most small retailers and franchises using a countertop terminal through a payment processor, you fall into the simplest PCI-DSS tier (SAQ A or SAQ B), which means completing an annual self-assessment questionnaire and confirming your network is segmented so card data doesn&apos;t flow through your general business computers. The real risk is the network configuration piece — card terminals sharing a Wi-Fi network with office workstations is a common gap. We scope your environment, identify what tier applies, and walk you through exactly what needs to change to satisfy your processor and avoid liability in the event of a breach.",
        },
        {
          q: "Our dental practice already signed a BAA with our software vendor. Doesn&apos;t that cover our HIPAA obligations?",
          a: "A Business Associate Agreement covers your vendor&apos;s obligations — it doesn&apos;t satisfy your practice&apos;s own Security Rule requirements. HIPAA requires covered entities to conduct a documented risk analysis, implement access controls (who can open which patient records and from where), encrypt data at rest and in transit, and maintain an audit trail. These are your responsibilities regardless of what your software vendor signs. We do a focused Security Rule gap analysis for dental and medical offices: what you have, what you&apos;re missing, and what needs to be documented before your next audit or a complaint triggers OCR scrutiny.",
        },
        {
          q: "What does a cybersecurity audit cost, and how long does it take?",
          a: "We quote a flat fee before any work starts — no hourly billing, no scope-creep surprises. For a typical Rohnert Park professional office or retail location, an initial audit runs two to four hours of your staff&apos;s time spread over a week, and the deliverable is a written risk report with ranked findings and flat-fee remediation quotes for each item. Pricing depends on the size of your environment and which compliance frameworks apply (PCI, HIPAA, or neither), but a focused small-business audit is a fraction of what a single BEC incident or ransomware recovery costs. Start with a free 30-minute call and we&apos;ll tell you what we&apos;d scope and what it would cost.",
        },
        {
          q: "If something goes wrong — a phishing email gets clicked, or files get encrypted — what happens next?",
          a: "If you&apos;re on our flat monthly monitoring plan, you call us and we start working immediately: isolating affected systems, assessing scope, and beginning recovery from clean backups. If you&apos;re not a monitoring client, we still take urgent calls and can work with you on incident response on a time-and-materials basis. The honest answer is that recovery is faster and cheaper when backups are current, systems are monitored, and a response plan exists — which is exactly what the audit and optional monitoring are for. We would rather help you prevent the incident than clean it up.",
        },
      ]}
      nearby={[
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/it-support-rohnert-park", label: "IT support in Rohnert Park" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
