import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-rohnert-park";

export const metadata: Metadata = {
  title: "Custom Software Development Rohnert Park CA | Copper Bay Tech",
  description: "Custom web apps, internal tools, and automations for Rohnert Park businesses — from SSU-adjacent student services to the retail centers along the 101 and…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Rohnert Park CA | Copper Bay Tech",
    description: "Custom web apps, internal tools, and automations for Rohnert Park businesses — from SSU-adjacent student services to the retail centers along the 101 and…",
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
      city="Rohnert Park"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Rohnert Park, CA · Custom Software"}
      heroBlurb={"Custom web apps, internal tools, and automations for Rohnert Park businesses — from SSU-adjacent student services to the retail centers along the 101 and the hospitality boom around Graton. Founder-led, custom-coded, one accountable owner per project."}
      intro={["Rohnert Park runs on a few engines at once: Sonoma State University and the student population that fills its apartments and storefronts, the Graton Resort & Casino and the hospitality and service jobs orbiting it, and the dense ring of retail and chain commerce along Redwood Drive and Commerce Boulevard. That mix creates software problems most off-the-shelf tools handle badly. A student-services business has wild September-to-June demand swings and a customer base that turns over every year. A shop in one of the big centers is juggling foot traffic, online orders, and a roster of part-timers on shifting schedules. A vendor or contractor feeding the casino-and-tourism economy is drowning in spreadsheets that were never meant to scale.","I build the smallest useful version first — the one tool or web app that removes your biggest daily headache — and grow it from there, so you are not paying for features you will never touch. That might be a booking and scheduling system tuned to the academic calendar, an internal dashboard that pulls your point-of-sale and online numbers into one screen, a customer portal for a multi-location retailer, or an automation that stops your team from re-typing the same data between QuickBooks, your scheduler, and your email. It is custom-coded and yours to keep — not a no-code template you rent forever — and you work directly with me, not a handoff chain. I'm in Santa Rosa, ten minutes up the 101, and I reply within one business day."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner — you work directly with me, start to finish, not a rotating support queue","A smallest-useful-version-first (MVP) build so you get something working fast and only pay to grow what earns its keep","Custom-coded software, not no-code templates you rent forever","You own the code and the data outright — full handoff, no lock-in","Replies within one business day, every business day","Plain-English scoping and progress updates — no jargon, no surprise invoices","Clean integrations between the tools you already run (POS, QuickBooks, scheduling, email, payments)","Practical AI only where it actually saves time — no hype features bolted on for show","Testing, deployment, and a clear plan for who maintains it after launch"]}
      industriesTitle={"What we build for Rohnert Park businesses"}
      industries={["Student-driven services near Sonoma State — tutoring, fitness studios, food and delivery, off-campus housing and property management","Retail and chain commerce along Redwood Drive and Commerce Boulevard — multi-location inventory, online ordering, staff scheduling","Hospitality and service vendors tied to Graton Resort & Casino tourism and events","Restaurants, cafes, and quick-serve spots managing student-heavy, seasonal demand","Property managers and landlords handling high tenant turnover and maintenance requests","Light manufacturing and trades along the 101 corridor and Sonoma Mountain Village","Health, wellness, and clinics serving students, families, and commuters","Professional services and contractors needing custom dashboards and workflow automation"]}
      faqs={[{"q":"Can you build software that handles Rohnert Park's student-season demand swings?","a":"Yes — that's exactly the kind of thing custom software is good at. A business serving the Sonoma State crowd sees demand spike from late August through spring and drop off over summer. I can build scheduling, booking, and staffing tools that flex with the academic calendar instead of fighting it, plus reporting that lets you compare the busy and slow stretches honestly so you staff and stock to match."},{"q":"Do you work with businesses connected to Graton Resort & Casino?","a":"Absolutely. A lot of Rohnert Park firms — caterers, suppliers, cleaning and maintenance crews, transport, event and hospitality vendors — feed the casino-and-tourism economy and end up running it all on spreadsheets and texts. I build internal tools, customer portals, and automations that track jobs, schedules, and invoicing in one place so nothing falls through the cracks when volume spikes around events."},{"q":"I run a shop in one of the retail centers off the 101. Can you connect my online and in-store sales?","a":"Yes. For Rohnert Park retailers I commonly build a single dashboard that pulls point-of-sale, online orders, and inventory into one screen, so you're not reconciling three systems by hand. If you have more than one location, I can roll them up together and add automations that flag low stock or reorder before you sell out."},{"q":"Why hire a local developer instead of using a no-code template?","a":"No-code tools are fine until your business does something specific — and Rohnert Park businesses almost always do, between the academic calendar, multi-location retail, and casino-adjacent work. Templates make you bend your process to fit them, charge rent forever, and you never own the result. I custom-code it to your actual workflow, you own the code, and I'm a ten-minute drive up the 101 in Santa Rosa with a one-business-day reply guarantee."}]}
      nearby={[{"href":"/software-development-cotati","label":"Cotati"},{"href":"/software-development-santa-rosa","label":"Santa Rosa"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Have a Rohnert Park business with a workflow that's outgrowing its spreadsheets? Tell me the one task eating your week — I'll reply within one business day with a straight answer on the smallest useful version to build first."}
    />
  );
}
