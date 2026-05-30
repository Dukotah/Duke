"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

const serviceLinks = [
  { label: "Web Development", href: "/web-development" },
  { label: "IT Support", href: "/it-support" },
  { label: "Cybersecurity", href: "/cybersecurity" },
];

const otherLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setServicesOpen(false); setOpen(false); }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAFAF9]/95 backdrop-blur border-b border-[#18181B]/10 shadow-sm" : "bg-transparent"
      }`}
      role="banner"
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
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${scrolled ? "text-[#3F3F46]/70 hover:text-[#18181B]" : "text-white/80 hover:text-white"}`}
              style={{ fontFamily: "var(--font-heading)" }}
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              aria-controls="services-dropdown"
            >
              Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {servicesOpen && (
              <div id="services-dropdown" role="menu" className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#18181B]/10 py-2 z-50">
                {serviceLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm text-[#3F3F46]/70 hover:text-[#18181B] hover:bg-[#FAFAF9] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                    onClick={() => setServicesOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${scrolled ? "text-[#3F3F46]/70 hover:text-[#18181B]" : "text-white/80 hover:text-white"}`}
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
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-[#FAFAF9] border-t border-[#18181B]/10 px-6 py-4 flex flex-col gap-4">
          {/* Services expandable */}
          <div>
            <button
              className="flex items-center gap-1 text-sm font-medium text-[#3F3F46]/80 hover:text-[#18181B] w-full text-left"
              style={{ fontFamily: "var(--font-heading)" }}
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              aria-expanded={mobileServicesOpen}
              aria-controls="mobile-services-menu"
            >
              Services <ChevronDown size={14} className={`ml-auto transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {mobileServicesOpen && (
              <div id="mobile-services-menu" className="mt-2 ml-4 flex flex-col gap-3">
                {serviceLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-[#3F3F46]/70 hover:text-[#18181B]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {otherLinks.map((l) => (
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
