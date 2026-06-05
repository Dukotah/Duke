import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type RelatedLink = { href: string; label: string; blurb?: string };

/**
 * A contextual internal-linking block. Turns dead-end pages (city/service/blog)
 * into hubs that pass link equity to the pages we actually want to rank, and
 * gives Google a clear topical cluster. Keep links genuinely relevant — that's
 * what makes internal linking an SEO signal rather than noise.
 */
export default function RelatedLinks({
  heading = "Explore more",
  links,
  variant = "light",
}: {
  heading?: string;
  links: RelatedLink[];
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <section className={dark ? "py-16 bg-[#18181B]" : "py-16 bg-[#FAFAF9] border-t border-[#18181B]/8"}>
      <div className="max-w-4xl mx-auto px-6">
        <h2
          className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-[#18181B]"}`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {heading}
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`group flex items-start gap-3 rounded-xl p-4 border transition-colors ${
                dark
                  ? "bg-white/5 border-white/10 hover:border-white/30"
                  : "bg-white border-[#18181B]/8 hover:border-[#F97316]/50 shadow-sm"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${dark ? "text-white" : "text-[#18181B]"}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {l.label}
                </p>
                {l.blurb && (
                  <p
                    className={`text-xs mt-0.5 ${dark ? "text-white/55" : "text-[#3F3F46]/55"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {l.blurb}
                  </p>
                )}
              </div>
              <ArrowUpRight
                size={16}
                className={`flex-shrink-0 mt-0.5 transition-colors ${
                  dark ? "text-white/40 group-hover:text-white" : "text-[#3F3F46]/40 group-hover:text-[#F97316]"
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
