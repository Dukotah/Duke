import type { Metadata } from "next";
import ServiceCityPage from "@/components/ServiceCityPage";

const CANONICAL = "https://copperbaytech.com/web-design-sebastopol";

export const metadata: Metadata = {
  title: "Web Design Sebastopol CA | Artisan, Cidery & Boutique Websites | Copper Bay Tech",
  description:
    "Custom website design for Sebastopol cideries, craft makers, galleries, wellness practitioners, and farm-to-table brands. Story-driven, design-forward sites that reflect West County's authentic, eco-conscious character. Call (707) 239-6725.",
  keywords:
    "web design Sebastopol, website design Sebastopol CA, cidery website design, The Barlow website, craft brand web design Sebastopol, small business website Sebastopol, Sonoma County web design",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Web Design for Sebastopol Businesses | Copper Bay Tech",
    description:
      "Design-forward, story-driven websites for Sebastopol cideries, makers, galleries, and wellness brands at The Barlow and beyond.",
    url: CANONICAL,
    siteName: "Copper Bay Tech",
  },
};

export default function WebDesignSebastopol() {
  return (
    <ServiceCityPage
      service="Web Design"
      city="Sebastopol"
      canonical={CANONICAL}
      hub={{ href: "/web-design-sonoma-county", label: "Web Design" }}
      heroBlurb="Story-driven, design-forward websites for Sebastopol cideries, makers, galleries, and independent brands — built to match the authentic, eco-conscious character of West County and to turn curious visitors into loyal customers."
      intro={[
        "Sebastopol has always done things its own way. The Gravenstein apple orchards that shaped this town for over a century gave way to cideries, craft beverage makers, and farm-to-table food brands that carry that same agrarian integrity into modern form. The Barlow district pulls together local artisans, winemakers, cheesemakers, brewers, and wellness practitioners under one roof — and draws the kind of destination visitor who actively seeks out authenticity over anything chain or generic. Art galleries line Sebastopol Avenue. Organic farms operate roadside stands. Yoga studios and acupuncture practices serve a community that is deeply invested in living well. If your brand belongs here, your website needs to say so within the first five seconds.",
        "The problem with off-the-shelf templates is that they flatten everything into the same mold — the same layout, the same stock photography, the same forgettable look that signals mass-produced rather than handcrafted. Sebastopol customers notice. They choose the cidery with the site that tells a real story over the one that looks like it came from a corporate franchise. We build custom, fast, mobile-first sites that reflect who you actually are: your origin story, your sourcing, your seasonal offerings, your tasting room hours, your e-commerce shop for the bottles and goods visitors want to take home. Whether you are pouring cider at The Barlow, selling handmade ceramics on the plaza, or running a wellness practice for a community that values quality of life, we make sure your online presence is as considered as everything else you do.",
      ]}
      includesTitle="What Sebastopol businesses get"
      includes={[
        "Custom-designed and coded — no Squarespace templates, no AI-generated slop",
        "Story-driven copy and layout that reflects your brand voice and local roots",
        "E-commerce for food, craft beverages, handmade goods, and gift boxes",
        "Tasting-room and appointment booking integration so visitors can plan ahead",
        "90+ Google PageSpeed score, mobile-first — your customers are browsing on their phones",
        "Local SEO wired in from the start — targeting West County and Sonoma County searches",
        "Google Business Profile setup so you show up when visitors search nearby",
        "Flat fee quoted upfront — live in 2–3 weeks, with 30 days of post-launch support",
      ]}
      industriesTitle="Who we build for in Sebastopol"
      industries={[
        "Cideries & craft beverage makers",
        "Farm-to-table restaurants & cafes",
        "Art galleries & studio artists",
        "Wellness practitioners & yoga studios",
        "Organic farms & food brands",
        "Independent boutiques & makers",
        "Event venues & The Barlow tenants",
        "Acupuncture, massage & holistic health",
      ]}
      faqs={[
        {
          q: "Can you build a site that sells cider, jam, or handmade goods online?",
          a: "Yes — e-commerce is a core part of what we build for West County makers. Whether you want to sell bottles for local pickup, ship gift boxes statewide, or offer a CSA-style seasonal subscription, we wire up a clean, fast storefront that fits your brand. We keep the checkout simple so customers who discover you at The Barlow can easily order again from home.",
        },
        {
          q: "My business has a strong in-person vibe. How do you translate that online?",
          a: "That translation is exactly where we focus most of our energy. We start with a conversation about what makes your space feel the way it does — the materials, the story, the values — and build a visual language around that. Real photography, honest copy, and a layout that does not look like a thousand other sites. The goal is for someone to land on your page and immediately understand that this place is worth visiting.",
        },
        {
          q: "Do Sebastopol customers actually find local businesses through Google?",
          a: "They do, and so do the destination visitors driving out from the Bay Area specifically to shop and eat and explore West County. We build local SEO in from the start — structured content around Sebastopol and Sonoma County search terms, proper metadata, and Google Business Profile setup. That means when someone searches for cideries near Sebastopol or farm-to-table Sebastopol CA, you have a real shot at appearing in the results.",
        },
        {
          q: "I care about sustainability — will the site itself be energy-efficient?",
          a: "Yes. Because we custom-code on lightweight, modern infrastructure rather than bloated template platforms, our sites load faster and consume fewer server resources than typical template-based sites. Fewer unnecessary scripts, no theme overhead, no plugin sprawl. A fast, lean site is also a more efficient one — which tends to matter to Sebastopol business owners.",
        },
        {
          q: "What does a website cost?",
          a: "We quote a flat fee upfront based on the scope of your site — page count, e-commerce, booking integration, and any custom features. No hourly billing, no surprise invoices. Most small-business sites land between $2,500 and $7,500. Start with a free 30-minute call and we will tell you honestly what we would build and what it would cost.",
        },
      ]}
      nearby={[
        { href: "/web-design-santa-rosa", label: "web design in Santa Rosa" },
        { href: "/industries/wineries", label: "wineries" },
        { href: "/web-design-sonoma-county", label: "all of Sonoma County" },
      ]}
    />
  );
}
