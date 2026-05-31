import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  Globe,
  Check,
  ArrowRight,
  Smartphone,
  Zap,
  Search,
  Code2,
  BarChart3,
  Mail,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Web Development in Sonoma County | Copper Bay Tech",
  description:
    "Copper Bay Tech builds custom-coded business websites for Sonoma County companies. Fast, mobile-first, locally SEO-optimized — flat-fee, no templates, no surprises.",
  keywords: [
    "web development Sonoma County",
    "custom website Petaluma",
    "small business website Santa Rosa",
    "local SEO Sonoma County",
    "Next.js web developer North Bay",
  ],
  openGraph: {
    title: "Custom Web Development in Sonoma County | Copper Bay Tech",
    description:
      "Custom-coded websites for Sonoma County businesses. Fast, mobile-first, locally SEO-optimized. Flat-fee projects starting around $2,500.",
    type: "website",
  },
};

const included = [
  {
    icon: Code2,
    title: "Custom-coded from scratch",
    body: "No WordPress, no Wix, no Squarespace. We write clean, hand-crafted code that performs exactly as designed — nothing bloated from a theme marketplace.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    body: "Over 60% of local searches happen on a phone. Your site is designed for small screens first, then scaled up — not the other way around.",
  },
  {
    icon: Zap,
    title: "Fast load times",
    body: "We optimize images, fonts, and scripts so your site loads in under two seconds. Slow sites lose visitors — fast sites keep them.",
  },
  {
    icon: Search,
    title: "Local SEO built in",
    body: "Schema markup, title tags, meta descriptions, and content structured to show up when people search for your service in Sonoma County.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile setup",
    body: "We set up or optimize your Google Business Profile so your business appears in Maps results and local search packs for your service area.",
  },
  {
    icon: Mail,
    title: "Domain, hosting & email",
    body: "We handle the full technical setup — domain registration, hosting configuration, professional email, and DNS — so you don't have to.",
  },
  {
    icon: BarChart3,
    title: "Analytics & contact forms",
    body: "Google Analytics 4 and Google Search Console connected from day one. Your contact forms are tested, functional, and send to your inbox.",
  },
  {
    icon: Globe,
    title: "Accessibility & standards",
    body: "Semantic HTML, proper heading structure, keyboard navigability, and adequate color contrast — a site that works for everyone and that search engines can read cleanly.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    body: "A free 30-minute call to understand your business, your customers, and what you need your website to do. We ask the right questions upfront so nothing gets built wrong.",
  },
  {
    number: "02",
    title: "Design",
    body: "We share mockups before writing a line of code. You see exactly what you're getting and can request changes before anything is built.",
  },
  {
    number: "03",
    title: "Build",
    body: "Clean, hand-written code. We share a live preview URL so you can review the site on your own devices as it comes together.",
  },
  {
    number: "04",
    title: "Launch",
    body: "We handle the go-live process — connecting your domain, confirming everything works, and submitting to Google Search Console. No action needed from you.",
  },
  {
    number: "05",
    title: "Ongoing Support",
    body: "After launch you're not on your own. We offer flat-fee update packages and are reachable when something needs attention.",
  },
];

const comparisons = [
  {
    feature: "Page speed",
    custom: "Consistently fast — only your code loads",
    template: "Often slow — heavy theme code loads even if unused",
  },
  {
    feature: "SEO control",
    custom: "Full control of every tag and structure",
    template: "Limited to what the theme exposes",
  },
  {
    feature: "Security",
    custom: "Minimal attack surface — no plugin vulnerabilities",
    template: "WordPress alone sees millions of attack attempts daily",
  },
  {
    feature: "Design",
    custom: "Looks like your brand, not a template",
    template: "Often recognizable as a theme — limited differentiation",
  },
  {
    feature: "Long-term maintenance",
    custom: "Stable — no plugin update roulette",
    template: "Plugin and theme updates can break things unexpectedly",
  },
];

const faqs = [
  {
    q: "How much does a custom website cost?",
    a: "Most small business websites we build fall in the $2,500–$4,000 range, depending on the number of pages and any custom functionality. You'll receive a flat-fee quote upfront before work begins — no hourly billing, no surprise invoices.",
  },
  {
    q: "How long does it take to build a website?",
    a: "Most business websites are live within 2–3 weeks of the project start date. More complex sites with custom features may take 4–6 weeks. We set a realistic timeline before starting and stick to it.",
  },
  {
    q: "We already have a website. Can you improve it?",
    a: "Yes. Whether it's a speed problem, an outdated design, missing SEO, or a broken contact form — we can assess your existing site and give you a clear picture of what's worth fixing and what isn't.",
  },
  {
    q: "Do you build e-commerce sites?",
    a: "We handle product pages, quote-request flows, and service-based booking. For full shopping cart and payment processing setups, reach out and we'll discuss whether it fits your situation and recommend the right approach.",
  },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-6xl mx-auto px-6">
            <span
              className="inline-block mb-5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Web Development
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A website that actually
              <br />
              <span style={{ color: "#F97316" }}>works for your business.</span>
            </h1>
            <p
              className="text-white/60 text-lg max-w-xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Custom-coded, mobile-first, and built to rank locally. No templates, no page builders, no mystery fees. Flat-fee projects for Sonoma County businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
              <Link
                href="/#estimator"
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white px-7 py-3 rounded-md text-sm font-semibold border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Estimate your project cost
              </Link>
            </div>
          </div>
        </section>

        {/* Intro — who it's for */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Who it's for
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#18181B] mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your website is your hardest-working employee — is it doing its job?
                </h2>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  We build websites for local Sonoma County businesses that need to show up in search, load fast on a phone, and turn visitors into actual calls and inquiries — not just look decent on a desktop.
                </p>
                <p
                  className="text-[#3F3F46]/70 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Whether you have no website, an outdated one, or a DIY site that isn't performing — we'll tell you honestly what makes sense for your situation.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Local businesses launching their first professional site",
                  "Businesses whose current site looks dated or loads slowly",
                  "Service companies who get zero leads from their website",
                  "Owners who built their own site and outgrew it",
                  "Businesses that need local SEO, not just a digital business card",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/8"
                  >
                    <Check size={16} color="#F97316" className="mt-0.5 flex-shrink-0" />
                    <span
                      className="text-sm text-[#3F3F46]/80"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What's included
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Everything you need. Nothing you don't.
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Every project includes the fundamentals done correctly — not as add-ons.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-6 border border-[#18181B]/8 shadow-sm"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.10)" }}
                  >
                    <item.icon size={18} color="#F97316" />
                  </div>
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#3F3F46]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom vs. template comparison */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why it matters
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Custom-coded vs. page builders
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Templates are fast to launch. But they carry real trade-offs for businesses that want to compete locally.
              </p>
            </div>
            <div className="rounded-2xl border border-[#18181B]/10 overflow-hidden">
              <div className="grid grid-cols-3 bg-[#18181B] text-white text-sm font-semibold py-4 px-6"
                style={{ fontFamily: "var(--font-heading)" }}>
                <span className="text-white/50">Feature</span>
                <span style={{ color: "#F97316" }}>Custom-coded</span>
                <span className="text-white/50">Template / page builder</span>
              </div>
              {comparisons.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 px-6 py-5 text-sm gap-4 border-t border-[#18181B]/8 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#FAFAF9]"
                  }`}
                >
                  <span
                    className="font-semibold text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {row.feature}
                  </span>
                  <span
                    className="text-[#3F3F46]/80"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {row.custom}
                  </span>
                  <span
                    className="text-[#3F3F46]/40"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {row.template}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How it works
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                From first call to live site
              </h2>
              <p
                className="text-lg text-[#3F3F46]/60 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-body)" }}
              >
                A clear, predictable process — so nothing surprises you.
              </p>
            </div>
            <div className="grid md:grid-cols-5 gap-6">
              {processSteps.map((step) => (
                <div key={step.number} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "#18181B" }}
                  >
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#F97316", fontFamily: "var(--font-heading)" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold text-[#18181B] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs text-[#3F3F46]/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing orientation */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10 p-10 md:p-14">
              <div className="text-center mb-10">
                <p
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Pricing
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#18181B] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Flat-fee. No hourly billing. No surprises.
                </h2>
                <p
                  className="text-[#3F3F46]/60 max-w-lg mx-auto"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Most small business websites we build fall in the <strong className="text-[#18181B]">$2,500–$4,000</strong> range. You receive a fixed-price quote before any work begins — the number won't change unless you change the scope.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {[
                  { label: "Typical range", value: "$2,500–$4,000" },
                  { label: "Timeline", value: "2–3 weeks" },
                  { label: "Payment structure", value: "50% upfront, 50% at launch" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl p-6 border border-[#18181B]/8 text-center"
                  >
                    <p
                      className="text-2xl font-bold text-[#18181B] mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs text-[#3F3F46]/50"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/#estimator"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#ea6c0a] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Use the project cost estimator <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mini FAQ */}
        <section className="py-24 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Common questions
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#18181B]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Web development FAQ
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-white rounded-xl border border-[#18181B]/10 p-6"
                >
                  <h3
                    className="text-base font-semibold text-[#18181B] mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    className="text-sm text-[#3F3F46]/70 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let's build something
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready for a website that does its job?
            </h2>
            <p
              className="text-white/60 text-lg max-w-lg mx-auto mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Schedule a free 30-minute call. We'll assess your situation, answer your questions, and tell you exactly what we'd recommend — with no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+17072396725"
                className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white px-7 py-3 rounded-md text-sm font-semibold border border-white/20 hover:border-white/40 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Call (707) 239-6725
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
