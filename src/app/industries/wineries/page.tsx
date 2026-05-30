import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, ShoppingCart, Globe, Wifi, Monitor, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Websites & IT Support for Wineries in Sonoma County | Copper Bay Tech",
  description:
    "Wine club websites, e-commerce, tasting room IT, and POS support for Sonoma County wineries and tasting rooms. Copper Bay Tech, based in Santa Rosa.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Websites & IT Support for Wineries",
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
    "Wine club websites, direct-to-consumer e-commerce, tasting room IT, and POS support for wineries and tasting rooms throughout Sonoma County.",
};

const painPoints = [
  { problem: "Wine club website that's hard to manage and losing DTC sales", solution: "We build or upgrade wine club sites with e-commerce that actually converts — integrated with your club management software and easy to update yourself." },
  { problem: "Tasting room POS system that goes offline during peak weekends", solution: "Reliable network infrastructure and POS support so your system stays up when the weekend crowds arrive. Local tech means fast response." },
  { problem: "Poor guest Wi-Fi experience in the tasting room", solution: "Properly configured guest and staff networks so visitors can post to Instagram without slowing down your POS or reservation system." },
  { problem: "Website that doesn't rank for winery searches", solution: "SEO-optimized winery website with your wine list, tasting experiences, events calendar, and local schema that helps you appear when visitors search for Sonoma County wineries." },
];

const services = [
  { icon: ShoppingCart, title: "Wine Club & E-Commerce", desc: "DTC wine sales integrated with Commerce7, WineDirect, or custom solutions. Club signup flows, member portals, and automatic shipment pages." },
  { icon: Globe, title: "Winery Websites", desc: "Beautifully designed, fast-loading sites that showcase your wines, story, estate, and experiences — optimized for the searches that bring visitors to your door." },
  { icon: Wifi, title: "Tasting Room Wi-Fi", desc: "Reliable, segmented networks so guests have a great experience while your POS and reservation system run on their own dedicated connection." },
  { icon: Monitor, title: "POS & Reservation Support", desc: "Square, Toast, Tock, Resy, and others. We configure, troubleshoot, and train staff so tech never slows down a great guest experience." },
  { icon: Users, title: "Staff Onboarding & Training", desc: "New seasonal hire starting? We set up accounts, configure devices, and do quick-start training so they&rsquo;re productive from day one." },
  { icon: CheckCircle, title: "Ongoing IT Support", desc: "A local tech partner you can call when something breaks — not a ticket queue. Serving Sonoma County wineries year-round." },
];

export default function WineriesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Nav />
      <main>
        <section className="bg-[#18181B] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft size={14} /> All Industries
            </Link>
            <span
              className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}
            >
              Wineries & Tasting Rooms
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Technology built for{" "}
              <span style={{ color: "#F97316" }}>Sonoma County wine country</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              From boutique tasting rooms in the Russian River Valley to larger estate operations in Alexander Valley, Sonoma County wineries need technology that works as reliably as their hospitality. We help with everything from wine club websites to tasting room IT.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talk to us <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Challenges we solve for wineries
            </h2>
            <div className="space-y-6">
              {painPoints.map(({ problem, solution }) => (
                <div key={problem} className="bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#F97316] shrink-0" style={{ fontFamily: "var(--font-heading)" }}>Problem:</span>
                    <p className="text-sm font-medium text-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>{problem}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={15} className="shrink-0 mt-0.5 text-[#F97316]" />
                    <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-3xl font-bold text-[#18181B] mb-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Winery technology services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-[#FAFAF9] rounded-2xl p-6 border border-[#18181B]/8">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DTC callout */}
        <section className="py-16 bg-[#FAFAF9]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-white rounded-2xl p-8 border border-[#18181B]/8">
              <h3 className="text-xl font-bold text-[#18181B] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                DTC is your highest-margin channel — your website should reflect that
              </h3>
              <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Direct-to-consumer wine sales generate more per bottle than any wholesale channel. But many winery websites make it harder than it should be to join a club, purchase a bottle, or book a tasting. We build sites that are easy to update, fast to load, and designed to convert the traffic you already have.
              </p>
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
              Let&rsquo;s upgrade your winery&rsquo;s technology
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Local IT and web development for Sonoma County wineries. Call (707) 239-6725 or send a message.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
