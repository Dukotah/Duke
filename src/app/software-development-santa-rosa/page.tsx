import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-santa-rosa";

export const metadata: Metadata = {
  title: "Custom Software Development Santa Rosa CA | Copper Bay Tech",
  description: "Custom-coded web apps, internal tools, and automations for Santa Rosa businesses — from Railroad Square shops to professional firms and the medical…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Santa Rosa CA | Copper Bay Tech",
    description: "Custom-coded web apps, internal tools, and automations for Santa Rosa businesses — from Railroad Square shops to professional firms and the medical…",
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
      city="Santa Rosa"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Santa Rosa, CA · Custom Software"}
      heroBlurb={"Custom-coded web apps, internal tools, and automations for Santa Rosa businesses — from Railroad Square shops to professional firms and the medical practices that orbit Kaiser and Sutter. One accountable owner, an MVP-first build, and code you actually own."}
      intro={["Santa Rosa is the engine room of Sonoma County — the county seat, the biggest city in the North Bay, and the place where healthcare networks, county government, retail, and professional services all set up shop. That mix produces a very particular software problem: a lot of local businesses are big enough to have real operational complexity but too lean to carry an in-house dev team. So the front-desk staff at a Montgomery Drive clinic re-types patient intake into three systems, a Coddingtown retailer reconciles online and in-store inventory by hand, and a professional firm near the courthouse runs its whole pipeline out of a shared spreadsheet that breaks every time someone sorts a column. None of these are problems off-the-shelf SaaS solves cleanly, because each shop runs a little differently than the next.","That's the gap I build into. I'm a founder-led shop based right here in Santa Rosa — I work on-site across the North Bay and remotely nationwide — and I write custom software instead of stapling together no-code templates that buckle the moment your process changes. For a lot of Sonoma County operators that means a scheduling or customer-portal tool that finally fits how their team actually works, an integration that makes QuickBooks, their booking system, and their CRM talk to each other, or a practical AI automation that kills an hour of daily copy-paste. I start with the smallest useful version, get it into your hands fast, and you own every line when we're done."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner on your project from first call to launch — you always know who to text","A fixed-scope first build: we ship the smallest useful version, then improve from real use","Custom-coded software, not no-code templates that break when your process changes","You own the code and the accounts outright — no lock-in, no per-seat ransom","Plain-English progress updates, not jargon, and a reply within one business day","Integrations that connect the tools you already run (QuickBooks, Stripe, your CRM, booking, email)","Practical AI and automation only where it removes real busywork — never bolted on for show","Hosting, deployment, and a clear handoff doc so the next person can pick it up","Post-launch support and a roadmap for what to build next, at your pace"]}
      industriesTitle={"What we build for Santa Rosa businesses"}
      industries={["Healthcare and medical practices — intake, scheduling, and patient-portal tools around the Kaiser/Sutter ecosystem","Professional services — law, accounting, and consulting firms near the county courthouse and downtown","Wine-adjacent businesses — vendors, logistics, tasting-room ops, and DTC fulfillment serving Sonoma County wineries","Retail and e-commerce — Coddingtown, Montgomery Village, and Railroad Square shops syncing in-store and online inventory","Trades and home services — HVAC, electrical, and contractors managing crews, quotes, and dispatch across the North Bay","Hospitality and tourism — hotels, event venues, and tour operators handling bookings and group scheduling","Nonprofits and county-adjacent organizations — grant tracking, case management, and reporting workflows","Real estate and property management — listing pipelines, tenant portals, and maintenance request tracking"]}
      faqs={[{"q":"Do you work on-site with Santa Rosa businesses or only remotely?","a":"Both. I'm based in Santa Rosa, so for local work I'll come to you anywhere in the North Bay — Santa Rosa, Petaluma, Windsor, Healdsburg, Rohnert Park — to watch how your team actually works before I build anything. For the build itself I work remotely, the same way I serve clients nationwide, and you get a reply within one business day either way."},{"q":"Can you build software that works with the systems a medical or professional practice already uses?","a":"Yes. A lot of Santa Rosa work is integration work — getting your scheduling, intake, billing, and CRM tools to talk to each other so staff stop re-typing the same data into three screens. I build the connective tissue around the systems you already run rather than forcing you to rip everything out. For regulated workflows like healthcare, I scope security and data-handling up front so it fits how your practice has to operate."},{"q":"We're a small wine-adjacent business — is custom software overkill for us?","a":"Not the way I do it. I start with the smallest useful version — maybe just the one tasting-room booking or DTC fulfillment headache that's costing you hours every week — ship that fast, and only build more once it's earning its keep. You're not signing up for a giant system on day one, and because it's custom-coded to your process, it actually fits the seasonal, allocation-heavy way Sonoma County wine businesses run."},{"q":"What does 'we own the code' actually mean for my business?","a":"It means the software, the source code, and the accounts it runs on are yours — not rented from me or trapped in some no-code platform's subscription. If you ever want to bring on another developer or take it fully in-house, everything hands off cleanly with documentation. You're buying an asset, not renting a dependency."}]}
      nearby={[{"href":"/software-development-rohnert-park","label":"Rohnert Park"},{"href":"/software-development-windsor","label":"Windsor"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Got a Santa Rosa business and a process that should be software? Tell me the headache — I reply within one business day."}
    />
  );
}
