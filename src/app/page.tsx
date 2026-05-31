import Nav from "@/components/Nav";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import ITQuiz from "@/components/ITQuiz";
import CaseStudies from "@/components/CaseStudies";
import PricingEstimator from "@/components/PricingEstimator";
import ToolsTeaser from "@/components/ToolsTeaser";
import FAQ from "@/components/FAQ";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Services />
        <HowItWorks />
        <ITQuiz />
        <CaseStudies />
        <PricingEstimator />
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
