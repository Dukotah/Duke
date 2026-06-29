import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/software-development-glen-ellen";

export const metadata: Metadata = {
  title: "Custom Software Development Glen Ellen CA | Copper Bay Tech",
  description: "Custom-coded web apps, internal tools, and automations for Glen Ellen's boutique wineries, inns, and restaurants. One accountable founder builds it, you…",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Custom Software Development Glen Ellen CA | Copper Bay Tech",
    description: "Custom-coded web apps, internal tools, and automations for Glen Ellen's boutique wineries, inns, and restaurants. One accountable founder builds it, you…",
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
      city="Glen Ellen"
      canonical={CANONICAL}
      hub={{ href: "/software-development", label: "Custom Software" }}
      heroEyebrow={"Glen Ellen, CA · Custom Software"}
      heroBlurb={"Custom-coded web apps, internal tools, and automations for Glen Ellen's boutique wineries, inns, and restaurants. One accountable founder builds it, you own the code, and the smallest useful version ships first."}
      intro={["Glen Ellen runs on small operators with outsized reputations: a 12-room inn off Arnold Drive, a tasting room that pours by appointment, a restaurant that turns over on Jack London State Historic Park foot traffic. The work is real, but the back office is usually a tangle of a reservations widget, a separate POS, a wine-club spreadsheet, and a shared inbox nobody fully trusts. When a busy October weekend hits, double-booked tastings and a guest who emailed three days ago and never heard back are what actually cost you money. Off-the-shelf tools each solve one slice and refuse to talk to each other, so a person ends up retyping the same booking into four screens.","That's the gap custom software closes for a village this size. Most Glen Ellen businesses don't need a sprawling enterprise platform; they need one tool that fits how their specific operation runs and connects the pieces they already pay for. A small winery wants its allocation list, club shipments, and pickup-party RSVPs in one place. An inn wants its booking calendar, housekeeping schedule, and the local-recommendations packet it emails every guest to stop living in separate apps. Because everything is custom-coded rather than stitched from no-code templates, it bends to your seasonality, your tasting-by-appointment rhythm, and the seasonal staff who need to learn it in an afternoon. You work with one person start to finish, get a reply within one business day, and own the code outright."]}
      includesTitle="Every engagement includes"
      includes={["One accountable owner on your project from first call to launch — no handoffs to a junior team","A smallest-useful-version-first (MVP) build so you see something real in weeks, not quarters","Custom-coded software, not a no-code template you'll outgrow or get locked into","Full ownership of the code and your data — it's yours to keep, host, and extend","Integrations that connect the tools you already use instead of replacing all of them","Plain-English scoping and progress updates, written for a non-technical owner","Replies within one business day throughout the engagement","Training and documentation so your seasonal staff can run it without you","Practical, optional AI only where it genuinely saves time — never bolted on for hype"]}
      industriesTitle={"What we build for Glen Ellen businesses"}
      industries={["Boutique wineries and tasting rooms — allocation lists, wine-club shipments, and by-appointment tasting bookings","Inns, B&Bs, and short-term rentals — reservations, housekeeping schedules, and automated guest welcome packets","Restaurants and cafes — reservations, online ordering, and staff scheduling tied to weekend tourism swings","Jack London-driven tourism and tours — ticketing, group bookings, and event RSVP tracking","Specialty food, olive oil, and farm producers — order forms, pickup scheduling, and inventory tracking","Event venues and private dinners — quote-to-booking workflows and deposit tracking for weddings and tastings","Local retail and gift shops — simple e-commerce and inventory synced to in-person sales","Vineyard and hospitality services — crew scheduling, work logs, and supplier coordination tools"]}
      faqs={[{"q":"I run a small Glen Ellen winery that pours by appointment. Can you build something that handles tasting bookings without a big platform?","a":"Yes. A by-appointment tasting room doesn't need an enterprise reservations suite — it needs a booking tool shaped to your slots, party-size limits, and club-member perks. I'll build the smallest useful version first: a clean booking page, a calendar your staff can actually read, and automatic confirmation and reminder emails so weekend no-shows drop. From there we can add wine-club pickup RSVPs or allocation lists if you want them, all in one tool you own."},{"q":"My inn near Jack London State Historic Park uses three different apps that don't talk to each other. Can custom software fix that?","a":"That's one of the most common asks I hear from North Bay hospitality operators. Instead of replacing everything at once, I build a layer that connects what you already use — your booking calendar, your guest emails, your housekeeping schedule — so a new reservation flows through without anyone retyping it. We start with the integration that's costing you the most time and expand from there. You stay in control, and you own the result."},{"q":"Do you work on-site in Glen Ellen, or is this all remote?","a":"Both. I'm based in Santa Rosa, just up Highway 12, so I can meet on-site across Sonoma County and the North Bay when it helps — walking your tasting room or inn front desk often surfaces things a call won't. Most of the build happens remotely, and I work with clients nationwide the same way. For Glen Ellen businesses, in-person kickoff and training are easy to arrange."},{"q":"We're seasonal and our staff turns over. Will a custom tool be too complicated to keep running?","a":"It's built the opposite way. Because the software is made for your specific workflow rather than a generic template, there's nothing extra to learn — it does what your operation actually does. I include plain-English documentation and a training session so a seasonal hire can pick it up in an afternoon, and you can reach me with a reply within one business day if something comes up during a busy tourism stretch."}]}
      nearby={[{"href":"/software-development-sonoma","label":"Sonoma"},{"href":"/software-development-santa-rosa","label":"Santa Rosa"},{"href":"/software-development","label":"Custom software across Sonoma County"}]}
      ctaBlurb={"Run a Glen Ellen winery, inn, or restaurant and tired of apps that don't talk to each other? Let's scope the smallest useful tool that fixes it — reply within one business day."}
    />
  );
}
