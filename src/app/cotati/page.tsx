import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Cotati, CA | Copper Bay Tech",
  description:
    "Local IT support and custom websites for Cotati small businesses. Copper Bay Tech — flat-fee pricing, no contracts. Call (707) 239-6725.",
  alternates: { canonical: "https://copperbaytech.com/cotati" },
  openGraph: {
    title: "IT Support & Web Development in Cotati, CA | Copper Bay Tech",
    description:
      "Local IT support and custom websites for Cotati small businesses. Copper Bay Tech — flat-fee pricing, no contracts. Call (707) 239-6725.",
    url: "https://copperbaytech.com/cotati",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function CotatiPage() {
  return (
    <CityPage
      city="Cotati"
      relatedLinks={[
        { href: "/web-design-cotati", label: "Web Design in Cotati", blurb: "Affordable, local-first websites that win 'near me' searches for La Plaza businesses." },
        { href: "/it-support-cotati", label: "IT Support in Cotati", blurb: "Right-sized, same-day, no-contract IT for small local bars, shops, and offices." },
      ]}
      description="Cotati's close-knit business community deserves tech support that's just as local. Copper Bay Tech provides IT support, custom websites, and cybersecurity for Cotati businesses — with honest flat-fee pricing and no lock-in."
      painPoints={[
        "Your website isn't showing up in local searches",
        "You rely on break-fix IT with no proactive support",
        "No real backup strategy for your business data",
        "Your network slows down or drops during busy periods",
        "You've never had a security review",
        "You want a professional online presence without agency prices",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb: "Fast, local SEO-optimized websites built for Cotati businesses.",
        },
        {
          icon: Server,
          title: "IT Support",
          blurb: "Networks, workstations, cloud tools, and a direct line for support.",
        },
        {
          icon: ShieldCheck,
          title: "Cybersecurity",
          blurb: "Audits and hardening to protect your business before something goes wrong.",
        },
      ]}
      nearbyAreas={["Rohnert Park", "Petaluma", "Santa Rosa", "Sebastopol", "Penngrove"]}
    />
  );
}
