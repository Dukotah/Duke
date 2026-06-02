import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import ITQuiz from "@/components/ITQuiz";
import CaseStudies from "@/components/CaseStudies";
import PricingEstimator from "@/components/PricingEstimator";
import PricingTeaser from "@/components/PricingTeaser";
import ToolsTeaser from "@/components/ToolsTeaser";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import StickyCTA from "@/components/StickyCTA";
import JsonLd, { localBusinessSchema } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd schema={localBusinessSchema()} />
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Services />
        <Testimonials />
        <HowItWorks />
        <ITQuiz />
        <CaseStudies />
        <PricingEstimator />
        <PricingTeaser />
        <ToolsTeaser />
        <FAQ />
        <About />
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
