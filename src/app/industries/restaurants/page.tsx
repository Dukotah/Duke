import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, ArrowLeft, Wifi, Monitor, Globe, ShieldCheck, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Support & Websites for Restaurants in Sonoma County | Copper Bay Tech",
  description:
    "POS support, reliable Wi-Fi, online ordering, and restaurant websites for Sonoma County food businesses. Local IT help from Copper Bay Tech in Santa Rosa.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IT Support & Web Development for Restaurants",
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
    "Technology support for restaurants and food service businesses in Sonoma County: POS systems, Wi-Fi, online ordering websites, and cybersecurity.",
};

const painPoints = [
  { problem: "POS system crashes during dinner rush", solution: "We set up reliable networks and keep POS systems running — with a local tech you can actually call." },
  { problem: "Guest Wi-Fi that's slow or insecure", solution: "Properly segmented guest and staff networks so customers stay happy and your POS traffic stays protected." },
  { problem: "No online ordering or a clunky third-party app eating margins", solution: "Custom website with direct online ordering that puts money in your pocket, not DoorDash's." },
  { problem: "Website that looks like it was built in 2010", solution: "Mobile-first restaurant website with your menu, hours, reservation link, and photos that actually make people hungry." },
];

const services = [
  { icon: Monitor, title: "POS Support & Setup", desc: "Toast, Square, Clover, and others. Network configuration, troubleshooting, and staff training." },
  { icon: Wifi, title: "Reliable In-House Wi-Fi", desc: "Separate guest and staff networks, dead-zone elimination, and router setup that handles a full dining room." },
  { icon: Globe, title: "Restaurant Websites", desc: "Fast, mobile-first sites with menus, hours, photo galleries, reservation links, and local SEO." },
  { icon: ShieldCheck, title: "Payment & Data Security", desc: "PCI-aware network setup and basic security practices to protect customer payment data." },
];

export default function RestaurantsPage() {
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
              Restaurants & Food Service
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tech that keeps your{" "}
              <span style={{ color: "#F97316" }}>restaurant running</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl mb-10 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              From farm-to-table spots in Healdsburg to busy pizza joints in Santa Rosa, Sonoma County restaurants deal with the same technology headaches. We fix them — fast — and build the web presence that fills tables.
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
              Problems we solve for restaurants
            </h2>
            <div className="space-y-6">
              {painPoints.map(({ problem, solution }) => (
                <div key={problem} className="bg-white rounded-2xl p-6 border border-[#18181B]/8 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Problem:</span>
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
              What we offer restaurants
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {services.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(249,115,22,0.12)" }}
                  >
                    <Icon size={20} style={{ color: "#F97316" }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#18181B] mb-1" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
                    <p className="text-sm text-[#3F3F46]/60 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{desc}</p>
                  </div>
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
              Ready to upgrade your restaurant&rsquo;s tech?
            </h2>
            <p className="text-white/50 mb-8" style={{ fontFamily: "var(--font-body)" }}>
              Local support across Sonoma County. Quick turnaround, flat-fee pricing, no jargon.
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
