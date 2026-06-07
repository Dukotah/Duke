import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Glen Ellen, CA | Copper Bay Tech",
  description:
    "IT support and custom websites for Glen Ellen businesses — wineries, inns, restaurants, and local services in the Valley of the Moon. Call (707) 239-6725.",
  alternates: { canonical: "https://copperbaytech.com/glen-ellen" },
  openGraph: {
    title: "IT Support & Web Development in Glen Ellen, CA | Copper Bay Tech",
    description:
      "IT support and custom websites for Glen Ellen businesses — wineries, inns, restaurants, and local services in the Valley of the Moon. Call (707) 239-6725.",
    url: "https://copperbaytech.com/glen-ellen",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function GlenEllenPage() {
  return (
    <CityPage
      city="Glen Ellen"
      relatedLinks={[
        { href: "/web-design-glen-ellen", label: "Web Design in Glen Ellen", blurb: "Story-driven websites for Valley of the Moon wineries, inns, and restaurants." },
        { href: "/it-support-glen-ellen", label: "IT Support in Glen Ellen", blurb: "White-glove IT and rural/historic-building Wi-Fi for boutique venues." },
        { href: "/cybersecurity-glen-ellen", label: "Cybersecurity in Glen Ellen", blurb: "Reputation-grade PCI and data protection for premium wine-country brands." },
      ]}
      description="Glen Ellen sits at the heart of the Valley of the Moon wine country. Wineries, inns, restaurants, and local shops here serve a discerning clientele — and deserve technology that matches that standard. Copper Bay Tech provides custom websites and IT support with transparent pricing."
      painPoints={[
        "Your winery or inn website loads slowly and looks dated",
        "Reservation or tasting room booking isn't working smoothly",
        "You're not ranking for Valley of the Moon or Glen Ellen wine searches",
        "Guest Wi-Fi can't handle weekend traffic",
        "No proactive IT support — you fix things when they break",
        "Your website doesn't do justice to the experience you provide",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Winery, inn, and restaurant websites built for the Valley of the Moon clientele.",
        },
        {
          icon: Server,
          title: "IT & Network Support",
          blurb:
            "Reliable networks, POS integrations, and guest Wi-Fi for wine country hospitality.",
        },
        {
          icon: ShieldCheck,
          title: "Local SEO & Security",
          blurb:
            "Rank for wine country searches and protect guest data with a proper security setup.",
        },
      ]}
      nearbyAreas={[
        "Sonoma",
        "Kenwood",
        "Santa Rosa",
        "Petaluma",
        "Napa",
        "Boyes Hot Springs",
      ]}
    />
  );
}
