import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Petaluma, CA | Copper Bay Tech",
  description:
    "Copper Bay Tech provides local IT support, custom websites, and cybersecurity for Petaluma small businesses. Flat-fee pricing, no contracts. Call (707) 239-6725.",
  alternates: { canonical: "https://copperbaytech.com/petaluma" },
  openGraph: {
    title: "IT Support & Web Development in Petaluma | Copper Bay Tech",
    description:
      "Local IT support and custom websites for Petaluma businesses. Serving the North Bay since day one.",
    url: "https://copperbaytech.com/petaluma",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function PetalumaPage() {
  return (
    <CityPage
      city="Petaluma"
      relatedLinks={[
        { href: "/web-design-petaluma", label: "Web Design in Petaluma", blurb: "Custom websites built for Petaluma businesses." },
        { href: "/it-support-petaluma", label: "IT Support in Petaluma", blurb: "Local, responsive managed IT — no ticket queue." },
        { href: "/cybersecurity-petaluma", label: "Cybersecurity in Petaluma", blurb: "Ransomware, email, and payment protection." },
      ]}
      description="Copper Bay Tech is based right here in Sonoma County and knows the Petaluma business community. We handle websites, IT support, and cybersecurity for local restaurants, law offices, wineries, and service businesses — with flat-fee pricing and no long-term contracts."
      painPoints={[
        "Your website looks outdated or doesn't show up in Google",
        "You rely on one person who 'knows computers' — and they're not always available",
        "You're not sure if your client data is secure",
        "Your network is slow or unreliable during busy hours",
        "You got a ransomware email and don't know if you're vulnerable",
        "You need a new website but don't know what it should cost",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Fast, mobile-first websites built for Petaluma businesses. No templates. Local SEO included.",
        },
        {
          icon: Server,
          title: "IT Support",
          blurb:
            "Network setup, workstations, cloud migration, and ongoing support with a direct line — not a ticket queue.",
        },
        {
          icon: ShieldCheck,
          title: "Cybersecurity",
          blurb:
            "Security audits, infrastructure hardening, and incident response planning for businesses that can't afford a breach.",
        },
      ]}
      nearbyAreas={[
        "Santa Rosa",
        "Sebastopol",
        "Rohnert Park",
        "Sonoma",
        "Novato",
        "Cotati",
        "Windsor",
      ]}
    />
  );
}
