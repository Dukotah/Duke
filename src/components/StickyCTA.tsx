"use client";

import { usePathname } from "next/navigation";
import { Phone, CalendarDays } from "lucide-react";
import { BOOKING_URL, PHONE, PHONE_HREF } from "@/config/site";
import { track } from "@/lib/analytics";

// Routes where a marketing call/book bar doesn't belong (the CRM app, generated
// reports, the assessment flow, and the post-submit thank-you page).
const HIDDEN_PREFIXES = ["/crm", "/report", "/assessment", "/thank-you"];

// A whisper of haptic feedback on the two highest-intent taps. Android fires an
// 8ms tick; iOS Safari has never implemented the Vibration API, so this is a
// silent no-op there (and on desktop) — purely progressive enhancement.
function tapHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

// Persistent bottom action bar for mobile. Local-service traffic is mostly
// mobile and the highest-intent action is a tap-to-call, so we keep both Call
// and Book reachable without scrolling back to the hero. Hidden on md+ where
// the sticky Nav CTA already covers this. Sits at z-40 — below the ChatWidget
// FAB (z-50), which is nudged up on mobile so the two don't collide.
export default function StickyCTA() {
  const pathname = usePathname();
  // On the home page, mobile (< md) renders the dedicated "molten copper"
  // landing page, which carries its own header + contact CTAs. Suppress this
  // bar there so the two don't clash. Desktop never shows this bar (md:hidden),
  // so this only affects the mobile home view.
  if (pathname === "/") {
    return null;
  }
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink-0/95 backdrop-blur-md shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.5)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <a
          href={PHONE_HREF}
          onClick={() => { tapHaptic(); track("cta_call_phone", { location: "sticky" }); }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-hairline bg-ink-2 px-4 py-3 text-sm font-semibold text-white outline-none transition-colors duration-200 hover:border-copper-dim focus-visible:ring-2 focus-visible:ring-copper active:scale-[0.98]"
          style={{ fontFamily: "var(--font-heading)" }}
          aria-label={`Call Copper Bay Tech at ${PHONE}`}
        >
          <Phone size={16} className="text-copper-bright" />
          Call
        </a>
        <a
          href={BOOKING_URL}
          onClick={() => { tapHaptic(); track("cta_book_call", { location: "sticky" }); }}
          className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-lg bg-copper px-4 py-3 text-sm font-bold text-ink-0 shadow-sm shadow-copper/25 outline-none transition-colors duration-200 hover:bg-copper-bright focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 active:scale-[0.98]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <CalendarDays size={16} />
          Book a Free Consultation
        </a>
      </div>
    </div>
  );
}
