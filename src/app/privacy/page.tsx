import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Copper Bay Tech",
  description: "Privacy policy for Copper Bay Tech. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Privacy Policy
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Last updated: June 2026
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>

            <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
              Copper Bay Tech is a local IT consulting and web development business based in Sonoma County, CA. We take your privacy seriously and keep things simple. This page explains exactly what information we collect, how we use it, and how you can reach us with any questions.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What information we collect
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              We only collect information that you voluntarily provide to us through our contact form. This includes:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { label: "Name", desc: "So we know who we're talking to." },
                { label: "Email address", desc: "To reply to your inquiry." },
                { label: "Phone number", desc: "Optional — if you'd prefer a call." },
                { label: "Message", desc: "The details of your question or project." },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                  <span className="text-sm text-[#3F3F46]/70">
                    <strong className="text-[#18181B]">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              How we use your information
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              We use contact form submissions for one purpose only: to respond to your inquiry. That&apos;s it.
            </p>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              We will never sell, rent, or share your personal information with third parties for marketing purposes. We don&apos;t add you to any mailing lists without your explicit consent. We don&apos;t have a CRM full of leads we&apos;re blasting with newsletters.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Cookies
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              Our website may use the following cookies:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                <span className="text-sm text-[#3F3F46]/70">
                  <strong className="text-[#18181B]">Session cookies:</strong> Basic cookies required for the website to function. These expire when you close your browser.
                </span>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0" />
                <span className="text-sm text-[#3F3F46]/70">
                  <strong className="text-[#18181B]">Google Analytics:</strong> We may use Google Analytics to understand how visitors use our site (e.g., which pages are most popular, where visitors come from). This data is anonymous and aggregated — it doesn&apos;t identify you personally. You can opt out at <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#F97316] hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>.
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Data retention
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Contact form submissions are retained only as long as necessary to manage the business relationship. If you&apos;d like your information deleted, just email us and we&apos;ll take care of it promptly.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Third-party services
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              Our website is hosted on modern, secure infrastructure. We don&apos;t use third-party advertising networks or sell data to data brokers. Any third-party tools we use (such as Google Analytics) operate under their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Your rights
            </h2>
            <p className="text-[#3F3F46]/70 mb-8 leading-relaxed">
              You have the right to request a copy of any personal information we hold about you, to request its correction, or to request its deletion. California residents also have rights under the CCPA, including the right to know what personal data is collected and the right to opt out of any sale of personal data (we don&apos;t sell data, so this is straightforward).
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Contact us about privacy
            </h2>
            <p className="text-[#3F3F46]/70 mb-4 leading-relaxed">
              If you have any questions about this privacy policy or how we handle your data, please reach out directly:
            </p>
            <div className="p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Copper Bay Tech</p>
              <p className="text-sm text-white/60 mb-1">Petaluma, CA (serving all of Sonoma County)</p>
              <a href="mailto:duke@copperbaytech.com" className="text-sm text-[#F97316] hover:underline">
                duke@copperbaytech.com
              </a>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
