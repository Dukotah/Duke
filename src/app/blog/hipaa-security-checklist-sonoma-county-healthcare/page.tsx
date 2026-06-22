import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ArticleHeader from "@/components/ArticleHeader";

const blogSchema = blogPostingSchema({
  title: "HIPAA Security Checklist for Sonoma County Healthcare Practices",
  description:
    "A practical HIPAA technical security checklist for small healthcare practices in Sonoma County. What you actually need — and what most practices are missing.",
  url: "https://copperbaytech.com/blog/hipaa-security-checklist-sonoma-county-healthcare",
  datePublished: "2026-05-01",
});

export const metadata: Metadata = {
  title: "HIPAA Security Checklist for Sonoma County Healthcare Practices | Copper Bay Tech",
  description:
    "A practical HIPAA technical security checklist for small healthcare practices in Sonoma County. What you actually need — and what most practices are missing.",
  keywords: "HIPAA compliance Sonoma County, HIPAA security small practice, healthcare IT Petaluma Santa Rosa, HIPAA checklist",
  alternates: { canonical: "https://copperbaytech.com/blog/hipaa-security-checklist-sonoma-county-healthcare" },
  openGraph: {
    title: "HIPAA Security Checklist for Sonoma County Healthcare Practices",
    description:
      "A practical HIPAA technical security checklist for small healthcare practices in Sonoma County. What you actually need — and what most practices are missing.",
    url: "https://copperbaytech.com/blog/hipaa-security-checklist-sonoma-county-healthcare",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const checks = [
  {
    category: "Access Controls",
    items: [
      { label: "Unique login credentials for every staff member — no shared passwords", critical: true },
      { label: "Multi-factor authentication (MFA) on email and practice management software", critical: true },
      { label: "Automatic screen lock after 5–10 minutes of inactivity", critical: false },
      { label: "Documented process to revoke access when staff leave", critical: true },
      { label: "Role-based access — staff only see data they need for their role", critical: false },
    ],
  },
  {
    category: "Data Protection",
    items: [
      { label: "Encrypted hard drives on all computers that hold patient data", critical: true },
      { label: "Encrypted email for transmitting PHI (patient health information)", critical: true },
      { label: "Automated backups that run daily, stored offsite or in the cloud", critical: true },
      { label: "Backup restoration tested at least once in the past 12 months", critical: true },
      { label: "Business Associate Agreements (BAAs) signed with all cloud vendors", critical: false },
    ],
  },
  {
    category: "Network Security",
    items: [
      { label: "Router firmware updated in the last 12 months", critical: true },
      { label: "Separate guest Wi-Fi network — patients and visitors not on your business network", critical: false },
      { label: "Firewall enabled and configured (not just the factory default)", critical: true },
      { label: "No remote desktop access without VPN or equivalent security", critical: true },
    ],
  },
  {
    category: "Devices & Software",
    items: [
      { label: "Windows/macOS automatic updates enabled on all workstations", critical: false },
      { label: "Antivirus/endpoint protection on all devices", critical: false },
      { label: "Inventory of all devices that access patient data", critical: false },
      { label: "Policy for what happens if a device is lost or stolen", critical: true },
    ],
  },
  {
    category: "Documentation",
    items: [
      { label: "Written Security Risk Analysis on file (required by HIPAA)", critical: true },
      { label: "Security policies distributed to all staff", critical: false },
      { label: "Staff training on phishing and security basics in the last year", critical: false },
      { label: "Incident response plan — what to do if you suspect a breach", critical: true },
    ],
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "HIPAA Security Checklist Healthcare" }])} />
      <Nav />
      <main>
        <ArticleHeader tag="Cybersecurity" title="HIPAA Security Checklist for Sonoma County Healthcare Practices" date="May 1, 2026" readTime="7 min read" />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div style={{ fontFamily: "var(--font-body)" }}>
              <p className="text-lg text-zinc-400 leading-relaxed mb-4">
                HIPAA is not just a compliance checkbox — it&apos;s a minimum baseline for protecting your patients and your practice. Most small healthcare practices in Sonoma County have significant gaps, usually not from negligence but from never having had someone audit the technical side.
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 p-4 rounded-lg bg-ink-0 border border-hairline">
                <strong>Disclaimer:</strong> This checklist covers technical safeguards under the HIPAA Security Rule. It is not legal advice. For full compliance assessment including administrative and physical safeguards, consult a qualified HIPAA consultant or attorney.
              </p>

              <div className="flex items-center gap-4 mb-6 text-xs">
                <div className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#DC2626" /><span className="text-zinc-400">= Required / critical gap if missing</span></div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={14} color="#22C55E" /><span className="text-zinc-400">= Best practice</span></div>
              </div>

              {checks.map((cat) => (
                <div key={cat.category} className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>{cat.category}</h2>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-ink-0 border border-hairline">
                        <CheckCircle2 size={16} color={item.critical ? "#DC2626" : "#22C55E"} className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-400">{item.label}</span>
                        {item.critical && (
                          <span className="ml-auto text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                The most common gaps we find
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                When we run security assessments for healthcare practices in Sonoma County, these four issues come up almost every time:
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { issue: "No MFA on email", detail: "A compromised email account is the most common vector for healthcare data breaches. MFA takes 10 minutes to set up and blocks the vast majority of credential-based attacks." },
                  { issue: "Shared login credentials", detail: "Multiple staff logging in with the same username and password makes it impossible to audit who accessed what — which is itself a HIPAA violation." },
                  { issue: "Untested backups", detail: "Many practices have backups running — they just haven't tested whether those backups can actually be restored. A backup you've never tested is a backup you can't count on." },
                  { issue: "No written Security Risk Analysis", detail: "HIPAA requires a documented risk analysis. If you've never done one, you're out of compliance regardless of how good your technical controls are." },
                ].map((item) => (
                  <li key={item.issue} className="rounded-xl border border-hairline p-4 bg-ink-0">
                    <p className="text-sm font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>{item.issue}</p>
                    <p className="text-sm text-zinc-400">{item.detail}</p>
                  </li>
                ))}
              </ul>

              <div className="bg-ink-2 rounded-xl p-6 text-center">
                <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Want a hands-on security assessment for your practice?</p>
                <p className="text-white/60 text-sm mb-5">We run practical HIPAA-aligned security audits for small healthcare practices in Sonoma County. Most critical issues are fixed same day.</p>
                <Link href="/cybersecurity-small-business" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-copper hover:bg-copper-bright transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  Book a Security Audit <ArrowRight size={14} />
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
