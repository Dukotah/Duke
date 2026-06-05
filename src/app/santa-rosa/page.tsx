import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Santa Rosa, CA | Copper Bay Tech",
  description:
    "Local IT consulting, custom websites, and cybersecurity for Santa Rosa small businesses. Copper Bay Tech — flat-fee pricing, no long-term contracts. Call (707) 239-6725.",
  openGraph: {
    title: "IT Support & Web Development in Santa Rosa | Copper Bay Tech",
    description:
      "Trusted IT support and custom websites for Santa Rosa businesses. Serving all of Sonoma County.",
    url: "https://copperbaytech.com/santa-rosa",
  },
};

export default function SantaRosaPage() {
  return (
    <CityPage
      city="Santa Rosa"
      relatedLinks={[
        { href: "/web-design-santa-rosa", label: "Web Design in Santa Rosa", blurb: "Fast, modern sites that rank locally." },
        { href: "/it-support-santa-rosa", label: "IT Support in Santa Rosa", blurb: "Same-day managed IT for Santa Rosa businesses." },
      ]}
      description="Santa Rosa businesses deserve technology that works as hard as they do. Copper Bay Tech provides custom websites, managed IT support, and cybersecurity — with honest flat-fee pricing and no surprise invoices."
      painPoints={[
        "Your website isn't ranking locally in Santa Rosa searches",
        "You're running outdated software that's a security risk",
        "IT problems cost you hours of productivity every month",
        "Your business has grown but your tech hasn't kept up",
        "You need HIPAA or PCI compliance but don't know where to start",
        "You want a professional web presence without a $10k agency price tag",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Hand-coded, fast-loading websites built to rank in Santa Rosa and Sonoma County local searches.",
        },
        {
          icon: Server,
          title: "Managed IT",
          blurb:
            "Month-to-month IT support covering networks, workstations, cloud tools, and staff onboarding.",
        },
        {
          icon: ShieldCheck,
          title: "Security Audits",
          blurb:
            "We assess your current security posture and deliver a plain-English report with prioritized fixes.",
        },
      ]}
      nearbyAreas={[
        "Petaluma",
        "Sebastopol",
        "Rohnert Park",
        "Healdsburg",
        "Windsor",
        "Cotati",
        "Sonoma",
      ]}
    />
  );
}
