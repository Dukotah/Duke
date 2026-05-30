import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Guerneville, CA | Copper Bay Tech",
  description:
    "IT consulting and custom websites for Guerneville small businesses — vacation rentals, restaurants, retail, and hospitality. Call (707) 239-6725.",
};

export default function GuernevillePage() {
  return (
    <CityPage
      city="Guerneville"
      description="Guerneville's hospitality businesses — vacation rentals, restaurants, boutique shops, and event venues — need technology that handles peak season traffic and keeps running year-round. Copper Bay Tech provides local IT support and custom websites with flat-fee pricing."
      painPoints={[
        "Your vacation rental or hospitality website can't handle peak season traffic",
        "Reservation and booking systems are unreliable",
        "Guest Wi-Fi is slow or goes down during busy weekends",
        "Your website doesn't rank for \"things to do in Guerneville\" searches",
        "No IT backup plan when something breaks on a busy weekend",
        "Payment processing or POS issues cost you revenue",
      ]}
      services={[
        {
          icon: Globe,
          title: "Custom Websites",
          blurb:
            "Hospitality-focused websites built for vacation rentals, restaurants, and event venues.",
        },
        {
          icon: Server,
          title: "IT & Network Support",
          blurb:
            "Reliable Wi-Fi, POS setup, and booking system integrations for hospitality businesses.",
        },
        {
          icon: ShieldCheck,
          title: "Security",
          blurb:
            "Protect guest data and payment info with a clear, practical security setup.",
        },
      ]}
      nearbyAreas={[
        "Monte Rio",
        "Forestville",
        "Sebastopol",
        "Santa Rosa",
        "Bodega Bay",
        "Jenner",
      ]}
    />
  );
}
