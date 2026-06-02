import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import ToolsTeaser from "@/components/ToolsTeaser";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StickyCTA from "@/components/StickyCTA";
import JsonLd, { localBusinessSchema } from "@/components/JsonLd";

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
export default function Home() {
  return (
    <>
      <JsonLd schema={localBusinessSchema()} />
      <Nav />
      <main id="main-content">
        <Hero />
        <SocialProof />
        <Services />
        <HowItWorks />
        <ToolsTeaser />
        <Contact />
      </main>
      <Footer />
      {/* Spacer so the fixed mobile action bar never covers footer content. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <ChatWidget />
      <StickyCTA />
    </>
  );
}
