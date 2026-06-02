import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Sebastopol, CA | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support, custom websites, and cybersecurity for Sebastopol small businesses. Local, honest, flat-fee pricing. Call (707) 239-6725.",
  openGraph: {
    title: "IT Support & Web Development in Sebastopol | Copper Bay Tech",
    description:
      "Local IT and web services for Sebastopol businesses. No contracts, no surprises.",
    url: "https://copperbaytech.com/sebastopol",
  },
};

export default function SebastopolPage() {
  return (
    <CityPage
      city="Sebastopol"
      description="Sebastopol's creative and independent business community deserves tech support that's just as straightforward. Copper Bay Tech offers custom websites, IT support, and cybersecurity for local shops, studios, and service businesses — with transparent pricing and no lock-in."
      painPoints={[
        "Your website was built years ago and doesn't reflect your business anymore",
        "You use a patchwork of apps and tools that don't talk to each other",
        "You don't have a real backup plan if something fails",
        "Your business data lives on one laptop with no cloud backup",
        "You want to automate repetitive tasks but don't know where to start",
        "Your online presence doesn't match the quality of your actual work",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Clean, fast websites built to represent your Sebastopol business the way you'd want — no templates.",
        },
        {
          icon: Server,
          title: "IT & Workflow",
          blurb:
            "Cloud setup, process automation, and AI tool integration to save you hours every week.",
        },
        {
          icon: ShieldCheck,
          title: "Security",
          blurb:
            "Protect your client data and business infrastructure with a clear, prioritized security plan.",
        },
      ]}
      nearbyAreas={[
        "Petaluma",
        "Santa Rosa",
        "Rohnert Park",
        "Cotati",
        "Bodega Bay",
        "Graton",
        "Occidental",
      ]}
    />
  );
}
