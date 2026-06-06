import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

export const metadata: Metadata = {
  title: "Websites & IT for Sonoma County Real Estate Agents | Copper Bay Tech",
  description:
    "Custom websites, CRM integrations, and IT support for Sonoma County real estate agents and brokerages. Look as good online as you do in person.",
  openGraph: {
    url: "https://copperbaytech.com/industries/real-estate",
  },
};

export default function RealEstatePage() {
  return (
    <IndustryPage
      industry="Real Estate Agents & Brokerages"
      tagline="Technology that makes you the obvious choice."
      description="In real estate, your digital presence is your first impression. We help Sonoma County agents and brokerages build standout websites, connect their tools, and rank for the searches that bring in buyers and sellers."
      painPoints={[
        "Your website looks like every other agent's — template, generic, forgettable",
        "Listings aren't loading fast or displaying well on mobile",
        "You use 6 different tools that don't talk to each other",
        "No clear way for leads to contact you from your website",
        "Client communication happens across email, text, and three apps",
        "You want to rank for local neighborhood searches but don't know how",
      ]}
      services={[
        {
          title: "Custom Agent Websites",
          blurb:
            "Unique design with IDX/MLS integration, lead capture forms, and fast mobile performance that sets you apart from template sites.",
        },
        {
          title: "CRM & Tool Integration",
          blurb:
            "Connect your CRM, email, calendar, and listing tools so leads flow automatically and nothing falls through the cracks.",
        },
        {
          title: "Local SEO",
          blurb:
            "Rank for neighborhood and city searches across Sonoma County so buyers and sellers find you before they find your competition.",
        },
      ]}
      relatedPosts={[
        {
          slug: "it-support-for-real-estate-offices-sonoma-county",
          title: "IT Support for Real Estate Offices in Sonoma County",
          tag: "IT Support",
        },
        {
          slug: "5-signs-your-business-website-is-costing-you-customers",
          title: "5 Signs Your Business Website Is Costing You Customers Right Now",
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
