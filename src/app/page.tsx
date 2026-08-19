import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import WorkStrip from "@/components/WorkStrip";
import Testimonials from "@/components/Testimonials";
import ToolsTeaser from "@/components/ToolsTeaser";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import JsonLd, { localBusinessSchema, organizationSchema, websiteSchema, aggregateRatingSchema } from "@/components/JsonLd";
import { aggregateRating } from "@/lib/reviews";

/**
 * Minimal home: a focused funnel only. Supporting content lives on dedicated
 * pages so the site has depth (good for SEO) instead of one endless scroll.
 *   About        -> /about
 *   FAQ          -> /faq
 *   IT quiz      -> /it-health-check
 *   Pricing tools, comparison -> /pricing
 *   Testimonials, portfolio    -> /work
 * Keep this list short. New sections almost always belong on a sub-page.
 */
export const metadata: Metadata = {
  alternates: { canonical: "https://copperbaytech.com" },
};

export default function Home() {
  // Emits star-rating schema only once real, approved reviews exist
  // (src/lib/reviews.ts). Null until then — no fake stars in search.
  const agg = aggregateRating();
  return (
    <>
      <JsonLd schema={localBusinessSchema()} />
      <JsonLd schema={organizationSchema()} />
      <JsonLd schema={websiteSchema()} />
      {agg && <JsonLd schema={aggregateRatingSchema({ ratingValue: agg.ratingValue, reviewCount: agg.reviewCount })} />}

      {/*
        One responsive homepage for every viewport. The bespoke "molten copper"
        WebGL mobile landing (MobileLanding) was retired 2026-08 — it read as a
        high-end design agency and worked against the approachable local-tech
        positioning. The component stack below is mobile-responsive on its own
        (see Hero's text-[2.6rem] sm:* breakpoints), so phones get the same
        calm, fast page as desktop.
      */}
      <div className="theme-dark block">
        <Nav />
        <main>
          <Hero />
          <SocialProof />
          <Services />
          <Stats />
          <HowItWorks />
          <WorkStrip />
          <Testimonials />
          <ToolsTeaser />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}
