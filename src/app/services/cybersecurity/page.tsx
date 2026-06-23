import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cybersecurity for Small Business Sonoma County | Copper Bay Tech",
  description:
    "Protect your Sonoma County business from ransomware, phishing, and data breaches. Cybersecurity assessments, employee training, and ongoing monitoring. Serving Petaluma, Santa Rosa & the North Bay.",
  keywords:
    "cybersecurity Sonoma County, small business cybersecurity Petaluma, ransomware protection Santa Rosa, IT security North Bay, HIPAA compliance Sonoma County",
  openGraph: {
    title: "Cybersecurity for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Most small businesses in the North Bay are one phishing email away from a breach. Find out where you stand — free IT security assessment.",
    url: "https://copperbaytech.com/services/cybersecurity",
  },
  alternates: {
    canonical: "https://copperbaytech.com/services/cybersecurity",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Cybersecurity",
  description:
    "Cybersecurity assessments, employee security training, password management, network hardening, and ongoing monitoring for small businesses in Sonoma County, CA.",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    url: "https://copperbaytech.com",
    telephone: "+17072396725",
    email: "contact@copperbaytech.com",
    address: {
      "@type": "PostalAddress",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Sonoma County",
  },
  url: "https://copperbaytech.com/services/cybersecurity",
  serviceType: "Cybersecurity",
};

export default function CybersecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />

      {/* Hero */}
      <section className="bg-ink-0 text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span
            className="inline-block bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-red-500/20"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Cybersecurity · Sonoma County, CA
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Small businesses are the #1 target.{" "}
            <span className="text-copper-bright">Are you protected?</span>
          </h1>
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            43% of cyberattacks target small businesses — and 60% of those businesses close within
            six months of a breach. Most North Bay small businesses are running on outdated
            passwords, unpatched software, and zero employee training. That&apos;s not bad luck. That&apos;s
            an open door.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper-bright text-ink-0 font-bold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get My Free Risk Score →
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talk to an expert ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Threat Reality */}
      <section className="bg-ink-1 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The threats targeting Sonoma County businesses right now
          </h2>
          <p
            className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Cybercriminals don&apos;t discriminate by size. They run automated scans looking for any
            easy target — and small businesses are easier targets than enterprises because they
            typically have fewer defenses.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎣",
                title: "Phishing Attacks",
                desc: "A convincing email impersonating your bank, a vendor, or even a coworker asks an employee to click a link or wire money. It takes one click. We've seen local businesses lose $40,000 in a single transaction from a fake invoice email. Employee training and email security filters dramatically reduce this risk.",
              },
              {
                icon: "🔒",
                title: "Ransomware",
                desc: "Malicious software encrypts every file on your network and demands payment for the key. Recovery without paying averages $1.85M globally. For a small business, it often means permanent closure. A proper backup system and endpoint protection means ransomware is an inconvenience instead of a catastrophe.",
              },
              {
                icon: "🔑",
                title: "Credential Theft",
                desc: "Password reuse is still the #1 entry point for breaches. If an employee uses the same password at work as on a breached consumer site (and they almost certainly do), your business network is exposed. A company-wide password manager and multi-factor authentication closes this gap almost entirely.",
              },
            ].map((threat) => (
              <div
                key={threat.title}
                className="bg-ink-2 rounded-xl p-6 border border-hairline"
              >
                <div className="text-3xl mb-4">{threat.icon}</div>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {threat.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {threat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ink-0 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Cybersecurity services for Sonoma County businesses
          </h2>
          <p
            className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No enterprise contracts. No 200-page compliance reports you won&apos;t read. Practical
            security that actually gets implemented by real small business teams.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🔎",
                title: "Security Assessment",
                desc: "A comprehensive audit of your current security posture: passwords, network configuration, software patch status, backup integrity, employee access controls, and physical security. You receive a prioritized action plan — not a list of scary problems with no solutions. Starts at $600.",
              },
              {
                icon: "🛡️",
                title: "Endpoint Protection",
                desc: "Modern antivirus and endpoint detection and response (EDR) deployed across every workstation and server. Managed and monitored so you don't have to think about it. We use best-in-class tools like CrowdStrike Falcon and Malwarebytes for Teams depending on your size and budget.",
              },
              {
                icon: "💾",
                title: "Backup + Disaster Recovery",
                desc: "The 3-2-1 backup rule implemented properly: 3 copies of your data, 2 different media types, 1 offsite. We design, implement, and test your backup system so that if the worst happens, you're back online in hours instead of weeks — or never.",
              },
              {
                icon: "📧",
                title: "Email Security + Anti-Phishing",
                desc: "DMARC, DKIM, and SPF configuration to prevent email spoofing. Spam filtering, link scanning, and attachment sandboxing. Microsoft 365 and Google Workspace security hardening. The email security configuration alone prevents the majority of phishing attacks that target small businesses.",
              },
              {
                icon: "🎓",
                title: "Employee Security Training",
                desc: "Your employees are your biggest security risk — and your best defense once trained. We run live phishing simulations, provide short video training modules, and build a security culture that actually sticks. Most breaches are preventable with basic awareness.",
              },
              {
                icon: "🔐",
                title: "Password Management + MFA",
                desc: "Company-wide deployment of 1Password or Bitwarden Teams. Every employee gets their own vault, with shared credentials for shared accounts. Multi-factor authentication configured for all critical systems. This single change eliminates the most common attack vector for small businesses.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-ink-1 rounded-xl p-6 border border-hairline"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3
                  className="font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-zinc-400 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="bg-ink-1 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Industry compliance for regulated businesses
          </h2>
          <p
            className="text-white/70 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Some Sonoma County businesses operate under federal or state regulations that carry
            specific cybersecurity requirements. We help you meet them without the enterprise
            price tag.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                standard: "HIPAA",
                applies: "Healthcare providers, therapists, wellness businesses",
                desc: "HIPAA requires technical safeguards for any system that stores or transmits protected health information. We implement access controls, audit logging, encrypted communications, and business associate agreements with your vendors.",
              },
              {
                standard: "PCI-DSS",
                applies: "Any business that accepts credit cards",
                desc: "If you store, process, or transmit cardholder data, PCI-DSS applies. We help with network segmentation, vulnerability scanning, and documentation to satisfy your payment processor's annual compliance requirements.",
              },
              {
                standard: "CCPA",
                applies: "California businesses with consumer data",
                desc: "California's privacy law requires businesses to disclose data collection, honor deletion requests, and maintain reasonable security. We help you understand your obligations and implement the technical and policy controls required.",
              },
            ].map((item) => (
              <div
                key={item.standard}
                className="bg-white/[0.04] rounded-xl p-6 border border-hairline"
              >
                <div
                  className="text-copper-bright text-2xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.standard}
                </div>
                <p
                  className="text-zinc-400 text-xs mb-3"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.applies}
                </p>
                <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ink-0 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "My business is small. Are we really a target?",
                a: "Yes. Small businesses are specifically targeted because they typically have weaker defenses than large companies, but still hold valuable data: customer payment information, employee records, business bank accounts, and access to customer systems. Attackers run automated tools that scan the internet looking for easy targets — they don't manually select victims based on size.",
              },
              {
                q: "How much does a cybersecurity assessment cost?",
                a: "Security assessments for small businesses start at $600 and scale with your headcount and complexity. You can also get a free high-level risk score right now using our IT Security Assessment at /assessment — it takes 6 questions and 2 minutes.",
              },
              {
                q: "We use Google Workspace / Microsoft 365. Isn't that secure?",
                a: "It's a solid foundation — but out-of-the-box configurations leave significant gaps. Both platforms have extensive security settings that aren't enabled by default. Phishing protection, conditional access policies, device management, data loss prevention, and audit logging all require deliberate configuration. Most small businesses are using maybe 20% of the security features they're already paying for.",
              },
              {
                q: "What happens if we do get breached?",
                a: "With a properly designed backup system, you restore from a clean backup and you're back online. Without one, you're looking at paying a ransom (with no guarantee of recovery), hiring a forensics firm at emergency rates, and potentially notifying customers under California's data breach notification law. The difference in outcomes is enormous. Incident response planning is something we help clients build before they need it.",
              },
              {
                q: "Do you offer ongoing security monitoring?",
                a: "Yes. Monthly security monitoring retainers include endpoint protection management, patch oversight, backup verification, and a monthly security summary. Pricing starts at $300/month for businesses under 10 users and scales from there. Details on our pricing page.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-hairline pb-8">
                <h3
                  className="text-lg font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.q}
                </h3>
                <p className="text-zinc-400 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-1 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Find out where you stand — free.
          </h2>
          <p
            className="text-white/70 text-lg mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our free IT Security Assessment covers passwords, network security, backups, website
            security, software updates, and employee offboarding. Six questions. Two minutes. A real
            risk score and personalized recommendations — no email required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper-bright text-ink-0 font-bold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Take the Free Assessment →
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talk to an expert ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}
