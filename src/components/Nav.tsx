"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/#about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAFAF9]/95 backdrop-blur border-b border-[#18181B]/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: scrolled ? "#18181B" : "#ffffff" }}
          >
            Copper Bay
            <span style={{ color: "#F97316" }}>Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
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

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/assessment"
            className={`text-sm font-semibold transition-colors ${scrolled ? "text-[#3F3F46]/60 hover:text-[#18181B]" : "text-white/60 hover:text-white"}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Assessment
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center px-5 py-2 rounded-md text-sm font-semibold text-white transition-colors bg-[#F97316] hover:bg-[#ea6c0a]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a Call
          </Link>
        </div>

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
            href="/assessment"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-[#F97316]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Assessment →
          </Link>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a Call
          </Link>
        </div>
      )}
    </header>
  );
}
