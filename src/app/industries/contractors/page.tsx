import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Websites for Contractors & Trades in Sonoma County | Copper Bay Tech",
  description:
    "Websites that win jobs for Sonoma County contractors — license front and center, real project photos, quote requests that reach your phone, and rankings for the cities you actually serve.",
  alternates: { canonical: "https://copperbaytech.com/industries/contractors" },
  openGraph: {
    url: "https://copperbaytech.com/industries/contractors",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ContractorsPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Industries", url: "https://copperbaytech.com/industries" }, { name: "Contractors & Trades" }])} />
      <IndustryPage
        industry="Contractors & Trades"
        tagline="A website that wins jobs while you're on one."
        description="General contractors, electricians, plumbers, painters, landscapers — your next customer is searching from their kitchen after something broke or a project got real. We build contractor sites that put your CSLB license, your real work, and a fast way to reach you in front of them before they call the next name on the list."
        painPoints={[
          "Your \"website\" is a Facebook page, a Yelp listing, or a template site you can't update",
          "Homeowners can't find your license number or proof of insurance, so they keep scrolling",
          "Project photos live on your phone instead of on a gallery that sells the next job",
          "Quote requests go to an email nobody checks from the truck",
          "You serve six cities but only show up in searches for one — or none",
          "National lead-gen sites sell you your own customers back at $80 a lead",
        ]}
        services={[
          {
            title: "Contractor Websites That Convert",
            blurb:
              "License and insurance up front, before/after project galleries, service pages for each trade, and a quote form that texts you — built custom, loads instantly on a phone.",
          },
          {
            title: "Rank in the Cities You Serve",
            blurb:
              "Service-area pages and a tuned Google Business Profile so \"electrician Santa Rosa\" and \"deck builder Healdsburg\" find you — not just the franchises and lead resellers.",
          },
          {
            title: "One Flat Plan, No Surprises",
            blurb:
              "Hosting, updates, new project photos, seasonal promos — handled for a flat monthly rate, so the site stays current without you touching a computer.",
          },
        ]}
        relatedPosts={[
          {
            slug: "ai-for-home-services-sonoma-county",
            title: "AI for Home-Services Businesses in Sonoma County",
            tag: "AI & Automation",
          },
          {
            slug: "how-to-rank-on-google-maps-local-business",
            title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
            tag: "Local SEO",
          },
          {
            slug: "how-much-does-a-website-cost-sonoma-county",
            title: "How Much Does a Website Cost in Sonoma County?",
            tag: "Web Development",
          },
        ]}
      />
    </>
  );
}
