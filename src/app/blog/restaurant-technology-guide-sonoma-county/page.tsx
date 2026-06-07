import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

export const metadata: Metadata = {
  title: "The Small Restaurant Owner's Guide to Technology in Sonoma County | Copper Bay Tech",
  description:
    "POS systems, WiFi reliability, online ordering, and data backup — a practical technology guide for Sonoma County restaurant owners.",
  alternates: { canonical: "https://copperbaytech.com/blog/restaurant-technology-guide-sonoma-county" },
  openGraph: {
    title: "The Small Restaurant Owner's Guide to Technology in Sonoma County | Copper Bay Tech",
    description:
      "POS systems, WiFi reliability, online ordering, and data backup — a practical technology guide for Sonoma County restaurant owners.",
    url: "https://copperbaytech.com/blog/restaurant-technology-guide-sonoma-county",
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "The Small Restaurant Owner's Guide to Technology in Sonoma County", description: "POS systems, WiFi reliability, online ordering, and data backup — a practical technology guide for Sonoma County restaurant owners.", url: "https://copperbaytech.com/blog/restaurant-technology-guide-sonoma-county", datePublished: "2026-03-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Restaurant Technology Sonoma County" }])} />
      <Nav />
      <main>
        <ArticleHeader tag="IT Support" title="The Small Restaurant Owner&apos;s Guide to Technology in Sonoma County" date="March 1, 2026" readTime="7 min read" />

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-[#3F3F46]/80 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-[#3F3F46]/70 mb-8 leading-relaxed">
                Running a restaurant in Sonoma County means navigating tourists, wine country foot traffic, seasonal rushes, and a customer base that expects seamless online experiences and reliable in-person service. Technology either helps you deliver that — or quietly gets in the way. Here&apos;s a practical breakdown of what actually matters.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Your POS system is your business&apos;s nervous system
              </h2>
              <p className="mb-6">
                Everything flows through your point-of-sale system — orders, payments, inventory, tips, end-of-day reports. If it goes down on a Saturday night in tourist season, you feel it immediately. Choosing the right POS (and keeping it healthy) is one of the most important tech decisions you&apos;ll make.
              </p>
              <p className="mb-6">
                For small Sonoma County restaurants, the most common systems are Toast, Square for Restaurants, and Lightspeed. Toast is popular for full-service dining and integrates well with kitchen display systems and online ordering. Square is simpler and more affordable for counter-service or smaller operations. Lightspeed works well for multi-location or higher-volume establishments.
              </p>
              <p className="mb-6">
                Whatever you run, make sure it&apos;s on a dedicated, secured network — not the same WiFi your customers use. POS systems can be compromised through shared networks, and the consequences (stolen card data, regulatory fines) are severe.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                WiFi: your customers expect it to work
              </h2>
              <p className="mb-6">
                Guest WiFi has gone from a nice-to-have to a baseline expectation — especially in wine country, where visitors are posting to Instagram, looking up Yelp reviews, and making reservations at their next stop, all from your dining room.
              </p>
              <p className="mb-6">
                The critical point: <strong>never let your guest WiFi share a network with your POS or back-office systems.</strong> Set up separate networks — one for business operations (POS, printers, back-office computers) and one for customers. This is a basic security practice that too many small restaurants skip.
              </p>
              <p className="mb-6">
                Coverage also matters. Dead spots near the back patio or upstairs dining room mean staff can&apos;t run tickets and guests get frustrated. A proper commercial WiFi setup — not a consumer router from Best Buy — handles coverage and traffic reliably. In buildings with thick walls or outdoor seating common in older Sonoma and Healdsburg properties, you&apos;ll likely need access points in multiple locations.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Online ordering and reservations
              </h2>
              <p className="mb-6">
                Customers searching &quot;dinner in Healdsburg tonight&quot; expect to be able to book a table or order directly from your website. If your competitors offer it and you don&apos;t, you&apos;re losing bookings.
              </p>
              <p className="mb-6">
                For reservations, OpenTable and Resy integrate well with Google Search (your listing shows a &quot;Reserve a table&quot; button directly in search results). For online ordering, direct ordering through your POS is usually cheaper than third-party apps like DoorDash or Grubhub, which charge 15–30% commission. Many operators use both — third-party for discovery, direct ordering for regulars.
              </p>
              <p className="mb-6">
                Make sure your online menu is current. A customer who orders something that&apos;s been off the menu for six months is a bad review waiting to happen.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Reviews and reputation management
              </h2>
              <p className="mb-6">
                In a competitive food scene like Sonoma County&apos;s, online reviews matter enormously. Yelp and Google are where visitors from the Bay Area and beyond are deciding where to eat. A few bad reviews — especially unresponded ones — can divert real bookings.
              </p>
              <p className="mb-6">
                A few practical habits that work:
              </p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li>Respond to every Google review — positive and negative. Keep responses professional and brief. Google rewards engagement, and future customers read them.</li>
                <li>Put a QR code on receipts or table cards linking to your Google Business Profile review page. Frictionless review requests dramatically increase volume.</li>
                <li>Don&apos;t pay for fake reviews or try to game Yelp&apos;s system. The penalties and customer backlash aren&apos;t worth it.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Data backup: the thing nobody thinks about until they lose everything
              </h2>
              <p className="mb-6">
                Your POS system holds years of sales data, customer records, and menu configuration. Your booking system has reservation history. Your accounting software has everything your CPA needs to do your taxes. What happens if a hard drive fails, ransomware hits, or your system provider has an outage?
              </p>
              <p className="mb-6">
                Most cloud-based POS systems handle their own data backup — but verify this explicitly with your provider. For anything running locally (on-premise servers, local accounting files, back-office computers), set up automated backups to a cloud service like Backblaze or Wasabi. Configure them to run daily, and test a restore at least once a year. Most people only discover their backup wasn&apos;t working when they actually need it.
              </p>

              <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                When to get outside help
              </h2>
              <p className="mb-6">
                Most restaurant owners are experts at hospitality, not IT. And that&apos;s fine — you don&apos;t need to become one. But having a local IT contact you can call when the POS goes down on a Friday night, the WiFi dies mid-service, or you need to securely onboard new staff devices is genuinely valuable. The cost of a local IT relationship is far lower than the cost of a service outage during a full Saturday in August.
              </p>

              <div className="mt-12 p-6 rounded-2xl bg-[#FAFAF9] border border-[#18181B]/10">
                <p className="text-sm font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  The bottom line
                </p>
                <p className="text-sm text-[#3F3F46]/60">
                  Technology should make your restaurant run smoother, not add stress. Separate your networks, back up your data, respond to your reviews, and build a relationship with a local IT pro before you&apos;re in crisis mode.
                </p>
              </div>
            </div>

            <div className="mt-16 rounded-2xl bg-[#18181B] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-3" style={{ fontFamily: "var(--font-heading)" }}>Ready to take action?</p>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Talk to a local IT expert — free.</h3>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Book a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
