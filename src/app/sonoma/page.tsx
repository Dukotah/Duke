import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Sonoma, CA | Copper Bay Tech",
  description:
    "Local IT consulting, custom websites, and cybersecurity for Sonoma small businesses — wineries, restaurants, and retail. Copper Bay Tech. Call (707) 239-6725.",
  openGraph: {
    title: "IT Support & Web Development in Sonoma | Copper Bay Tech",
    description:
      "IT support and custom websites for Sonoma wineries, restaurants, and small businesses.",
    url: "https://copperbaytech.com/sonoma",
  },
};

export default function SonomaPage() {
  return (
    <CityPage
      city="Sonoma"
      relatedLinks={[
        { href: "/web-design-sonoma", label: "Web Design in Sonoma", blurb: "Booking-focused websites for Plaza tasting rooms, restaurants, and inns." },
        { href: "/it-support-sonoma", label: "IT Support in Sonoma", blurb: "Rock-solid POS, reservations, and Wi-Fi for Plaza hospitality businesses." },
      ]}
      description="Sonoma's wine country businesses — tasting rooms, restaurants, boutique hotels, and retail shops — run on reputation and experience. Copper Bay Tech helps you back that up with technology that's reliable, secure, and easy for your staff to use."
      painPoints={[
        "Your tasting room or restaurant website isn't ranking for local searches",
        "Online reservations or booking systems are clunky or unreliable",
        "Your Wi-Fi can't handle busy weekend traffic",
        "You process card payments but haven't thought about PCI compliance",
        "Your website doesn't look as good as your actual business",
        "Staff spend too much time on manual tasks that could be automated",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Beautiful, fast websites for Sonoma wineries, restaurants, and hospitality businesses built to drive reservations and visits.",
        },
        {
          icon: Server,
          title: "IT & Operations",
          blurb:
            "Reliable networks, POS integrations, booking system setup, and staff support — all on a flat monthly rate.",
        },
        {
          icon: ShieldCheck,
          title: "Security & Compliance",
          blurb:
            "PCI compliance, data protection, and security hardening for businesses that handle payments and guest data.",
        },
      ]}
      nearbyAreas={[
        "Petaluma",
        "Santa Rosa",
        "Napa",
        "Glen Ellen",
        "Kenwood",
        "Sebastopol",
        "Rohnert Park",
      ]}
    />
  );
}
