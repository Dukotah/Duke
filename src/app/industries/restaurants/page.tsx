import type { Metadata } from "next";
import IndustryPage from "@/components/IndustryPage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you integrate with our existing POS system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we work with most major POS systems including Toast, Square, Clover, and Lightspeed. We'll assess your current setup and integrate where possible.",
      },
    },
    {
      "@type": "Question",
      name: "We already have a website. Can you just improve it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We'll review your current site and tell you honestly whether it needs a rebuild or just targeted improvements. You'll have a clear recommendation within 24 hours.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work on-site or remotely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. Network and hardware work is done on-site. Web development, software configuration, and many IT issues can be handled remotely.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "IT Support & Websites for Sonoma County Restaurants | Copper Bay Tech",
  description:
    "POS integrations, reservation systems, guest Wi-Fi, and websites for Sonoma County restaurants. Local IT support that shows up when you need it.",
  openGraph: {
    url: "https://copperbaytech.com/industries/restaurants",
  },
};

export default function RestaurantsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IndustryPage
      industry="Restaurants & Food Service"
      tagline="Tech that keeps your front-of-house running."
      description="From POS crashes during dinner rush to guest Wi-Fi that can't handle a full house, restaurant tech problems cost you money every time they happen. We work with Sonoma County restaurants to keep the technology invisible — so you can focus on the food."
      painPoints={[
        "POS system crashes during dinner rush",
        "Guest Wi-Fi slows to a crawl on weekends",
        "Online ordering system is clunky or broken",
        "Website doesn't show up when people search \"restaurants near me\"",
        "No IT person — you call whoever set it up years ago",
        "Staff onboarding takes forever with no documented system",
      ]}
      services={[
        {
          title: "Website & Online Ordering",
          blurb:
            "A fast, Google-optimized website with integrated online ordering that works on every device. We build it, you own it.",
        },
        {
          title: "Network & POS Support",
          blurb:
            "Reliable Wi-Fi, POS setup and troubleshooting, vendor coordination so you're never stuck on hold during service.",
        },
        {
          title: "Security & Compliance",
          blurb:
            "PCI compliance for card payments, guest network isolation, staff access controls so your data stays safe.",
        },
      ]}
      relatedPosts={[
        {
          slug: "best-website-for-a-sonoma-county-winery",
          title: "What Makes a Great Website for a Sonoma County Winery?",
          tag: "Web Development",
        },
        {
          slug: "how-to-rank-on-google-maps-local-business",
          title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
          tag: "Local SEO",
        },
        {
          slug: "5-signs-your-business-website-is-costing-you-customers",
          title: "5 Signs Your Business Website Is Costing You Customers Right Now",
          tag: "Web Development",
        },
      ]}
    />
    </>
  );
}
