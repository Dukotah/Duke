import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ITQuiz from "@/components/ITQuiz";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Free IT Health Check | Copper Bay Tech | Sonoma County",
  description:
    "Take the free 2-minute IT health check. Answer a few questions and get a personalized read on where your small business stands on support, security, and risk.",
  keywords:
    "IT assessment small business, IT health check Sonoma County, free IT audit, managed IT readiness",
  alternates: { canonical: "https://copperbaytech.com/it-health-check" },
  openGraph: {
    title: "Free IT Health Check | Copper Bay Tech",
    description:
      "A free 2-minute assessment of your small business IT, support, and security posture.",
    url: "https://copperbaytech.com/it-health-check",
    siteName: "Copper Bay Tech",
  },
};

export default function ItHealthCheckPage() {
  return (
    <>
      <Nav />
      {/* No pt-16: the ITQuiz hero is dark (bg-[#18181B]) and its own py-24
          clears the fixed nav, so let it run full-bleed behind the transparent
          nav like every other dark-hero page. */}
      <main>
        <ITQuiz />
      </main>
      <Footer />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
