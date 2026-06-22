import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

export const metadata: Metadata = {
  title: "Why Sonoma County Wineries Are a Cybersecurity Target | Copper Bay Tech",
  description:
    "Wine club data, tasting room POS systems, and reservation platforms make Sonoma County wineries attractive targets. Here's what to do about it.",
  alternates: {
    canonical: "https://copperbaytech.com/blog/winery-cybersecurity-sonoma-county",
  },
  openGraph: {
    title: "Why Sonoma County Wineries Are a Cybersecurity Target | Copper Bay Tech",
    description:
      "Wine club data, tasting room POS systems, and reservation platforms make Sonoma County wineries attractive targets. Here's what to do about it.",
    url: "https://copperbaytech.com/blog/winery-cybersecurity-sonoma-county",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Why Sonoma County Wineries Are a Cybersecurity Target", description: "Wine club data, tasting room POS systems, and reservation platforms make Sonoma County wineries attractive targets. Here's what to do about it.", url: "https://copperbaytech.com/blog/winery-cybersecurity-sonoma-county", datePublished: "2026-04-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Winery Cybersecurity Sonoma County" }])} />
      <Nav />
      <main>
        <ArticleHeader tag="Cybersecurity" title="Why Sonoma County Wineries Are a Cybersecurity Target (And What to Do About It)" date="April 1, 2026" readTime="6 min read" />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                The wine industry feels like it belongs to a different era — rolling vineyards, handcrafted production, relationships built over decades. But the back office of a modern Sonoma County winery is digital infrastructure: POS terminals, wine club platforms, reservation systems, email lists, supplier networks, and financial accounts. All of it is a target.
              </p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What makes wineries attractive targets
              </h2>
              <p className="mb-6">
                Wineries hold an unusual combination of data that cybercriminals find valuable:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Wine club member data.</strong> A mid-sized Sonoma County winery might have 500–5,000 wine club members with stored credit card numbers, shipping addresses, and purchase history. That&apos;s a ready-made dataset for fraud.</li>
                <li><strong>Tasting room POS systems.</strong> High-volume card transactions during tourist season mean payment data is flowing constantly. An unsecured POS network is a direct path to payment card theft.</li>
                <li><strong>Reservation and event systems.</strong> Tasting appointments and event bookings hold contact information, and these systems are often third-party platforms with varying security standards.</li>
                <li><strong>Supplier and distributor relationships.</strong> Wineries communicate regularly with suppliers, distributors, and retailers by email. Business Email Compromise (BEC) attacks exploit these trusted relationships to redirect payments.</li>
              </ul>
              <p className="mb-6">
                Add to this that many family-owned wineries run lean operations without dedicated IT staff, and the picture becomes clear: valuable data, limited defenses.
              </p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The attacks that actually happen
              </h2>
              <p className="mb-6">
                The threat isn&apos;t hypothetical. Agricultural and food production businesses — including wineries — have seen a significant increase in targeted ransomware attacks. Here&apos;s what the real scenarios look like:
              </p>
              <p className="mb-6">
                <strong>Ransomware before harvest.</strong> Timing matters enormously in winemaking. An attack that encrypts your production records, lab data, or shipping logistics during crush can cost far more than the ransom — and the reputational damage of delayed allocations to restaurant and retail accounts is lasting.
              </p>
              <p className="mb-6">
                <strong>Wire transfer fraud.</strong> An email from a &quot;vendor&quot; requests updated banking information for an invoice payment. The email looks legitimate — it may have come from a compromised account you&apos;ve corresponded with for years. The money moves before anyone realizes it was fraud.
              </p>
              <p className="mb-6">
                <strong>Payment skimming.</strong> Malware installed on a tasting room POS silently copies card data for weeks before it&apos;s detected. The breach isn&apos;t discovered until customers start reporting fraudulent charges.
              </p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Securing your tasting room
              </h2>
              <p className="mb-6">
                The tasting room is where risk and volume intersect. Practical steps:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Separate your networks.</strong> Your POS terminals should be on a network completely isolated from your office computers, guest WiFi, and staff personal devices.</li>
                <li><strong>Use a PCI-compliant payment processor.</strong> Your payment system should be certified under PCI DSS (Payment Card Industry Data Security Standards). Ask your processor directly if you&apos;re not sure.</li>
                <li><strong>Restrict physical access.</strong> POS terminals should only be accessible to staff who need them. Shared login credentials are a compliance risk and a security one.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Protecting wine club member data
              </h2>
              <p className="mb-6">
                Your wine club members trusted you with their payment information and home addresses. That&apos;s a relationship worth protecting — and a legal obligation under California&apos;s Consumer Privacy Act (CCPA).
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>Never store credit card numbers in spreadsheets or email. Use a wine club platform with proper encryption and access controls.</li>
                <li>Enable multi-factor authentication on any system that stores member data.</li>
                <li>Know who in your organization has access to member data and ensure it&apos;s limited to those who need it.</li>
                <li>Have a plan for what you&apos;d do if there were a breach — including how you&apos;d notify affected members.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The three things to do this week
              </h2>
              <p className="mb-6">
                If you&apos;re a winery owner reading this and you&apos;re not sure where your biggest exposures are, start here:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Enable MFA on your email accounts.</strong> Email is the entry point for most attacks. Protecting it with a second factor blocks the majority of credential-based attacks.</li>
                <li><strong>Verify your backup situation.</strong> Do you have a current backup of your wine club data, production records, and financial files that isn&apos;t connected to your main network? If not, that&apos;s priority one.</li>
                <li><strong>Call your IT contact or find one.</strong> A 30-minute conversation with a local IT professional who understands the wine industry&apos;s specific risks is worth more than a generic security checklist.</li>
              </ul>

              <div className="mt-12 p-6 rounded-2xl bg-ink-0 border border-hairline">
                <p className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-zinc-400">
                  Sonoma County wineries hold valuable data and are often underprotected. The specific risks — POS data, wine club member records, supplier payment fraud — are manageable with the right safeguards. Don&apos;t wait for an incident to find out where your gaps are.
                </p>
              </div>
            </div>

            <div className="mt-16 rounded-2xl bg-ink-2 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-copper hover:bg-copper-bright transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
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
