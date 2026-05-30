import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Monitor, Wifi, HardDrive, Mail, Database, PhoneCall, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Managed Services in Sonoma County | Copper Bay Tech",
  description:
    "Remote and on-site IT support for Sonoma County small businesses. Network setup, hardware, email, backups, and more. Local team based in Santa Rosa, CA. Call (707) 239-6725.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does managed IT support cost for a small business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our managed IT support retainers typically range from $200–$800/month depending on the number of users and scope of coverage. We also offer flat-fee project work for one-time needs like network setup or hardware upgrades. You'll always know your cost in advance.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer on-site support in Sonoma County?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We serve businesses throughout Sonoma County including Santa Rosa, Petaluma, Healdsburg, Sebastopol, and surrounding areas. Many issues can be resolved remotely, but when you need someone on-site, we can usually get there the same day or next business day.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if something breaks after hours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Retainer clients get a direct line for urgent issues. We triage after-hours emergencies and respond based on severity — a downed server gets faster attention than a printer that's offline. We'll set expectations clearly when we start working together.",
      },
    },
    {
      "@type": "Question",
      name: "Can you take over support from another IT company?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We handle transitions from other vendors regularly. We'll audit your current setup, document everything, and make sure nothing falls through the cracks during the handoff. We've seen plenty of situations where the previous vendor didn't leave clean documentation — we'll sort it out.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support & Managed Services",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    telephone: "+17072396725",
    email: "duke@copperbaytech.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santa Rosa",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  areaServed: "Sonoma County, CA",
  description:
    "Remote and on-site IT support for Sonoma County small businesses. Covers network setup, hardware, email, backups, and ongoing managed services.",
};

const services = [
  {
    icon: PhoneCall,
    title: "Remote & On-Site Support",
    desc: "Quick help via remote session for everyday issues, with on-site dispatch for hands-on needs across Sonoma County.",
  },
  {
    icon: Wifi,
    title: "Network Setup & Troubleshooting",
    desc: "Wired and wireless network design, router and switch configuration, VLANs, and guest networks for offices of any size.",
  },
  {
    icon: Monitor,
    title: "Hardware & Workstation Setup",
    desc: "New computer setup, device procurement, printer configuration, and hardware repair or replacement coordination.",
  },
  {
    icon: Mail,
    title: "Business Email & Microsoft 365",
    desc: "Email migration, Microsoft 365 setup, spam filtering, and shared calendar/contacts configuration for your whole team.",
  },
  {
    icon: Database,
    title: "Backup & Disaster Recovery",
    desc: "Automated cloud and local backups with tested restore procedures so you're covered when something goes wrong.",
  },
  {
    icon: HardDrive,
    title: "Server & Infrastructure",
    desc: "On-premises server maintenance, NAS setup, virtualization, and cloud migration planning tailored to your needs.",
  },
];

export default function ITSupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#18181B] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              IT Support
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              IT support that shows up{" "}
              <span style={{ color: "#F97316" }}>when you need it</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Remote help desk, on-site visits, network setup, and ongoing managed services for small businesses across Sonoma County. No ticket queues, no overseas call centers — just a local team that picks up the phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get IT support <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white/80 border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                (707) 239-6725
              </a>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What we handle
            </h2>
            <p
              className="text-[#3F3F46]/60 mb-12 max-w-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              From daily helpdesk questions to infrastructure overhauls — we cover the full range of small business IT needs.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why local */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl font-bold text-[#18181B] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Why local IT support matters
                </h2>
                <div className="space-y-4" style={{ fontFamily: "var(--font-body)" }}>
                  {[
                    "Same-day or next-day on-site response across Sonoma County",
                    "We know the local infrastructure, vendors, and quirks",
                    "Direct line to a person who knows your setup — not a ticket number",
                    "Flat-fee retainers so you budget with confidence",
                    "Documentation you own, in plain English",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: "#F97316" }} />
                      <span className="text-[#3F3F46]/70 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#FAFAF9] rounded-2xl p-8 border border-[#18181B]/8">
                <p
                  className="text-2xl font-bold text-[#18181B] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  &ldquo;The WiFi went down an hour before a big client presentation.&rdquo;
                </p>
                <p className="text-sm text-[#3F3F46]/60 leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  That&rsquo;s a real scenario we&rsquo;ve handled. A local team that can walk in the door changes what&rsquo;s possible when something breaks at the worst time.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                >
                  Talk to us <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {faqJsonLd.mainEntity.map((item) => (
                <div key={item.name} className="bg-white rounded-2xl p-6 border border-[#18181B]/8">
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Stop waiting on hold. Get local IT support.
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Serving small businesses throughout Sonoma County. Quick response, flat-fee options, no jargon.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Copper Bay Tech <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
