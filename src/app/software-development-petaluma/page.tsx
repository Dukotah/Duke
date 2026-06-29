import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-petaluma";

export const metadata: Metadata = {
  title: "Custom Software Development Petaluma CA | Copper Bay Tech",
  description: "Custom web apps, internal tools, and automations built for Petaluma businesses — from downtown restaurants and breweries to ag-tech startups and the small…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Petaluma CA | Copper Bay Tech",
    description: "Custom web apps, internal tools, and automations built for Petaluma businesses — from downtown restaurants and breweries to ag-tech startups and the small…",
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
      city="Petaluma"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Petaluma, CA · Custom Software"}
      heroBlurb={"Custom web apps, internal tools, and automations built for Petaluma businesses — from downtown restaurants and breweries to ag-tech startups and the small manufacturers along the river. Custom-coded, owned by you, with one accountable builder on the project."}
      intro={["Petaluma runs on a rare mix: a dairy-and-poultry heritage that earned it the \"Egg Capital\" name, a downtown of iron-front buildings packed with restaurants and retail, and a tech bench deep enough that locals still call the area Telecom Valley. That spread means the software a Petaluma business actually needs rarely comes off a shelf. A small manufacturer near Lakeville Highway tracking jobs and parts, a brewery managing taproom shifts and distribution orders, a downtown restaurant group juggling reservations and inventory across locations — each one ends up wrestling spreadsheets and a stack of disconnected apps that almost fit but never quite do.","That's the gap Copper Bay Tech fills. I build the custom tool that matches how your shop actually works instead of forcing your crew to bend around someone else's template. Based in Santa Rosa, I work on-site across Petaluma and the North Bay and remotely for the rest. The approach is plain: start with the smallest useful version that solves your most expensive daily headache, get it in your hands fast, then grow it. You own the code outright — no per-seat lock-in, no no-code platform deciding your future for you."]}
      includesTitle="Every engagement includes"
      includes={["A single accountable owner — you work directly with the person writing the code, start to finish","An MVP-first plan: the smallest useful version shipped early, then built out from real feedback","Custom-coded software, not no-code templates or rented platforms you can't change","Full source code and accounts handed to you — you own everything we build","Replies within one business day, every time","Clean integrations between the tools you already use, instead of yet another silo","Plain-English scoping and pricing — no jargon, no surprise change orders","Practical automation (including AI where it genuinely helps) for the repetitive work eating your week","Post-launch support and documentation so your team can actually run the thing"]}
      industriesTitle={"What we build for Petaluma businesses"}
      industries={["Dairy, poultry, and ag operations needing herd, flock, or production tracking beyond spreadsheets","Ag-tech and tech startups building internal dashboards, customer portals, or MVPs on a budget","Breweries, wineries, and beverage makers managing taproom scheduling, batches, and distribution","Small manufacturers and fabricators tracking jobs, inventory, and parts on the shop floor","Downtown restaurants and food businesses running reservations, online ordering, and inventory","Retail and antique shops on Petaluma Boulevard wanting real online catalogs and POS integrations","Professional services and trades automating quotes, scheduling, and client intake","Craft food and CPG producers connecting orders, fulfillment, and wholesale accounts"]}
      faqs={[{"q":"Do you work on-site with Petaluma businesses or only remotely?","a":"Both. I'm based in Santa Rosa, so Petaluma is a short drive — I'll come to your downtown storefront, taproom, or shop floor off Lakeville to see how your team actually works before writing a line of code. Most of the build happens remotely after that, and you get same-day-or-next-business-day replies throughout."},{"q":"We're a small manufacturer near the river still running on spreadsheets. Is custom software worth it for a shop our size?","a":"Usually, yes — and the point is to start small. Instead of a big rollout, I build the smallest useful version first, like a job-tracking or inventory tool that replaces the one spreadsheet causing the most rework. You see whether it pays off before investing further, and because it's custom-coded, it fits your exact process rather than forcing you into someone else's template."},{"q":"Petaluma has a real tech scene — why hire you instead of using a no-code platform?","a":"No-code tools are fine until you hit their limits, then you're stuck paying rising per-seat fees and can't change the parts that matter. I write actual code that you own outright, so the software grows with you and never holds your business hostage. For a town with Petaluma's Telecom Valley roots, owning your own stack just makes sense."},{"q":"Can you connect the different apps our restaurant or brewery already uses?","a":"That's a big part of the work. Most Petaluma food and beverage businesses I talk to have a reservation system, a POS, an accounting tool, and a distributor portal that don't talk to each other. I build the integrations and automations that move data between them automatically, so your staff stops re-keying numbers and you get one clear view of the operation."}]}
      nearby={[{"href":"/software-development-rohnert-park","label":"Rohnert Park"},{"href":"/software-development-cotati","label":"Cotati"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Got a Petaluma business problem worth solving? Tell me about it — I'll reply within one business day."}
    />
  );
}
