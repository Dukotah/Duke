import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Copper Bay Tech",
  description: "Terms governing use of the Copper Bay Tech website and free tools.",
};

const EFFECTIVE_DATE = "May 30, 2026";
const COMPANY = "Copper Bay Tech";
const EMAIL = "duke@copperbaytech.com";
const SITE = "copperbaytech.com";

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: `By accessing or using ${SITE} and any free tools provided on it, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.`,
  },
  {
    heading: "2. Use of Free Tools",
    body: `${COMPANY} provides free website audit tools (speed, SSL, SEO, broken links, mobile, and ADA checks), an IT security self-assessment, and a pricing estimator for informational purposes only.

Results from these tools are estimates and should not be relied upon as professional advice, legal compliance certification, or a guarantee of any particular outcome. For authoritative assessments, consult a qualified IT or security professional.

You agree not to use these tools to:
• Submit URLs of websites you do not own or have permission to audit
• Probe, scan, or test systems in an unauthorized manner
• Attempt to overload, disrupt, or circumvent our services or third-party APIs we use`,
  },
  {
    heading: "3. Accuracy of Information",
    body: `We strive to provide accurate information on this website, but we make no warranties — express or implied — about the completeness, accuracy, or reliability of any content, audit results, pricing estimates, or recommendations.

Pricing ranges shown in the estimator tool are rough ballparks only and do not constitute a quote or binding offer. Actual pricing is determined after a free consultation.`,
  },
  {
    heading: "4. Intellectual Property",
    body: `All content on this website — including text, design, logos, and code — is owned by ${COMPANY} and protected by applicable copyright and trademark laws. You may not reproduce, distribute, or create derivative works from our content without written permission.`,
  },
  {
    heading: "5. Third-Party Services",
    body: `Our website integrates with third-party services including:
• Google PageSpeed Insights — for website performance analysis
• Resend — for transactional email delivery
• Calendly — for meeting scheduling

Use of these services is subject to their respective terms of service and privacy policies. ${COMPANY} is not responsible for the practices of these third parties.`,
  },
  {
    heading: "6. Limitation of Liability",
    body: `To the fullest extent permitted by law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of this website or our services, even if advised of the possibility of such damages.

Our total liability to you for any claims arising out of or related to these terms shall not exceed the amount you paid us in the twelve months preceding the claim.`,
  },
  {
    heading: "7. Disclaimer of Warranties",
    body: `This website and its tools are provided "as is" and "as available" without any warranty of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.`,
  },
  {
    heading: "8. Governing Law",
    body: `These Terms of Service are governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of courts located in Sonoma County, California.`,
  },
  {
    heading: "9. Changes to Terms",
    body: `We reserve the right to modify these terms at any time. Updated terms will be posted on this page with a revised effective date. Continued use of the website after changes constitutes acceptance of the updated terms.`,
  },
  {
    heading: "10. Contact",
    body: `Questions about these terms? Contact us at ${EMAIL}.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav light />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-gold-on-light mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Legal
          </p>
          <h1
            className="text-4xl font-bold text-[#18181B] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Terms of Service
          </h1>
          <p className="text-[#3F3F46]/50 text-sm mb-12" style={{ fontFamily: "var(--font-body)" }}>
            Effective date: {EFFECTIVE_DATE}
          </p>

          <p className="text-[#3F3F46]/70 leading-relaxed mb-10" style={{ fontFamily: "var(--font-body)" }}>
            Please read these Terms of Service carefully before using the {COMPANY} website and tools.
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
            <Link href="/" className="text-sm text-gold-on-light hover:underline" style={{ fontFamily: "var(--font-heading)" }}>
              ← Back to home
            </Link>
            <Link href="/privacy" className="text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
              Privacy Policy →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
