import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Industries from "@/components/Industries";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import ITQuiz from "@/components/ITQuiz";
import Testimonials from "@/components/Testimonials";
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
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <Problem />
        <Services />
        <Stats />
        <Industries />
        <HowItWorks />
        <WhyUs />
        <ITQuiz />
        <Testimonials />
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
