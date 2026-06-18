"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";

/**
 * Stats — HERO EFFECT per ELEVATED_DESIGN_PLAYBOOK §Stats.
 * Count-up on scroll-in + a thin copper progress underline that fills in sync
 * (Resend/Vercel). Numbers in monospace `tabular-nums` (no reflow), --copper-bright,
 * `once: true`. Final values are present in the markup so no-JS / reduced-motion /
 * pre-hydration always show the finished number (LCP/CLS-safe).
 *
 * NOTE: the playbook calls for JetBrains Mono for stat numerals. That face is not
 * yet loaded by the foundation (layout.tsx ships DM_Sans + Lora only), so these
 * use the system monospace stack via `font-mono`. When JetBrains Mono is wired as
 * `--font-mono` at the layout level, swap the `fontFamily` below to it — the
 * tabular-nums width reservation already prevents any reflow on that swap.
 */

type Stat = {
  /** Numeric target for the count-up; omit for non-numeric values (e.g. "Nationwide"). */
  to?: number;
  /** Decimal places for the count-up (default 0). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Pre-rendered final display string — always present in markup. */
  display: string;
  label: string;
  sub: string;
};

// Illustrative service-level figures (flagged). `display` is the source of truth
// for no-JS/RM; numeric `to` drives the animated count-up where it applies.
const stats: readonly Stat[] = [
  {
    to: 1,
    prefix: "< ",
    suffix: " day",
    display: "< 1 day",
    label: "Average response time",
    sub: "We pick up the phone and reply to emails fast — always within one business day.",
  },
  {
    to: 3,
    prefix: "2–",
    suffix: " wks",
    display: "2–3 wks",
    label: "Typical website launch",
    sub: "From kickoff to live — no month-long waits or endless revision cycles.",
  },
  {
    to: 100,
    suffix: "%",
    display: "100%",
    label: "Custom-coded, no templates",
    sub: "Every site is hand-built for your business. No page builders, no shared themes.",
  },
  {
    // Non-numeric — no count-up; the underline still fills in sync.
    display: "Nationwide",
    label: "Remote-friendly, locally rooted",
    sub: "Based in Sonoma County, CA — we work remotely across the U.S. and show up on-site in the North Bay when it matters.",
  },
];

const NUMBER_FONT =
  'ui-monospace, "JetBrains Mono", "SFMono-Regular", "Menlo", "Consolas", monospace';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function StatNumber({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  display,
  active,
  reduce,
  duration,
}: {
  to?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  display: string;
  active: boolean;
  reduce: boolean;
  duration: number;
}) {
  const [value, setValue] = useState<number | null>(to ?? null);
  const started = useRef(false);

  useEffect(() => {
    // No numeric target (e.g. "Nationwide"), reduced motion, or not yet in view:
    // leave the final markup value untouched — nothing to animate.
    if (to === undefined || reduce || !active || started.current) return;
    started.current = true;
    setValue(0);
    const controls = animate(0, to, {
      duration,
      ease: easeOutCubic,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [to, reduce, active, duration]);

  // Non-numeric stat → render the display string verbatim.
  if (to === undefined || value === null) {
    return (
      <span style={{ fontFamily: NUMBER_FONT }} className="tabular-nums">
        {display}
      </span>
    );
  }

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span style={{ fontFamily: NUMBER_FONT }} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const reduce = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.3 });

  // Mobile parity (playbook): 1.5s count + 1px underline + no stagger;
  // desktop: 2s count + 2px underline + light reveal stagger.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const countDuration = isMobile ? 1.5 : 2;
  const underlineWidth = isMobile ? 1 : 2;
  const active = inView;

  return (
    <section className="py-14 sm:py-16 bg-ink-2">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-copper-bright mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What to expect
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-warm"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What working with us actually looks like
          </h2>
        </motion.div>

        <div
          ref={wrapRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, delay: isMobile ? 0 : i * 0.1 }
              }
              className="bg-ink-2 px-8 py-10 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2">
                <p
                  className="text-4xl md:text-5xl font-bold text-copper-bright leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <StatNumber
                    to={s.to}
                    decimals={s.decimals}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    display={s.display}
                    active={active}
                    reduce={reduce}
                    duration={countDuration}
                  />
                </p>
                {/* Thin copper progress underline — fills 0→1 in sync with the
                    count-up. RM / no-JS: full width, no animation. */}
                <span
                  aria-hidden
                  className="block w-full overflow-hidden rounded-full bg-copper-dim"
                  style={{ height: underlineWidth }}
                >
                  <motion.span
                    className="block h-full origin-left rounded-full bg-copper-bright"
                    initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                    animate={
                      reduce
                        ? { scaleX: 1 }
                        : active
                          ? { scaleX: 1 }
                          : { scaleX: 0 }
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            duration: countDuration,
                            ease: [0.33, 1, 0.68, 1],
                          }
                    }
                    style={{ willChange: "transform" }}
                  />
                </span>
              </div>
              <p
                className="text-sm font-semibold text-warm uppercase tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.label}
              </p>
              <p
                className="text-xs text-warm-3 leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
