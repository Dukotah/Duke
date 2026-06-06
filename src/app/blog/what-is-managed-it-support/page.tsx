import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "lucide-react";

const blogSchema = blogPostingSchema({
  title: "What Is Managed IT Support — and Does Your Business Need It?",
  description:
    "Break/fix IT is reactive and unpredictable. Managed IT support is proactive and flat-fee. Here's how to know which model is right for your business.",
  url: "https://copperbaytech.com/blog/what-is-managed-it-support",
  datePublished: "2026-02-01",
});

export const metadata: Metadata = {
  title: "What Is Managed IT Support — and Does Your Business Need It? | Copper Bay Tech",
  description:
    "Break/fix IT is reactive and unpredictable. Managed IT support is proactive and flat-fee. Here's how to know which model is right for your business.",
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "What Is Managed IT Support" }])} />
      <JsonLd schema={faqSchema([
        { q: "What does managed IT support include?", a: "Managed IT support typically includes network monitoring and management, workstation support, cloud services management, security updates, and a helpdesk for staff. The exact scope varies by provider." },
        { q: "How is managed IT support different from calling an IT person when something breaks?", a: "Break-fix IT is reactive — you call when something goes wrong and pay hourly. Managed IT support is proactive — your provider monitors your systems, catches issues early, and handles routine maintenance for a flat monthly fee." },
        { q: "Is managed IT support worth it for a small business?", a: "For businesses that rely on their technology daily (most do), managed IT pays for itself by preventing costly downtime, data loss, and security incidents. It also replaces unpredictable hourly bills with a predictable monthly cost." },
        { q: "How much does managed IT support cost per month?", a: "Most managed IT providers charge $75–$150 per user per month. A 5-person office might pay $500–$750/month for full managed IT support, compared to $150–$300/hour for emergency break-fix calls." },
      ])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              IT Support
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              What Is Managed IT Support — and Does Your Business Need It?
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              6 min read · February 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                Most small businesses run IT the same way they handle a leaky pipe: ignore it until it becomes a crisis, then call someone to fix it and pay whatever it costs. There&apos;s a better way — and it&apos;s predictable, proactive, and often cheaper in the long run.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Break/fix IT: the old model
              </h2>
              <p className="mb-6">
                Break/fix is exactly what it sounds like. Something breaks, you call someone, they fix it, you pay an hourly rate. No ongoing relationship, no monitoring, no proactive work. It feels low-commitment — you only pay when you need something.
              </p>
              <p className="mb-6">
                The problem is the math. Hourly IT rates typically run $125–$250/hour. When a server goes down or ransomware hits, you&apos;re not looking at one hour — you&apos;re looking at a day or more of emergency work at premium rates, plus the cost of downtime itself. For a business doing $500,000 a year in revenue, a single day of downtime can cost $2,000–$5,000 in lost productivity and sales, before you&apos;ve paid a single dollar to the IT company.
              </p>
              <p className="mb-6">
                Break/fix also has a subtle misalignment of incentives. The IT company makes more money when things break more often. That&apos;s not a great foundation for a long-term relationship.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What managed IT support actually means
              </h2>
              <p className="mb-6">
                A Managed Service Provider (MSP) charges a flat monthly fee — typically per user or per device — and in return takes ongoing responsibility for your IT environment. What that usually includes:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Remote monitoring.</strong> Your devices and network are monitored 24/7. Problems are often caught and fixed before you notice them.</li>
                <li><strong>Patch management.</strong> Software and security updates are applied automatically on a schedule.</li>
                <li><strong>Helpdesk support.</strong> Your team can call or submit a ticket when something goes wrong — covered under the flat fee, not billed hourly.</li>
                <li><strong>Security tools.</strong> Antivirus, endpoint detection, DNS filtering, and sometimes email security are included or bundled.</li>
                <li><strong>Strategic guidance.</strong> A good MSP will tell you when hardware is aging out, when a software decision is risky, or when your setup has gaps — before they become emergencies.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What does managed IT cost?
              </h2>
              <p className="mb-6">
                Pricing varies by scope and location, but for small businesses in the North Bay, managed IT typically runs <strong>$100–$200 per user per month</strong> for a comprehensive plan. A 10-person business might pay $1,200–$1,800/month.
              </p>
              <p className="mb-6">
                That sounds significant — until you compare it to a single bad month of break/fix. One ransomware incident, one failed server, one data recovery situation can easily cost $5,000–$20,000. The math changes quickly.
              </p>
              <p className="mb-6">
                It&apos;s also worth noting that the flat-fee model makes budgeting much easier. You know exactly what IT costs every month, rather than getting surprise invoices that blow your budget.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Who managed IT is (and isn&apos;t) right for
              </h2>
              <p className="mb-6">
                Managed IT makes the most sense when:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>You have 5+ employees relying on computers to work</li>
                <li>Downtime would meaningfully hurt your business</li>
                <li>You handle customer data, financial records, or health information</li>
                <li>You don&apos;t have (or want to have) an internal IT person</li>
                <li>You&apos;re tired of unpredictable IT bills</li>
              </ul>
              <p className="mb-6">
                If you&apos;re a solo operator with a laptop and a G Suite account, break/fix or even self-managed IT is probably fine. But once you have a team, shared files, a server or cloud infrastructure, and customer data — the risk profile changes and managed support starts to pay for itself.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What to look for in an MSP
              </h2>
              <p className="mb-6">
                Not all managed IT providers are the same. Ask prospective partners:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>What&apos;s included in the flat fee — and what costs extra?</li>
                <li>What&apos;s the response time guarantee for different issue types?</li>
                <li>Do you have local staff who can come on-site if needed?</li>
                <li>How do you handle security incidents?</li>
                <li>What does the onboarding process look like?</li>
              </ul>
              <p className="mb-6">
                A trustworthy MSP will answer all of these clearly and put them in writing.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Break/fix IT is reactive, unpredictable, and misaligned with your interests. Managed IT support is proactive, predictable, and gives you a real partner instead of a vendor you only talk to when things go wrong.
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-500 mt-8">
              Related:{" "}
              <Link href="/services/it-support" className="text-orange-500 hover:text-orange-600">IT Support</Link>
            </p>

            <div className="mt-16 rounded-2xl bg-[#18181B] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#18181B] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                { q: "What does managed IT support include?", a: "Managed IT support typically includes network monitoring and management, workstation support, cloud services management, security updates, and a helpdesk for staff. The exact scope varies by provider." },
                { q: "How is managed IT support different from calling an IT person when something breaks?", a: "Break-fix IT is reactive — you call when something goes wrong and pay hourly. Managed IT support is proactive — your provider monitors your systems, catches issues early, and handles routine maintenance for a flat monthly fee." },
                { q: "Is managed IT support worth it for a small business?", a: "For businesses that rely on their technology daily (most do), managed IT pays for itself by preventing costly downtime, data loss, and security incidents. It also replaces unpredictable hourly bills with a predictable monthly cost." },
                { q: "How much does managed IT support cost per month?", a: "Most managed IT providers charge $75–$150 per user per month. A 5-person office might pay $500–$750/month for full managed IT support, compared to $150–$300/hour for emergency break-fix calls." },
              ].map((item) => (
                <div key={item.q} className="border border-[#18181B]/10 rounded-xl p-6 bg-white">
                  <p className="text-base font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <span className="text-[#F97316] mr-2">Q.</span>{item.q}
                  </p>
                  <p className="text-sm text-[#3F3F46]/70 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Interested in managed IT support for your business?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              We offer flat-fee, month-to-month IT support for Sonoma County small businesses. No contracts, no ticket queues.
            </p>
            <Link href="/it-support-sonoma-county" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              See How It Works <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
