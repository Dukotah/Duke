import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema } from "@/components/JsonLd";
import { ArrowLeft, ArrowRight } from "lucide-react";

const blogSchema = blogPostingSchema({
  title:
    "The 5 Cybersecurity Threats Most Likely to Hit a Sonoma County Small Business in 2026",
  description:
    "The five cyber threats most likely to hit a Sonoma County small business this year — phishing, ransomware, weak passwords, unpatched software, and lost devices — plus what actually stops them.",
  url: "https://copperbaytech.com/blog/small-business-cybersecurity-threats-sonoma-county",
  datePublished: "2026-06-01",
});

export const metadata: Metadata = {
  title: "Small Business Cybersecurity Threats in Sonoma County (2026) | Copper Bay Tech",
  description:
    "The five cyber threats most likely to hit a Sonoma County small business this year — phishing, ransomware, weak passwords, unpatched software, and lost devices — plus what actually stops them.",
  keywords:
    "small business cybersecurity Sonoma County, ransomware protection Santa Rosa, phishing prevention Petaluma, IT security small business",
  alternates: {
    canonical:
      "https://copperbaytech.com/blog/small-business-cybersecurity-threats-sonoma-county",
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Cybersecurity
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              The 5 Cybersecurity Threats Most Likely to Hit a Sonoma County Small Business in 2026
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read · June 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-lg text-[#3F3F46]/70 leading-relaxed mb-8">
                Attackers don&apos;t skip small businesses because they&apos;re small — they target them because they&apos;re easier. A five-person office in Petaluma or Santa Rosa rarely has a dedicated security team, so the basics get missed. The good news: nearly every attack we see locally exploits one of the same five gaps, and all five are fixable without an enterprise budget.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1. Phishing emails (still the #1 way in)
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                The vast majority of breaches start with someone clicking a link or entering a password into a fake login page. Modern phishing is convincing — it copies real invoices, mimics your bank, or impersonates the owner asking an employee to buy gift cards. What stops it:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Multi-factor authentication (MFA) on email and every critical account — a stolen password becomes useless",
                  "A 10-minute habit of checking the actual sender address, not the display name",
                  "Email filtering that catches spoofed domains before they reach the inbox",
                  "A clear internal rule: nobody moves money or shares credentials based on an email alone",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                2. Ransomware and no working backup
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                Ransomware encrypts your files and demands payment to unlock them. For a small business, the real damage isn&apos;t always the ransom — it&apos;s the days of downtime and the customer data you can&apos;t recover. The single most important defense is a backup that is automatic, off-site, and tested. A backup you&apos;ve never restored from is a guess, not a safety net. If you handle patient records, this overlaps directly with the technical safeguards in our{" "}
                <Link href="/blog/hipaa-security-checklist-sonoma-county-healthcare" className="font-semibold text-[#F97316] hover:underline">
                  HIPAA security checklist
                </Link>
                .
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                3. Weak and reused passwords
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                When one password protects five accounts, one leak compromises all five. Attackers buy lists of leaked credentials and try them everywhere automatically. The fix is unglamorous but effective:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "A password manager so every account gets a unique, long password nobody has to memorize",
                  "MFA everywhere it's offered — especially banking, email, and payroll",
                  "Immediate offboarding when someone leaves: disable accounts the same day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                4. Unpatched software and forgotten devices
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                Most successful attacks use vulnerabilities that already had a fix available — the business just never installed it. That old router, the laptop running an operating system that stopped getting updates, the plugin nobody&apos;s touched in two years: each is an open door. Keeping patches current across every device is exactly the kind of routine that{" "}
                <Link href="/blog/managed-it-support-vs-break-fix-sonoma-county" className="font-semibold text-[#F97316] hover:underline">
                  managed IT support
                </Link>{" "}
                handles on a schedule, so it doesn&apos;t depend on anyone remembering.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                5. Lost or stolen laptops and phones
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                A device left in a car or forgotten at a café is a data breach waiting to happen — unless it&apos;s protected. Three settings turn a lost laptop from a disaster into a minor inconvenience:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Full-disk encryption (FileVault on Mac, BitLocker on Windows) so the data is unreadable without the password",
                  "A screen lock with a strong PIN or password on every device",
                  "Remote wipe enabled, so you can erase a missing device from anywhere",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Where to start if this feels overwhelming
              </h2>
              <p className="text-[#3F3F46]/70 leading-relaxed mb-4">
                You don&apos;t have to fix everything at once. In order of impact for most Sonoma County businesses:
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Turn on MFA for email and banking today — it's free and blocks most account takeovers",
                  "Confirm you have a backup, then actually test restoring a file from it",
                  "Roll out a password manager to the whole team",
                  "Patch or replace anything running outdated, unsupported software",
                  "Encrypt every laptop and phone that touches business data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#3F3F46]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#18181B] flex-shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-[#3F3F46]/70 leading-relaxed mb-8">
                We help small businesses across the county close these gaps — whether that&apos;s{" "}
                <Link href="/cybersecurity-small-business" className="font-semibold text-[#F97316] hover:underline">
                  cybersecurity for small business
                </Link>
                , ongoing{" "}
                <Link href="/it-support-santa-rosa" className="font-semibold text-[#F97316] hover:underline">
                  IT support in Santa Rosa
                </Link>{" "}
                and{" "}
                <Link href="/it-support-petaluma" className="font-semibold text-[#F97316] hover:underline">
                  Petaluma
                </Link>
                , or just a second opinion on where you stand.
              </p>

              <div className="bg-[#18181B] rounded-xl p-6 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Want to know which gaps you actually have?</p>
                <p className="text-white/60 text-sm mb-5" style={{ fontFamily: "var(--font-body)" }}>Free 30-minute security review — no jargon, no sales pressure. We&apos;ll tell you the three things to fix first.</p>
                <Link href="/cybersecurity-small-business" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Get a Security Review <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
