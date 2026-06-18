"use client";

import { useId, useState, type ReactNode } from "react";

export type AccordionItem = {
  question: ReactNode;
  answer: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Allow multiple open at once (default false = single-open). */
  multiple?: boolean;
  /** Index open by default (single mode). */
  defaultOpen?: number | null;
  className?: string;
  /** Class for each item wrapper. */
  itemClassName?: string;
  /** Class for the trigger button. */
  triggerClassName?: string;
  /** Class for the answer panel inner. */
  panelClassName?: string;
};

/**
 * Smooth grid-rows accordion (animates 0fr→1fr — no max-height guessing, no
 * layout jump). Fully accessible: button + aria-expanded + region. Reduced
 * motion drops the height transition via the global guard. Bring your own
 * chevron in the question render if desired, or rely on the data-state hook.
 */
export default function Accordion({
  items,
  multiple = false,
  defaultOpen = null,
  className,
  itemClassName,
  triggerClassName,
  panelClassName,
}: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen != null ? [defaultOpen] : []),
  );

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className={className}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i} className={itemClassName} data-state={isOpen ? "open" : "closed"}>
            <button
              id={btnId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className={triggerClassName}
            >
              {item.question}
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              data-flow-acc={isOpen ? "open" : "closed"}
            >
              <div className="flow-acc-inner">
                <div className={panelClassName}>{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
