// Provider-agnostic conversion tracking.
//
// `track()` forwards a single event to whichever analytics provider happens to
// be present on `window` at runtime. It deliberately has zero dependencies and
// is SSR-safe: on the server (or before any provider script loads) every call
// is a harmless no-op.
//
// How to connect a provider later — no changes to call sites are required:
//   * GA4 (gtag.js):   add the Google tag <script> to the layout. Once
//                      `window.gtag` exists, events flow through automatically.
//   * Plausible:       add the Plausible <script> with your domain. Once
//                      `window.plausible` exists, events are forwarded to it.
//   * GTM / dataLayer: include the GTM snippet. Events are pushed onto
//                      `window.dataLayer` for tag configuration in GTM.
//   * Vercel Analytics: install @vercel/analytics and render <Analytics /> in
//                      the layout for pageviews; for custom events you can also
//                      route them here via Vercel's `track` if desired.
//
// Until one of those provider scripts is added, calls remain silent no-ops, so
// it is safe to instrument conversion events ahead of choosing a provider.

declare global {
  interface Window {
    // Google Analytics 4 / gtag.js
    gtag?: (...args: unknown[]) => void;
    // Google Tag Manager data layer
    dataLayer?: Record<string, unknown>[];
    // Plausible Analytics
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Record a conversion / interaction event.
 *
 * Use stable, lowercase snake_case event names (e.g. "cta_book_call").
 * Safe to call from anywhere, including during SSR — it no-ops when no
 * provider is available.
 *
 * @param event Event name in snake_case.
 * @param props Optional metadata forwarded to the provider.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  // SSR guard: nothing to do without a browser environment.
  if (typeof window === "undefined") return;

  try {
    // GA4 / gtag.js
    if (typeof window.gtag === "function") {
      window.gtag("event", event, props ?? {});
    }

    // Google Tag Manager data layer
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...props });
    }

    // Plausible Analytics
    if (typeof window.plausible === "function") {
      window.plausible(event, props ? { props } : undefined);
    }
  } catch {
    // Never let analytics break the UI.
  }
}
