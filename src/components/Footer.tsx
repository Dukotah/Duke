import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { SOCIAL, SOCIAL_URLS } from "@/config/site";

// lucide-react dropped brand glyphs (trademark), so the social marks are inline
// SVGs. Each takes a size and inherits color via `currentColor`.
type IconProps = { size?: number };
function LinkedinIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.25 8h4.5v14h-4.5V8zm7.5 0h4.31v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.5v-6.62c0-1.58-.03-3.61-2.2-3.61-2.2 0-2.54 1.72-2.54 3.5V22h-4.5V8z" />
    </svg>
  );
}
function FacebookIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}
function InstagramIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.36 2.67.95 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.38.66-.66 1.07-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.12-.66-.66-1.33-1.07-2.12-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
    </svg>
  );
}
function XIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.5h7.59l5.24 6.93L18.9 1.5zm-1.29 18.8h2.04L6.49 3.6H4.3l13.31 16.7z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  // Only the profiles that have a URL set in config render — no dead links.
  const socials = [
    { label: "LinkedIn", href: SOCIAL.linkedin, Icon: LinkedinIcon },
    { label: "Facebook", href: SOCIAL.facebook, Icon: FacebookIcon },
    { label: "Instagram", href: SOCIAL.instagram, Icon: InstagramIcon },
    { label: "X (Twitter)", href: SOCIAL.x, Icon: XIcon },
  ].filter((s) => s.href);

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Copper Bay Tech",
    description: "IT consulting, web development, and cybersecurity for Sonoma County businesses.",
    url: "https://copperbaytech.com",
    telephone: "+17072396725",
    email: "contact@copperbaytech.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: ["Petaluma","Santa Rosa","Sebastopol","Rohnert Park","Sonoma","Bodega Bay","Cotati","Windsor","Healdsburg"],
    serviceType: ["Web Development","IT Consulting","Cybersecurity","Network Setup","Process Automation"],
    // Only emitted when at least one social profile URL is configured.
    ...(SOCIAL_URLS.length > 0 ? { sameAs: SOCIAL_URLS } : {}),
  };

  const navLinks = [
    { label: "Get Started", href: "/get-started" },
    { label: "Services", href: "/#services" },
    { label: "Pricing", href: "/pricing" },
    { label: "How We Work", href: "/process" },
    { label: "Locations", href: "/locations" },
    { label: "Work", href: "/work" },
    { label: "Free IT Health Check", href: "/it-health-check" },
    { label: "Tools", href: "/tools" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/blog" },
    { label: "FAQ", href: "/faq" },
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
    { label: "AI Integration", href: "/ai-integration-small-business" },
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
              className="inline-flex items-center gap-2.5 text-2xl font-bold rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Image
                src="/logos/logo-icon.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg"
              />
              <span>Copper Bay<span className="text-[#F97316]">Tech</span></span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/55 max-w-xs text-pretty" style={{ fontFamily: "var(--font-body)" }}>
              Custom-built technology for Sonoma County businesses. Websites, IT support, and cybersecurity — done right.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex items-center gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Copper Bay Tech on ${label}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white/55 outline-none transition-colors duration-200 hover:border-[#F97316]/40 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Navigation
            </h2>
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
            <h2 className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Services
            </h2>
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
            <h2 className={headingClass} style={{ fontFamily: "var(--font-heading)" }}>
              Contact
            </h2>
            <ul className="space-y-4">
              <li>
                <a href="tel:+17072396725" className={`${linkClass} items-start`} style={{ fontFamily: "var(--font-heading)" }}>
                  <Phone size={15} className="mt-0.5 shrink-0 text-[#F97316]" />
                  (707) 239-6725
                </a>
              </li>
              <li>
                <a href="mailto:contact@copperbaytech.com" className={`${linkClass} items-start`} style={{ fontFamily: "var(--font-heading)" }}>
                  <Mail size={15} className="mt-0.5 shrink-0 text-[#F97316]" />
                  contact@copperbaytech.com
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
          <p className="text-xs text-white/55" style={{ fontFamily: "var(--font-body)" }}>
            &copy; {year} Copper Bay Tech. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-xs text-white/55 rounded-sm outline-none transition-colors hover:text-white/70 focus-visible:text-white/70 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
