import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Copper Bay Tech",
  description: "Privacy Policy for Copper Bay Tech — how we collect, use, and protect your information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">
      <Link
        href="/"
        className="text-sm text-[#F97316] hover:underline mb-8 inline-block"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        ← Back to home
      </Link>

      <h1
        className="text-4xl font-bold text-[#18181B] mb-4"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm text-[#3F3F46]/60 mb-12" style={{ fontFamily: "var(--font-body)" }}>
        Last updated: May 30, 2026
      </p>

      <div
        className="prose prose-zinc max-w-none text-[#3F3F46]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          1. Who We Are
        </h2>
        <p>
          Copper Bay Tech is an IT consulting and web development firm serving businesses in Sonoma
          County, California. You can reach us at{" "}
          <a href="mailto:contact@copperbaytech.com" className="text-[#F97316] hover:underline">
            contact@copperbaytech.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          2. Information We Collect
        </h2>
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your name</li>
          <li>Business name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Any message content you submit through our contact form</li>
        </ul>
        <p className="mt-4">
          We also collect basic usage data through our website (such as pages visited) to understand
          how visitors use our site. We do not use tracking cookies for advertising.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          3. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Respond to your inquiries and provide requested services</li>
          <li>Send follow-up communications related to your project or inquiry</li>
          <li>Improve our website and services</li>
        </ul>
        <p className="mt-4">
          We do not sell, rent, or share your personal information with third parties for marketing
          purposes.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          4. How We Store Your Information
        </h2>
        <p>
          Contact form submissions are transmitted via email to our team. We retain this
          correspondence for as long as necessary to fulfill the purposes outlined in this policy or
          as required by law.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          5. Your Rights
        </h2>
        <p>
          You may request to access, correct, or delete any personal information we hold about you
          at any time by contacting us at{" "}
          <a href="mailto:contact@copperbaytech.com" className="text-[#F97316] hover:underline">
            contact@copperbaytech.com
          </a>
          . We will respond within a reasonable timeframe.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          6. Third-Party Services
        </h2>
        <p>
          Our site may use third-party services (such as email delivery providers) to process
          contact form submissions. These providers are used solely to deliver messages to us and
          are not permitted to use your information for other purposes.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          7. Children&apos;s Privacy
        </h2>
        <p>
          Our services are not directed to children under 13. We do not knowingly collect personal
          information from children.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          8. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last
          updated&quot; date at the top of this page. Continued use of our site after changes constitutes
          acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-semibold text-[#18181B] mt-10 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
          9. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:contact@copperbaytech.com" className="text-[#F97316] hover:underline">
            contact@copperbaytech.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
