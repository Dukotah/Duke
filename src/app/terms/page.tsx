import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Copper Bay Tech",
  description:
    "Terms governing your use of the Copper Bay Tech website and free tools. Read before using the site.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#FAFAF9] min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-12 bg-white border-b border-[#18181B]/10">
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Legal
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
            >
              Terms of Service
            </h1>
            <p
              className="text-sm"
              style={{ color: "#3F3F46", fontFamily: "var(--font-body)", opacity: 0.6 }}
            >
              Last updated: May 31, 2026
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <div
              className="space-y-10 text-base leading-relaxed"
              style={{ color: "#3F3F46", fontFamily: "var(--font-body)" }}
            >
              {/* Intro */}
              <div>
                <p>
                  Please read these Terms of Service carefully before using{" "}
                  <span style={{ fontFamily: "var(--font-heading)", color: "#18181B" }}>
                    copperbaytech.com
                  </span>{" "}
                  (the "Site") operated by Copper Bay Tech ("we," "us," or "our"), a founder-led
                  IT consulting, web development, and cybersecurity company based in Petaluma,
                  California.
                </p>
                <p className="mt-4">
                  By accessing or using any part of this Site, you agree to be bound by these
                  Terms. If you do not agree, please discontinue use of the Site immediately.
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  1. Acceptance of Terms
                </h2>
                <p>
                  By visiting or using this Site, you represent that you are at least 18 years
                  of age and have the legal authority to agree to these Terms on behalf of
                  yourself or the business you represent. If you are using this Site on behalf of
                  a company or organization, you represent that you have the authority to bind
                  that entity to these Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  2. Description of Services
                </h2>
                <p className="mb-4">
                  This Site is an informational marketing website for Copper Bay Tech. Its
                  purposes include:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    Describing the IT support, web development, and cybersecurity services
                    available from Copper Bay Tech for businesses in Sonoma County and the
                    greater North Bay area.
                  </li>
                  <li>
                    Providing educational articles and resources to help small business owners
                    make better technology decisions.
                  </li>
                  <li>
                    Offering free diagnostic tools (such as the website health-check / audit
                    tool) to help visitors assess their own web presence.
                  </li>
                  <li>
                    Facilitating initial contact with prospective clients via the contact form.
                  </li>
                </ul>
                <p className="mt-4">
                  The Site itself is not a platform for purchasing services. Actual work is
                  governed exclusively by a separate, written proposal or service agreement
                  signed by both parties (see Section 5 below).
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  3. Use of Free Tools
                </h2>
                <p className="mb-4">
                  The Site may offer free tools, including a website health-check or audit tool
                  that returns publicly available performance data about a URL you provide. By
                  using these tools, you agree to the following:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "#18181B" }}>
                      Authorized use only.
                    </span>{" "}
                    You may only submit URLs for websites that you own, operate, or have
                    explicit authorization to test. You may not use these tools against websites
                    you do not have permission to analyze.
                  </li>
                  <li>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "#18181B" }}>
                      Provided "as is."
                    </span>{" "}
                    These tools are offered free of charge and without warranty of any kind.
                    Results are drawn from third-party APIs (such as Google PageSpeed Insights)
                    and are provided for informational purposes only. We do not guarantee their
                    accuracy, completeness, or fitness for any particular purpose.
                  </li>
                  <li>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "#18181B" }}>
                      No professional advice.
                    </span>{" "}
                    Tool results do not constitute professional IT, security, or legal advice.
                    Engage a qualified professional before making significant changes to your
                    technology infrastructure based on any tool output.
                  </li>
                  <li>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "#18181B" }}>
                      No storage of results.
                    </span>{" "}
                    We do not retain the URLs you submit or the results generated by these
                    tools beyond your active browser session.
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  4. Intellectual Property
                </h2>
                <p className="mb-4">
                  All content on this Site — including text, graphics, logos, code, and
                  educational articles — is the property of Copper Bay Tech or its licensors and
                  is protected by applicable intellectual property laws.
                </p>
                <p>
                  You may view and print pages from this Site for your own personal,
                  non-commercial reference. You may not reproduce, redistribute, republish, or
                  create derivative works from any content on this Site without our prior written
                  consent.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  5. Engagements &amp; Proposals
                </h2>
                <p className="mb-4">
                  Nothing on this Site — including pricing examples, tool results, blog articles,
                  or any other content — constitutes a binding offer, guarantee, or contract for
                  services.
                </p>
                <p>
                  All actual work performed by Copper Bay Tech is governed by a separate, signed
                  written proposal or service agreement between you and Copper Bay Tech.
                  Submitting the contact form, receiving a response, or participating in a
                  consultation call does not create a client relationship or obligate either party
                  to proceed with any engagement.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  6. Disclaimers &amp; Limitation of Liability
                </h2>
                <p className="mb-4">
                  This Site and all content and tools on it are provided "as is" and "as
                  available" without warranties of any kind, either express or implied, including
                  but not limited to warranties of merchantability, fitness for a particular
                  purpose, or non-infringement.
                </p>
                <p className="mb-4">
                  To the fullest extent permitted by applicable law, Copper Bay Tech shall not
                  be liable for any indirect, incidental, special, consequential, or punitive
                  damages arising out of or related to your use of, or inability to use, this
                  Site or any content or tools on it — even if we have been advised of the
                  possibility of such damages.
                </p>
                <p>
                  Our total liability for any claim related to this Site shall not exceed one
                  hundred dollars ($100.00 USD).
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  7. Third-Party Links
                </h2>
                <p>
                  This Site may contain links to third-party websites or resources. These links
                  are provided for your convenience only. Copper Bay Tech does not control, and
                  is not responsible for, the content, privacy practices, or accuracy of any
                  third-party site. Inclusion of a link does not constitute endorsement. You
                  access third-party sites at your own risk and subject to their own terms and
                  policies.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  8. Governing Law
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of
                  the State of California, without regard to its conflict of law provisions. Any
                  dispute arising from these Terms or your use of this Site shall be subject to
                  the exclusive jurisdiction of the state and federal courts located in Sonoma
                  County, California, and you hereby consent to personal jurisdiction in those
                  courts.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  9. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms of Service from time to time. When we do, we will
                  update the "last updated" date at the top of this page. Your continued use of
                  the Site after any changes constitutes your acceptance of the revised Terms.
                  We encourage you to review this page periodically.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2
                  className="text-xl font-bold mb-4"
                  style={{ color: "#18181B", fontFamily: "var(--font-heading)" }}
                >
                  10. Contact
                </h2>
                <p className="mb-4">
                  Questions about these Terms? We're happy to answer them:
                </p>
                <div
                  className="rounded-xl border border-[#18181B]/10 bg-white p-6 space-y-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <p className="font-bold text-[#18181B]">Copper Bay Tech</p>
                  <p>Petaluma, California</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:duke@copperbaytech.com"
                      style={{ color: "#F97316" }}
                    >
                      duke@copperbaytech.com
                    </a>
                  </p>
                  <p>
                    Phone:{" "}
                    <a
                      href="tel:+17072396725"
                      style={{ color: "#F97316" }}
                    >
                      (707) 239-6725
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
