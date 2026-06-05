"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PHONE, PHONE_HREF } from "@/config/site";
import { track } from "@/lib/analytics";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

// `light` is for pages whose hero/top section is light (FAQ, About, Terms, and
// the white-background blog articles). Without it the nav floats transparent
// with white text over a light background and the links/wordmark vanish until
// you scroll. Pages with a dark hero (the majority) leave it false and keep the
// glass-over-hero look. Defaulting to false is the safe choice: a missed
// dark-hero page just shows a readable solid nav, never an invisible one.
export default function Nav({ light = false }: { light?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Move focus into the drawer for keyboard users.
    firstLinkRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // When the chrome is "light" (solid linen) the text/icons go dark; when it's
  // floating over the dark hero they stay white. Drawer-open and light-bg pages
  // force solid so the nav is always legible.
  const solid = scrolled || open || light;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
        solid
          ? "bg-[#FAFAF9]/85 backdrop-blur-md border-b border-[#18181B]/10 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_8px_24px_-12px_rgba(24,24,27,0.18)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.98]"
          aria-label="Copper Bay Tech — home"
        >
          <Image
            src="/logos/logo-icon.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-lg"
          />
          <span
            className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              solid ? "text-[#18181B]" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Copper Bay
            <span className="text-[#F97316] transition-colors group-hover:text-[#ea6c0a]">Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative px-3 py-2 text-sm font-medium rounded-md outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                solid
                  ? "text-[#3F3F46] hover:text-[#18181B] hover:bg-[#18181B]/[0.04]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions: tap-to-call + primary CTA */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={PHONE_HREF}
            onClick={() => track("cta_call_phone", { location: "nav" })}
            className={`group inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 ${
              solid
                ? "text-[#18181B] hover:bg-[#18181B]/[0.04] focus-visible:ring-offset-[#FAFAF9]"
                : "text-white hover:bg-white/10 focus-visible:ring-offset-transparent"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
            aria-label={`Call Copper Bay Tech at ${PHONE}`}
          >
            <Phone size={15} className="text-[#F97316]" />
            {PHONE}
          </a>
          <Link
            href="/#contact"
            onClick={() => track("cta_consultation", { location: "nav" })}
            className="group inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-semibold text-white bg-[#F97316] shadow-sm outline-none transition-all duration-200 hover:bg-[#ea6c0a] hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF9] active:translate-y-0 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Consultation
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={`md:hidden inline-flex items-center justify-center p-2 rounded-md outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 active:scale-95 ${
            solid ? "text-[#18181B] focus-visible:ring-offset-[#FAFAF9] hover:bg-[#18181B]/[0.04]" : "text-white focus-visible:ring-offset-transparent hover:bg-white/10"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        inert={!open}
        className={`md:hidden overflow-hidden border-t transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? "max-h-[28rem] opacity-100 border-[#18181B]/10" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <nav
          className="bg-[#FAFAF9]/95 backdrop-blur-md px-6 pt-3 pb-6 flex flex-col"
          aria-label="Mobile"
        >
          {links.map((l, i) => (
            <Link
              key={l.href}
              ref={i === 0 ? firstLinkRef : undefined}
              href={l.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="group flex items-center justify-between py-3 text-base font-medium text-[#3F3F46] border-b border-[#18181B]/[0.06] rounded-md px-1 outline-none transition-colors duration-200 hover:text-[#18181B] focus-visible:ring-2 focus-visible:ring-[#F97316]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {l.label}
              <ArrowRight
                size={16}
                className="text-[#18181B]/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#F97316]"
              />
            </Link>
          ))}
          <a
            href={PHONE_HREF}
            onClick={() => { track("cta_call_phone", { location: "nav" }); setOpen(false); }}
            tabIndex={open ? 0 : -1}
            className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-base font-semibold text-[#18181B] border border-[#18181B]/15 bg-white outline-none transition-colors duration-200 hover:bg-[#18181B]/[0.04] focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF9] active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Phone size={16} className="text-[#F97316]" />
            {PHONE}
          </a>
          <Link
            href="/#contact"
            onClick={() => { track("cta_consultation", { location: "nav" }); setOpen(false); }}
            tabIndex={open ? 0 : -1}
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-base font-semibold text-white bg-[#F97316] shadow-sm outline-none transition-all duration-200 hover:bg-[#ea6c0a] focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF9] active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Free Consultation
            <ArrowRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
