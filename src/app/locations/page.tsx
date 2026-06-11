import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { SERVICE_CITIES, SERVICE_META } from "@/config/serviceCities";
import { BOOKING_URL } from "@/config/site";
import { ArrowRight, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Areas | Copper Bay Tech — Sonoma County",
  description:
    "Copper Bay Tech serves businesses across Sonoma County — web design, IT support, and cybersecurity in Santa Rosa, Petaluma, Healdsburg, Sebastopol, and more.",
  keywords: [
    "Sonoma County web design",
    "Sonoma County IT support",
    "Sonoma County cybersecurity",
    "small business tech Sonoma County",
    "Copper Bay Tech service areas",
  ],
  alternates: { canonical: "https://copperbaytech.com/locations" },
  openGraph: {
    title: "Service Areas | Copper Bay Tech",
    description:
      "Web design, IT support, and cybersecurity for businesses across Sonoma County — serving Santa Rosa, Petaluma, Healdsburg, Sebastopol, and surrounding communities.",
    url: "https://copperbaytech.com/locations",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const serviceKeys = ["web", "it", "cyber"] as const;

export default function LocationsPage() {
  const cities = Object.entries(SERVICE_CITIES);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://copperbaytech.com" },
    { name: "Locations" },
  ]);

  return (
    <>
      <Nav />
      <main>
        <JsonLd schema={breadcrumb} />

        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#18181B]">
          <div className="max-w-4xl mx-auto px-6">
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(249,115,22,0.15)",
                color: "#F97316",
                fontFamily: "var(--font-heading)",
              }}
            >
              Service Areas
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Serving all of Sonoma County.
            </h1>
            <p
              className="text-white/60 text-lg max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Copper Bay Tech is a mobile, service-area business — we come to
              you. We provide web design, IT support, and cybersecurity to small
              businesses throughout Sonoma County, from the coast to the valley
              floor.
            </p>
          </div>
        </section>

        {/* City cards */}
        <section className="py-20 bg-[#FAFAF9]">
          <div className="max-w-5xl mx-auto px-6">
            <p
              className="text-[#3F3F46]/60 text-sm mb-10 max-w-2xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Click any service link below to see location-specific pricing,
              project examples, and how we help businesses in that community.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map(([city, info]) => {
                const availableServices = serviceKeys.filter(
                  (key) => info[key]
                );

                return (
                  <div
                    key={info.slug}
                    className="rounded-xl border border-[#18181B]/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h2
                      className="font-bold text-[#18181B] text-lg mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {city}
                    </h2>

                    <ul className="space-y-2">
                      {availableServices.map((key) => {
                        const meta = SERVICE_META[key];
                        const href = `/${meta.prefix}-${info.slug}`;
                        return (
                          <li key={key}>
                            <Link
                              href={href}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-on-light hover:text-[#ea6c0a] transition-colors"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              <ArrowRight size={12} />
                              {meta.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="py-20 bg-[#18181B]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Don&apos;t see your city?
            </h2>
            <p
              className="text-white/60 mb-8 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We serve the broader Sonoma County region and surrounding areas.
              Reach out and we&apos;ll let you know if you&apos;re in our service area — and
              we&apos;ll be honest if you&apos;re not.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a Free Consultation <ArrowRight size={16} />
              </Link>
              <a
                href={BOOKING_URL}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-semibold border-2 border-white/30 text-white hover:border-white/60 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <CalendarDays size={16} />
                Book a Free Consultation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
