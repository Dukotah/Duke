import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/it-support-sebastopol";

export const metadata: Metadata = {
  title: "IT Support Sebastopol CA | The Barlow, Makers & Retailers | Copper Bay Tech",
  description:
    "Flat-monthly IT support for Sebastopol small businesses — The Barlow food and cider district, art studios, wellness practitioners, boutiques, and creative teams. Reliable POS, guest Wi-Fi, cloud backup, and direct human help. Call (707) 239-6725.",
  keywords:
    "IT support Sebastopol, computer support Sebastopol CA, small business IT Sebastopol, The Barlow IT support, managed IT Sebastopol, POS support Sebastopol, West County IT services Sonoma County",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "IT Support for Sebastopol Businesses | Copper Bay Tech",
    description:
      "Flat-monthly managed IT for Sebastopol makers, retailers, tasting spaces, and creative teams — no ticket queue, no long-term contract.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function ITSupportSebastopol() {
  return (
    <ServiceCityPage
      service="IT Support"
      city="Sebastopol"
      canonical={CANONICAL}
      hub={{ href: "/it-support-sonoma-county", label: "IT Support" }}
      heroBlurb="Flat-monthly IT support for Sebastopol's artisan makers, food and cider businesses, art studios, and independent boutiques — direct human help with no ticket queue, no long-term contract."
      intro={[
        "Sebastopol is West County's maker hub — and the tech needs of a cidery tasting room at The Barlow, an organic food brand shipping product online, and a two-person art studio are nothing like the needs of a corporate office park. When your point-of-sale goes down on a Saturday afternoon, you need a real person who picks up the phone, not a support portal that routes you to a queue. When your guest Wi-Fi drops during a packed tasting flight, your reviews feel it that week. When your one backup laptop dies, the whole shop stops. That's the reality of running a small creative or food business in Sebastopol, and it's exactly the scale we work at best.",
        "From the craft-beverage producers and specialty food brands anchored at The Barlow to the independent wellness practitioners along Petaluma Avenue and the Mac-heavy creative studios dotted through town, Sebastopol businesses run lean — one or two machines, one internet connection, maybe a cloud subscription or two, and no IT department. We become that department for a flat monthly rate you can budget like rent. No per-incident billing that spikes when something actually goes wrong, no long-term lock-in, and no entry-level technician reading from a script. You get a senior engineer who knows your setup and can usually fix problems before you notice them.",
      ]}
      includesTitle="What Sebastopol businesses get"
      includes={[
        "POS health monitoring and same-day troubleshooting for tasting rooms, cafes, and retail shops",
        "Guest Wi-Fi setup and ongoing management so customer connectivity never becomes a bad review",
        "Cloud backup for the one or two machines your whole operation depends on",
        "E-commerce uptime monitoring for makers shipping product direct-to-consumer",
        "Mac and iOS device management for creative teams running Apple hardware",
        "Cloud collaboration setup — Google Workspace, Dropbox, Notion — configured the way small teams actually use it",
        "Direct phone and remote access to a senior engineer, no ticket queue",
        "Flat monthly pricing with no long-term contract — cancel anytime",
      ]}
      industriesTitle="Who we support in Sebastopol"
      industries={[
        "Craft cideries & tasting rooms",
        "Specialty food & beverage brands",
        "Art studios & galleries",
        "Organic & natural product retailers",
        "Wellness & bodywork practitioners",
        "Independent boutiques & gift shops",
        "Creative agencies & design studios",
        "Farmers market vendors & online sellers",
      ]}
      faqs={[
        {
          q: "We run our whole shop on one or two machines. Is that enough for you to support?",
          a: "That's exactly the scale we work at best. Most managed IT providers have minimums built for offices with a dozen machines — we don't. If your business runs on a single Mac behind the counter and a tablet for inventory, we'll protect and monitor those specific devices, make sure your backup is real and tested, and be the person you call when anything goes sideways. Small footprint doesn't mean low risk; it often means a single point of failure you really can't afford.",
        },
        {
          q: "Our point-of-sale goes down on weekends when we're busiest. How fast can you respond?",
          a: "Weekend and same-day response is part of the plan — not an add-on. Tasting rooms and retail shops at The Barlow and around town do their real volume on Saturdays. We don't disappear on Friday afternoon. If your POS or card reader goes down during a busy service, you call or text a direct number and get a technician, not a callback promise from a support queue.",
        },
        {
          q: "We ship product online and can't afford e-commerce downtime. Can you help with that?",
          a: "Yes. For Sebastopol makers selling direct-to-consumer — whether that's small-batch cider, specialty food, or handmade goods — we set up uptime monitoring on your storefront and get alerted before you do if something breaks. We also manage the cloud-side configurations (domain, DNS, hosting integrations) that quietly cause checkout failures when they drift. You focus on the product; we watch the infrastructure.",
        },
        {
          q: "What's included in 'flat monthly' — and what isn't?",
          a: "The flat monthly rate covers all the ongoing work: device monitoring, software updates, security patching, backup verification, and unlimited support calls and remote sessions for issues that come up in normal operations. What's not included is new hardware procurement or major one-time projects like a full network rebuild — those are quoted separately and upfront so there are no surprises. Most Sebastopol clients never hit an extra charge.",
        },
        {
          q: "We use a lot of Mac and Apple hardware. Do you support that, or is it mostly Windows shops you work with?",
          a: "We support both, and a good portion of our Sebastopol clients are Mac-first — creative studios, designers, and small teams that made the switch and never looked back. Mac support at the small-business level is genuinely different from Windows: Apple Business Manager, iCloud vs. Google Workspace decisions, Time Machine backup strategy, and the specific ways macOS behaves on a business network. We handle all of it without sending you to the Apple Store for business IT.",
        },
      ]}
      nearby={[
        { href: "/web-design-sebastopol", label: "web design in Sebastopol" },
        { href: "/it-support-santa-rosa", label: "IT support in Santa Rosa" },
        { href: "/it-support-sonoma-county", label: "all of Sonoma County" },
      ]}
      ctaBlurb="Free 30-minute call. We'll tell you honestly what we'd fix first and what it costs — no pressure, no sales script."
    />
  );
}
