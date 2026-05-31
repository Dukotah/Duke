import Link from "next/link";

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
    { label: "IT Support — Sonoma County", href: "/it-support-sonoma-county" },
    { label: "IT Support — Santa Rosa", href: "/it-support-santa-rosa" },
    { label: "IT Support — Petaluma", href: "/it-support-petaluma" },
    { label: "Cybersecurity for Small Business", href: "/cybersecurity-small-business" },
    { label: "Our Work", href: "/work" },
  ];

  return (
    <footer className="bg-[#18181B] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <p className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
            </p>
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Custom-built technology for Sonoma County businesses. Websites, IT support, and cybersecurity — done right.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Navigation
            </p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Services
            </p>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Contact
            </p>
            <ul className="space-y-2">
              <li>
                <a href="tel:+17072396725" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  (707) 239-6725
                </a>
              </li>
              <li>
                <a href="mailto:duke@copperbaytech.com" className="text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  duke@copperbaytech.com
                </a>
              </li>
              <li>
                <p className="text-sm text-white/50" style={{ fontFamily: "var(--font-heading)" }}>
                  Serving Sonoma County, CA
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30" style={{ fontFamily: "var(--font-body)" }}>
            &copy; {year} Copper Bay Tech. All rights reserved.
          </p>
          <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
