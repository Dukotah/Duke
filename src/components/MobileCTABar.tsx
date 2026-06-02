"use client";

import { usePathname } from "next/navigation";
import { Phone, CalendarDays } from "lucide-react";
import { CALENDLY_URL, PHONE, PHONE_HREF } from "@/config/site";
import { trackPhoneClick, trackCalendlyClick } from "@/lib/analytics";

/**
 * Sticky bottom call/book bar for mobile.
 *
 * 70%+ of local-service traffic is mobile and click-to-call is the single
 * highest-intent action for an IT/web shop — this keeps both "Call" and "Book"
 * one tap away on every marketing page. Hidden on desktop (`md:hidden`) and on
 * the internal CRM, where it would be noise. A spacer reserves room so the bar
 * never covers the footer.
 */
export default function MobileCTABar() {
  const pathname = usePathname();

  // Don't show on the internal CRM — this is a marketing-site conversion aid.
  if (pathname?.startsWith("/crm")) return null;

  return (
    <>
      {/* Spacer keeps the fixed bar from covering page content on mobile. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <nav
        aria-label="Quick contact"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden grid grid-cols-2 gap-px bg-[#18181B]/10 border-t border-[#18181B]/10 shadow-[0_-4px_20px_rgba(24,24,27,0.12)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={PHONE_HREF}
          onClick={() => trackPhoneClick("mobile_sticky_bar")}
          className="flex items-center justify-center gap-2 py-3.5 bg-white text-[#18181B] text-sm font-semibold active:bg-[#FAFAF9]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Phone size={16} aria-hidden="true" />
          Call {PHONE}
        </a>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCalendlyClick("mobile_sticky_bar")}
          className="flex items-center justify-center gap-2 py-3.5 bg-[#F97316] text-white text-sm font-semibold active:bg-[#ea6c0a]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <CalendarDays size={16} aria-hidden="true" />
          Book a Call
        </a>
      </nav>
    </>
  );
}
