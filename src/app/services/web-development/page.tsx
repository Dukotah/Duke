import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Web Development Sonoma County | Custom Websites | Copper Bay Tech",
  description:
    "Custom-built websites for Sonoma County small businesses. Fast, secure, mobile-ready. Serving Petaluma, Santa Rosa, Sebastopol & the North Bay. Free consultation.",
  alternates: {
    canonical: "https://copperbaytech.com/services/web-development",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to build a small business website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most small business websites go live in 2–3 weeks from the kickoff call. We handle the design, copy, and technical setup. You review and approve. Complex sites with e-commerce or booking systems can take 4–6 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "How much does a small business website cost in Sonoma County?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A professional small business website from Copper Bay Tech starts at $1,500 for a simple 5-page site. Most projects land between $2,000 and $4,500. E-commerce and booking-integrated sites start at $3,500. We offer payment plans with no interest.",
      },
    },
    {
      "@type": "Question",
      name: "Will my website show up on Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every site we build is optimized for local search from day one — fast loading, mobile-first design, proper meta tags, structured data, and Google Business Profile setup. We also submit your sitemap to Google Search Console so your site gets indexed quickly.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after my website launches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We include 30 days of free post-launch support to fix any issues. After that, we offer optional monthly maintenance plans starting at $79/month covering security updates, backups, uptime monitoring, and content changes. You're never left on your own.",
      },
    },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Development",
  description:
    "Custom-built websites and web applications for small businesses across Sonoma County, CA. Performance-first, mobile-ready, and SEO-optimized.",
  provider: {
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    url: "https://copperbaytech.com",
    telephone: "+17072396725",
    email: "duke@copperbaytech.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petaluma",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Sonoma County",
  },
  url: "https://copperbaytech.com/services/web-development",
  serviceType: "Web Development",
};

export default function WebDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, faqSchema]) }}
      />
      <Nav />

      {/* Hero */}
      <section className="bg-[#18181B] text-white pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Web Development · Petaluma, CA
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Custom Web Development for Sonoma County Businesses
          </h1>
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Your website is your hardest-working employee — available 24/7, fielding first
            impressions, and converting curious visitors into paying customers. Copper Bay Tech
            builds fast, modern websites using React and Next.js for Petaluma, Santa Rosa,
            Sebastopol, and businesses across the North Bay. No templates. No shortcuts. Just a
            website that actually works.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Estimate →
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Check Your Current Site ↗
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
            Most Small Business Websites Are Quietly Losing You Customers
          </h2>
          <p
            className="text-zinc-600 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A bad website doesn&apos;t announce itself. It just quietly bounces visitors, tanks your
            Google ranking, and hands your competitors the business you should have won. Here&apos;s
            what&apos;s likely happening right now:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="text-3xl mb-4">⏱️</div>
              <h3
                className="text-xl font-bold text-zinc-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Slow Load Times Are Killing Conversions
              </h3>
              <p className="text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Google research shows that 53% of mobile users abandon a page that takes longer than
                3 seconds to load. A one-second delay in page response can result in a 7% reduction
                in conversions. If your site was built on a drag-and-drop platform or an old
                WordPress theme, it&apos;s almost certainly too slow — and you&apos;re losing real
                money every single day.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="text-3xl mb-4">📱</div>
              <h3
                className="text-xl font-bold text-zinc-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Mobile-Unfriendly Sites Lose Google Rank
              </h3>
              <p className="text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Over 60% of web searches now happen on mobile devices. Google uses mobile-first
                indexing, meaning your mobile site&apos;s performance directly determines where you
                rank in search results — even for desktop searches. If your Sonoma County
                competitor&apos;s site loads cleanly on a phone and yours doesn&apos;t, they will
                outrank you. It&apos;s that simple.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
              <div className="text-3xl mb-4">🔓</div>
              <h3
                className="text-xl font-bold text-zinc-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Outdated CMS = Open Security Vulnerabilities
              </h3>
              <p className="text-zinc-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                WordPress powers 43% of the web — which makes it the #1 target for automated
                attacks. Outdated plugins and themes are exploited within hours of a vulnerability
                being published. A hacked business website gets flagged by Google, loses search
                ranking, and sometimes serves malware to your customers. The cleanup cost averages
                $5,000–$50,000. Prevention is dramatically cheaper.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What a Copper Bay Tech Website Includes
          </h2>
          <p
            className="text-zinc-600 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every website we build is a complete, professional package — not a bare minimum that
            requires upsells to function. Here&apos;s what&apos;s standard in every engagement:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Performance-First Build",
                desc: "Built with Next.js and React — the same stack used by Vercel, Netflix, and Hulu. Pages load in under 2 seconds. Core Web Vitals scores in the green. Fast sites rank higher and convert better.",
              },
              {
                icon: "📐",
                title: "Mobile-First Responsive Design",
                desc: "Every layout is designed starting from the smallest screen and scaled up. Your site will look polished and function perfectly on iPhones, Androids, tablets, and every desktop size.",
              },
              {
                icon: "🔐",
                title: "SSL + Security Hardening",
                desc: "HTTPS everywhere, secure headers, no unnecessary plugins, and a deployment architecture that limits attack surface. Your site won't be the one leaking customer data.",
              },
              {
                icon: "🔍",
                title: "SEO Foundation Built In",
                desc: "Semantic HTML structure, proper heading hierarchy, meta tags, Open Graph, sitemap.xml, robots.txt, and structured data (Schema.org). We set you up to rank — you provide the great content.",
              },
              {
                icon: "📊",
                title: "Analytics + Search Console",
                desc: "Google Analytics 4 and Google Search Console connected before launch. You'll see who visits, where they come from, what they click, and what search queries bring them in.",
              },
              {
                icon: "🛟",
                title: "30-Day Post-Launch Support",
                desc: "After launch, you get 30 days of included support for bug fixes, copy tweaks, and questions. You're not alone the moment the site goes live.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#FAFAF9] rounded-xl p-6 border border-zinc-100"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3
                  className="font-bold text-zinc-900 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-zinc-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#18181B] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How It Works
          </h2>
          <p
            className="text-white/70 text-lg mb-12 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A clear, collaborative process with no surprises. You&apos;ll always know where we are
            and what comes next.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Discovery Call",
                desc: "We start with a 30-minute conversation about your business, your goals, and your current situation. No sales pressure — just a genuine exploration of what you need and whether we&apos;re a good fit.",
              },
              {
                num: "02",
                title: "Proposal + Wireframe",
                desc: "You receive a written proposal with a fixed price, timeline, and scope. We also provide a simple wireframe showing the page structure so you can visualize the site before a single line of code is written.",
              },
              {
                num: "03",
                title: "Build + Review Cycles",
                desc: "We build the site in stages with regular check-ins and a shared staging environment so you can see progress in real time. Feedback is incorporated in dedicated review rounds — no endless back-and-forth.",
              },
              {
                num: "04",
                title: "Launch + Handoff",
                desc: "After final approval, we deploy to your domain, connect all analytics, and walk you through how to use and manage your new site. You get documentation and 30 days of included post-launch support.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-5">
                <div
                  className="text-orange-400 text-4xl font-bold leading-none pt-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-white/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {step.desc.replace(/&apos;/g, "'")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-[#FAFAF9] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What Does a Website Cost?
          </h2>
          <p
            className="text-zinc-600 text-lg mb-10 max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We believe in transparent, honest pricing. Here are the ranges for the most common
            project types. Every project is quoted individually based on scope — these are realistic
            starting points, not bait-and-switch minimums.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                type: "Brochure Site",
                range: "$1,500 – $3,500",
                desc: "5–8 pages: Home, About, Services, Contact, and a few supporting pages. Perfect for service businesses, consultants, and local retailers who need a clean, professional web presence.",
                examples: "Contractors, salons, therapists, restaurants",
              },
              {
                type: "Business + Booking",
                range: "$3,000 – $6,000",
                desc: "Everything in a brochure site plus online scheduling, contact forms with CRM integration, service menus, testimonials, and blog capabilities. Built for businesses that generate leads online.",
                examples: "Med spas, law firms, home services, fitness studios",
              },
              {
                type: "Custom Web App",
                range: "$6,000 – $20,000+",
                desc: "Full-stack custom applications: customer portals, e-commerce, membership sites, database-backed tools, API integrations. Scoped individually after discovery.",
                examples: "SaaS products, marketplaces, internal tools",
              },
            ].map((tier) => (
              <div
                key={tier.type}
                className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm"
              >
                <h3
                  className="font-bold text-zinc-900 mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tier.type}
                </h3>
                <div
                  className="text-orange-500 text-2xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tier.range}
                </div>
                <p
                  className="text-zinc-600 text-sm mb-3 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {tier.desc}
                </p>
                <p
                  className="text-zinc-400 text-xs italic"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {tier.examples}
                </p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Want a personalized estimate?{" "}
            <Link href="/pricing" className="text-orange-500 hover:text-orange-600 font-semibold">
              Use our interactive pricing estimator →
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
                q: "How long does a website project take?",
                a: "Most brochure sites take 4–6 weeks from kickoff to launch. Business sites with booking and integrations typically take 6–8 weeks. Custom web apps are scoped individually but usually run 8–16 weeks. Timelines depend heavily on how quickly client feedback and content arrive — we hold our end and ask the same of you.",
              },
              {
                q: "Do I need to provide content, or do you write it?",
                a: "You know your business better than anyone, so we start with your input. We provide a content guide that walks you through exactly what we need for each page — it's not as daunting as it sounds. For clients who need help, we offer copywriting as an add-on service. Photography and video are typically sourced by the client, though we can recommend local Sonoma County photographers.",
              },
              {
                q: "Will I be able to edit the website myself?",
                a: "Yes. We discuss CMS options during discovery. For clients who need frequent updates, we can integrate a headless CMS like Sanity or Contentful that gives you a friendly editing interface without touching code. For simpler sites with infrequent updates, we often handle changes as part of a monthly retainer — which is usually more cost-effective than training on a CMS you'll use twice a year.",
              },
              {
                q: "Do you do ongoing website maintenance?",
                a: "Yes. We offer monthly maintenance retainers starting at $150/month that cover hosting oversight, security updates, uptime monitoring, and a set number of content change hours. For clients who want more hands-on support — new pages, A/B testing, SEO reporting — we have higher-tier retainers as well. Details are on the pricing page.",
              },
              {
                q: "I already have a website. Can you improve it instead of rebuilding?",
                a: "Absolutely. We offer website audits that assess your current site's performance, SEO, security, and user experience — and give you a prioritized improvement plan. Sometimes a targeted fix is all you need. Sometimes the audit confirms a rebuild is the right call. Either way, you get an honest assessment, not a pitch. You can start with our free site audit tool at /tools.",
              },
              {
                q: "Why not just use Squarespace or Wix?",
                a: "Squarespace and Wix are great for getting something online quickly with zero technical knowledge. But they come with real trade-offs: slower performance due to bloated platform code, limited ability to customize beyond their templates, recurring subscription costs that add up over time, and — critically — you don't own the underlying code. If the platform changes pricing or shuts down, you have to start over. A custom-built site is an asset you own outright, performs better in search, and can grow exactly as your business grows.",
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

      {/* CTA Section */}
      <section className="bg-[#18181B] text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to Build Something That Works?
          </h2>
          <p
            className="text-white/70 text-lg mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Whether you need a fresh start or want to fix what you already have, let&apos;s talk.
            Copper Bay Tech serves Petaluma, Santa Rosa, Sebastopol, Rohnert Park, Sonoma, Windsor,
            Healdsburg, Cotati, and Bodega Bay. Free 30-minute consultation, no strings attached.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get a Free Estimate →
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Audit My Current Site ↗
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
