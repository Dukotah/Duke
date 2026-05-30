import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import AssessmentTeaser from "@/components/AssessmentTeaser";
import CaseStudies from "@/components/CaseStudies";
import PricingTeaser from "@/components/PricingTeaser";
import ToolsTeaser from "@/components/ToolsTeaser";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Services />
        <HowItWorks />
        <AssessmentTeaser />
        <CaseStudies />
        <PricingTeaser />
        <ToolsTeaser />
        <FAQ />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
