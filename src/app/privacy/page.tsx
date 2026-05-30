import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Copper Bay Tech",
  description:
    "Privacy policy for Copper Bay Tech — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Header */}
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Legal
            </span>
            <h1
              className="text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-4 text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Last updated: May 30, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="prose prose-zinc max-w-none"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <h2 style={{ fontFamily: "var(--font-heading)" }}>1. Who We Are</h2>
              <p>
                Copper Bay Tech is an IT consulting and web development company based in Sonoma County, California. We serve small businesses throughout Sonoma County and the greater North Bay area. You can reach us at:
              </p>
              <ul>
                <li>Email: <a href="mailto:duke@copperbaytech.com" style={{ color: "#F97316" }}>duke@copperbaytech.com</a></li>
                <li>Phone: <a href="tel:+17072396725" style={{ color: "#F97316" }}>(707) 239-6725</a></li>
                <li>Website: <a href="https://copperbaytech.com" style={{ color: "#F97316" }}>copperbaytech.com</a></li>
              </ul>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>2. Information We Collect</h2>
              <p>We collect information in the following ways:</p>
              <h3 style={{ fontFamily: "var(--font-heading)" }}>Contact form submissions</h3>
              <p>
                When you fill out our contact form, we collect your name, email address, phone number (if provided), and the message you send. This information is used solely to respond to your inquiry and, with your consent, to follow up about our services.
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)" }}>Email list</h3>
              <p>
                If you opt in to our email list, we collect your name and email address. We use <strong>Resend</strong> to manage and send emails. You can unsubscribe at any time using the link at the bottom of any email we send.
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)" }}>Cookies and analytics</h3>
              <p>
                Our website may use cookies to improve your browsing experience and to understand how visitors use the site. We may use privacy-respecting analytics tools to track aggregate page views and traffic sources. These tools do not identify you personally. You can disable cookies in your browser settings at any time.
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)" }}>Automatically collected data</h3>
              <p>
                Like most websites, our server may automatically log basic technical data such as your IP address, browser type, referring URL, and pages visited. This data is used for security monitoring and to diagnose technical issues.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and provide the services you request</li>
                <li>Send you occasional emails about our services or helpful tips (only if you opt in)</li>
                <li>Improve our website and service offerings</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>
                We do not use your information for automated decision-making or profiling.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>4. We Do Not Sell Your Data</h2>
              <p>
                Copper Bay Tech does not sell, rent, trade, or otherwise transfer your personal information to third parties for marketing or commercial purposes — ever. Your data stays with us and the service providers we use to operate our business (listed below).
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>5. Third-Party Service Providers</h2>
              <p>
                We work with a small number of trusted service providers to operate our website and communicate with clients. These providers may process your data on our behalf:
              </p>
              <ul>
                <li><strong>Resend</strong> — email delivery for contact form submissions and newsletters</li>
                <li><strong>Vercel</strong> — website hosting and infrastructure</li>
              </ul>
              <p>
                Each of these providers maintains their own privacy policies and data protection practices. We choose providers that take data privacy seriously.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>6. Data Retention</h2>
              <p>
                We retain contact form submissions and email correspondence for as long as needed to maintain an accurate business record and provide ongoing service. If you request deletion of your data, we will remove it within 30 days, except where we are required to retain it for legal or accounting purposes.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>7. Your Rights</h2>
              <p>
                Depending on where you live, you may have the right to:
              </p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of email communications at any time</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at <a href="mailto:duke@copperbaytech.com" style={{ color: "#F97316" }}>duke@copperbaytech.com</a> or call <a href="tel:+17072396725" style={{ color: "#F97316" }}>(707) 239-6725</a>. We will respond within 30 days.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>8. Security</h2>
              <p>
                We take reasonable measures to protect the information you share with us. Our website uses HTTPS encryption, and we limit access to personal data to only the people who need it to do their jobs. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>9. Children's Privacy</h2>
              <p>
                Our website and services are directed at businesses and adults. We do not knowingly collect personal information from anyone under the age of 13. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. When we do, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.
              </p>

              <h2 style={{ fontFamily: "var(--font-heading)" }}>11. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or how we handle your information, please don't hesitate to get in touch:
              </p>
              <ul>
                <li>Email: <a href="mailto:duke@copperbaytech.com" style={{ color: "#F97316" }}>duke@copperbaytech.com</a></li>
                <li>Phone: <a href="tel:+17072396725" style={{ color: "#F97316" }}>(707) 239-6725</a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
