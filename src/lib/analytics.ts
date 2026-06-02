import { track } from "@vercel/analytics";

/**
 * Centralized conversion-event tracking for the marketing site.
 *
 * Events flow to Vercel Web Analytics. Page views and Speed Insights record on
 * every Vercel plan; the custom events below record on Pro/Enterprise and
 * safely no-op elsewhere — so instrumenting now means the data is ready the
 * moment the plan is upgraded. In local dev these log to the console instead of
 * sending. No cookies are set, so this needs no consent banner.
 *
 * Keep event names and property keys stable: renaming them resets their history
 * in the dashboard. Property values must be flat (string | number | boolean).
 */

type EventProps = Record<string, string | number | boolean>;

/** Fire a custom conversion event. Never throws — analytics must not break UX. */
function emit(event: string, props?: EventProps): void {
  try {
    track(event, props);
  } catch {
    // Swallow: a tracking failure must never affect the user experience.
  }
}

// ── Tier 1 — primary lead conversions (the "money" events) ───────────────────

/** Contact form successfully submitted. */
export function trackLeadFormSubmit(props: {
  formLocation: string;
  service?: string;
  hasPhone: boolean;
}): void {
  emit("lead_form_submit", {
    form_location: props.formLocation,
    service: props.service?.trim() || "unspecified",
    has_phone: props.hasPhone,
  });
}

/** Any "book a call / schedule" CTA that opens Calendly was clicked. */
export function trackCalendlyClick(location: string): void {
  emit("calendly_booking_click", { location });
}

/** A click-to-call (`tel:`) link was clicked. */
export function trackPhoneClick(location: string): void {
  emit("phone_click", { location });
}

// ── Tier 2 — high-intent engagement (which tools drive the leads above) ──────

/** The IT security quiz produced a result. */
export function trackQuizComplete(props: { score: number; riskTier: string }): void {
  emit("security_quiz_complete", { score: props.score, risk_tier: props.riskTier });
}

/** The pricing estimator produced a result. */
export function trackEstimatorComplete(props: { service: string; range: string }): void {
  emit("pricing_estimator_complete", {
    service: props.service,
    estimated_range: props.range,
  });
}
