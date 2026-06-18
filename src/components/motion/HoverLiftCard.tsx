import { type ElementType, type ReactNode } from "react";

type HoverLiftCardProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Card that lifts + deepens its shadow on hover; any inner element marked
 * data-flow-zoom (e.g. a thumbnail) scales up gently. Pure CSS — no JS, safe in
 * server components. Reduced-motion removes the transitions globally.
 *
 * <HoverLiftCard className="rounded-2xl ...">
 *   <img data-flow-zoom ... />
 * </HoverLiftCard>
 */
export default function HoverLiftCard({
  children,
  as: Tag = "div",
  className,
  style,
}: HoverLiftCardProps) {
  return (
    <Tag className={`flow-hover-lift ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}
