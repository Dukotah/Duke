import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

export const metadata: Metadata = {
  title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business? | Copper Bay Tech",
  description:
    "An honest comparison of Google Workspace and Microsoft 365 for small businesses — pricing, features, and who should use which.",
  alternates: {
    canonical: "https://copperbaytech.com/blog/google-workspace-vs-microsoft-365-small-business",
  },
  openGraph: {
    title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business? | Copper Bay Tech",
    description:
      "An honest comparison of Google Workspace and Microsoft 365 for small businesses — pricing, features, and who should use which.",
    url: "https://copperbaytech.com/blog/google-workspace-vs-microsoft-365-small-business",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const googlePros = [
  "Easier to use — most employees already know Gmail and Google Docs",
  "Real-time collaboration built in from the ground up (Docs, Sheets, Slides)",
  "Works entirely in the browser — no software to install or update",
  "Simpler admin console — easier to manage a small team",
  "Slightly cheaper at the entry tier ($6/user/month for Business Starter)",
];

const googleCons = [
  "Google Docs/Sheets aren't 100% compatible with complex Excel or Word files",
  "Offline access works but isn't as seamless as desktop apps",
  "Some industries have compliance concerns about Google's data handling",
];

const microsoftPros = [
  "Full desktop versions of Word, Excel, PowerPoint, and Outlook",
  "Better for complex spreadsheets and documents (advanced Excel features)",
  "More familiar to employees who've used Office for years",
  "Strong compliance and regulatory controls (HIPAA, FERPA, etc.)",
  "Better integration with Windows-based infrastructure",
];

const microsoftCons = [
  "More complex to set up and manage",
  "More expensive at higher tiers ($12.50–$22/user/month for Business plans)",
  "Desktop apps require installation and regular updates",
  "SharePoint can be confusing for small teams",
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business?", description: "An honest comparison of Google Workspace and Microsoft 365 for small businesses — pricing, features, and who should use which.", url: "https://copperbaytech.com/blog/google-workspace-vs-microsoft-365-small-business", datePublished: "2026-06-05" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Google Workspace vs Microsoft 365" }])} />
      <Nav />
      <main>
        <ArticleHeader tag="IT Support" title="Google Workspace vs Microsoft 365: Which Is Right for Your Small Business?" date="June 1, 2026" readTime="5 min read" />

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              This is one of the most common questions we hear from small businesses setting up their first real IT infrastructure: Google Workspace or Microsoft 365? Both are solid, both work — the right choice depends on how your team works, not which brand sounds better.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              Here&apos;s an honest breakdown of each, including pricing as of 2026.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Google Workspace
            </h2>
            <p className="text-[#3F3F46]/60 text-sm mb-6">$6–$18/user/month</p>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Google Workspace (formerly G Suite) includes Gmail, Google Drive, Docs, Sheets, Slides, Meet, and Calendar. Everything is browser-based, which means no software to install and real-time collaboration that actually works.
            </p>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>What Google Workspace does well:</h3>
            <ul className="space-y-2 mb-6">
              {googlePros.map((pro) => (
                <li key={pro} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Where it falls short:</h3>
            <ul className="space-y-2 mb-10">
              {googleCons.map((con) => (
                <li key={con} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#18181B]/30 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Microsoft 365
            </h2>
            <p className="text-[#3F3F46]/60 text-sm mb-6">$6–$22/user/month</p>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Microsoft 365 (formerly Office 365) includes Outlook, Word, Excel, PowerPoint, Teams, SharePoint, and OneDrive. The Business plans include full desktop app installs on up to 5 devices per user.
            </p>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>What Microsoft 365 does well:</h3>
            <ul className="space-y-2 mb-6">
              {microsoftPros.map((pro) => (
                <li key={pro} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Where it falls short:</h3>
            <ul className="space-y-2 mb-10">
              {microsoftCons.map((con) => (
                <li key={con} className="flex items-start gap-3 text-sm text-[#3F3F46]/70">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#18181B]/30 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Who should use which?
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                <p className="font-bold text-[#18181B] mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>Choose Google Workspace if:</p>
                <ul className="space-y-2">
                  {[
                    "Your team collaborates heavily on shared documents",
                    "You want the simplest possible setup and admin",
                    "Your employees mostly work in a browser already",
                    "You're a startup or small team starting fresh",
                  ].map((item) => (
                    <li key={item} className="text-xs text-[#3F3F46]/70 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                <p className="font-bold text-[#18181B] mb-3 text-sm" style={{ fontFamily: "var(--font-heading)" }}>Choose Microsoft 365 if:</p>
                <ul className="space-y-2">
                  {[
                    "Your team relies on advanced Excel or Word features",
                    "You're in a regulated industry (healthcare, legal, finance)",
                    "You have Windows-heavy infrastructure",
                    "Your employees are already deeply familiar with Office",
                  ].map((item) => (
                    <li key={item} className="text-xs text-[#3F3F46]/70 flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Migration doesn&apos;t have to be painful
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Whichever direction you choose, migrating email, files, and user accounts from your old setup is the hardest part. Migrating from Gmail to Outlook (or vice versa) involves more nuance than most guides let on — especially if you have years of email history, shared drives, or calendars to preserve. Getting it wrong means lost data or days of disruption. Getting it right means you&apos;re up and running in a day.
            </p>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Not sure which to pick?</p>
              <p className="text-sm text-white/70 mb-4">
                We&apos;ll help you decide based on your team&apos;s actual workflows — and handle the migration so nothing gets lost.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                We&apos;ll help you migrate <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Free IT Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
