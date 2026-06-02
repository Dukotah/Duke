import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Message Received | Copper Bay Tech",
  description: "Thanks for reaching out. Duke will be in touch within one business day.",
  robots: { index: false, follow: false },
};

const nextSteps = [
  "Duke reviews every message personally — no VA, no auto-response scripts.",
  "Expect a reply within one business day, usually same day.",
  "The intro call is 30 minutes, no-pressure, and free.",
];

export default function ThankYou() {
  return (
    <>
      <Nav />
      <main>
        <section className="min-h-screen flex items-center justify-center bg-[#18181B] pt-16">
          <div className="max-w-xl mx-auto px-6 text-center py-24">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: "rgba(249,115,22,0.15)" }}
            >
              <CheckCircle2 size={40} color="#F97316" />
            </div>

            <span
              className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "#F97316", border: "1px solid rgba(200,169,110,0.3)", fontFamily: "var(--font-heading)" }}
            >
              Message Received
            </span>

            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              You&apos;re on Duke&apos;s radar.
            </h1>

            <p
              className="text-lg text-white/60 mb-12 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Your message came through. Here&apos;s what happens next:
            </p>

            <div className="space-y-4 mb-12 text-left">
              {nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                  <span
                    className="w-7 h-7 rounded-full bg-[#F97316]/20 text-[#F97316] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-base font-semibold text-white transition-colors"
                style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
              >
                Call / Text Now
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-base font-semibold transition-colors"
                style={{ border: "2px solid rgba(255,255,255,0.2)", color: "white", fontFamily: "var(--font-heading)" }}
              >
                Back to Home <ArrowRight size={15} />
              </Link>
            </div>

            <p className="mt-10 text-xs text-white/30" style={{ fontFamily: "var(--font-body)" }}>
              Can&apos;t wait? Email directly at{" "}
              <a href="mailto:contact@copperbaytech.com" className="underline hover:text-white/50 transition-colors">
                contact@copperbaytech.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
