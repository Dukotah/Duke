import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, Globe, Smartphone, Zap, Search, Mail, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Web Development for Sonoma County Small Businesses | Copper Bay Tech",
  description:
    "Copper Bay Tech builds fast, mobile-first websites for Sonoma County small businesses. Custom Next.js sites, SEO-ready, with contact forms that actually work. Based in Santa Rosa, CA.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does a small business website cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most small business websites we build range from $1,500 to $5,000 depending on scope. A simple 5-page site with a contact form is on the lower end; a site with a blog, booking system, or e-commerce will cost more. We give you a flat-fee quote before any work starts — no surprises.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most small business websites launch within 2–4 weeks. The timeline depends on how quickly we receive your content (text, photos, logo) and how many revision rounds are needed. Rush projects can sometimes be completed in under 2 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build websites on WordPress?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We specialize in custom Next.js sites, which are faster, more secure, and easier to maintain than WordPress. That said, if you already have a WordPress site and just need updates or fixes, we can help with that too.",
      },
    },
    {
      "@type": "Question",
      name: "Will my website show up on Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every site we build includes on-page SEO best practices: proper heading structure, meta descriptions, fast load times, and local schema markup. We also set up Google Search Console so you can monitor performance. Getting to page one takes ongoing effort, but we make sure your foundation is solid from day one.",
      },
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Web Development",
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
    "Custom Next.js websites for Sonoma County small businesses. Mobile-first, fast loading, SEO-ready, with contact forms and ongoing support.",
};

const features = [
  {
    icon: Globe,
    title: "Custom Next.js Sites",
    desc: "No cookie-cutter templates. Every site is built to your brand, your goals, and your customers.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Over 60% of local searches happen on phones. Your site will look great and convert on every screen size.",
  },
  {
    icon: Zap,
    title: "Fast Load Times",
    desc: "Slow sites lose customers. We optimize images, minimize code, and leverage modern hosting to keep things snappy.",
  },
  {
    icon: Search,
    title: "SEO-Ready",
    desc: "Proper heading structure, meta tags, local schema markup, and Google Search Console setup included on every project.",
  },
  {
    icon: Mail,
    title: "Contact Forms That Work",
    desc: "Reliable form submissions that land in your inbox — not spam folders. Optional email notifications and CRM integrations.",
  },
  {
    icon: CheckCircle,
    title: "Ongoing Support",
    desc: "Need a page updated or a new service added? We're a local team you can call, not a ticket queue in another time zone.",
  },
];

export default function WebDevelopmentPage() {
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
              Web Development
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A website that actually works{" "}
              <span style={{ color: "#F97316" }}>for your business</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We build custom, fast-loading websites for Sonoma County small businesses — from family restaurants in Petaluma to law firms in Santa Rosa. No WordPress bloat, no page-builder headaches. Just a site that looks great, loads fast, and brings in customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a free quote <ArrowRight size={15} />
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

        {/* Features */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What&rsquo;s included in every project
            </h2>
            <p
              className="text-[#3F3F46]/60 mb-12 max-w-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every site we build comes with these essentials — not as add-ons.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(({ icon: Icon, title, desc }) => (
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

        {/* Process */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-12"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How it works
            </h2>
            <div className="space-y-8">
              {[
                { step: "01", title: "Free discovery call", desc: "We learn about your business, your customers, and what you need your site to do. No sales pitch — just a conversation." },
                { step: "02", title: "Flat-fee proposal", desc: "You get a written scope and price before any work starts. We don't bill by the hour, so you'll never get a surprise invoice." },
                { step: "03", title: "Design & build", desc: "We handle everything — design, development, copywriting assistance, and image optimization. You review and give feedback." },
                { step: "04", title: "Launch & handoff", desc: "We launch your site, set up analytics, and walk you through how to make basic updates yourself if you want to." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-6">
                  <span
                    className="text-3xl font-bold shrink-0 w-12"
                    style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                  >
                    {step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#18181B] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {title}
                    </h3>
                    <p className="text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
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
              Ready for a website that works as hard as you do?
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Based in Sonoma County. Quick response. Flat-fee projects. No jargon.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get your free quote <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
