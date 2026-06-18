"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Shared IntersectionObserver hook for FLOW primitives.
 * Fires once by default (the premium look = reveal on enter, not on every
 * scroll), unwiring the observer afterward so there's zero ongoing cost.
 *
 * Returns a ref to attach to the watched element and an `inView` boolean.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Re-trigger every time the element enters/leaves (default: once). */
  repeat?: boolean;
  /** Fraction of the element that must be visible (default 0.18). */
  threshold?: number;
  /** rootMargin, e.g. to trigger slightly before entry (default 0px 0px -10%). */
  rootMargin?: string;
}) {
  const { repeat = false, threshold = 0.18, rootMargin = "0px 0px -10% 0px" } =
    options ?? {};
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Graceful fallback for very old browsers: reveal immediately (in a task,
    // so we never call setState synchronously inside the effect body).
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }

    // Fail-open for above-the-fold content: if the element is ALREADY in the
    // viewport at mount, reveal it on the next frame instead of waiting on an
    // async observer callback that can be delayed or miss — which is what leaves
    // content stuck at low opacity. Below-the-fold elements still use the
    // observer normally.
    let raf = 0;
    const onScreenAtMount = (() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    })();
    if (onScreenAtMount) {
      raf = requestAnimationFrame(() => setInView(true));
      if (!repeat) return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [repeat, threshold, rootMargin]);

  return { ref, inView };
}

// ── matchMedia-backed external stores (no setState-in-effect) ───────────────

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

function getMediaSnapshot(query: string) {
  return () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false;
}

// Server snapshot is always false (no media at SSR) — matches the conservative
// "motion allowed / pointer fine" default until the client hydrates.
const serverFalse = () => false;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER = "(pointer: coarse)";

/** SSR-safe read of the user's reduced-motion preference (live-updating). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMedia(REDUCED_MOTION),
    getMediaSnapshot(REDUCED_MOTION),
    serverFalse,
  );
}

/** Coarse-pointer (touch) detection — used to skip cursor-driven effects. */
export function useIsTouch(): boolean {
  return useSyncExternalStore(
    subscribeMedia(COARSE_POINTER),
    getMediaSnapshot(COARSE_POINTER),
    serverFalse,
  );
}
