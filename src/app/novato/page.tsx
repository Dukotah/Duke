import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Novato, CA | Copper Bay Tech",
  description:
    "Copper Bay Tech provides IT support, HIPAA-compliant cybersecurity, and professional web development for Novato businesses and medical offices. Serving the Marin–Sonoma border area.",
  alternates: { canonical: "https://copperbaytech.com/novato" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "IT Support & Web Development in Novato, CA | Copper Bay Tech",
    description:
      "Copper Bay Tech provides IT support, HIPAA-compliant cybersecurity, and professional web development for Novato businesses and medical offices. Serving the Marin–Sonoma border area.",
    url: "https://copperbaytech.com/novato",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function NovatoPage() {
  return (
    <CityPage
      city="Novato"
      county="Marin County"
      description="On the border of Marin and Sonoma counties, Novato is home to professional services firms, medical offices, and established local businesses. We understand the compliance requirements and professional standards that Novato clients expect."
      painPoints={[
        "Medical and dental offices with outdated IT that doesn't meet HIPAA requirements",
        "Professional services websites that look dated compared to competitors",
        "No IT support contract — someone's brother-in-law handles problems when they come up",
        "Patient and client data stored without proper encryption or access controls",
        "Staff using personal devices and personal email for business communications",
        "Slow or unreliable technology frustrating both staff and clients",
      ]}
      services={[
        {
          icon: Globe,
          title: "Professional Web Design",
          blurb:
            "Clean, credible websites for medical practices, law firms, financial advisors, and professional services. Built to build trust at first glance.",
        },
        {
          icon: Server,
          title: "IT Support & Management",
          blurb:
            "Reliable ongoing IT support for small professional offices. Device management, cloud setup, and someone to call when things go wrong.",
        },
        {
          icon: ShieldCheck,
          title: "HIPAA & Compliance",
          blurb:
            "For medical, dental, and healthcare-adjacent businesses — HIPAA-compliant infrastructure, encrypted data handling, and security policies that actually get followed.",
        },
      ]}
      nearbyAreas={["Petaluma", "San Rafael", "Mill Valley", "Sonoma", "Marin County"]}
    />
  );
}
