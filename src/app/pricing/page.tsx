import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingEstimator from "@/components/PricingEstimator";

export const metadata: Metadata = {
  title: "Pricing & Estimates | Copper Bay Tech",
  description:
    "Get a rough ballpark for your website, IT support, cybersecurity, or custom app project. 4 quick questions, no email required. Flat-fee proposals after a free consultation.",
  openGraph: {
    title: "Pricing & Estimates — Copper Bay Tech",
    description: "4 questions. Instant ballpark. No email required.",
    url: "https://copperbaytech.com/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Nav />

      <section className="pt-32 pb-4 px-6 text-center bg-[#18181B]">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Transparent Pricing
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What might{" "}
            <span className="text-orange-400">it cost?</span>
          </h1>
          <p
            className="text-zinc-400 text-lg max-w-xl mx-auto pb-16"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Answer 4 quick questions and get a rough ballpark — no email required.
            We always provide a flat-fee proposal after a free consultation.
          </p>
        </div>
      </section>

      {/* PricingEstimator renders its own section padding */}
      <PricingEstimator />

      {/* Tier overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold text-[#18181B] text-center mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What&apos;s included at each tier
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                tier: "Foundation",
                range: "$1,500 – $4,000",
                items: ["Custom website", "Mobile-first design", "Local SEO setup", "Domain + hosting", "Google Business Profile"],
              },
              {
                tier: "Core Operations",
                range: "$800 – $2,500 / mo",
                items: ["Network management", "Cloud migration", "Workflow automation", "AI integrations", "Staff support"],
                featured: true,
              },
              {
                tier: "Security & Dev",
                range: "$600 – $12,000+",
                items: ["Cybersecurity audit", "Infrastructure hardening", "Custom web apps", "HIPAA / PCI baseline", "Incident planning"],
              },
            ].map(t => (
              <div
                key={t.tier}
                className={`rounded-xl p-6 ${t.featured ? "bg-[#18181B] text-white" : "bg-[#FAFAF9] border border-[#18181B]/8"}`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-widest mb-1 ${t.featured ? "text-orange-400" : "text-[#18181B]/50"}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.tier}
                </p>
                <p
                  className={`text-xl font-bold mb-4 ${t.featured ? "text-white" : "text-[#18181B]"}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.range}
                </p>
                <ul className="space-y-2">
                  {t.items.map(item => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${t.featured ? "text-white/70" : "text-[#3F3F46]/60"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.featured ? "bg-orange-400" : "bg-[#18181B]"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p
            className="text-center text-sm text-[#3F3F46]/50 mt-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            All pricing is flat-fee — no hourly billing surprises. Final quote provided after a free consultation.
          </p>
          <div className="text-center mt-6">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
