import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Copper Bay Tech",
  description: "How Copper Bay Tech collects, uses, and protects your personal information.",
};

const EFFECTIVE_DATE = "May 30, 2026";
const COMPANY = "Copper Bay Tech";
const EMAIL = "duke@copperbaytech.com";
const PHONE = "(707) 239-6725";
const SITE = "copperbaytech.com";

const sections = [
  {
    heading: "1. Information We Collect",
    body: `We collect information you provide directly to us, including:
• Contact form submissions (name, business name, email, phone, message)
• IT security self-assessment responses and your email if you request a report
• Website audit tool inputs (URLs you submit for analysis)
• Chat widget conversations and contact details you share
• Pricing estimator selections

We do not use tracking cookies, advertising pixels, or third-party analytics platforms on this website.`,
  },
  {
    heading: "2. How We Use Your Information",
    body: `We use the information collected to:
• Respond to your inquiries and provide requested services
• Send you audit reports, assessment results, or information you asked for
• Follow up on business opportunities you've expressed interest in
• Improve our website and services

We do not sell, rent, or trade your personal information to third parties. We do not use your information for advertising or marketing purposes beyond direct responses to your own inquiries.`,
  },
  {
    heading: "3. Email Communications",
    body: `When you submit a form, take the IT assessment, or request an emailed report, you may receive one or more follow-up emails from Duke at Copper Bay Tech. These are manual or automated responses to your specific request — not bulk marketing lists. You can opt out at any time by replying "unsubscribe" to any email or contacting us directly.

Transactional email is delivered via Resend (resend.com). Your email address is transmitted to Resend solely for the purpose of delivery and is governed by their privacy policy.`,
  },
  {
    heading: "4. Website Audit Tool",
    body: `When you use our free website audit tool at ${SITE}/tools, the URL you submit is sent to Google's PageSpeed Insights API (pagespeed.web.dev) for performance analysis. This is subject to Google's Privacy Policy. We do not store the URLs you submit beyond the duration of your browser session.`,
  },
  {
    heading: "5. Data Retention",
    body: `Contact form submissions and lead information are retained in our email inbox for as long as necessary to respond to your inquiry or fulfill the service requested. If you would like your information deleted, contact us at ${EMAIL} and we will remove it promptly.`,
  },
  {
    heading: "6. Security",
    body: `We take reasonable technical precautions to protect the information you provide. All data transmissions between your browser and our website are encrypted via HTTPS/TLS. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    heading: "7. Children's Privacy",
    body: `Our services are intended for business owners and professionals. We do not knowingly collect personal information from individuals under the age of 13. If we become aware that a child under 13 has submitted personal information, we will delete it promptly.`,
  },
  {
    heading: "8. California Privacy Rights (CCPA)",
    body: `If you are a California resident, you have the right to request information about the categories and specific pieces of personal information we have collected about you, and to request deletion of your personal information. To exercise these rights, contact us at ${EMAIL}.

We do not sell personal information as defined under the California Consumer Privacy Act.`,
  },
  {
    heading: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    heading: "10. Contact Us",
    body: `If you have questions about this Privacy Policy or how we handle your information, contact us:\n\n${COMPANY}\nEmail: ${EMAIL}\nPhone: ${PHONE}\nServing Sonoma County, California`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Legal
          </p>
          <h1
            className="text-4xl font-bold text-[#18181B] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-[#3F3F46]/50 text-sm mb-12" style={{ fontFamily: "var(--font-body)" }}>
            Effective date: {EFFECTIVE_DATE}
          </p>

          <p className="text-[#3F3F46]/70 leading-relaxed mb-10" style={{ fontFamily: "var(--font-body)" }}>
            {COMPANY} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates {SITE}. This Privacy Policy
            explains how we collect, use, and protect information when you visit our website or use our services.
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2
                  className="text-lg font-bold text-[#18181B] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.heading}
                </h2>
                <div className="text-[#3F3F46]/70 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-body)" }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link href="/" className="text-sm text-[#F97316] hover:underline" style={{ fontFamily: "var(--font-heading)" }}>
              ← Back to home
            </Link>
            <Link href="/terms" className="text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              Terms of Service →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
