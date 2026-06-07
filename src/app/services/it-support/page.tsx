import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "IT Support Sonoma County | Small Business IT Services | Copper Bay Tech",
  description:
    "Responsive IT support for Sonoma County small businesses. Network setup, device management, remote monitoring, and on-site help in Petaluma, Santa Rosa & beyond.",
  alternates: {
    canonical: "https://copperbaytech.com/services/it-support",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support",
  description:
    "Managed IT support for small businesses across Sonoma County, CA. Network setup, device management, remote monitoring, employee onboarding/offboarding, and on-site help.",
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
  url: "https://copperbaytech.com/services/it-support",
  serviceType: "IT Support",
};

export default function ITSupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Nav />

      {/* Hero */}
      <section className="bg-[#18181B] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            IT Support · North Bay California
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            IT Support for Sonoma County Small Businesses
          </h1>
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            You shouldn&apos;t need to call your cousin every time the WiFi goes down. Copper Bay
            Tech is a real IT partner — local, responsive, and built for businesses with 1–50
            employees in Petaluma, Santa Rosa, Sebastopol, and across the North Bay. We handle
            the technology so you can focus on running your business.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Free IT Assessment →
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Book a Call ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-[#FAFAF9] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Happens When You Don&apos;t Have a Real IT Partner
          </h2>
          <p
            className="text-zinc-600 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Most small businesses wing their IT until something goes catastrophically wrong. By then,
            the damage — in downtime, lost data, and emergency repair costs — is already done.
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "👤",
                title: "The \"Tech Person\" Problem",
                desc: "You promoted someone internally because they were good with computers. Now they spend 30% of their time on IT issues instead of their actual job — and when they leave, they take all the passwords and institutional knowledge with them. This is one of the most common and most expensive IT mistakes small businesses make.",
              },
              {
                icon: "🔧",
                title: "Break-Fix Is a Money Pit",
                desc: "Calling an IT vendor only when things break sounds economical until you see the invoices. Emergency rates, after-hours fees, and the labor cost of diagnosing a problem that proper monitoring would have caught weeks earlier add up fast. One bad server failure can easily cost $5,000–$15,000 in recovery time alone.",
              },
              {
                icon: "🚨",
                title: "You Find Out About Problems Last",
                desc: "Without monitoring, you learn about IT problems the worst possible way: a customer can&apos;t checkout, your email stops sending, or an employee shows up Monday to find the server is down. Proactive monitoring catches 80% of issues before they cause visible outages — but only if someone is watching.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3
                  className="text-xl font-bold text-zinc-900 mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Copper Bay Tech IT Support Covers
          </h2>
          <p
            className="text-zinc-600 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A flat monthly engagement means you get everything below without watching the clock.
            No per-ticket fees, no surprise invoices, no being put on hold with a tier-1 help desk.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🖥️",
                title: "Remote Monitoring & Alerts",
                desc: "Your servers, workstations, and network devices are monitored 24/7. We get alerted when something looks wrong — often before you notice anything — and address it proactively.",
              },
              {
                icon: "📡",
                title: "Network Setup & WiFi",
                desc: "Proper business-grade WiFi configuration, network segmentation (guest vs. internal), VPN setup for remote workers, and ongoing management so your network is fast, stable, and secure.",
              },
              {
                icon: "💻",
                title: "Device Procurement & Setup",
                desc: "We source, configure, and deploy business laptops, desktops, and mobile devices. Every device comes hardened with security baselines, enrolled in management software, and ready to use on day one.",
              },
              {
                icon: "📋",
                title: "Software Licensing Management",
                desc: "Stop losing track of who has what license. We manage your Microsoft 365, Google Workspace, and other software subscriptions — ensuring you&apos;re not overpaying for unused seats or under-licensed.",
              },
              {
                icon: "🚪",
                title: "Employee Onboarding & Offboarding",
                desc: "A new hire&apos;s first day should go smoothly. A departing employee&apos;s access should be revoked immediately. We handle both — account provisioning, device setup, access controls, and secure offboarding — every time.",
              },
              {
                icon: "💾",
                title: "Backup & Disaster Recovery",
                desc: "Your business data is backed up automatically, encrypted, and stored offsite. We test restores regularly. If something goes wrong — ransomware, hardware failure, accidental deletion — we can get you back up and running fast.",
              },
              {
                icon: "🛡️",
                title: "Security Patches & Updates",
                desc: "Every device and server is kept current with operating system and software security patches. Most breaches exploit known vulnerabilities that had patches available for months. We close that window.",
              },
              {
                icon: "📞",
                title: "Real Human Help Desk",
                desc: "When someone on your team has a problem, they call or message us directly. No ticket queue, no offshore call center, no robot. A real person who knows your business answers and resolves the issue.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 bg-[#FAFAF9] rounded-xl border border-zinc-100">
                <div className="text-2xl pt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <h3
                    className="font-bold text-zinc-900 mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-[#18181B] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for Businesses with 1–50 Employees
          </h2>
          <p
            className="text-white/70 text-lg mb-10 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Copper Bay Tech IT support is designed for the Sonoma County businesses that fall
            between &quot;I can handle it myself&quot; and &quot;large enough to need a full-time IT
            department.&quot; You&apos;re in the right place if:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "You have no dedicated IT staff — or your IT person is wearing five other hats",
              "Your team runs on Google Workspace, Microsoft 365, or a mix of both",
              "You have between 5 and 50 devices (laptops, desktops, phones, tablets, servers)",
              "You value fast, direct responses over corporate ticket systems",
              "You&apos;ve had at least one \"why didn&apos;t we have this set up sooner\" moment",
              "You&apos;re in Petaluma, Santa Rosa, Sebastopol, Rohnert Park, Sonoma, Windsor, Healdsburg, Cotati, or Bodega Bay",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-orange-400 mt-0.5 shrink-0">✓</span>
                <p className="text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.replace(/&apos;/g, "'").replace(/&quot;/g, '"')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#FAFAF9] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transparent Monthly Pricing
          </h2>
          <p
            className="text-zinc-600 text-lg mb-10 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            IT support is quoted based on the number of users and devices, the complexity of your
            environment, and the level of support you need. Here are the realistic ranges:
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                tier: "Essentials",
                range: "$800 – $1,200/mo",
                desc: "Up to 10 users. Remote monitoring, patching, help desk support, and monthly check-ins. Great for small teams that need a safety net.",
              },
              {
                tier: "Core Ops",
                range: "$1,200 – $2,000/mo",
                desc: "11–25 users. Everything in Essentials plus backup management, onboarding/offboarding, and a quarterly in-person review.",
                featured: true,
              },
              {
                tier: "Full Coverage",
                range: "$2,000 – $3,500/mo",
                desc: "26–50 users. Everything in Core Ops plus on-site visits, vendor management, and priority response SLAs.",
              },
            ].map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-xl p-6 border ${tier.featured ? "bg-orange-500/10 border-orange-500/30" : "bg-white border-zinc-200 shadow-sm"}`}
              >
                <h3
                  className="font-bold text-zinc-900 mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tier.tier}
                </h3>
                <div
                  className="text-orange-500 text-2xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tier.range}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Project-based work (new network installs, office moves, server migrations) is quoted
            separately.{" "}
            <Link href="/pricing" className="text-orange-500 hover:text-orange-600 font-semibold">
              Use the pricing estimator →
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "How fast do you respond when something breaks?",
                a: "For active support clients, our standard response time is same business day for non-critical issues and within 2 hours for anything that's taking down operations. We give you a direct line — not a ticket portal — so you can actually reach us when it matters.",
              },
              {
                q: "Do you do on-site visits in Sonoma County?",
                a: "Yes. We serve Petaluma and regularly visit clients in Santa Rosa, Sebastopol, Rohnert Park, Sonoma, Windsor, Healdsburg, Cotati, and Bodega Bay. Some issues require hands-on work — server installations, network cabling, hardware failures — and we show up. Remote-first, but not remote-only.",
              },
              {
                q: "Can you support our Google Workspace or Microsoft 365?",
                a: "Yes — both, and both at the same time. Many Sonoma County businesses we work with have a mix. We manage user accounts, licensing, email routing, shared drives, Teams/Meet configuration, and security settings for both platforms. If you're thinking about migrating from one to the other, we can help evaluate that decision too.",
              },
              {
                q: "What if we need help after hours?",
                a: "Active clients on Core Ops and Full Coverage plans have access to an emergency contact for critical outages outside business hours. We define critical as: your ability to operate is materially impaired and it can't wait until morning. If you get a ransomware alert at 11pm on a Friday, you have a number to call.",
              },
              {
                q: "Do we need to sign a long-term contract?",
                a: "No. We offer month-to-month agreements. We earn your business every month by being genuinely useful, not by locking you in. Some clients prefer a 12-month commitment in exchange for a rate discount — that option is available — but it's never required.",
              },
              {
                q: "We already have an IT company. Can you take over?",
                a: "Yes, and we do this regularly. A clean transition starts with a full environment audit — we document everything your current vendor has set up, identify any gaps or risks, and build a handoff plan. We coordinate directly with the outgoing vendor when possible. Most transitions are complete within 30 days with no service interruption.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-zinc-100 pb-8">
                <h3
                  className="text-lg font-bold text-zinc-900 mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.q}
                </h3>
                <p className="text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="bg-[#18181B] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Not Sure Where Your IT Stands?
          </h2>
          <p
            className="text-white/70 text-lg mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Take the free 6-question IT security assessment. It covers passwords, network setup,
            backups, website security, software updates, and employee offboarding — the six areas
            where Sonoma County small businesses most commonly have gaps. You&apos;ll get a risk
            score and a prioritized action plan instantly. No email required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Take the Free Assessment →
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talk to Duke Directly ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
