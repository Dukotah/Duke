import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: May 2026</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-zinc-300">
            <section>
              <h2 className="text-white text-xl font-bold mb-3">1. Who We Are</h2>
              <p className="leading-relaxed">
                Copper Bay Tech is an IT consulting, web development, and cybersecurity firm based in Petaluma, California, serving Sonoma County and the greater North Bay. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">2. Information We Collect</h2>
              <p className="leading-relaxed mb-3">We collect information in two ways:</p>
              <p className="font-semibold text-white mb-1">Information you provide directly:</p>
              <ul className="list-disc list-inside space-y-1 mb-4 text-zinc-400">
                <li>Name, business name, and email address submitted via our contact form or scheduling tool</li>
                <li>Phone number (if provided)</li>
                <li>URLs you enter into our free audit and comparison tools</li>
                <li>Messages and notes you include with inquiries</li>
              </ul>
              <p className="font-semibold text-white mb-1">Information collected automatically:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Browser type and version</li>
                <li>Pages visited and time on site</li>
                <li>Referring URL</li>
                <li>General geographic location (city/region level, not precise)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>To respond to your inquiries and consultation requests</li>
                <li>To deliver the services you&apos;ve hired us to provide</li>
                <li>To send you information you&apos;ve explicitly requested</li>
                <li>To improve our website and tools</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We do not sell, rent, or share your personal information with third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">4. Free Audit Tools</h2>
              <p className="leading-relaxed">
                Our free tools (website health checker, speed audit, competitor comparison, email header analyzer, and password checker) process the data you enter to generate results for you. URLs and email headers you submit are not stored beyond the duration of your session. Password inputs are hashed locally in your browser using SHA-1 before any data leaves your device — we never receive your actual password, only the first 5 characters of the hash, in compliance with the Have I Been Pwned k-anonymity model.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">5. Email Communications</h2>
              <p className="leading-relaxed">
                When you submit a contact form or book a consultation, we use Resend to deliver transactional emails. Your email address is used only to respond to your request. We do not add you to a mailing list without explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">6. Cookies & Analytics</h2>
              <p className="leading-relaxed">
                Our website may use minimal cookies required for functionality (such as remembering form state). We do not use advertising cookies or cross-site tracking. If we add analytics in the future, we will update this policy accordingly.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">7. Data Retention</h2>
              <p className="leading-relaxed">
                Contact form submissions and consultation requests are retained for up to 2 years for the purpose of managing ongoing client relationships. You may request deletion of your data at any time by emailing us at the address below.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">8. Your Rights (California Residents)</h2>
              <p className="leading-relaxed mb-3">Under the California Consumer Privacy Act (CCPA), you have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-zinc-400">
                <li>Know what personal information we collect and how it&apos;s used</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of the sale of your personal information (we do not sell personal information)</li>
                <li>Non-discrimination for exercising your rights</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                To exercise any of these rights, contact us at <a href="mailto:duke@copperbaytech.com" className="text-orange-400 hover:text-orange-300">duke@copperbaytech.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">9. Security</h2>
              <p className="leading-relaxed">
                We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">10. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. When we do, we&apos;ll update the &ldquo;Last updated&rdquo; date at the top. We encourage you to review this page periodically.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-bold mb-3">11. Contact</h2>
              <p className="leading-relaxed">
                Questions about this Privacy Policy? Reach us at:
              </p>
              <div className="mt-3 space-y-1 text-zinc-400">
                <p>Copper Bay Tech</p>
                <p>Petaluma, California</p>
                <p><a href="mailto:duke@copperbaytech.com" className="text-orange-400 hover:text-orange-300">duke@copperbaytech.com</a></p>
                <p><a href="tel:+17072396725" className="text-orange-400 hover:text-orange-300">(707) 239-6725</a></p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
