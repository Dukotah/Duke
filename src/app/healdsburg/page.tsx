import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Healdsburg, CA | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support, web development, and cybersecurity for Healdsburg businesses — from boutique hotels and wine country restaurants to local retailers.",
};

export default function HealdsburgPage() {
  return (
    <CityPage
      city="Healdsburg"
      relatedLinks={[
        { href: "/web-design-healdsburg", label: "Web Design in Healdsburg", blurb: "Conversion-focused websites for wineries, tasting rooms, inns, and restaurants." },
        { href: "/it-support-healdsburg", label: "IT Support in Healdsburg", blurb: "Reliable IT for wine-country hospitality businesses." },
        { href: "/cybersecurity-healdsburg", label: "Cybersecurity in Healdsburg", blurb: "PCI, guest-data, and ransomware protection for hospitality venues." },
      ]}
      description="Healdsburg's wine country economy runs on hospitality — boutique hotels, tasting rooms, upscale restaurants, and destination retail. We help Healdsburg businesses run the technology that keeps guests happy and operations smooth."
      painPoints={[
        "Reservation and booking systems that are clunky or unreliable during peak season",
        "POS systems that crash or slow down during high-traffic dinner service",
        "Poor Wi-Fi performance in venues where guests expect fast, reliable connectivity",
        "Winery and restaurant websites that don't convert tourists into bookings",
        "No IT support when something breaks on a busy weekend",
        "Outdated tech infrastructure that doesn't match the premium experience you're delivering",
      ]}
      services={[
        {
          icon: Globe,
          title: "Hospitality Websites",
          blurb:
            "Beautiful, conversion-focused websites for tasting rooms, boutique hotels, and restaurants. Built to turn visitors into reservations.",
        },
        {
          icon: Server,
          title: "IT Support & Infrastructure",
          blurb:
            "Reliable IT support for POS systems, reservation platforms, and business Wi-Fi. We're available when you need us — not just 9-to-5.",
        },
        {
          icon: ShieldCheck,
          title: "Cybersecurity",
          blurb:
            "Protect guest payment data and business systems. PCI compliance support, network segmentation, and staff security training.",
        },
      ]}
      nearbyAreas={["Windsor", "Geyserville", "Cloverdale", "Santa Rosa", "Sonoma County"]}
    />
  );
}
