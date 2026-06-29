import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A curated "related guides" block — internal-linking surface that points a
 * service/pillar page DOWN into the relevant blog cluster (and to sibling
 * services). Pure server component; pass a title and a list of {href, label}.
 */
export default function RelatedGuides({
  title = "Related guides",
  eyebrow = "Learn more",
  items,
}: {
  title?: string;
  eyebrow?: string;
  items: { href: string; label: string }[];
}) {
  if (!items?.length) return null;
  return (
    <section className="border-t border-hairline bg-ink-1 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-copper-bright">
          {eyebrow}
        </p>
        <h2
          className="mb-6 text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex items-center justify-between gap-3 rounded-lg border border-hairline bg-ink-0 px-4 py-3 text-warm transition-colors hover:border-copper-dim hover:text-white"
              >
                <span className="text-sm">{g.label}</span>
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="flex-shrink-0 text-copper-bright opacity-70 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
