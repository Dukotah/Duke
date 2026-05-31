"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/#contact" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--linen)]/80 backdrop-blur-xl border-b border-[var(--ink-900)]/8 shadow-[0_8px_30px_rgba(14,16,20,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="grid place-items-center w-8 h-8 rounded-lg text-sm font-bold text-white shadow-[0_4px_14px_rgba(232,133,58,0.4)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
            style={{ background: "var(--grad-copper)", fontFamily: "var(--font-heading)" }}
          >
            C
          </span>
          <span
            className="text-xl font-bold tracking-tight transition-colors duration-300"
            style={{ fontFamily: "var(--font-heading)", color: scrolled ? "#18181B" : "#ffffff" }}
          >
            Copper Bay
            <span className="text-gradient-copper">Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`link-underline text-sm font-medium transition-colors ${scrolled ? "text-[#3F3F46]/70 hover:text-[#18181B]" : "text-white/80 hover:text-white"}`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/#contact"
          className="btn-copper hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
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
        <div className="md:hidden bg-[var(--linen)]/95 backdrop-blur-xl border-t border-[#18181B]/10 px-6 py-4 flex flex-col gap-4">
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
            className="btn-copper inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
