import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | Copper Bay Tech",
  description:
    "Transparent pricing for web development, IT support, and cybersecurity services in Sonoma County. No surprises, no lock-in.",
};

const tiers = [
  {
    name: "Starter Site",
    price: "From $1,500",
    cadence: "one-time",
    description:
      "A clean, fast, mobile-friendly website for businesses that need a professional online presence without the complexity.",
    features: [
      "Up to 5 pages",
      "Custom design (no templates)",
      "Mobile-first, fast-loading",
      "Contact form",
      "Google Business Profile setup",
      "Domain & hosting guidance",
      "1 month of post-launch support",
    ],
    cta: "Get a quote",
    featured: false,
  },
  {
    name: "Business Site",
    price: "From $3,000",
    cadence: "one-time",
    description:
      "For businesses that need more — more pages, more functionality, more polish. Includes SEO foundation and integrations.",
    features: [
      "Up to 12 pages",
      "Everything in Starter",
      "Local SEO optimization",
      "Booking or e-commerce integration",
      "Blog or news section",
      "Analytics setup (GA4)",
      "3 months of post-launch support",
    ],
    cta: "Get a quote",
    featured: true,
  },
  {
    name: "IT Support",
    price: "From $350",
    cadence: "/ month",
    description:
      "Ongoing IT management for small businesses. Network, workstations, cloud, backups — handled, so you don't have to think about it.",
    features: [
      "Network monitoring & management",
      "Workstation setup & maintenance",
      "Cloud storage & backups",
      "Security updates & patching",
      "Staff support & onboarding",
      "Priority response",
      "Month-to-month, no contract",
    ],
    cta: "Talk IT support",
    featured: false,
  },
];

const addOns = [
  { name: "Security Audit", price: "From $500", desc: "One-time review of your network, devices, and software for vulnerabilities." },
  { name: "Process Automation", price: "From $750", desc: "Automate a repetitive workflow — invoicing, scheduling, reporting, etc." },
  { name: "AI Integration", price: "From $1,200", desc: "Add an AI assistant, chatbot, or automated tool to your business workflow." },
  { name: "Ongoing SEO", price: "From $200/mo", desc: "Monthly content, link-building, and technical SEO to grow organic search traffic." },
];

export default function PricingPage() {
  return (
    <main className="bg-[#FAFAF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="text-sm text-[#F97316] hover:underline mb-12 inline-block"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          ← Back to home
        </Link>

        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Straightforward pricing
          </h1>
          <p
            className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No mystery quotes. Here&apos;s what most projects run — every engagement
            gets a fixed price before work starts.
          </p>
        </div>

        {/* Main tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-8 flex flex-col ${
                tier.featured
                  ? "bg-[#18181B] text-white shadow-xl"
                  : "bg-white border border-[#18181B]/8"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                  tier.featured ? "text-[#F97316]" : "text-[#18181B]/50"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {tier.name}
              </p>
              <div className="mb-4">
                <span
                  className={`text-3xl font-bold ${tier.featured ? "text-white" : "text-[#18181B]"}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tier.price}
                </span>
                {tier.cadence && (
                  <span
                    className={`text-sm ml-1 ${tier.featured ? "text-white/50" : "text-[#3F3F46]/50"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {tier.cadence}
                  </span>
                )}
              </div>
              <p
                className={`text-sm mb-6 leading-relaxed ${
                  tier.featured ? "text-white/60" : "text-[#3F3F46]/60"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tier.description}
              </p>
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className={`mt-0.5 flex-shrink-0 ${
                        tier.featured ? "text-[#F97316]" : "text-[#18181B]"
                      }`}
                    />
                    <span
                      className={`text-sm ${tier.featured ? "text-white/80" : "text-[#3F3F46]/70"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  tier.featured
                    ? "bg-[#F97316] text-[#18181B] hover:bg-[#ea6c0a]"
                    : "bg-[#18181B] text-white hover:bg-[#0d0d0f]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h2
            className="text-2xl font-bold text-[#18181B] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Add-ons & one-time services
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="bg-white border border-[#18181B]/8 rounded-xl p-6 flex items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="font-semibold text-[#18181B]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {a.name}
                    </p>
                    <span
                      className="text-sm font-semibold text-[#F97316] ml-4 whitespace-nowrap"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {a.price}
                    </span>
                  </div>
                  <p
                    className="text-sm text-[#3F3F46]/60"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fine print / CTA */}
        <div className="bg-[#18181B] rounded-2xl p-10 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not sure what you need?
          </p>
          <h2
            className="text-2xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start with a conversation.
          </h2>
          <p
            className="text-white/60 max-w-lg mx-auto mb-6 text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Tell us what you&apos;re working with and what&apos;s frustrating you. We&apos;ll give you a
            straight answer on what would help — and what it would cost. No obligation.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get in touch
          </Link>
        </div>
      </div>
    </main>
  );
}
