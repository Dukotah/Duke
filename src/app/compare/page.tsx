import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

export const metadata: Metadata = {
  title: "Website Competitor Analysis Tool | Copper Bay Tech",
  description: "Compare your website against competitors. Check speed, SSL, SEO, and mobile scores side by side — free tool from Copper Bay Tech.",
  alternates: { canonical: "https://copperbaytech.com/compare" },
  openGraph: {
    title: "Website Competitor Analysis | Copper Bay Tech",
    description: "Compare your site against competitors on speed, SSL, SEO, and mobile.",
    url: "https://copperbaytech.com/compare",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ComparePage() {
  return (
    <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-copper/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-bright">
              Free tool
            </span>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">
              Website Competitor Analysis
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              Compare your site against competitors on speed, SSL, SEO, and mobile — side by side, free.
            </p>
          </div>
        </section>
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck initial="compare" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
