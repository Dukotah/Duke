import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-bodega-bay";

export const metadata: Metadata = {
  title: "Custom Software Development Bodega Bay CA | Copper Bay Tech",
  description: "Custom-coded web apps, booking systems, and internal tools for Bodega Bay's fishing, lodging, and tourism businesses — built around your boats, your…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Bodega Bay CA | Copper Bay Tech",
    description: "Custom-coded web apps, booking systems, and internal tools for Bodega Bay's fishing, lodging, and tourism businesses — built around your boats, your…",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <ServiceCityPage
      service="Custom Software"
      city="Bodega Bay"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Bodega Bay, CA · Custom Software"}
      heroBlurb={"Custom-coded web apps, booking systems, and internal tools for Bodega Bay's fishing, lodging, and tourism businesses — built around your boats, your slips, and your short, crowded season. One accountable owner on every project, replies within a business day."}
      intro={["Bodega Bay runs on the water and the weather. Charter captains book trips that the next morning's swell might cancel, the fish market sells whatever came in off the boats that day, and the inns and vacation rentals along Highway 1 fill to the gills on a sunny summer weekend and sit half-empty in February. Most owners here are stitching that together with a wall calendar, a phone that won't stop ringing, a spreadsheet, and a booking widget that doesn't know the first thing about tides or crab season. When the rush hits, the gaps in that setup are exactly where money and good reviews leak out.","I build custom software for that reality — not a no-code template with Bodega Bay pasted on top. That means a charter-and-trip booking system that handles weather holds, deposits, and waitlists; a lodging tool that syncs availability across your own site and the listing sites so you stop double-booking; an internal dashboard that tells you what's actually making money across a wildly seasonal year. We start with the smallest useful version, get it working in your hands fast, and you own the code at the end — no monthly hostage situation. I'm based in Santa Rosa, a short drive over from the coast, and I work on-site across the North Bay and remotely nationwide."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner — Duke — on your project start to finish, no handoffs","A custom-coded build, not a no-code template you'll outgrow","Smallest-useful-version-first (MVP) so you see real value in weeks, not quarters","Replies within one business day, every time","You own the code and the data — full handoff, no lock-in","Integrations with the tools you already use (payments, calendars, listing sites, email/SMS)","Plain-English scope and pricing agreed up front before any build","Training and documentation so your team can actually run it","Optional ongoing support and improvements once you're live"]}
      industriesTitle={"What we build for Bodega Bay businesses"}
      industries={["Sport-fishing and whale-watching charters — trip booking, weather holds, deposits, and waitlists","Seafood markets and crab/Dungeness sellers — daily catch inventory and pre-order systems","Inns, motels, and vacation rentals — availability sync and direct booking to cut OTA fees","Waterfront restaurants and clam-chowder spots — reservations, waitlists, and seasonal staffing tools","Kayak, surf, and outdoor outfitters — online rentals, waivers, and tour scheduling","Marina, slip, and boat-launch operations — slip management, launch reservations, and billing","Coastal event and wedding venues — inquiry-to-booking pipelines and deposit tracking","Tour operators and guides — combined activity calendars and customer portals"]}
      faqs={[{"q":"Can you build a charter booking system that accounts for weather cancellations in Bodega Bay?","a":"Yes — that's a core need on this coast. I build trip-booking tools that let you place weather or swell holds, automatically notify booked customers by text or email, manage deposits and refunds per your policy, and roll cancelled guests onto a waitlist for the next open trip. The goal is to stop the morning-of phone scramble when the bar's too rough to cross."},{"q":"My inn fills up in summer and goes quiet in winter. Can software handle that swing?","a":"Absolutely. Highly seasonal demand is exactly what custom software handles better than an off-the-shelf widget. I can build availability that syncs across your own site and the listing sites to prevent double-bookings, set seasonal pricing and minimum-stay rules for peak Bodega Bay weekends, and give you a dashboard that shows occupancy and revenue across the whole year so you can plan staffing and off-season promotions."},{"q":"I run a seafood market and sell what the boats bring in. Can a tool track daily catch?","a":"Yes. I build simple daily-inventory and pre-order systems where you update what came in off the boats, customers can reserve crab or fresh catch for pickup, and you avoid both overselling and waste. It's built to be fast to update from your phone behind the counter, not a clunky enterprise system."},{"q":"Do I have to be technical, and will I be locked into paying you forever?","a":"No on both counts. My clients are non-technical owners — fishermen, innkeepers, restaurant operators — and I keep scope and pricing in plain English. You own the code and your data at the end, with a full handoff and documentation. Ongoing support is available if you want it, but it's your choice, not a requirement to keep the lights on."}]}
      nearby={[{"href":"/software-development-sebastopol","label":"Sebastopol"},{"href":"/software-development-petaluma","label":"Petaluma"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Got a Bodega Bay business that's outgrowing spreadsheets and phone-tag? Let's talk — I reply within one business day."}
    />
  );
}
