import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PRICING } from "@/config/pricing";

export const metadata: Metadata = {
  title: "Email Marketing & Newsletter Management Sonoma County | Copper Bay Tech",
  description:
    "Done-for-you email newsletters for Sonoma County small businesses. We write, design, send, and report. Flat monthly fee, no contracts. Serving Petaluma, Santa Rosa & the North Bay.",
  keywords:
    "email marketing Sonoma County, newsletter management Petaluma, small business email marketing Santa Rosa, done for you newsletter North Bay, email marketing agency Sonoma County",
  openGraph: {
    title: "Email Marketing & Newsletters for Sonoma County Small Businesses | Copper Bay Tech",
    description:
      "Your customer list is the cheapest marketing you own, and most businesses never use it. We write and send your newsletter every month for a flat fee.",
    url: "https://copperbaytech.com/services/email-marketing",
  },
  alternates: {
    canonical: "https://copperbaytech.com/services/email-marketing",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Email Marketing & Newsletter Management",
  description:
    "Done-for-you email newsletter and email marketing management for small businesses in Sonoma County, CA: strategy, copywriting, design, sending, list management, automations, and monthly reporting.",
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
  url: "https://copperbaytech.com/services/email-marketing",
  serviceType: "Email Marketing",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: PRICING.email.low,
    highPrice: PRICING.email.high,
  },
};

const plans = [
  {
    name: "Essentials",
    price: "$195",
    cadence: "/mo",
    tagline: "One great newsletter a month, handled end to end.",
    features: [
      "1 campaign per month, written, designed, and sent for you",
      "List management: imports, unsubscribes, cleanup",
      "Signup form on your website",
      "Plain-English monthly report (opens, clicks, revenue)",
      "Month-to-month, cancel anytime",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$395",
    cadence: "/mo",
    tagline: "Steady sends plus the automations that do the selling.",
    features: [
      "2 campaigns per month",
      "Automated welcome series for new subscribers",
      "Review & referral request emails",
      "Basic segmentation (customers vs. prospects)",
      "Quarterly content calendar planned with you",
    ],
    popular: true,
  },
  {
    name: "Full Service",
    price: "$695",
    cadence: "/mo",
    tagline: "Email as a real sales channel, run for you.",
    features: [
      "Weekly campaigns + promo calendar",
      "Win-back automation for lapsed customers",
      "Subject line A/B testing",
      "Advanced segmentation & targeting",
      "Priority turnaround on one-off sends",
    ],
    popular: false,
  },
];

const included = [
  {
    title: "We write it",
    desc: "You talk, we type. A quick monthly check-in (or just a voicemail) is all we need to turn what's happening in your business into an email your customers actually want to read.",
  },
  {
    title: "Branded design",
    desc: "A clean email template built to match your website and logo, readable on every phone and inbox. Set up once during onboarding, reused every send so your emails are instantly recognizable.",
  },
  {
    title: "Deliverability done right",
    desc: "SPF, DKIM, and DMARC configured on your domain so your emails land in the inbox instead of spam. We set this up during onboarding. It is the same hardening we do in our security work.",
  },
  {
    title: "List management",
    desc: "We import your existing contacts, clean out dead addresses, handle unsubscribes, and grow the list with signup forms on your website. You own the list and the account, always.",
  },
  {
    title: "Automations",
    desc: "Welcome emails for new subscribers, review requests after a job wraps, win-back notes to customers you haven't seen in a while. Written once, then working for you around the clock.",
  },
  {
    title: "Reporting that makes sense",
    desc: "No dashboard homework. Once a month you get a short plain-English summary: who opened, what they clicked, what it drove, and what we're trying next.",
  },
];

const faqs = [
  {
    q: "We've collected customer emails for years but never sent anything. Is that normal?",
    a: "Extremely. Most small businesses have a list sitting in a point of sale system, an old spreadsheet, or an inbox, and it is worth more than any ad budget. Those people already know and trust you. A simple monthly email is usually the best marketing a local business can do, because the audience is free and already warm.",
  },
  {
    q: "Who owns the email list and the account?",
    a: "You do, completely. We set everything up in an email platform account registered to your business, and we work inside it. If you ever leave, the list, the templates, and the history stay with you. No hostage situations.",
  },
  {
    q: "What do you need from me each month?",
    a: "About ten minutes. A quick call, a text, or a few notes about what is new. A promotion, a project you are proud of, a seasonal reminder. We turn that into the email, send you a preview to approve, and handle the rest.",
  },
  {
    q: "Is this legal? I've heard about spam laws.",
    a: "Sending to your own customers and people who signed up is exactly what the law allows. We handle the compliance details for you: a working unsubscribe link in every email, your business address in the footer, and prompt removal of anyone who opts out, as CAN-SPAM requires.",
  },
  {
    q: "What's the one-time setup fee for?",
    a: "The $250 setup covers everything that happens before the first send: the email platform account, domain authentication (SPF, DKIM, DMARC) so you land in inboxes, your branded template, importing and cleaning your list, signup forms on your site, and a welcome email. We waive it when we build your website or you're on a care plan.",
  },
  {
    q: "What platform do you use?",
    a: "We work in proven small-business platforms like Mailchimp or Brevo, set up under your account. The platform's own fee is usually free or under $30/month at typical local-business list sizes, and it's billed directly to you so there's no markup hiding in our price.",
  },
];

export default function EmailMarketingPage() {
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
              className="inline-block bg-copper/10 text-copper-bright text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-copper-dim"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Email Marketing · Sonoma County, CA
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your customer list is a gold mine.{" "}
              <span className="text-copper-bright">We&apos;ll work it for you.</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Every month you don&apos;t email your customers, somebody else does. A
              simple, well written newsletter keeps your business the first name
              they think of, and it costs less than what one new customer is
              worth. We write it, design it, send it, and show you what it
              earned. You approve a preview and get back to work.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-copper hover:bg-copper-bright text-ink-0 font-bold px-6 py-3 rounded-lg transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Start my newsletter →
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See plans & pricing ↓
              </Link>
            </div>
          </div>
        </section>

        {/* Why email */}
        <section className="bg-ink-1 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why a newsletter beats another ad campaign
            </h2>
            <p
              className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ads rent attention from strangers. Email talks to people who
              already chose you once. For a local business, that difference is
              everything.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "The audience is free",
                  desc: "You already paid to earn these customers. Emailing them costs pennies, and repeat customers spend more and refer more than new ones. Email consistently returns more per dollar than any paid channel a small business can buy.",
                },
                {
                  title: "Stay first in mind",
                  desc: "Most customers don't leave because they're unhappy. They drift away because they forgot about you. A monthly email keeps your name in their inbox, so when they need what you do, you're the call they make instead of whoever Google shows them first.",
                },
                {
                  title: "Fill the slow seasons",
                  desc: "A well-timed email moves real revenue on demand: a spring tune-up reminder, a holiday booking push, a slow-week promotion. Your list is the one marketing channel you can pull like a lever, exactly when you need it.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-ink-2 rounded-xl p-6 border border-hairline"
                >
                  <h3
                    className="text-xl font-bold text-white mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-zinc-400 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-ink-0 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Everything handled, start to send
            </h2>
            <p
              className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              &quot;I know I should send a newsletter&quot; is where most businesses
              stall. Writing it, designing it, and wrestling the software is a
              job nobody has time for. That job is ours now.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {included.map((service) => (
                <div
                  key={service.title}
                  className="bg-ink-1 rounded-xl p-6 border border-hairline"
                >
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

        {/* Pricing */}
        <section id="pricing" className="bg-ink-1 py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Flat monthly plans, no contracts
            </h2>
            <p
              className="text-zinc-400 text-lg mb-12 max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              One-time setup is $250. That covers the platform account, domain
              authentication, your branded template, list import, and signup
              forms. We waive it when we build your website or you&apos;re on
              any care plan.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 border ${
                    plan.popular
                      ? "border-copper bg-ink-2 relative"
                      : "border-hairline bg-ink-2"
                  }`}
                >
                  {plan.popular && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-copper text-ink-0 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Most popular
                    </span>
                  )}
                  <h3
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mb-3">
                    <span
                      className="text-4xl font-bold text-copper-bright"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-zinc-400 text-sm">{plan.cadence}</span>
                  </div>
                  <p
                    className="text-zinc-400 text-sm mb-6 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {plan.tagline}
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-white/80"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-copper" />
                        {f}
                      </li>
                    ))}
                  </ul>
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
              {faqs.map((item) => (
                <div key={item.q} className="border-b border-hairline pb-8">
                  <h3
                    className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.q}
                  </h3>
                  <p
                    className="text-zinc-400 leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
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
              Your first issue could go out this month.
            </h2>
            <p
              className="text-white/70 text-lg mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Tell us about your business and your list, even if it&apos;s a shoebox
              of business cards. We&apos;ll tell you honestly what a newsletter can do
              for you, and what it can&apos;t, in a free 30 minute call.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-copper hover:bg-copper-bright text-ink-0 font-bold px-6 py-3 rounded-lg transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get started →
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See all pricing ↗
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
