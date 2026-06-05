import type { Metadata } from "next";
import Nav from "@/components/Nav";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ | Copper Bay Tech | Pricing, Process & Support Answers",
  description:
    "Answers to common questions about working with Copper Bay Tech — pricing, timelines, ongoing support, and what to expect from web design, IT, and security projects.",
  alternates: { canonical: "https://copperbaytech.com/faq" },
  openGraph: {
    title: "FAQ | Copper Bay Tech",
    description:
      "Common questions about pricing, timelines, and support at Copper Bay Tech.",
    url: "https://copperbaytech.com/faq",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function FaqPage() {
  return (
    <>
      <Nav light />
      <main className="pt-16">
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
