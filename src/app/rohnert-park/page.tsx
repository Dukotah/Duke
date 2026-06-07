import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Rohnert Park, CA | Copper Bay Tech",
  description:
    "IT consulting, custom websites, and cybersecurity for Rohnert Park small businesses. Copper Bay Tech — local, flat-fee, no contracts. Call (707) 239-6725.",
  alternates: { canonical: "https://copperbaytech.com/rohnert-park" },
  openGraph: {
    title: "IT Support & Web Development in Rohnert Park | Copper Bay Tech",
    description:
      "Local IT and web services for Rohnert Park businesses. Honest pricing, no surprises.",
    url: "https://copperbaytech.com/rohnert-park",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RohnertParkPage() {
  return (
    <CityPage
      city="Rohnert Park"
      relatedLinks={[
        { href: "/web-design-rohnert-park", label: "Web Design in Rohnert Park", blurb: "Custom websites for Rohnert Park businesses." },
        { href: "/it-support-rohnert-park", label: "IT Support in Rohnert Park", blurb: "Flat-rate managed IT with direct technician access — no ticket queue." },
        { href: "/cybersecurity-rohnert-park", label: "Cybersecurity in Rohnert Park", blurb: "BEC, ransomware, PCI, and HIPAA protection for offices and retail." },
      ]}
      description="Rohnert Park businesses count on reliable technology to stay competitive. Copper Bay Tech handles the IT and web side so you can focus on running your business — with clear pricing and a local team you can actually reach."
      painPoints={[
        "Your business doesn't show up when people search locally in Rohnert Park",
        "You've outgrown your current IT setup but don't know what comes next",
        "Slow Wi-Fi or network issues cost you time every week",
        "You're worried about ransomware or phishing attacks",
        "You need a website that actually converts visitors into customers",
        "You want IT support but can't afford a full-time hire",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Professional, fast websites built to convert visitors and rank in local Rohnert Park searches.",
        },
        {
          icon: Server,
          title: "IT Support",
          blurb:
            "Managed IT for growing businesses — networks, cloud tools, and a support line that actually picks up.",
        },
        {
          icon: ShieldCheck,
          title: "Cybersecurity",
          blurb:
            "Audits, hardening, and ongoing monitoring so you're protected before something goes wrong.",
        },
      ]}
      nearbyAreas={["Petaluma", "Santa Rosa", "Cotati", "Sebastopol", "Sonoma", "Novato"]}
    />
  );
}
