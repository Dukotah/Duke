import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Compact homepage proof strip — three live builds linking out, plus a CTA to
 * /work. Deliberately a server component with zero client JS (the home page
 * stays a minimal funnel; the full grid with motion lives in Portfolio.tsx on
 * /work). The three entries mirror tiles from Portfolio.tsx PROJECTS — if one
 * changes there, update it here too.
 *
 * Honesty contract (same as Portfolio.tsx): these are real, live demonstration
 * builds with genuine screenshots. The intro line says so — never present them
 * as commissioned client work until one actually converts.
 */
const FEATURED = [
  {
    title: "Grey Squirrel Manor",
    vertical: "Windsor café & provisions",
    image: "/portfolio/grey-squirrel-manor.jpg",
    url: "https://demos.copperbaytech.com/greysquirrelmanor",
  },
  {
    title: "32 Winds — Mascarin Family Wines",
    vertical: "Dry Creek Valley winery",
    image: "/portfolio/mascarin-family-wines.jpg",
    url: "https://demos.copperbaytech.com/b/mascarin-family-wines/",
  },
  {
    title: "Cascada Landscape",
    vertical: "Santa Rosa hardscape & masonry",
    image: "/portfolio/cascada-landscape.jpg",
    url: "https://demos.copperbaytech.com/b/cascada/",
  },
] as const;

export default function WorkStrip() {
  return (
    <section aria-labelledby="workstrip-heading" className="bg-ink-0 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-copper-bright"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Proof, not promises
          </p>
          <h2
            id="workstrip-heading"
            className="text-4xl font-bold leading-tight text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See the work. It&apos;s live.
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-zinc-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Demonstration builds for real Sonoma County businesses — designed,
            built, and deployed to show exactly what we&apos;d do for you.
            Click one and poke around.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((p) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-hairline bg-ink-2 transition-colors hover:border-copper-dim"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- static screenshot, matches Portfolio.tsx */}
                <img
                  src={p.image}
                  alt={`${p.title} — ${p.vertical}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3
                  className="text-base font-semibold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-1 text-sm text-zinc-400"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {p.vertical}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-copper-bright underline-offset-4 transition-colors hover:text-copper hover:underline"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See all our work
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
