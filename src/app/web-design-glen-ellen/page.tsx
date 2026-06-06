import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-glen-ellen";

export const metadata: Metadata = {
  title: "Web Design Glen Ellen CA | Boutique Winery & Inn Websites | Copper Bay Tech",
  description:
    "Story-driven website design for Glen Ellen boutique wineries, inns, and restaurants in the Valley of the Moon. Heritage-rich, mobile-first sites built to earn tasting reservations and wine-club members. Call (707) 239-6725.",
  keywords:
    "web design Glen Ellen, website design Glen Ellen CA, boutique winery website Glen Ellen, Valley of the Moon web design, Jack London wine country website, inn website Glen Ellen, Sonoma Valley web design",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Glen Ellen Businesses | Copper Bay Tech",
    description:
      "Heritage-forward, story-driven websites for Glen Ellen boutique wineries, inns, and restaurants in the Valley of the Moon.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignGlenEllen() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Glen Ellen"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Story-driven, heritage-forward websites for Glen Ellen's boutique wineries, rustic-luxury inns, and celebrated restaurants — built to match the intimacy of the Valley of the Moon and to turn curious visitors into confirmed reservations."
      intro={[
        "Glen Ellen is a place people arrive at on purpose. They came because they read about Jack London, because a sommelier recommended a small family winery tucked off Arnold Drive, or because they wanted the Valley of the Moon without the crowds of the Sonoma Plaza. This is not a tourist trap — it is a curated destination for visitors who already know what they are looking for. Your website has to honor that intentionality. A generic template with stock photography of grapevines does not earn the trust of a guest who has done their research; a beautifully crafted, story-led site that reflects the real character of your place does.",
        "The businesses that thrive in Glen Ellen share a common quality: a sense of place so specific and genuine that people plan their entire day around a single visit. Your website should do the same work. We design and build sites that open with that story — the estate history, the winemaker's philosophy, the innkeeper who restored a century-old Victorian — and then make it effortless to book a tasting, reserve a room, or join a wine club. Because Glen Ellen draws discerning, research-driven visitors, mobile performance and refined imagery matter as much as the copy. We deliver all of it at a flat, upfront fee.",
      ]}
      includesTitle="What Glen Ellen businesses get"
      includes={[
        "Custom-coded design — no off-the-shelf themes, no template shorthand",
        "Story-first layout that leads with heritage and place before any hard sell",
        "Tasting reservation and wine-club integration (Tock, Commerce7, direct booking)",
        "Inn and vacation-rental booking setup (Lodgify, Cloudbeds, or direct calendar)",
        "90+ Google PageSpeed score — fast even on a slow signal on Warm Springs Road",
        "Local SEO for Valley of the Moon and Sonoma Valley search terms",
        "Refined, high-resolution image presentation that respects your photography investment",
        "Flat fee quoted upfront — live in 2–3 weeks, 30 days of post-launch support included",
      ]}
      industriesTitle="Who we build for in Glen Ellen"
      industries={[
        "Boutique & family-owned wineries",
        "Rustic-luxury inns & B&Bs",
        "Farm-to-table restaurants",
        "Vacation rental estates",
        "Art studios & galleries",
        "Equestrian & outdoor experiences",
        "Specialty olive oil & food producers",
        "Event & elopement venues",
      ]}
      faqs={[
        {
          q: "My winery is tiny and family-owned. Do I actually need a custom site, or will a template do?",
          a: "In Glen Ellen, the intimacy and authenticity of your operation is the selling point — and a generic template undercuts it before a visitor reads a single word. The guests who seek out a small Valley-of-the-Moon producer over a famous Napa estate are exactly the guests who will notice that your site looks like every other Squarespace winery in California. A custom-built site lets the design itself signal that yours is a place worth the drive. It does not have to be expensive: our flat-fee projects start at $2,500 for straightforward brochure sites.",
        },
        {
          q: "Can you connect the site to our tasting reservation system and wine-club signup?",
          a: "Yes. We integrate directly with the platforms Glen Ellen wineries and hospitality businesses actually use — Tock for tasting reservations, Commerce7 or WineDirect for wine-club and DTC sales, and direct booking calendars for inn and vacation-rental stays. The goal is to let a visitor go from your homepage to a confirmed reservation in a single seamless flow, without bouncing through a third-party page that looks nothing like your brand.",
        },
        {
          q: "Most of our visitors come from out of the area and are browsing on their phones. Does that change how you build the site?",
          a: "It is the starting point of how we build every site. A guest sitting at home in San Francisco planning a Valley-of-the-Moon weekend, or standing on Arnold Drive deciding whether to walk in, is looking at your site on a phone. We build mobile-first — your imagery, navigation, and booking flow are designed for a small screen first and then scaled up to desktop, not the other way around. We also optimize load times so the site is fast even on the marginal cell coverage common in the Sonoma Valley hills.",
        },
        {
          q: "We lean heavily into the Jack London and Valley of the Moon history in our marketing. Can the site reflect that heritage without feeling like a museum?",
          a: "That is the exact balance we aim for. Heritage is a genuine differentiator in Glen Ellen — guests choose this valley partly for the literary and agricultural history woven into the landscape. We design sites where that story is woven into the visual and copy hierarchy: in an opening section that sets the scene, in section headings and image captions that reference your estate's own history, and in a tone that feels literate and warm rather than promotional. The result is a site that earns emotional buy-in before it ever asks someone to book.",
        },
        {
          q: "What does a website cost?",
          a: "We quote a flat fee upfront — no hourly billing and no surprise invoices. Most Glen Ellen small-business sites land between $2,500 and $7,500 depending on page count, photography work, and features like booking integration or wine-club e-commerce. Start with a free 30-minute call and we will tell you honestly what we would build and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/web-design-sonoma", label: "web design in Sonoma" },
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
