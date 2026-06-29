import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-cotati";

export const metadata: Metadata = {
  title: "Custom Software Development Cotati CA | Copper Bay Tech",
  description: "Custom-coded web apps, internal tools, and automations for Cotati's restaurants, service businesses, and the people who keep La Plaza humming. One founder…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Cotati CA | Copper Bay Tech",
    description: "Custom-coded web apps, internal tools, and automations for Cotati's restaurants, service businesses, and the people who keep La Plaza humming. One founder…",
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
      city="Cotati"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Cotati, CA · Custom Software"}
      heroBlurb={"Custom-coded web apps, internal tools, and automations for Cotati's restaurants, service businesses, and the people who keep La Plaza humming. One founder builds it, owns it, and answers within a business day."}
      intro={["Cotati is a small town that punches above its weight. You've got the hexagonal La Plaza Park, a music scene that traces back to The Inn of the Beginning, the Accordion Festival that fills downtown every August, and a steady stream of Sonoma State students and faculty spilling over the line from Rohnert Park. The businesses here are mostly owner-run: the restaurant on Old Redwood Highway, the festival vendor, the contractor working homes off East Cotati Avenue, the studio teaching music a block from the plaza. They run lean, and they don't have an IT department.","That's exactly who I build for. I'm Duke, a local software developer in Santa Rosa, and I write custom software for small businesses that have outgrown spreadsheets, sticky notes, and a tangle of apps that don't talk to each other. Instead of forcing your shop into a no-code template, I build the smallest useful version of the tool you actually need, get it working for your real workflow, then grow it from there. You own the code outright, and you deal with one accountable person the whole way through, not a rotating support queue."]}
      includesTitle="Every engagement includes"
      includes={["A discovery call where we map your actual workflow before any code gets written","A build-the-smallest-useful-version-first (MVP) plan so you see value fast, not a year later","Custom-coded software written for your business, not a no-code template you'll outgrow","One accountable owner on your project from first call to launch and beyond","Replies within one business day, every business day","Full ownership of the source code and your data, with no lock-in","Clear, jargon-free updates you can actually follow as a non-technical owner","Integrations that connect the tools you already use so data stops being re-typed","Practical, optional AI where it genuinely saves time, never bolted on for hype"]}
      industriesTitle={"What we build for Cotati businesses"}
      industries={["Cotati restaurants and cafes near La Plaza needing online ordering, reservations, or staff scheduling tools","Music venues, studios, and instructors managing lessons, bookings, and recurring billing","Accordion Festival and event vendors needing ticketing, vendor sign-ups, or registration portals","Local service businesses (contractors, landscapers, home services) wanting quoting, scheduling, and job-tracking apps","Retail and specialty shops downtown needing inventory, customer portals, or e-commerce that fits their workflow","Sonoma State-adjacent ventures and student-run businesses needing affordable custom web apps","Wellness, fitness, and personal-care studios automating intake, class booking, and reminders","Nonprofits and community groups around Cotati managing members, volunteers, and donations"]}
      faqs={[{"q":"Do you work with small businesses right here in Cotati, or just bigger companies?","a":"Small businesses are the whole point. Most of my clients are owner-run shops, restaurants, and service businesses, the kind you find around La Plaza Park and along Old Redwood Highway. I start with the smallest useful version of a tool so a one- or two-person operation can afford it and actually use it, then we grow from there."},{"q":"Can you build something to handle vendor sign-ups and ticketing for an event like the Cotati Accordion Festival?","a":"Yes. Event tooling is a good fit for custom software: vendor application forms, booth assignments, ticket sales, volunteer scheduling, and a simple dashboard so organizers see everything in one place. Whether it's the Accordion Festival, a concert series, or a smaller community event, I build it around how your event actually runs instead of forcing you into generic event-platform fees."},{"q":"I'm a Cotati restaurant owner using three different apps that don't talk to each other. Can you fix that?","a":"That's one of the most common problems I solve. I can build a custom tool that ties your ordering, scheduling, and customer info together, or write integrations so the apps you already use share data automatically instead of you re-typing it. The goal is one place to look instead of three tabs and a paper notebook."},{"q":"Are you local, and can you meet in person?","a":"I'm based in Santa Rosa, just up 101, so Cotati is right in my backyard. I can meet on-site across the North Bay and I work remotely for everything else. Either way you get a reply within one business day and one accountable person for the whole project."}]}
      nearby={[{"href":"/software-development-rohnert-park","label":"Rohnert Park"},{"href":"/software-development-petaluma","label":"Petaluma"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Got a Cotati business outgrowing spreadsheets and mismatched apps? Let's map it out. Reply and you'll hear back within one business day."}
    />
  );
}
