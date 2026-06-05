import type { Metadata } from "next";
import Nav from "@/components/Nav";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | Copper Bay Tech | Sonoma County IT & Web",
  description:
    "Who we are and how we work: a Sonoma County technology partner for web design, IT support, and cybersecurity. Flat-fee, no jargon, local.",
  alternates: { canonical: "https://copperbaytech.com/about" },
  openGraph: {
    title: "About | Copper Bay Tech",
    description:
      "A Sonoma County technology partner for web design, IT support, and cybersecurity.",
    url: "https://copperbaytech.com/about",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <>
      <Nav light />
      <main className="pt-16">
        <About />
        <Contact />
      </main>
      <Footer />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
