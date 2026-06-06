import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-sonoma";

export const metadata: Metadata = {
  title: "IT Support Sonoma CA | Plaza-Area Small Business Tech | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Sonoma Plaza tasting rooms, restaurants, inns, boutiques, and event venues. Rock-solid POS, reservation systems, and guest Wi-Fi — with a real human to call. (707) 239-6725.",
  keywords:
    "IT support Sonoma CA, IT support Sonoma Plaza, managed IT Sonoma, small business IT Sonoma, POS support tasting room, restaurant IT support Sonoma, inn IT support Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Sonoma Plaza Businesses | Copper Bay Tech",
    description:
      "Flat-monthly managed IT for Sonoma tasting rooms, restaurants, inns, and boutiques. No ticket queue — a real person picks up.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportSonoma() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Sonoma"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-monthly managed IT for Sonoma Plaza tasting rooms, restaurants, inns, and boutiques — so your POS and reservation system stay up on the busiest Bay Area escape weekends, with a real person to call when something goes wrong."
      intro={[
        "Sonoma’s Plaza is the beating heart of one of California’s oldest wine towns, and the businesses ringing it run on systems that cannot afford to hiccup on a Friday afternoon when the parking lot fills with cars from the Bay. A tasting room that can’t ring a sale, a B&B whose check-in software is down, or a restaurant that loses its reservation queue on a Saturday evening doesn’t get a second chance with that guest. The historic buildings around the Plaza add a layer of real-world complexity — thick adobe walls, century-old wiring conduits, and layouts that were never meant to carry a network — and getting reliable Wi-Fi to every corner of the floor plan takes hands-on problem solving, not a spec sheet.",
        "Copper Bay Tech works with the Plaza-area businesses that power Sonoma’s visitor economy: tasting rooms and wine bars, restaurants and cafés, boutique inns and B&Bs, galleries, boutiques, and the wedding and event venues that keep the calendar full year-round. We handle the IT layer so you can stay on the floor with your guests instead of rebooting a router. Flat monthly fee, no long-term contract, and when something breaks you call a local number and a real person answers — no ticket queue, no offshore hold music.",
      ]}
      includesTitle="What Sonoma businesses get"
      includes={[
        "POS and payment system monitoring so a crash on a busy Plaza weekend doesn't mean lost sales",
        "Reservation and property-management system support (Toast, Square, Tock, Cloudbeds, and others)",
        "Separate guest and business Wi-Fi networks — visitors get fast internet, your back-office stays secure",
        "Historic-building Wi-Fi surveys to solve dead zones created by adobe walls and old building layouts",
        "Seasonal and part-time staff device onboarding for summer and harvest rushes",
        "Remote monitoring and after-hours alerts so problems get caught before they become crises",
        "Flat monthly rate with no long-term contract — pricing you can budget without surprises",
        "Direct phone access to your technician — no ticket queue, no scripted call center",
      ]}
      industriesTitle="Who we help in Sonoma"
      industries={[
        "Tasting rooms & wine bars",
        "Restaurants & cafés",
        "Boutique inns & B&Bs",
        "Wedding & event venues",
        "Retail boutiques & gifts",
        "Art galleries",
        "Tour & experience operators",
        "Food & specialty retail",
      ]}
      faqs={[
        {
          q: "Our POS went down on a Saturday afternoon. How fast can you actually respond?",
          a: "When you’re on a monthly support plan with us, you call a local number and a real technician picks up — not a help-desk queue. For a downed POS or reservation system during business hours, we aim to have you troubleshooting within minutes and, if needed, someone on-site the same day. We keep priority response built into the plan because we understand that a Sonoma Plaza weekend is your revenue window.",
        },
        {
          q: "The building is old adobe with thick walls. Can you actually get Wi-Fi everywhere?",
          a: "We hear this often from Plaza-area businesses. Thick masonry and historic construction eat wireless signal in ways a standard router placement can’t overcome. We start with a physical walk-through of your space to map dead zones and signal paths before we recommend anything. The fix is usually a properly placed set of access points — not more expensive hardware, just the right positions. We’ve done this in Sonoma’s historic buildings and know what works.",
        },
        {
          q: "We hire extra staff every summer and during harvest. Can you handle fast onboarding?",
          a: "Yes, that’s a normal part of supporting hospitality and wine businesses in Sonoma County. We can set up new devices, create limited-access accounts for seasonal employees, and configure role-based permissions so temporary staff get exactly the access they need and nothing more. We can also batch-onboard several people at once when you have a hiring push.",
        },
        {
          q: "Do we need separate Wi-Fi for guests and for the business?",
          a: "We strongly recommend it, and it’s standard in what we set up for hospitality clients. Guest Wi-Fi runs on its own isolated network — visitors get fast, reliable internet without being able to reach your POS, reservation system, or any back-office devices. It also protects you if a guest’s device happens to be compromised. The setup is straightforward and makes a real difference for security.",
        },
        {
          q: "What does flat-monthly IT support cost for a small Plaza business?",
          a: "Pricing depends on the number of devices, locations, and how much hands-on support you typically need. Most single-location Sonoma small businesses land in a range that’s comfortable to budget month to month — well under the cost of one afternoon of lost sales from a system outage. There’s no long-term contract, so you’re not locked in. Start with a free 30-minute call and we’ll give you an honest number for your specific setup.",
        },
      ]}
      nearby={[
        { href: "/web-design-sonoma", label: "web design in Sonoma" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
