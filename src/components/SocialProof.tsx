const cities = [
  "Petaluma",
  "Santa Rosa",
  "Sebastopol",
  "Rohnert Park",
  "Sonoma",
  "Bodega Bay",
  "Cotati",
  "Windsor",
  "Healdsburg",
  "Cloverdale",
];

export default function SocialProof() {
  // Duplicate the list so the marquee loops seamlessly at -50%.
  const track = [...cities, ...cities];

  return (
    <section className="bg-[var(--ink-900)] py-6 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
        <span className="eyebrow shrink-0 text-white/35 hidden sm:block">
          Serving
        </span>
        <div className="marquee-mask flex-1 overflow-hidden">
          <div className="marquee-track items-center gap-10">
            {track.map((city, i) => (
              <span key={i} className="flex items-center gap-10 shrink-0">
                <span
                  className="text-sm font-medium text-white/55 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {city}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--copper-500)]/60" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
