import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = {
  title: "IT Support & Websites for Sonoma County Wineries | Copper Bay Tech",
  description:
    "Tasting room reservation systems, wine club tech, and custom websites for Sonoma County wineries. Local IT support that understands wine country.",
  openGraph: {
    url: "https://copperbaytech.com/industries/wineries",
  },
};

export default function WineriesPage() {
  return (
    <IndustryPage
      industry="Wineries & Tasting Rooms"
      tagline="Technology built for the pace of wine country."
      description="Tasting room visits, wine club signups, and DTC sales all start with your digital presence — and rely on technology working when the room is full. We help Sonoma County wineries build websites and infrastructure that keep up with the season."
      painPoints={[
        "Your website loads slowly or looks dated on mobile",
        "Reservation system is a PDF or a phone number — visitors just leave",
        "Wine club signup is buried or broken",
        "POS system crashes during peak weekend hours",
        "Your tasting room Wi-Fi can't handle busy days",
        "You're not ranking when tourists search \"wine tasting near Healdsburg\"",
      ]}
      services={[
        {
          title: "Winery Websites",
          blurb:
            "Reservations, wine club signup, online shop, and events calendar — all in a fast, mobile-first site that converts visitors.",
        },
        {
          title: "Network & POS Support",
          blurb:
            "Reliable Wi-Fi that handles a full tasting room, POS integrations, and guest network setup that keeps your business network safe.",
        },
        {
          title: "Local SEO for Wine Country",
          blurb:
            "Rank for tasting room searches across Sonoma County so tourists find you before they find the winery down the road.",
        },
      ]}
      relatedPosts={[
        {
          slug: "best-website-for-a-sonoma-county-winery",
          title: "What Makes a Great Website for a Sonoma County Winery?",
          tag: "Web Development",
        },
        {
          slug: "how-to-rank-on-google-maps-local-business",
          title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
          tag: "Local SEO",
        },
        {
          slug: "google-business-profile-setup-sonoma-county",
          title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County",
          tag: "Local SEO",
        },
      ]}
    />
  );
}
