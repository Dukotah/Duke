/**
 * Mobile landing ("Monolith Ultra v3" — Claude Design bespoke build).
 *
 * The entire mobile homepage experience is authored as a single self-contained
 * document (WebGL/Three.js engine, boot sequence, scroll camera, gyro/audio) and
 * shipped as a static asset at /public/mobile-home.html. To edit the mobile site,
 * edit that ONE file and redeploy — no React rebuild needed.
 *
 * We mount it as a full-viewport fixed overlay so it sits cleanly above the global
 * layout chrome (StickyCTA, ThemeToggle, bottom spacer) on phones. The parent
 * <div className="md:hidden"> in app/page.tsx gates it to mobile: on desktop the
 * overlay is display:none and never loads (loading="lazy" + off-viewport), so the
 * desktop component homepage is completely untouched.
 *
 * Internal links use <base target="_top"> in the document, so CTAs (audit,
 * pricing, tel:) break out and navigate the top window normally.
 */
export default function MobileLanding() {
  return (
    <iframe
      src="/mobile-home.html"
      title="Copper Bay Tech — Websites, IT & Cybersecurity for small business"
      loading="lazy"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        background: "#0b0908",
        zIndex: 999999,
      }}
    />
  );
}
