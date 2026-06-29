import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-sebastopol";

export const metadata: Metadata = {
  title: "Custom Software Development Sebastopol CA | Copper Bay Tech",
  description: "Custom-coded software for Sebastopol's orchards, organic-food makers, galleries, and tasting rooms — built around how your business actually runs, not…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Sebastopol CA | Copper Bay Tech",
    description: "Custom-coded software for Sebastopol's orchards, organic-food makers, galleries, and tasting rooms — built around how your business actually runs, not…",
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
      city="Sebastopol"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Sebastopol, CA · Custom Software"}
      heroBlurb={"Custom-coded software for Sebastopol's orchards, organic-food makers, galleries, and tasting rooms — built around how your business actually runs, not forced into a no-code template. One owner on your project, start to finish."}
      intro={["Sebastopol runs on small, hands-on operations: Gravenstein apple growers and cider makers working a short harvest window, organic and natural-food producers tracking lots and ingredients, artists and galleries around the Barlow and downtown, and a steady flow of weekend visitors. Most of these businesses are juggling spreadsheets, sticky notes, a point-of-sale, and three or four disconnected apps that don't talk to each other. That patchwork holds up until you hit a real season — apple pressing, a craft fair, a busy tasting weekend — and then the cracks cost you orders, hours, and goodwill. Custom software fixes the specific bottleneck instead of asking you to change how your shop works.","I build practical tools for exactly this kind of business: an order and inventory system that knows your apple varieties and pressing schedule, a customer portal for CSA or wholesale accounts, a booking tool for studio tours or tastings, or a quiet automation that turns Square sales into the bookkeeping and reorder numbers you actually need. The approach is owner-to-owner and deliberately small to start — we build the smallest useful version first, get it into your hands during a real workweek, and grow it from there. You own the code outright, and you get one accountable person who replies within a business day, not a ticket queue."]}
      includesTitle="Every engagement includes"
      includes={["A single accountable owner (Duke) on your project from first call to launch — no handoffs","Custom-coded software, not stitched-together no-code templates or plugins","An MVP-first plan: the smallest useful version shipped fast, then improved","Plain-language scoping so you know what you're getting and what it costs before we build","Replies within one business day, every time","Integrations that connect the tools you already use (POS, accounting, email, calendars)","You own the code and the data — full handoff, no lock-in","Testing and a real launch, plus training so your team can actually use it","Optional ongoing support and maintenance, on your terms"]}
      industriesTitle={"What we build for Sebastopol businesses"}
      industries={["Apple growers, cider makers, and Gravenstein-season producers","Organic and natural-food makers, packagers, and CSA operations","Galleries, working artists, and craft studios in the Barlow and downtown","Tasting rooms, cideries, and food-and-drink hospitality","Tourism, lodging, and weekend-visitor experiences","Specialty retail and farm-stand / farmers-market vendors","Tech-adjacent professionals and remote consultancies needing internal tools","Wellness, makers, and small service businesses"]}
      faqs={[{"q":"Can you build software around the Gravenstein apple harvest and our pressing schedule?","a":"Yes. Seasonal, short-window operations are exactly where custom software earns its keep. I can build an order, inventory, and scheduling tool that tracks your apple varieties, pressing batches, and lot numbers, and that handles the rush when wholesale and direct orders all land in the same few weeks. Because it's custom-coded to your actual workflow, it fits the way Sebastopol growers and cider makers really work instead of forcing you into a generic template."},{"q":"I sell at the Barlow and at farmers markets — can you connect my Square sales to inventory and bookkeeping?","a":"Absolutely. A common Sebastopol setup is a Square POS at the shop or a market stand plus separate spreadsheets for inventory and accounting. I can build automations that pull each sale into your reorder counts and bookkeeping automatically, so you stop double-entering numbers after a busy market day and always know what's actually in stock."},{"q":"Do you work on-site in Sebastopol, or is this all remote?","a":"Both. Copper Bay Tech is based in Santa Rosa, just up the road, so I can meet on-site across Sebastopol and the North Bay to see how your operation actually runs — at the orchard, the studio, or the tasting room. Most of the build work happens remotely, and you get one person to call who knows your project, not a rotating support team."},{"q":"We're a small organic-food business — is custom software overkill for us?","a":"Not the way I build it. We start with the single biggest bottleneck — maybe lot tracking, CSA sign-ups, or wholesale orders — and ship the smallest useful version first, so the cost and scope stay sized to a small Sebastopol food business. You get a tool that solves one real problem now, own the code outright, and only expand it when it's clearly paying off."}]}
      nearby={[{"href":"/software-development-santa-rosa","label":"Santa Rosa"},{"href":"/software-development-cotati","label":"Cotati"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Tell me the one task that's eating your week — I'll reply within a business day with a plain-English plan to fix it."}
    />
  );
}
