import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolDeck from "@/components/tools/ToolDeck";

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
    <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden px-6 pt-20 pb-10 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-copper/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-copper-bright">
              Free tool
            </span>
            <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl">
              Free IT Health Check
            </h1>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-zinc-400">
              A free 2-minute read on your support, security, and risk posture.
            </p>
          </div>
        </section>
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <ToolDeck initial="it-health-check" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
