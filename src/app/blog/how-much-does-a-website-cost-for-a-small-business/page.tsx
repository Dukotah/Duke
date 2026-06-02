import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How Much Does a Website Cost for a Small Business in 2026? | Copper Bay Tech",
  description:
    "DIY, freelancer, or agency? We break down real website costs for small businesses in 2026 — and explain why the cheapest option often costs the most.",
};

export default function Article() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Web Development
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How Much Does a Website Cost for a Small Business in 2026?
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              7 min read · January 2026
            </p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                &quot;How much does a website cost?&quot; is one of the most Googled questions in small business — and one of the least honestly answered. The real answer depends on who builds it, what you need, and what &quot;cheap&quot; actually costs you over time. Here&apos;s a straight breakdown.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The three paths: DIY, freelancer, or agency
              </h2>
              <p className="mb-6">
                Most small businesses choose one of three routes. <strong>DIY platforms</strong> like Squarespace, Wix, or Shopify run $20–$60/month and give you full control — at the cost of your time and a ceiling on what&apos;s possible. <strong>Freelancers</strong> typically charge $1,500–$6,000 for a small business site, with quality varying enormously. <strong>Agencies</strong> start around $5,000 and go well into five figures for custom work, but include strategy, design, development, and usually some ongoing support.
              </p>
              <p className="mb-6">
                None of these is the &quot;right&quot; answer for everyone. The question is what your website needs to actually do for your business.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What actually drives the cost up
              </h2>
              <p className="mb-6">
                A five-page brochure site for a local plumber is a very different project than an e-commerce store with 200 products, a booking system, and email integrations. Here are the factors that move the needle most:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Custom design vs. a template.</strong> Templates save money but look like everyone else. Custom design adds $2,000–$8,000 to a project but creates something that actually reflects your brand.</li>
                <li><strong>E-commerce.</strong> Selling online adds complexity — payment processing, inventory, shipping logic, returns. Expect to add $3,000–$15,000 depending on scale.</li>
                <li><strong>Content creation.</strong> Most quotes don&apos;t include copywriting or photography. If you need both, budget another $1,000–$3,000.</li>
                <li><strong>Integrations.</strong> Connecting your site to a CRM, booking tool, or email platform takes time. Each integration adds cost.</li>
                <li><strong>Ongoing maintenance.</strong> Plugins break, security patches are needed, things change. Budget $100–$300/month for ongoing care, or plan to handle it yourself.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The real cost of going cheap
              </h2>
              <p className="mb-6">
                We see it constantly in Sonoma County: a business owner spends $800 on a website from a cut-rate freelancer on a bidding platform, and two years later they&apos;re back — frustrated that it can&apos;t be updated, isn&apos;t showing up on Google, loads slowly on mobile, or simply looks like it was built in 2015. Now they need to start over, and they&apos;ve wasted the $800 plus the opportunity cost of two years of a bad first impression.
              </p>
              <p className="mb-6">
                A cheap website isn&apos;t just an aesthetic problem. Slow sites lose visitors. Sites without proper SEO structure don&apos;t rank. Sites that aren&apos;t mobile-friendly penalize you in Google search. Sites without SSL certificates get flagged as &quot;Not Secure.&quot; These aren&apos;t cosmetic issues — they directly affect whether customers trust you and whether they find you at all.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What a reasonable budget looks like in 2026
              </h2>
              <p className="mb-6">
                For most Sonoma County small businesses — a restaurant, a contractor, a boutique, a service provider — a well-built, professionally designed website with 5–8 pages, proper SEO foundations, a contact form, and mobile optimization runs <strong>$3,500–$7,500</strong> from a quality local freelancer or small agency. That&apos;s a one-time investment. Add $150–$250/month for hosting, maintenance, and support.
              </p>
              <p className="mb-6">
                If you&apos;re in a competitive local market — wine country tourism, legal services, real estate — investing toward the higher end pays for itself quickly if the site converts even a handful of additional leads per year.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Questions to ask before hiring anyone
              </h2>
              <p className="mb-6">
                Before you sign a contract, ask these:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>Will I own the site and all its files when we&apos;re done?</li>
                <li>Will I be able to edit content myself without calling you?</li>
                <li>What does ongoing support cost, and what does it include?</li>
                <li>Can you show me examples of sites you&apos;ve built for businesses like mine?</li>
                <li>What happens to the site if I stop paying you?</li>
              </ul>
              <p className="mb-6">
                If any of those questions are answered evasively, keep looking. A good web developer has nothing to hide.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  For most small businesses, the sweet spot is $4,000–$6,000 upfront with a reasonable monthly retainer. Treat your website like a storefront, not a one-time expense — and it&apos;ll pay you back.
                </p>
              </div>
            </div>

            <div className="mt-16 rounded-2xl bg-[#18181B] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
