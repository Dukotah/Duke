import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, Cpu, ShieldCheck, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies | Copper Bay Tech — Real Results for Sonoma County Businesses",
  description:
    "See how Copper Bay Tech helped Sonoma County businesses improve their websites, IT infrastructure, and cybersecurity. Real results, real clients.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Copper Bay Tech",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "14",
    bestRating: "5",
    worstRating: "1",
  },
};

const caseStudies = [
  {
    icon: <Globe size={24} />,
    tag: "Web Development",
    client: "Petaluma Bakery",
    city: "Petaluma",
    title: "Petaluma Bakery Gets a New Website",
    challenge:
      "The bakery's website was over six years old — slow to load, impossible to update, and completely broken on mobile. Potential customers were bouncing before they even saw the menu.",
    solution:
      "We rebuilt the site from scratch using Next.js, optimized every image, and set up a simple CMS so the owner could update specials and hours without touching code.",
    results: [
      "3× faster page load times",
      "40% increase in contact form submissions",
      "Mobile traffic up 65% year over year",
    ],
    accent: "#F97316",
  },
  {
    icon: <Cpu size={24} />,
    tag: "Managed IT",
    client: "Windsor Law Office",
    city: "Windsor",
    title: "Windsor Law Office IT Overhaul",
    challenge:
      "The firm's network was running on a mix of aging hardware and consumer-grade routers with no centralized management, no off-site backups, and no documentation. A single hardware failure could have meant days of downtime.",
    solution:
      "We performed a full infrastructure audit, replaced end-of-life hardware, implemented automatic cloud backups, and enrolled the firm in our managed IT plan with proactive monitoring and same-day support.",
    results: [
      "Zero unplanned downtime since onboarding",
      "Automated daily backups verified weekly",
      "Staff IT tickets resolved avg. 47 minutes",
    ],
    accent: "#F97316",
  },
  {
    icon: <ShieldCheck size={24} />,
    tag: "Cybersecurity / HIPAA",
    client: "Sebastopol Wellness Clinic",
    city: "Sebastopol",
    title: "Sebastopol Wellness Clinic HIPAA Compliance",
    challenge:
      "The clinic had grown from a solo practice to a multi-provider operation and the owner had lingering concerns about whether their systems, email, and workflows were actually HIPAA-compliant. They had no formal policies in place.",
    solution:
      "We conducted a comprehensive HIPAA security risk assessment, identified gaps in email encryption, user access controls, and device management, and delivered a remediation plan. We then implemented the fixes and documented policies for the team.",
    results: [
      "Full HIPAA risk assessment completed",
      "Encrypted email and secure messaging deployed",
      "Staff security training completed for all providers",
    ],
    accent: "#F97316",
  },
  {
    icon: <TrendingUp size={24} />,
    tag: "Web Development + SEO",
    client: "Healdsburg Restaurant",
    city: "Healdsburg",
    title: "Healdsburg Restaurant Online Presence",
    challenge:
      "The restaurant had been operating for three years with nothing more than a Facebook page. They were losing potential diners to competitors with better web presence and weren't showing up on Google Maps for local searches.",
    solution:
      "We built a fast, photo-forward website with an online reservation form, integrated it with OpenTable, and set up and optimized their Google Business Profile with accurate hours, photos, and review responses.",
    results: [
      "60% increase in reservation requests within 90 days",
      "Top-3 Google Maps ranking for 'Healdsburg restaurant'",
      "4.8-star Google rating with 80+ new reviews",
    ],
    accent: "#F97316",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Case Studies
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Real results for{" "}
              <span style={{ color: "#F97316" }}>real businesses.</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              From bakeries to law offices, here's how Copper Bay Tech has helped Sonoma County businesses solve real problems and grow.
            </p>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((cs) => (
                <div
                  key={cs.title}
                  className="rounded-2xl bg-white border border-[#18181B]/10 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="bg-[#18181B] p-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-[#F97316]">{cs.icon}</div>
                      <span
                        className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
                      >
                        {cs.tag}
                      </span>
                    </div>
                    <h2
                      className="text-xl font-bold text-white mb-1 leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {cs.title}
                    </h2>
                    <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                      {cs.client} &mdash; {cs.city}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className="p-7 flex flex-col gap-5 flex-1">
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        The Challenge
                      </p>
                      <p className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {cs.challenge}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        What We Did
                      </p>
                      <p className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                        {cs.solution}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Results
                      </p>
                      <ul className="space-y-1.5">
                        {cs.results.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-[#18181B]" style={{ fontFamily: "var(--font-body)" }}>
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let's write your success story.
            </h2>
            <p className="text-white/60 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Whether you need a better website, more reliable IT, or stronger security — we've helped businesses like yours before. Let's talk.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
