import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Bodega Bay, CA | Copper Bay Tech",
  description:
    "IT support and custom websites for Bodega Bay businesses — coastal hospitality, vacation rentals, and local services. Call (707) 239-6725.",
  alternates: { canonical: "https://copperbaytech.com/bodega-bay" },
  openGraph: {
    title: "IT Support & Web Development in Bodega Bay, CA | Copper Bay Tech",
    description:
      "IT support and custom websites for Bodega Bay businesses — coastal hospitality, vacation rentals, and local services. Call (707) 239-6725.",
    url: "https://copperbaytech.com/bodega-bay",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function BodegaBayPage() {
  return (
    <CityPage
      city="Bodega Bay"
      relatedLinks={[
        { href: "/web-design-bodega-bay", label: "Web Design in Bodega Bay", blurb: "Fast, coastal websites with charter, lodging, and dining booking built in." },
        { href: "/it-support-bodega-bay", label: "IT Support in Bodega Bay", blurb: "Resilient coastal connectivity, failover, and POS uptime for the harbor village." },
        { href: "/cybersecurity-bodega-bay", label: "Cybersecurity in Bodega Bay", blurb: "PCI, endpoint, and backup protection built for unreliable coastal internet." },
      ]}
      description="Bodega Bay's coastal businesses — fishing charters, vacation rentals, restaurants, and shops — operate in a high-season environment where reliable technology isn't optional. Copper Bay Tech provides local IT support and websites that work as hard as you do."
      painPoints={[
        "Your website doesn't capture tourists searching for Bodega Bay activities",
        "Booking or reservation systems break at the worst times",
        "Slow or unreliable internet is killing your business operations",
        "You're processing payments without a clear PCI compliance plan",
        "No IT support when something fails on a busy summer weekend",
        "Your online presence doesn't match the quality of your business",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Tourism-ready websites built for Bodega Bay hospitality, rentals, and coastal businesses.",
        },
        {
          icon: Server,
          title: "IT & Connectivity",
          blurb:
            "Network setup, POS support, and reliable connectivity for seasonal businesses.",
        },
        {
          icon: ShieldCheck,
          title: "Security & Compliance",
          blurb:
            "PCI compliance and data protection for businesses handling guest payments.",
        },
      ]}
      nearbyAreas={[
        "Petaluma",
        "Sebastopol",
        "Guerneville",
        "Jenner",
        "Tomales",
        "Occidental",
      ]}
    />
  );
}
