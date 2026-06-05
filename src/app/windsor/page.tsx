import type { Metadata } from "next";
import CityPage, { Globe, Server, ShieldCheck } from "@/components/CityPage";

export const metadata: Metadata = {
  title: "IT Support & Web Development in Windsor, CA | Copper Bay Tech",
  description:
    "Copper Bay Tech helps Windsor businesses with IT support, modern websites, and cloud migration. Serving Windsor's growing community of family businesses and light industrial companies.",
};

export default function WindsorPage() {
  return (
    <CityPage
      city="Windsor"
      relatedLinks={[
        { href: "/it-support-windsor", label: "IT Support in Windsor", blurb: "Managed IT and cloud migration for Windsor businesses." },
      ]}
      description="Windsor is one of Sonoma County's fastest-growing communities, with a mix of family-owned businesses, local retail, and light industrial operations. We help Windsor businesses modernize their technology without the enterprise price tag."
      painPoints={[
        "Outdated websites that don't reflect how good the business actually is",
        "No dedicated IT support — problems get ignored until they become crises",
        "Files still stored on local hard drives with no cloud backup",
        "Slow, unreliable internet and office Wi-Fi dragging down productivity",
        "Manual processes that could be automated to save hours every week",
        "Growing team with no system for managing devices, accounts, or security",
      ]}
      services={[
        {
          icon: Globe,
          title: "Modern Website Design",
          blurb:
            "Professional websites built for Windsor businesses — fast, mobile-friendly, and designed to bring in customers, not just look good.",
        },
        {
          icon: Server,
          title: "IT Support & Cloud Migration",
          blurb:
            "Move from scattered local files to reliable cloud infrastructure. Microsoft 365, Google Workspace, and ongoing IT support for growing teams.",
        },
        {
          icon: ShieldCheck,
          title: "Cybersecurity",
          blurb:
            "Protect your business data with backup systems, MFA setup, and security monitoring — without the complexity of enterprise security tools.",
        },
      ]}
      nearbyAreas={["Healdsburg", "Santa Rosa", "Rohnert Park", "Sonoma County"]}
    />
  );
}
