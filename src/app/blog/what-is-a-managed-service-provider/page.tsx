import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "What Is a Managed Service Provider (MSP) — and Does Your Small Business Need One? | Copper Bay Tech",
  description:
    "MSP, break-fix, in-house IT — what's the difference, when does each make sense, and what should a small business in Sonoma County actually expect to pay?",
  openGraph: {
    url: "https://copperbaytech.com/blog/what-is-a-managed-service-provider",
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "What Is a Managed Service Provider (MSP) — and Does Your Small Business Need One?", description: "MSP, break-fix, in-house IT — what's the difference, when does each make sense, and what should a small business in Sonoma County actually expect to pay?", url: "https://copperbaytech.com/blog/what-is-a-managed-service-provider", datePublished: "2026-06-12" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "What Is a Managed Service Provider" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              IT Support
            </span>
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What Is a Managed Service Provider (MSP) — and Does Your Small Business Need One?
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              5 min read · June 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              If you&apos;ve started looking for IT support, you&apos;ve probably run into the term &quot;MSP&quot; without a clear explanation of what it actually means. Here&apos;s the plain-English version — and how to figure out whether your business actually needs one.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The three models: MSP, break-fix, and in-house IT
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              <strong className="text-[#18181B]">Break-fix</strong> is exactly what it sounds like: something breaks, you call someone, they fix it, you pay an hourly rate. No ongoing relationship, no proactive maintenance, no one watching your systems. It&apos;s the cheapest option until something catastrophic happens.
            </p>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              <strong className="text-[#18181B]">In-house IT</strong> means hiring a full-time employee (or two) to manage your technology. It&apos;s the right model for larger companies with complex infrastructure, but for most small businesses the cost is prohibitive — a mid-level IT person in Sonoma County runs $70,000–$95,000 per year, before benefits.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              <strong className="text-[#18181B]">A managed service provider (MSP)</strong> sits between the two. You pay a monthly retainer and get ongoing monitoring, maintenance, security updates, and support — all included. The MSP becomes your external IT department. You get predictable costs and proactive care instead of reactive fixes.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What MSPs typically cover
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "Workstation and server monitoring and maintenance",
                "Security patching and software updates",
                "Backup management and disaster recovery",
                "Help desk support for staff (email, hardware, software issues)",
                "Endpoint security and antivirus management",
                "Network monitoring and firewall management",
                "Vendor management (dealing with your ISP, software vendors, etc.)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">{item}</span>
                </li>
              ))}
            </ul>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              When it makes sense to hire an MSP
            </h2>
            <div className="space-y-4 mb-8">
              {[
                {
                  trigger: "You have 5 or more employees",
                  why: "At this size, IT issues start affecting enough people that reactive support becomes genuinely disruptive. Proactive management starts to pay for itself.",
                },
                {
                  trigger: "You're paying for reactive fixes constantly",
                  why: "If your hourly IT bills are adding up to $500–$1,500 per month or more, a flat-rate retainer often costs less and includes much more.",
                },
                {
                  trigger: "You've had a security incident",
                  why: "A breach, ransomware attack, or data loss event is a signal that reactive IT isn't keeping up with the risk. Managed services include the proactive security layer you're missing.",
                },
                {
                  trigger: "You're in a regulated industry",
                  why: "Healthcare, legal, and financial businesses have compliance requirements that are hard to meet without ongoing IT oversight. An MSP with compliance expertise makes this manageable.",
                },
              ].map(({ trigger, why }) => (
                <div
                  key={trigger}
                  className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]"
                >
                  <p
                    className="font-semibold text-[#18181B] text-sm mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {trigger}
                  </p>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{why}</p>
                </div>
              ))}
            </div>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              When it doesn&apos;t make sense
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              If you&apos;re a 1–2 person business with straightforward tech needs — a couple of laptops, a basic website, cloud-based tools — a full MSP retainer is probably overkill. Break-fix support or an occasional consultant is more cost-effective.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Similarly, if your tech is extremely simple and rarely causes problems, the overhead of a managed relationship may not be worth it yet. The right time to engage an MSP is usually just before you actually need one — not after something breaks.
            </p>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What to look for in an MSP
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "Clear, flat-rate pricing with no hidden per-ticket fees",
                "Defined response time guarantees (not just \"we'll get to it\")",
                "Local presence — someone who can be on-site when needed",
                "Experience with businesses your size, not just enterprise clients",
                "No long-term lock-in contracts",
                "A security-first approach, not just reactive support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">{item}</span>
                </li>
              ))}
            </ul>

            <h2
              className="text-2xl font-bold text-[#18181B] mt-10 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How Copper Bay Tech&apos;s model works
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              We operate differently from a traditional MSP. Traditional MSPs often use a one-size-fits-all pricing model that includes services you don&apos;t need and excludes things you do. We build flat-rate retainers around what your specific business actually requires — whether that&apos;s monitoring, security, help desk, or all three.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              We&apos;re local to Sonoma County, which means on-site support when you need it, not just remote tickets. And we don&apos;t require long-term contracts — we keep clients because the service is good, not because they&apos;re locked in.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p
                className="text-sm font-semibold mb-2 text-[#F97316]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Not sure what you actually need?
              </p>
              <p className="text-sm text-white/70">
                A free IT assessment takes 30 minutes and gives you a clear picture of where you stand — and whether managed support would actually save you money. No sales pressure, just honest answers.
              </p>
            </div>

            <p className="text-sm text-zinc-500 mt-8">
              Related:{" "}
              <Link href="/services/it-support" className="text-orange-500 hover:text-orange-600">IT Support</Link>
            </p>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free IT Assessment <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
