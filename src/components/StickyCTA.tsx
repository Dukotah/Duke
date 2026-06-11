"use client";

import { usePathname } from "next/navigation";
import { Phone, CalendarDays } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { track } from "@/lib/analytics";

// Routes where a marketing call/book bar doesn't belong (the CRM app, generated
// reports, the assessment flow, and the post-submit thank-you page).
const HIDDEN_PREFIXES = ["/crm", "/report", "/assessment", "/thank-you"];

// Persistent bottom action bar for mobile. Local-service traffic is mostly
// mobile and the highest-intent action is a tap-to-call, so we keep both Call
// and Book reachable without scrolling back to the hero. Hidden on md+ where
// the sticky Nav CTA already covers this. Sits at z-40 — below the ChatWidget
// FAB (z-50), which is nudged up on mobile so the two don't collide.
export default function StickyCTA() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#18181B]/10 bg-[#FAFAF9]/95 backdrop-blur-md shadow-[0_-4px_20px_-8px_rgba(24,24,27,0.25)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={PHONE_HREF}
          onClick={() => track("cta_call_phone", { location: "sticky" })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#18181B]/15 bg-white px-4 py-3 text-sm font-semibold text-[#18181B] outline-none transition-colors duration-200 hover:bg-[#18181B]/[0.04] focus-visible:ring-2 focus-visible:ring-[#F97316] active:scale-[0.98]"
          style={{ fontFamily: "var(--font-heading)" }}
          aria-label={`Call Copper Bay Tech at ${PHONE}`}
        >
          <Phone size={16} className="text-[#F97316]" />
          Call
        </a>
        <a
          href={BOOKING_URL}
          onClick={() => track("cta_book_call", { location: "sticky" })}
          className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-lg bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[#F97316]/25 outline-none transition-colors duration-200 hover:bg-[#ea6c0a] focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF9] active:scale-[0.98]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <CalendarDays size={16} />
          Book a Free Consultation
        </a>
      </div>
    </div>
  );
}
