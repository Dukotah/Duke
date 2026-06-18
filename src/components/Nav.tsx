"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PHONE, PHONE_HREF, BOOKING_URL } from "@/config/site";
import { track } from "@/lib/analytics";
import { MagneticCTA } from "@/components/motion";

const links = [
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

// Active-link match: a link is active when the current path is its route (or a
// child of it). Hash/home links ("/#services") only highlight on the homepage.
function isActive(href: string, pathname: string): boolean {
  if (href.startsWith("/#")) return pathname === "/";
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// `light` is for pages whose hero/top section is light (FAQ, About, Terms, and
// the white-background blog articles). With the dark + copper system, those
// pages get a SOLID near-black bar (--bg-0) at all times so the warm-white nav
// stays legible over still-light page content — never a transparent nav whose
// text vanishes. Pages with a dark hero (the majority) leave it false: the nav
// floats transparent over the hero gradient and frosts into dark glass on
// scroll (the Stripe/Linear glass-over-hero look). Defaulting to false is the
// safe choice: a missed dark-hero page still shows a readable frosted bar once
// scrolled, and a solid dark bar is legible over any background.
export default function Nav({ light = false }: { light?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

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

  // `floating` = the nav is transparent over a dark hero (dark-hero page, not
  // scrolled, drawer closed). Otherwise the chrome is opaque/glass:
  //  - light interior pages → solid near-black bar (always legible over light)
  //  - dark-hero page once scrolled (or drawer open) → frosted dark glass
  const floating = !light && !scrolled && !open;
  // Glass (translucent + blur) only over the dark hero on scroll. Light pages
  // use a fully solid bar so the dark nav reads cleanly over light content.
  const glass = scrolled && !light;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-[background-color,border-color] ${
        floating
          ? "bg-transparent border-b border-transparent"
          : glass
            ? "bg-[var(--bg-0)]/80 backdrop-blur-md border-b border-hairline shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]"
            : "bg-[var(--bg-0)] border-b border-hairline shadow-[0_8px_24px_-16px_rgba(0,0,0,0.7)]"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ease-out motion-reduce:transition-none ${
          // Sticky shrink: taller floating over the hero, condensed once solid.
          floating ? "h-[4.5rem]" : "h-16"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.98]"
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
            className="text-xl font-bold tracking-tight text-warm transition-colors duration-300"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Copper Bay
            <span className="text-copper transition-colors group-hover:text-copper-bright">Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = isActive(l.href, pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`group relative px-3 py-2 text-sm font-medium rounded-md outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                  active
                    ? "text-warm"
                    : "text-warm-2 hover:text-warm hover:bg-warm/[0.06]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {l.label}
                {/* Copper active-link underline indicator. Scales in from the
                    left on the active route; a fainter version previews on
                    hover. Drops its transition under reduced motion. */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px origin-left bg-copper transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100 bg-copper-dim"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions: tap-to-call + primary CTA */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={PHONE_HREF}
            onClick={() => track("cta_call_phone", { location: "nav" })}
            className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-warm outline-none transition-colors duration-200 hover:bg-warm/[0.06] focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-label={`Call Copper Bay Tech at ${PHONE}`}
          >
            <Phone size={15} className="text-copper" />
            {PHONE}
          </a>
          <MagneticCTA
            as="link"
            href={BOOKING_URL}
            onClick={() => track("cta_consultation", { location: "nav" })}
            className="group inline-flex items-center justify-center px-5 py-2 rounded-md text-sm font-semibold text-warm bg-copper outline-none transition-[background-color,box-shadow] duration-200 hover:bg-copper-bright hover:shadow-[0_0_0_1px_var(--copper-dim),0_8px_24px_-10px_var(--copper-glow)] focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a free consultation
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </MagneticCTA>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-3 rounded-md text-warm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:bg-warm/[0.06] active:scale-95"
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
          open ? "max-h-[28rem] opacity-100 border-hairline" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <nav
          className="bg-[var(--bg-0)]/95 backdrop-blur-md px-6 pt-3 pb-6 flex flex-col"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          aria-label="Mobile"
        >
          {links.map((l, i) => {
            const active = isActive(l.href, pathname);
            return (
              <Link
                key={l.href}
                ref={i === 0 ? firstLinkRef : undefined}
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center justify-between py-3 text-base font-medium border-b border-hairline rounded-md px-1 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-copper ${
                  active ? "text-warm" : "text-warm-2 hover:text-warm"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="inline-flex items-center gap-2">
                  {/* Copper active-route marker for the mobile list. */}
                  <span
                    aria-hidden
                    className={`h-4 w-px rounded-full transition-colors ${active ? "bg-copper" : "bg-transparent"}`}
                  />
                  {l.label}
                </span>
                <ArrowRight
                  size={16}
                  className="text-warm-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-copper"
                />
              </Link>
            );
          })}
          <a
            href={PHONE_HREF}
            onClick={() => { track("cta_call_phone", { location: "nav" }); setOpen(false); }}
            tabIndex={open ? 0 : -1}
            className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-base font-semibold text-warm border border-hairline bg-[var(--bg-2)] outline-none transition-colors duration-200 hover:bg-[var(--bg-3)] focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)] active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Phone size={16} className="text-copper" />
            {PHONE}
          </a>
          <Link
            href={BOOKING_URL}
            onClick={() => { track("cta_consultation", { location: "nav" }); setOpen(false); }}
            tabIndex={open ? 0 : -1}
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-base font-semibold text-warm bg-copper outline-none transition-colors duration-200 hover:bg-copper-bright focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-0)] active:scale-[0.98]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book a free consultation
            <ArrowRight size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
