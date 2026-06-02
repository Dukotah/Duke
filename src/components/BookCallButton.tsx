"use client";

import { CALENDLY_URL } from "@/config/site";
import { CalendarDays } from "lucide-react";

type Props = {
  label?: string;
  variant?: "primary" | "outline-dark" | "outline-light";
  className?: string;
};

const styles = {
  primary: "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold text-white transition-colors bg-[#F97316] hover:bg-[#ea6c0a]",
  "outline-dark": "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold transition-colors border-2 border-[#18181B]/20 text-[#18181B] hover:border-[#18181B]/50",
  "outline-light": "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-base font-semibold transition-colors border-2 border-white/30 text-white hover:border-white/60",
};

export default function BookCallButton({ label = "Book a Free Call", variant = "primary", className = "" }: Props) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles[variant]} ${className}`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      <CalendarDays size={16} />
      {label}
    </a>
  );
}
