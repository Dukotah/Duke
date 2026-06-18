"use client";

import { useSyncExternalStore } from "react";
// Re-export framer-motion's reduced-motion hook so every primitive imports its
// motion guards from one place. (framer-motion is already a project dependency.)
export { useReducedMotion } from "framer-motion";

/**
 * Shared motion hooks for the dark + copper homepage primitives.
 *
 * `useHoverCapable()` — true only on devices with a fine pointer that can hover
 * (i.e. real mouse/trackpad). This is the HARD GATE the playbook (§P4/§3)
 * requires: cursor-tracking effects (spotlight, magnetic) must be OFF on touch.
 * SSR-safe via useSyncExternalStore; server snapshot is `false` (motion-off
 * default) so we never flash a desktop-only effect before hydration.
 */

const HOVER_FINE = "(hover: hover) and (pointer: fine)";

function subscribe(query: string) {
  return (onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

function getSnapshot(query: string) {
  return () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false;
}

// Conservative server default: assume NOT hover-capable so cursor effects stay
// off until the client confirms a fine pointer (avoids a hydration flash).
const serverFalse = () => false;

/** True when the device has a hovering, fine pointer (desktop mouse/trackpad). */
export function useHoverCapable(): boolean {
  return useSyncExternalStore(
    subscribe(HOVER_FINE),
    getSnapshot(HOVER_FINE),
    serverFalse,
  );
}
