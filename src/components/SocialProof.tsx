export default function SocialProof() {
  const cities = [
    "Petaluma",
    "Santa Rosa",
    "Sebastopol",
    "Rohnert Park",
    "Sonoma",
    "Bodega Bay",
    "Cotati",
    "Windsor",
  ];

  return (
    <section className="bg-[#18181B] py-5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest text-white/40"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serving
          </span>
          {cities.map((city, i) => (
            <span key={city} className="flex items-center gap-8">
              <span
                className="text-sm font-medium text-white/70"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {city}
              </span>
              {i < cities.length - 1 && (
                <span className="text-white/20 text-xs">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
