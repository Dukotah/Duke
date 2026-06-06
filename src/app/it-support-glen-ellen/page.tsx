import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-glen-ellen";

export const metadata: Metadata = {
  title: "IT Support Glen Ellen CA | Tasting Room & Inn Tech Support | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Glen Ellen wineries, tasting rooms, inns, and restaurants. Reliable POS, guest Wi-Fi, and on-call help for businesses in the Valley of the Moon. Call (707) 239-6725.",
  keywords:
    "IT support Glen Ellen, computer support Glen Ellen CA, tasting room IT support, winery IT support Sonoma Valley, guest Wi-Fi rural winery, small business IT Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Glen Ellen Businesses | Copper Bay Tech",
    description:
      "Flat-monthly IT support for Glen Ellen tasting rooms, boutique inns, and restaurants in the Valley of the Moon.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportGlenEllen() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Glen Ellen"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="On-call, flat-monthly IT support for Glen Ellen's tasting rooms, boutique inns, and acclaimed restaurants — so your tech works as seamlessly as the Valley of the Moon experience you've built."
      intro={[
        "Glen Ellen sits quietly at the heart of Sonoma Valley — a handful of blocks, a cluster of boutique wineries, a few destination restaurants, and a collection of rustic-luxury inns tucked into the oak-covered hills near Jack London State Historic Park. There's no Plaza bustle here, no Main Street foot traffic to fall back on. Guests arrive intentionally, with high expectations built from reviews and word of mouth, and the entire experience has to hold together from the moment they walk in. A POS that freezes during a seated tasting, a guest Wi-Fi password that doesn't work in the vineyard-view suite, or a reservation system that goes offline on a Saturday afternoon — these are the moments that break the premium reputation you've worked hard to earn.",
        "Rural Sonoma Valley also presents real infrastructure challenges that a generic IT provider downtown has never dealt with. Historic stone and adobe tasting room walls that defeat standard Wi-Fi access points, long property runs where wired drops aren't an option, and limited ISP redundancy in a small valley mean that maintaining reliable connectivity takes deliberate engineering, not an off-the-shelf router. We work with Glen Ellen's specific terrain and building stock — and we stay available on a flat monthly retainer, so when something goes sideways on a busy harvest weekend you call a real person, not a ticket queue.",
      ]}
      includesTitle="What Glen Ellen businesses get"
      includes={[
        "Flat monthly fee — no per-ticket billing, no surprise invoices",
        "Tasting room POS setup, monitoring, and rapid-response support",
        "Guest and staff Wi-Fi engineered for thick-walled historic and rural buildings",
        "Online reservation platform reliability (Tock, Resy, OpenTable, and property management systems)",
        "Network redundancy planning for limited rural-valley ISP options",
        "Workstation, tablet, and iPad management for tasting and front-of-house staff",
        "Security patching and endpoint protection — no scare tactics, just steady upkeep",
        "On-call availability during harvest season and peak hospitality weekends",
      ]}
      industriesTitle="Who we help in Glen Ellen"
      industries={[
        "Boutique & family wineries",
        "Tasting rooms & wine caves",
        "Rustic-luxury inns & B&Bs",
        "Farm-to-table restaurants",
        "Wedding & private event venues",
        "Vacation rental properties",
        "Wellness retreats & spas",
        "Specialty wine & food retail",
      ]}
      faqs={[
        {
          q: "Our tasting room is in a historic stone building and Wi-Fi has always been terrible. Can you actually fix that?",
          a: "Yes — this is one of the most common problems we solve for Sonoma Valley properties. Thick stone, adobe, and wood-framed walls from the late 1800s and early 1900s absorb and scatter Wi-Fi signals in ways a standard consumer router can't overcome. We survey the space, design a proper access-point layout using enterprise-grade hardware, and run cabling where needed. The result is solid coverage in the tasting room, the barrel room, the outdoor patio, and the guest rooms — not just next to the router.",
        },
        {
          q: "What happens if our POS or reservation system goes down on a Saturday afternoon?",
          a: "You call us directly and we pick up. On a flat monthly plan you aren't waiting for a ticket to be triaged — you're a known client calling a known technician. We aim to have remote issues resolved within the hour. For hardware failures we carry common spares and can reach Glen Ellen for on-site work the same day or next morning depending on the situation. Harvest season and holiday weekends are exactly when we stay closest to our Valley clients.",
        },
        {
          q: "We're a small operation — just three or four staff. Is IT support overkill for a place our size?",
          a: "Glen Ellen's hospitality businesses tend to be small in headcount but high in revenue per guest and reputation-sensitive. One bad experience shared online carries more weight here than it might in a larger town. A flat monthly plan scales to small teams — you pay for the coverage level you need, not a contract sized for a 50-person office. The break-even is usually the cost of one service call under a pay-per-incident model, and after that every month of stability is upside.",
        },
        {
          q: "Our inn uses a property management system and our tasting room uses a separate POS. Can you support both?",
          a: "Absolutely. Multi-system environments are the norm for Glen Ellen properties that run both hospitality and direct-to-consumer wine sales. We learn your specific stack — whether that's a cloud-based PMS like Cloudbeds or a locally-installed POS — and support all of it under one retainer. We also flag when systems aren't talking to each other well and can recommend integrations that reduce double-entry and staff friction.",
        },
        {
          q: "What does flat-monthly IT support cost for a small winery or inn?",
          a: "Pricing depends on the number of devices, locations, and the level of on-call availability you need. We'll give you an honest quote after a free 30-minute call where we learn about your setup. There are no hourly rates hidden inside the contract and no charges for calling us — that's the whole point of a flat retainer. Call (707) 239-6725 or fill out the contact form and we'll talk through what makes sense for your operation.",
        },
      ]}
      nearby={[
        { href: "/web-design-glen-ellen", label: "web design in Glen Ellen" },
        { href: "/it-support-sonoma", label: "IT support in Sonoma" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
      ctaBlurb="Free 30-minute call. We'll tell you honestly what we'd fix first and what it would cost — no pressure, no ticket queue."
    />
  );
}
