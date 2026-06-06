import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/cybersecurity-sebastopol";

export const metadata: Metadata = {
  title: "Cybersecurity Sebastopol CA | Small Business Security Audits | Copper Bay Tech",
  description:
    "Practical, plain-English cybersecurity for Sebastopol small businesses — e-commerce shops, food and cider brands, boutiques, and wellness practitioners. Flat-fee security audits, MFA setup, and tested backups. Call (707) 239-6725.",
  keywords:
    "cybersecurity Sebastopol, small business cybersecurity Sebastopol CA, PCI compliance Sebastopol, data security Sonoma County, ransomware protection small business, cybersecurity wellness practice",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Cybersecurity for Sebastopol Small Businesses | Copper Bay Tech",
    description:
      "Affordable, no-fear cybersecurity for Sebastopol e-commerce shops, maker brands, boutiques, and wellness practices. Flat-fee audits and plain-English guidance.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function CybersecuritySebastopol() {
  return (
    <ServiceCityPage
      service="Cybersecurity"
      city="Sebastopol"
      canonical={CANONICAL}
      hub={{ href: "/cybersecurity-small-business", label: "Cybersecurity" }}
      heroBlurb="Practical, affordable cybersecurity for Sebastopol's creative shops, e-commerce food and cider brands, boutiques, and wellness practitioners — honest guidance, no fear-based upsells, and flat-fee pricing you can plan around."
      intro={[
        "Sebastopol businesses tend to run lean and value their independence — a cider-maker selling direct-to-consumer, a ceramics studio with an online shop, a bodywork practice keeping client health notes, a small natural-foods brand managing a mailing list of loyal regulars. What those businesses share is real, if unglamorous, security exposure: card data flowing through a point-of-sale or an online checkout, customer contact lists that took years to build, and critical files living on one or two laptops with no tested backup in place. A breach or a ransomware lockout doesn't just cost money — in a community this size, it costs trust, and that's harder to recover.",
        "We work with Sebastopol owners who want straight answers, not a sales pitch. That means a flat-fee audit that tells you exactly where you stand, a prioritized list of what to fix first, and practical steps you can actually follow without a full-time IT person. We're not here to sell you enterprise software you'll never fully use. We're here to close the real gaps — MFA on your accounts, a backup you've actually tested, card-reader compliance, and sensible data handling for the customer information you're entrusted with.",
      ]}
      includesTitle="What Sebastopol businesses get"
      includes={[
        "Flat-fee security audit with a written, prioritized findings report — no hourly billing",
        "PCI DSS compliance review for in-shop card readers and online checkout (Shopify, Square, WooCommerce)",
        "Customer and mailing-list data inventory — know what you hold and how it's protected",
        "Ransomware-resilient backup setup with verified restore testing, not just set-and-forget",
        "MFA rollout and password-manager guidance for small teams sharing accounts",
        "Basic health-data handling review for wellness, bodywork, and massage practices",
        "Email security configuration (SPF, DKIM, DMARC) to protect your brand domain from spoofing",
        "Plain-English written summary your accountant or landlord can read — no jargon",
      ]}
      industriesTitle="Who we help in Sebastopol"
      industries={[
        "E-commerce food & cider brands",
        "Ceramics, art & maker studios",
        "Natural grocery & specialty retail",
        "Massage, bodywork & wellness practices",
        "Boutique clothing & gift shops",
        "Yoga & fitness studios",
        "Independent bookstores & music shops",
        "Small farms selling direct-to-consumer",
      ]}
      faqs={[
        {
          q: "I use Shopify or Square for my online store. Do I still need to worry about PCI compliance?",
          a: "Yes, though the scope is narrower than most people assume. Using a hosted platform like Shopify or Square offloads most of the card-data burden to them, but you're still responsible for the security of the account itself — the login credentials, API keys, connected apps, and any device you use to process in-person payments. We review exactly what's in scope for your setup, close the gaps that actually matter, and give you a simple attestation checklist you can point to if a card brand or insurance provider ever asks.",
        },
        {
          q: "My business runs off one laptop. Is ransomware really a realistic risk?",
          a: "It's one of the most common ways small businesses lose data, and single-laptop shops are frequently the target because the attacker knows a ransom demand of even a few hundred dollars can feel easier than losing everything. The good news is the fix is straightforward: a properly configured cloud backup combined with an external drive backup, both tested so you know they actually restore. We set that up and run a test restore with you so you can see it work — that's more valuable than any monitoring software.",
        },
        {
          q: "I keep client appointment notes and intake forms for my massage or bodywork practice. What am I required to do?",
          a: "Bodywork and massage practices in California occupy an interesting middle ground. Most are not covered entities under HIPAA (which applies to healthcare providers billing insurance), but California law still requires reasonable data security for personal information you collect, and many clients reasonably expect their health and body information to stay private. We help you assess what you actually store, where it lives, and how access is controlled — and we'll tell you honestly whether your exposure is low, medium, or worth acting on, rather than selling you a compliance package you don't need.",
        },
        {
          q: "We're a small team and everyone shares a few passwords. How do we fix that without making it complicated?",
          a: "Shared passwords are one of the most common entry points for account takeover, and the fix is genuinely not complicated for a small team. We pick a business password manager that fits your budget (there are solid options under $5 per person per month), migrate your shared credentials into it, set up multi-factor authentication on your email, banking, and e-commerce accounts, and walk everyone through the new workflow in one session. Most small teams are fully switched over in an afternoon.",
        },
        {
          q: "What does a security audit cost, and what do I actually get at the end?",
          a: "We charge a flat fee quoted upfront — no hourly rate and no bill that grows while we dig. The exact number depends on how many systems, accounts, and people are in scope, but most Sebastopol small-business audits land between $500 and $1,500. At the end you get a written findings report that ranks issues by priority, explains each risk in plain English, and tells you what to fix yourself versus what we can handle for you. There's no obligation to hire us for remediation — plenty of owners take the report and handle items on their own.",
        },
      ]}
      nearby={[
        { href: "/it-support-sebastopol", label: "IT support in Sebastopol" },
        { href: "/cybersecurity-santa-rosa", label: "cybersecurity in Santa Rosa" },
        { href: "/cybersecurity-small-business", label: "all of Sonoma County" },
      ]}
    />
  );
}
