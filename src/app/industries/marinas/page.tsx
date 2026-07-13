import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Websites & IT for Marinas, Boatyards & Marine Trades | Copper Bay Tech",
  description:
    "Marina websites with slip reservations, launch and fuel info, and seasonal updates — plus IT support for the dock office. Built in Sonoma County by a team that has shipped real marina booking software.",
  alternates: { canonical: "https://copperbaytech.com/industries/marinas" },
  openGraph: {
    url: "https://copperbaytech.com/industries/marinas",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function MarinasPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Industries", url: "https://copperbaytech.com/industries" }, { name: "Marinas & Marine Trades" }])} />
      <IndustryPage
        industry="Marinas & Marine Trades"
        tagline="Websites and systems built for life on the water."
        description="Slip rentals, launch ramps, fuel docks, boat repair, detailing, canvas — marine businesses live and die by the season, and most of their websites were last touched a decade ago. We build marina and marine-trade sites that answer the questions boaters actually search for, and we've built real slip-booking software, not just brochure pages."
        painPoints={[
          "Boaters call the office to ask things your website should answer — lake level, ramp status, fuel hours, slip availability",
          "Slip inquiries live in a paper binder or a shared inbox instead of a booking system",
          "Your site looks fine on a desktop in the office and broken on a phone at the dock",
          "Seasonal hours and rates are wrong half the year because updating the site is a chore",
          "You don't show up when someone searches \"boat slip rental\" or \"marina near me\" for your water",
          "The dock office computer, the POS, and the security cameras are held together with guesswork",
        ]}
        services={[
          {
            title: "Marina Websites & Slip Booking",
            blurb:
              "Fast, mobile-first sites with slip inquiry and reservation flows, rate sheets, ramp/fuel status, and seasonal updates you can change in minutes. We've built full marina booking platforms — reservations, tenants, payments — so the hard version of this problem is one we already know.",
          },
          {
            title: "Local SEO for the Waterfront",
            blurb:
              "Own the searches that matter on your water — slip rental, launch ramp, boat storage, fuel dock — with a Google Business Profile and site structure tuned for how boaters actually search.",
          },
          {
            title: "Dock Office IT & Wi-Fi",
            blurb:
              "Point-of-sale, cameras, guest Wi-Fi that survives a summer weekend, and backups for the records that run the marina — handled by one local partner.",
          },
        ]}
        relatedPosts={[
          {
            slug: "online-booking-system-for-small-business",
            title: "Does Your Small Business Need an Online Booking System?",
            tag: "Web Development",
          },
          {
            slug: "how-to-rank-on-google-maps-local-business",
            title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
            tag: "Local SEO",
          },
          {
            slug: "5-signs-your-business-website-is-costing-you-customers",
            title: "5 Signs Your Business Website Is Costing You Customers",
            tag: "Web Development",
          },
        ]}
      />
    </>
  );
}
