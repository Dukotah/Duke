import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-guerneville";

export const metadata: Metadata = {
  title: "Custom Software Development Guerneville CA | Copper Bay Tech",
  description: "Custom web apps, booking systems, and internal tools built for Guerneville's river-season businesses — from vacation rentals and resorts to canoe…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Guerneville CA | Copper Bay Tech",
    description: "Custom web apps, booking systems, and internal tools built for Guerneville's river-season businesses — from vacation rentals and resorts to canoe…",
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
      city="Guerneville"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Guerneville, CA · Custom Software"}
      heroBlurb={"Custom web apps, booking systems, and internal tools built for Guerneville's river-season businesses — from vacation rentals and resorts to canoe outfitters and event hosts. Built by one accountable owner, not a no-code template."}
      intro={["Guerneville runs on a calendar most software ignores. Memorial Day through the leaf-peeping weeks, the town swells with Russian River visitors, Lazy Bear Week and Women's Weekend crowds, and wine-country day-trippers headed for Armstrong Redwoods or Korbel — then it goes quiet. Off-the-shelf tools assume steady, year-round demand, so they leave river-town owners overbooking in July, hand-keying the same reservation into three systems, and losing the slow-season hours to spreadsheets. Custom software fits the season you actually have: it can throttle availability around peak weekends, gate inventory on river conditions, and automate the reminder-and-deposit flow that keeps a fully-booked summer from turning into a phone-tag mess.","There's also the part of Guerneville life no national platform plans for: the Russian River floods, weekends sell out months ahead, and a single property might be a cabin rental, an event venue, and a beach-day rental all at once. Whether you run a vacation-rental portfolio, a resort or inn, a canoe-and-kayak outfit, or a downtown shop that lives or dies by the tourist calendar, a purpose-built app can connect the booking calendar, the cleaning and turnover crew, the deposit payments, and the guest messaging into one system you actually own. I build the smallest useful version first so you see it working before the season hits, and you keep the code."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner on your project from first call to launch — not a handoff chain","A discovery call where we map your actual workflow before writing any code","Custom-coded software, not stitched-together no-code templates you'll outgrow","An MVP-first build: the smallest useful version shipped fast, then improved","Clean integrations between the tools you already use (booking, payments, email, accounting)","Mobile-friendly interfaces that work on a phone from the dock, the front desk, or a cabin","You own all the code and the accounts — no lock-in, no held hostage","Replies within one business day, every time","Plain-English documentation and a walkthrough so your team can actually run it"]}
      industriesTitle={"What we build for Guerneville businesses"}
      industries={["Vacation rentals and cabin-portfolio owners juggling multi-platform calendars","Resorts, inns, and lodges managing peak-weekend booking and deposits","Canoe, kayak, and river-recreation outfitters with day-rental scheduling","Restaurants, bars, and cafes riding the seasonal tourist surge","Event and wedding venues hosting weekends like Lazy Bear and Women's Weekend","Wineries and tasting rooms near Korbel handling reservations and club orders","Downtown retail and outdoor-gear shops with seasonal inventory swings","Cleaning, turnover, and property-management crews coordinating same-day flips"]}
      faqs={[{"q":"I run a Russian River vacation rental. Can you build something that handles peak-weekend demand and turnover better than the big platforms?","a":"Yes. I build custom booking and operations tools that fit how river-town rentals actually work — capping availability around sold-out weekends, automating deposits and damage holds, and pushing each booking straight to your cleaning and turnover crew so a busy July doesn't turn into hand-keyed chaos. It can sit alongside or replace the national platforms, and you own it."},{"q":"My business is basically dead in winter and slammed all summer. Is custom software worth it for a seasonal Guerneville operation?","a":"That's exactly when it pays off. A custom tool can throttle bookings around your real peak weeks, collect deposits up front, and run the off-season on autopilot so you're not paying for steady-state software you only use four months a year. I build MVP-first, so you get a working version before the river season starts."},{"q":"Can you account for things like river conditions or flood closures in a booking system?","a":"Yes — that's the advantage of custom over off-the-shelf. For a canoe outfitter or beach rental, I can gate availability on conditions, block dates fast when the Russian River runs high or closes, and automatically notify booked guests with rebooking options instead of you fielding a hundred calls."},{"q":"Do I have to be in Guerneville to work with you, and will you understand a small river-town operation?","a":"I'm based in Santa Rosa, just down River Road, so I know the Guerneville season firsthand and can meet on-site across the North Bay. I also work remotely with businesses nationwide. Either way you get one owner on the project who replies within one business day — built for a small operation, not a corporate IT department."}]}
      nearby={[{"href":"/software-development-sebastopol","label":"Sebastopol"},{"href":"/software-development-healdsburg","label":"Healdsburg"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Run a Guerneville business that lives by the river calendar? Let's build the tool that fits your season — reply within one business day."}
    />
  );
}
