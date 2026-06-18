import { type CSSProperties } from "react";

type MeshGradientBgProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Drifting brand mesh-gradient field for dark hero/section backgrounds. Pure
 * CSS, decorative, aria-hidden, pointer-events-none. Render as the FIRST child
 * of a `relative` section, before content. Light for LCP (no JS, no images).
 * Reduced-motion freezes the drift. Pair with <GlowOrbs /> for extra depth.
 */
export default function MeshGradientBg({ className, style }: MeshGradientBgProps) {
  return (
    <div
      aria-hidden="true"
      className={`flow-mesh ${className ?? ""}`}
      style={style}
    />
  );
}
