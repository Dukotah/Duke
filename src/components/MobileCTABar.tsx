"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, CalendarDays } from "lucide-react";
import { PHONE, PHONE_HREF, BOOKING_URL } from "@/config/site";

// A persistent one-tap "call / book" bar for mobile, revealed after the hero
// scrolls off. Hidden on app/utility routes where a marketing CTA doesn't belong
// (the CRM, generated reports, the assessment/quiz flow, the thank-you page).
const HIDDEN_PREFIXES = ["/crm", "/report", "/assessment", "/thank-you"];

export default function MobileCTABar() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (hidden) return null;

  const H = { fontFamily: "var(--font-heading)" };

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#18181B]/10 bg-white/95 px-3 py-2.5 backdrop-blur transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      <div className="flex gap-2">
        <a
          href={PHONE_HREF}
          aria-label={`Call ${PHONE}`}
          tabIndex={show ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border-2 border-[#18181B] py-2.5 text-sm font-semibold text-[#18181B] outline-none transition-colors hover:bg-[#18181B]/[0.04] focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
          style={H}
        >
          <Phone size={15} aria-hidden={true} /> Call
        </a>
        <Link
          href={BOOKING_URL}
          tabIndex={show ? 0 : -1}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-[#F97316] py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-[#ea6c0a] focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
          style={H}
        >
          <CalendarDays size={15} aria-hidden={true} /> Book a call
        </Link>
      </div>
    </div>
  );
}
