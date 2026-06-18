import { type CSSProperties } from "react";

type Orb = {
  /** Tailwind/utility classes for size + position, e.g. "w-72 h-72 -top-10 left-10". */
  className: string;
  /** Color variant. */
  color?: "gold" | "amber" | "copper";
  /** Slower float / staggered start. */
  slow?: boolean;
  delay?: boolean;
  style?: CSSProperties;
};

type GlowOrbsProps = {
  /** Default = three tasteful brand orbs. Override for bespoke placement. */
  orbs?: Orb[];
  /** Wrapper classes (default absolute inset-0 overflow-hidden). */
  className?: string;
};

const DEFAULT_ORBS: Orb[] = [
  { className: "w-72 h-72 -top-16 -left-10", color: "gold" },
  { className: "w-80 h-80 top-1/3 -right-16", color: "amber", slow: true, delay: true },
  { className: "w-64 h-64 -bottom-20 left-1/4", color: "copper", slow: true },
];

/**
 * Ambient floating blurred brand orbs behind hero/section content. Decorative,
 * aria-hidden, pointer-events-none, compositor-only float. Place after
 * <MeshGradientBg /> and before content. Reduced-motion freezes them.
 */
export default function GlowOrbs({ orbs = DEFAULT_ORBS, className }: GlowOrbsProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`flow-orb flow-orb--${o.color ?? "gold"} ${
            o.slow ? "flow-orb--slow" : ""
          } ${o.delay ? "flow-orb--delay" : ""} ${o.className}`}
          style={o.style}
        />
      ))}
    </div>
  );
}
