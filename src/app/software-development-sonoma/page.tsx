import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-sonoma";

export const metadata: Metadata = {
  title: "Custom Software Development Sonoma CA | Copper Bay Tech",
  description: "Custom web apps, internal tools, and automations built for Sonoma's tasting rooms, restaurants, vacation rentals, and Plaza retail. Founder-led…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Sonoma CA | Copper Bay Tech",
    description: "Custom web apps, internal tools, and automations built for Sonoma's tasting rooms, restaurants, vacation rentals, and Plaza retail. Founder-led…",
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
      city="Sonoma"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Sonoma, CA · Custom Software"}
      heroBlurb={"Custom web apps, internal tools, and automations built for Sonoma's tasting rooms, restaurants, vacation rentals, and Plaza retail. Founder-led, custom-coded, and yours to keep."}
      intro={["Sonoma runs on a few overlapping economies: the wineries and tasting rooms that draw visitors year-round, the restaurants and hotels packed around the Plaza, the vacation rentals scattered across the valley, and the historic shops that have anchored the square for generations. Most of these businesses are stitched together with a reservation widget, a POS, a spreadsheet for the wine club, and a separate inbox for events and private tastings. The handoffs between those tools are where time and money leak out — a tasting-room host re-keying allocations into a club spreadsheet, a rental manager copying turnover dates between a calendar and a cleaning crew's texts, a chef counting covers across three apps that don't talk to each other.","That's the gap custom software closes. Instead of forcing your wine club, allocations, event bookings, and shipping holds into off-the-shelf tools that were built for someone else's business, we build the smallest useful version of exactly what your operation needs — a tasting-room dashboard, a club-member portal, a rental-turnover scheduler, a Plaza shop's inventory and online-order tool — and connect it to the systems you already run. You work directly with the person writing the code, you get a working first version fast, and you own it outright. No monthly per-seat tax on software that should just be part of how your business runs."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner from first call to launch — you always know who's building your software","A reply within one business day, every time","Custom-coded software, not a no-code template you'll outgrow","A smallest-useful-version-first (MVP) build so you see value in weeks, not quarters","Clean integrations with the tools you already use — POS, calendars, email, payments, accounting","Full ownership of the code and your data — no lock-in, no per-seat ransom","Plain-English documentation and a walkthrough so your team can actually use it","Practical, optional AI where it earns its keep — never bolted on for hype","Post-launch support and a clear plan for changes as your business grows"]}
      industriesTitle={"What we build for Sonoma businesses"}
      industries={["Wineries and tasting rooms — allocation tracking, club-member portals, and reservation-to-POS sync","Wine clubs and DTC shipping — membership management, hold lists, and compliant fulfillment workflows","Restaurants and Plaza eateries — covers, private-event bookings, and prep/inventory dashboards","Vacation rentals and inns — turnover scheduling, cleaning-crew coordination, and guest portals","Historic Plaza retail and specialty shops — inventory, online ordering, and local-pickup tools","Event and private-tasting hosts — booking, deposits, and calendar coordination across venues","Tour and hospitality operators — group scheduling, waivers, and per-guest itineraries","Farms, olive mills, and tasting-adjacent producers — order tracking and wholesale account portals"]}
      faqs={[{"q":"Can you build software specifically for a Sonoma Plaza tasting room or wine club?","a":"Yes — that's a core use case. We build tools like tasting-room reservation dashboards, allocation and hold tracking, and club-member portals that connect your booking system, POS, and shipping so your hosts stop re-keying member data between a spreadsheet and three other apps. We start with the single biggest pain point and ship a working version fast."},{"q":"We run vacation rentals across the valley. Can you automate turnovers and cleaning schedules?","a":"Absolutely. We build turnover schedulers that pull check-out dates from your booking calendars, auto-notify your cleaning crew, and give you one dashboard for every property — instead of texts and a shared spreadsheet. For Sonoma's mix of in-town and rural valley rentals, we account for crew travel time and same-day flips."},{"q":"Will this work with the POS and reservation tools my Sonoma restaurant or tasting room already uses?","a":"In almost every case, yes. Most reservation, POS, and payment systems have integrations we can connect to, so your custom tool sits on top of what you already run rather than replacing it. If something genuinely can't connect, we tell you that upfront before any work starts."},{"q":"I'm a small shop on the square — is custom software overkill for me?","a":"Not the way we build it. We start with the smallest useful version aimed at one real problem — say, inventory plus a simple online-order-and-local-pickup tool — so the cost stays proportional to the value. You own the code, so there's no growing per-seat bill as you add staff or a second location."}]}
      nearby={[{"href":"/software-development-glen-ellen","label":"Glen Ellen"},{"href":"/software-development-petaluma","label":"Petaluma"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Run a Sonoma business that's held together by spreadsheets and disconnected apps? Let's build the one tool that fixes it. Reply within one business day."}
    />
  );
}
