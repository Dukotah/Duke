import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-guerneville";

export const metadata: Metadata = {
  title: "IT Support Guerneville CA | Russian River Small Business IT | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Guerneville vacation rentals, riverside restaurants, resorts, and outfitters. Flood-ready backups, rock-solid POS and booking systems, and a real human on a busy summer Saturday. Call (707) 239-6725.",
  keywords:
    "IT support Guerneville, computer support Guerneville CA, Russian River business IT, vacation rental IT support, POS support Guerneville, disaster recovery Russian River, small business IT Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Guerneville Businesses | Copper Bay Tech",
    description:
      "Reliable IT support built for Guerneville&apos;s seasonal swings and flood risk — POS, booking systems, guest Wi-Fi, and tested off-site backups.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportGuerneville() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Guerneville"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-monthly IT support that keeps Guerneville vacation rentals, riverside restaurants, resorts, and outfitters running — through packed summer weekends, big-event crowds, and Russian River flood season alike."
      intro={[
        "Guerneville runs on two speeds: full throttle and flood watch. Summer brings a surge of visitors for Lazy Bear Week, Jazz on the River, and long Fourth of July weekends — vacation rental occupancy maxes out, the riverside bars and restaurants are packed wall-to-wall, and canoe outfitters are turning people away. Your point-of-sale, reservation platform, and guest Wi-Fi have to absorb that load without a hiccup, because a system outage on a Saturday night in August is real lost revenue with a real line out the door. The remote redwood canyon setting doesn't help — the Russian River corridor has limited connectivity options compared to inland towns, so you need a provider who knows how to engineer redundancy for that environment, not one who assumes fiber is everywhere.",
        "Then winter arrives. The crowds thin, the river rises, and in a bad year it comes over the banks entirely. Guerneville has flooded repeatedly — 2019 was severe enough to strand the town for days — and businesses that had not tested their off-site backups learned the hard way that a local-only copy means nothing if the building is under water. We bring disaster-recovery thinking to every Guerneville engagement: encrypted cloud backups verified on a schedule, documented recovery procedures, and hardware setups designed so that when the water recedes and you reopen, you&apos;re back to work the same day, not weeks later.",
      ]}
      includesTitle="What Guerneville businesses get"
      includes={[
        "Flat monthly fee — no surprise invoices after a busy summer weekend call",
        "POS and payment-terminal support that holds up during peak-crowd surges",
        "Reservation and booking-platform troubleshooting (Airbnb, VRBO, ResNexus, and others)",
        "Guest Wi-Fi setup and management for vacation rentals, lodges, and resorts",
        "Encrypted off-site cloud backups with scheduled restore tests — flood-ready by design",
        "Remote monitoring and patch management so problems surface before they become crises",
        "Real human support reachable on a busy Saturday, not just weekday business hours",
        "No long-term contract — earn your trust month to month",
      ]}
      industriesTitle="Who we support in Guerneville"
      industries={[
        "Vacation rentals & cabins",
        "Riverside restaurants & bars",
        "Lodges & resorts",
        "Canoe, kayak & beach outfitters",
        "Bed & breakfasts",
        "Event venues & campgrounds",
        "Retail & gift shops",
        "Wellness & massage studios",
      ]}
      faqs={[
        {
          q: "Our busiest days are summer weekends and big events like Lazy Bear Week. Will you actually pick up the phone then?",
          a: "Yes — that&apos;s precisely why we structure support the way we do. A Monday-through-Friday help desk is useless to a Guerneville restaurant going down on a Saturday night in August. We provide real human support on weekends and we prioritize active-incident calls. The flat monthly model means we&apos;re not billing you extra for a busy-season call, so there&apos;s no friction in reaching out.",
        },
        {
          q: "The Russian River floods. How do you protect against losing everything?",
          a: "Every Guerneville client gets encrypted off-site cloud backups — nothing stored only on-premises where it can be destroyed or stranded by high water. More importantly, we test restores on a regular schedule so you know the backup actually works before you need it. We also document a recovery runbook specific to your setup so that when you reopen after a flood event, the steps to get back online are clear and quick, not improvised under stress.",
        },
        {
          q: "Our vacation rental uses platforms like Airbnb and VRBO. Is that something you support?",
          a: "We support the devices and local network infrastructure your rental operations run on — the router and Wi-Fi hardware guests connect to, the computers or tablets you manage listings and check-ins from, and the local software or printers tied to your operation. If a platform app or integration is misbehaving, we&apos;ll help you diagnose whether it&apos;s a network issue, a device issue, or something on the platform&apos;s end that needs their support team — and we&apos;ll stay on it with you either way.",
        },
        {
          q: "Connectivity in the Russian River canyon can be unreliable. Can you help with that?",
          a: "The canyon corridor has real constraints — limited ISP options and terrain that makes cellular backup less reliable than in an open valley town. We design around those constraints: we&apos;ll assess your available connections, set up a secondary failover where feasible, and configure your network so a momentary outage doesn&apos;t take down everything at once. We won&apos;t oversell what&apos;s possible given local infrastructure, but we will squeeze the most reliability out of what&apos;s actually there.",
        },
        {
          q: "What does flat-monthly IT support cost for a small Guerneville business?",
          a: "Pricing depends on how many devices, locations, and systems we&apos;re covering. We quote a flat monthly number upfront after a free 30-minute assessment call — no hourly billing, no per-incident fees, no surprises after a busy weekend. Start with that free call and we&apos;ll tell you honestly what we&apos;d prioritize first and exactly what it would cost.",
        },
      ]}
      nearby={[
        { href: "/web-design-guerneville", label: "web design in Guerneville" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
      ctaBlurb="Free 30-minute call. We&apos;ll tell you honestly what we&apos;d fix first — POS reliability, off-site backups, guest Wi-Fi, or something else — and exactly what it would cost. No pressure."
    />
  );
}
