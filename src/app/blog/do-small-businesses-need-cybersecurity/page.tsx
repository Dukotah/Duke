import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Do Small Businesses Really Need Cybersecurity? | Copper Bay Tech",
  description:
    "The myth that hackers only target large companies is costing small businesses millions. Here's the truth — and what to do about it.",
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Do Small Businesses Really Need Cybersecurity?", description: "The myth that hackers only target large companies is costing small businesses millions. Here's the truth — and what to do about it.", url: "https://copperbaytech.com/blog/do-small-businesses-need-cybersecurity", datePublished: "2026-02-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Do Small Businesses Need Cybersecurity" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Cybersecurity
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Do Small Businesses Really Need Cybersecurity? (Yes, Here&apos;s Why)
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
                &quot;We&apos;re too small to be a target.&quot; It&apos;s the most dangerous sentence in small business IT. And it&apos;s wrong. Here&apos;s what the data actually shows — and what happens to businesses that find out the hard way.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The myth: hackers only target big companies
              </h2>
              <p className="mb-6">
                This belief comes from how cyberattacks are covered in the news. We hear about breaches at banks, hospitals, and Fortune 500 companies because those stories are dramatic. What doesn&apos;t make the news is the 10-person accounting firm in Santa Rosa that had its files encrypted by ransomware, or the Healdsburg boutique that had customer credit card data stolen through a compromised point-of-sale system.
              </p>
              <p className="mb-6">
                The reality: <strong>43% of cyberattacks target small businesses</strong>, according to Verizon&apos;s annual Data Breach Investigations Report. Small businesses are attacked not because they&apos;re valuable targets individually — but because they&apos;re easy targets collectively. Automated tools scan the internet looking for vulnerable systems, and they don&apos;t care how many employees you have.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                What a real attack looks like for a small business
              </h2>
              <p className="mb-6">
                Cybercrime against small businesses doesn&apos;t always look like a Hollywood hack. The most common scenarios are:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Phishing emails</strong> that trick an employee into handing over login credentials — then the attacker accesses your email, invoices, or banking.</li>
                <li><strong>Ransomware</strong> that encrypts your files and demands payment to restore them. Average ransom demanded from small businesses: $50,000–$200,000. Most businesses that pay still lose weeks of productivity.</li>
                <li><strong>Business Email Compromise (BEC)</strong>, where attackers impersonate your email to redirect wire transfers or vendor payments. This costs U.S. businesses billions annually.</li>
                <li><strong>Credential stuffing</strong>, where stolen passwords from one breach are tried against your accounts. If your employees reuse passwords, this works more often than you&apos;d think.</li>
              </ul>
              <p className="mb-6">
                The average cost of a data breach for a small business is now over $200,000. <strong>60% of small businesses close within six months of a major cyberattack.</strong> This isn&apos;t theoretical — it&apos;s well-documented.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Why small businesses are easier targets
              </h2>
              <p className="mb-6">
                Large companies have dedicated security teams, enterprise-grade tools, and incident response plans. Small businesses typically have none of those. What they do have: customer data, banking access, vendor relationships, and employees who haven&apos;t been trained to spot social engineering. That&apos;s a rich enough target for automated attacks and opportunistic criminals.
              </p>
              <p className="mb-6">
                Many small businesses also run outdated software — old versions of Windows, unpatched plugins on their websites, routers that haven&apos;t been updated since they were installed. Every unpatched vulnerability is a door left open.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Actionable steps you can take right now
              </h2>
              <p className="mb-6">
                You don&apos;t need an enterprise security budget to dramatically reduce your risk. The most impactful steps are:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Enable multi-factor authentication (MFA)</strong> on every account that supports it — email, banking, cloud storage. This blocks the vast majority of credential-based attacks.</li>
                <li><strong>Use a password manager.</strong> Get your team off &quot;password1&quot; and &quot;company2024.&quot; A password manager like Bitwarden or 1Password costs $3–$5/user/month.</li>
                <li><strong>Keep software updated.</strong> Set Windows, macOS, and all business software to update automatically. Most successful attacks exploit known vulnerabilities that patches already fixed.</li>
                <li><strong>Back up your data.</strong> Offline and cloud backups mean ransomware can&apos;t hold you hostage. (See our dedicated guide on this.)</li>
                <li><strong>Train your team.</strong> A 30-minute phishing awareness session is enough to catch most attacks. Teach people to verify wire transfer requests by phone, not just email.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Security doesn&apos;t have to be expensive
              </h2>
              <p className="mb-6">
                Foundational cybersecurity for a 5–20 person business doesn&apos;t require a six-figure budget. MFA, password management, automated backups, endpoint protection, and basic employee training can be in place for a few hundred dollars a month — often less than your monthly office supplies bill.
              </p>
              <p className="mb-6">
                The question isn&apos;t whether you can afford security. It&apos;s whether you can afford the alternative.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Small businesses are targeted constantly — they just rarely hear about it until it&apos;s too late. A few basic safeguards can block the overwhelming majority of attacks. Start with MFA, backups, and staff awareness.
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
