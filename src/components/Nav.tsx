"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#F5F4F0]/95 backdrop-blur border-b border-[#1C3A5E]/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "#1C3A5E" }}
          >
            Copper Bay
            <span style={{ color: "#C8A96E" }}>Tech</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#1A1A1A]/70 hover:text-[#1C3A5E] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-md text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#2D6A4F", fontFamily: "var(--font-heading)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#235540")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2D6A4F")}
        >
          Free Consultation
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[#1C3A5E]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#F5F4F0] border-t border-[#1C3A5E]/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#1A1A1A]/80 hover:text-[#1C3A5E]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white"
            style={{ backgroundColor: "#2D6A4F", fontFamily: "var(--font-heading)" }}
          >
            Free Consultation
          </a>
        </div>
      )}
    </header>
  );
}
