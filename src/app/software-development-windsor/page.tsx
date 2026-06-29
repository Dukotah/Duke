import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-windsor";

export const metadata: Metadata = {
  title: "Custom Software Development Windsor CA | Copper Bay Tech",
  description: "Custom web apps, internal tools, and automations built for Windsor's family-run trades, home-service crews, and Town Green shops. One accountable builder…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Windsor CA | Copper Bay Tech",
    description: "Custom web apps, internal tools, and automations built for Windsor's family-run trades, home-service crews, and Town Green shops. One accountable builder…",
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
      city="Windsor"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Windsor, CA · Custom Software"}
      heroBlurb={"Custom web apps, internal tools, and automations built for Windsor's family-run trades, home-service crews, and Town Green shops. One accountable builder, code you actually own — no no-code templates."}
      intro={["Windsor isn't a sleepy bedroom community anymore. New subdivisions off Old Redwood Highway and Shiloh Road keep filling up, which means the plumbers, electricians, HVAC techs, landscapers, and general contractors who serve those households are drowning in scheduling calls, quote requests, and invoices they're still tracking on paper or in a tangle of spreadsheets. A lot of these are second- and third-generation family businesses that grew faster than their back office, and the gap shows up as missed callbacks, double-booked crews, and jobs that slip through the cracks during the busy season.","Down on the Town Green, the picture is different but the squeeze is the same. Restaurants, the tasting rooms, the boutiques, and the Sunday farmers-market vendors are running customer waitlists, event RSVPs, and inventory by hand while competing for the same weekend foot traffic. A custom-built scheduling system, customer portal, or internal dashboard fits a Windsor operation far better than off-the-shelf software that assumes you're a 200-person company. I build the smallest useful version first, get it working for your actual crew or counter, then grow it — so you're not paying for a bloated platform you'll never fully use."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner on your project from first call to launch — you always know who to talk to","Custom-coded software, not stitched-together no-code templates","An MVP-first build: the smallest useful version live fast, then improved","You own the source code outright — no lock-in, no per-seat ransom","A reply within one business day, every time","Integrations that connect the tools you already use (QuickBooks, Stripe, scheduling, email)","Clear flat-fee or milestone pricing agreed before work starts","Hands-on training for you and your staff, plus plain-English documentation","Post-launch support so the thing keeps working as your business changes"]}
      industriesTitle={"What we build for Windsor businesses"}
      industries={["Trades and home services — plumbers, electricians, HVAC, roofing crews serving Windsor's new housing","General contractors and remodelers managing bids, change orders, and subs","Landscaping and lawn-care companies routing seasonal crews across town","Town Green restaurants, tasting rooms, and bars handling reservations and events","Family-owned retail and boutiques on and around the Town Green","Farmers-market and specialty-food vendors tracking orders and inventory","Property management and real-estate offices serving the growing residential base","Local wineries and vineyard-services businesses in the surrounding hills"]}
      faqs={[{"q":"I run a home-services business out of Windsor — can you build something that handles scheduling and quotes?","a":"Yes, that's a sweet spot. For a Windsor trades or home-service company I'll build a custom system that takes quote requests, schedules your crews so you're not double-booking, sends automatic appointment reminders to cut no-shows, and turns finished jobs into invoices without re-typing anything. We start with the one or two features that hurt most and expand from there."},{"q":"Do I have to come to an office, or do you work with Windsor businesses remotely?","a":"Both. I'm based in Santa Rosa, ten minutes down 101, so I can meet you on-site at your shop, your job trailer, or a table on the Town Green when it helps. Plenty of the work — design reviews, progress demos, support — happens remotely so we're not burning your day on meetings."},{"q":"Can you connect a new tool to the QuickBooks and software we already run?","a":"Usually, yes. Most Windsor businesses already have QuickBooks, a payment processor like Stripe or Square, and maybe a scheduling or email tool. A big part of what I do is build integrations so those systems talk to each other and stop making your staff copy data by hand between them."},{"q":"We're a small family business — is custom software actually worth it versus an off-the-shelf app?","a":"Often it is, precisely because you're small. Off-the-shelf apps charge per seat and force your business to bend to their workflow. I build the smallest useful version of exactly what your Windsor operation needs, you own the code, and there's no growing monthly per-user bill. If an off-the-shelf tool genuinely fits you better, I'll tell you that straight."}]}
      nearby={[{"href":"/software-development-santa-rosa","label":"Santa Rosa"},{"href":"/software-development-healdsburg","label":"Healdsburg"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Run a Windsor business that's outgrowing its spreadsheets? Tell me where the work piles up and I'll show you the smallest custom tool that fixes it. Reply within one business day."}
    />
  );
}
