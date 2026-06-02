import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    description: "IT consulting, web development, and cybersecurity for Sonoma County businesses.",
    url: "https://copperbaytech.com",
    telephone: "+17072396725",
    email: "duke@copperbaytech.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Petaluma",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: ["Petaluma","Santa Rosa","Sebastopol","Rohnert Park","Sonoma","Bodega Bay","Cotati","Windsor","Healdsburg"],
    serviceType: ["Web Development","IT Consulting","Cybersecurity","Network Setup","Process Automation"],
  };

  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/#about" },
    { label: "Resources", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

  const serviceLinks = [
    { label: "Web Design — Sonoma County", href: "/web-design-sonoma-county" },
    { label: "Web Design — Santa Rosa", href: "/web-design-santa-rosa" },
    { label: "Web Design — Petaluma", href: "/web-design-petaluma" },
    { label: "Web Design — Rohnert Park", href: "/web-design-rohnert-park" },
    { label: "IT Support — Sonoma County", href: "/it-support-sonoma-county" },
    { label: "IT Support — Santa Rosa", href: "/it-support-santa-rosa" },
    { label: "IT Support — Petaluma", href: "/it-support-petaluma" },
    { label: "IT Support — Windsor", href: "/it-support-windsor" },
    { label: "IT Support — Healdsburg", href: "/it-support-healdsburg" },
    { label: "Cybersecurity for Small Business", href: "/cybersecurity-small-business" },
    { label: "Our Work", href: "/work" },
  ];

  const linkClass =
    "group inline-flex items-center gap-1 text-sm text-white/55 rounded-sm outline-none transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]";
  const headingClass =
    "text-xs font-semibold uppercase tracking-[0.18em] text-[#F97316] mb-5";

  return (
    <footer className="relative bg-[#18181B] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Top hairline accent */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-[#F97316]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-14">
          <div className="lg:pr-4">
            <Link
              href="/"
              className="inline-block text-2xl font-bold rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Copper Bay<span className="text-[#F97316]">Tech</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/55 max-w-xs text-pretty" style={{ fontFamily: "var(--font-body)" }}>
              Custom-built technology for Sonoma County businesses. Websites, IT support, and cybersecurity — done right.
            </p>
          </div>

          <div>
            <p className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Navigation
            </p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass} style={{ fontFamily: "var(--font-heading)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Services
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass} style={{ fontFamily: "var(--font-heading)" }}>
                    <span>{l.label}</span>
                    <ArrowUpRight size={13} className="shrink-0 text-white/0 -translate-x-1 transition-all duration-200 group-hover:text-[#F97316] group-hover:translate-x-0 group-focus-visible:text-[#F97316] group-focus-visible:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Contact
            </p>
            <ul className="space-y-4">
              <li>
                <a href="tel:+17072396725" className={`${linkClass} items-start`} style={{ fontFamily: "var(--font-heading)" }}>
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#F97316]" />
                  (707) 239-6725
                </a>
              </li>
              <li>
                <a href="mailto:duke@copperbaytech.com" className={`${linkClass} items-start`} style={{ fontFamily: "var(--font-heading)" }}>
                  <Mail size={15} className="mt-0.5 shrink-0 text-[#F97316]" />
                  duke@copperbaytech.com
                </a>
              </li>
              <li className="flex items-start gap-1 text-sm text-white/55" style={{ fontFamily: "var(--font-heading)" }}>
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#F97316]" />
                Serving Sonoma County, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-body)" }}>
            &copy; {year} Copper Bay Tech. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-xs text-white/40 rounded-sm outline-none transition-colors hover:text-white/70 focus-visible:text-white/70 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
