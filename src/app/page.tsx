import Nav from "@/components/Nav";
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

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  description:
    "IT consulting, web development, and cybersecurity for small businesses in Sonoma County, CA.",
  url: "https://copperbaytech.com",
  telephone: "+17072396725",
  email: "hello@copperbaytech.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Petaluma",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: [
    "Petaluma, CA",
    "Santa Rosa, CA",
    "Sebastopol, CA",
    "Rohnert Park, CA",
    "Sonoma, CA",
    "Sonoma County, CA",
  ],
  serviceType: [
    "IT Consulting",
    "Web Development",
    "Cybersecurity",
    "IT Support",
  ],
  priceRange: "$$",
  sameAs: [],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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
