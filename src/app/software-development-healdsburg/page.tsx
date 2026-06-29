import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-healdsburg";

export const metadata: Metadata = {
  title: "Custom Software Development Healdsburg CA | Copper Bay Tech",
  description: "Custom web apps, internal tools, and automations built for Healdsburg's tasting rooms, restaurants, hotels, and vacation-rental operators. Real code you…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Healdsburg CA | Copper Bay Tech",
    description: "Custom web apps, internal tools, and automations built for Healdsburg's tasting rooms, restaurants, hotels, and vacation-rental operators. Real code you…",
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
      city="Healdsburg"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Healdsburg, CA · Custom Software"}
      heroBlurb={"Custom web apps, internal tools, and automations built for Healdsburg's tasting rooms, restaurants, hotels, and vacation-rental operators. Real code you own, built by one accountable person who answers the phone."}
      intro={["Healdsburg runs on hospitality, and hospitality runs on a hundred small handoffs: a tasting-room reservation that needs to sync with a wine-club roster, a restaurant waitlist on a busy Plaza weekend, a boutique inn juggling housekeeping turns between guests, a vacation rental coordinating cleaners and check-ins across the season. Most local businesses stitch these together with a pile of spreadsheets, a booking widget that doesn't talk to their POS, and a lot of late-night manual data entry. That works until peak crush season hits and the cracks show. Custom software replaces the duct tape with one tool that actually fits how your business runs.","I'm Duke Hutcheon, and Copper Bay Tech is based right here in Sonoma County, so I understand a Healdsburg calendar where the difference between a slow Tuesday and a sold-out harvest-season Saturday is everything. I build the smallest useful version first, custom-coded for your exact workflow rather than forced into a no-code template, so a tasting-room allocation tool or an owner-facing rental dashboard does precisely what you need and nothing you don't. You own the code outright, one person is accountable from first call to launch, and you get a reply within one business day. Remote-friendly for the whole project, and I can meet on-site anywhere in the North Bay."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner from first call through launch, with a reply within one business day","A build-the-smallest-useful-version-first (MVP) plan so you see value fast and spend less","Custom-coded software, not a no-code template you'll outgrow","Full source code ownership, handed to you with no lock-in","Integrations that connect your existing tools, POS, and booking systems","Plain-English progress updates, no jargon or status-meeting theater","Practical automation of the manual, repetitive work eating your team's time","Testing and a clean handoff so it works on day one and you know how to run it","Optional ongoing support and improvements once you're live"]}
      industriesTitle={"What we build for Healdsburg businesses"}
      industries={["Tasting rooms and wineries: reservation, allocation, and wine-club member tools that sync with your POS","Restaurants and the Plaza dining scene: waitlists, reservations, and online ordering that fit your floor","Boutique hotels and inns: booking, housekeeping-turn, and guest-communication dashboards","Vacation rentals and property managers: owner portals, cleaner scheduling, and multi-listing calendars","Boutique retail and specialty food shops: inventory, e-commerce, and customer-loyalty tools","Event and wedding venues: inquiry intake, deposit tracking, and day-of coordination software","Wine clubs and DTC sales: member portals, shipment scheduling, and compliance-aware order tools","Tour and experience operators: bookings, capacity limits, and automated guest reminders"]}
      faqs={[{"q":"Can you build a tasting-room reservation tool that works with my existing POS and wine club?","a":"Yes. That's exactly the kind of integration I do. Healdsburg tasting rooms usually have a booking widget, a POS, and a wine-club roster that don't talk to each other, so staff re-key the same guest three times. I build a custom layer that connects them, so a reservation flows through to your member list and sales system automatically. You keep your current tools; the software just makes them work together."},{"q":"I run a vacation rental near the Plaza. Can you build something to coordinate cleaners and guest check-ins?","a":"Absolutely. A common Healdsburg setup is a handful of high-end rentals where the bottleneck is the same-day turn between a checkout and the next check-in, especially on harvest-season weekends. I can build an owner-and-cleaner dashboard that schedules turns, sends automated arrival instructions to guests, and flags any gaps before they become a problem across all your listings."},{"q":"Do I have to be technical to work with you?","a":"No, and most of my clients aren't. My audience is owners and operators who run hospitality, retail, and wine businesses, not software people. I handle the technical side and explain everything in plain English. You stay in charge of the decisions about how your business should work; I translate that into software."},{"q":"Are you local, or is this all remote?","a":"Both. Copper Bay Tech is based in Santa Rosa, just down the road, so I can meet on-site at your Healdsburg tasting room, restaurant, or office anywhere in the North Bay. Most of the build work happens remotely, which keeps things efficient, but you're never dealing with an offshore team or a faceless agency. It's one local person you can actually reach."}]}
      nearby={[{"href":"/software-development-windsor","label":"Windsor"},{"href":"/software-development-sebastopol","label":"Sebastopol"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Got a Healdsburg workflow that's held together by spreadsheets and late nights? Let's talk. Reply within one business day, no hard sell."}
    />
  );
}
