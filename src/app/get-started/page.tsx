import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetStartedFunnel from "@/components/GetStartedFunnel";

export const metadata: Metadata = {
  title: "Get Started | Copper Bay Tech",
  description:
    "Tell us what you need — website, IT support, cybersecurity, or AI integration — and we'll reach out within one business day with a clear, no-pressure path forward.",
  alternates: {
    canonical: "https://copperbaytech.com/get-started",
  },
  openGraph: {
    title: "Get Started | Copper Bay Tech",
    description:
      "Tell us what you need — website, IT support, cybersecurity, or AI integration — and we'll reach out within one business day.",
    url: "https://copperbaytech.com/get-started",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function GetStartedPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Sonoma County Web &amp; IT
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let&apos;s figure out what
              <br />
              <span style={{ color: "#F97316" }}>your business actually needs.</span>
            </h1>
            <p
              className="text-white/55 text-lg max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Answer three quick questions and we&apos;ll get back to you within one business day —
              with a clear, honest take on how we can help. No fluff, no pressure.
            </p>
          </div>
        </section>

        {/* Funnel */}
        <section className="bg-[#18181B] pt-4 pb-4">
          <GetStartedFunnel />
        </section>
      </main>
      <Footer />
    </>
  );
}
