/**
 * FLOW motion-primitive library — shared, mobile-safe, reduced-motion-aware
 * premium UI building blocks. All visual styling lives in the FLOW layer of
 * src/app/globals.css (owned by the foundation agent); these components only
 * wire interactivity (IntersectionObserver, rAF, cursor math) to those classes.
 *
 * Import from "@/components/motion".
 */

// ── Dark + copper homepage primitives (ELEVATED_DESIGN_PLAYBOOK §6 Phase 0) ──
// Self-contained: no dependency on a global CSS layer. Each ships its own
// (hover:none) + prefers-reduced-motion branch via framer-motion + the design
// tokens in globals.css. SpotlightCard/CountUp (below) are part of this set too.
export { default as RevealOnScroll } from "./RevealOnScroll";
export { default as MagneticCTA } from "./MagneticCTA";
export { default as LogoMarquee } from "./LogoMarquee";
export { default as MeshGradient } from "./MeshGradient";
export { useHoverCapable, useReducedMotion } from "./hooks";

export { default as Reveal } from "./Reveal";
export { default as ScrollProgress } from "./ScrollProgress";
export { default as Tilt } from "./Tilt";
export { default as SpotlightCard } from "./SpotlightCard";
export { default as MagneticButton } from "./MagneticButton";
export { default as CountUp } from "./CountUp";
export { default as Marquee } from "./Marquee";
export { default as GradientBorder } from "./GradientBorder";
export { default as MeshGradientBg } from "./MeshGradientBg";
export { default as GlowOrbs } from "./GlowOrbs";
export { default as RotatingWord } from "./RotatingWord";
export { default as SelfDrawingLine } from "./SelfDrawingLine";
export { default as HoverLiftCard } from "./HoverLiftCard";
export { default as Accordion, type AccordionItem } from "./Accordion";
export {
  useInView,
  usePrefersReducedMotion,
  useIsTouch,
} from "./useInView";
