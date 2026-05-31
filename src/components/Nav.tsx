"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

const services = [
  { label: "Web Development", href: "/services/web-development", desc: "Fast, custom-coded websites" },
  { label: "IT Support & Networking", href: "/services/it-support", desc: "Managed support that just works" },
  { label: "Cybersecurity", href: "/services/cybersecurity", desc: "Audits & network security" },
];

const links = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Free Audit", href: "/tools" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = scrolled
    ? "text-[#3F3F46]/70 hover:text-[#18181B]"
    : "text-white/80 hover:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAFAF9]/95 backdrop-blur border-b border-[#18181B]/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: scrolled ? "#18181B" : "#ffffff" }}
          >
            Copper Bay
            <span style={{ color: "#F97316" }}>Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/#services"
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${linkColor}`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Services
              <ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </Link>
            {servicesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
                <div className="w-72 rounded-xl bg-white border border-[#18181B]/10 shadow-lg p-2">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-4 py-3 rounded-lg hover:bg-[#FAFAF9] transition-colors"
                    >
                      <span
                        className="block text-sm font-semibold text-[#18181B]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {s.label}
                      </span>
                      <span className="block text-xs text-[#3F3F46]/50" style={{ fontFamily: "var(--font-body)" }}>
                        {s.desc}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/#services"
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#F97316] hover:underline"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${linkColor}`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/#contact"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-md text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea6c0a")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F97316")}
        >
          Free Consultation
        </Link>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 ${scrolled ? "text-[#18181B]" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#FAFAF9] border-t border-[#18181B]/10 px-6 py-4 flex flex-col gap-4">
          <span
            className="text-xs font-semibold uppercase tracking-widest text-[#3F3F46]/40"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Services
          </span>
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#3F3F46]/80 hover:text-[#18181B] pl-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {s.label}
            </Link>
          ))}
          <div className="h-px bg-[#18181B]/10" />
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#3F3F46]/80 hover:text-[#18181B]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white"
            style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}
          >
            Free Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
