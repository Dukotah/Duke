import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Portfolio from "@/components/Portfolio";
import ToolsTeaser from "@/components/ToolsTeaser";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollCTA from "@/components/ScrollCTA";

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
        <Portfolio />
        <ToolsTeaser />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ScrollCTA />
    </>
  );
}
