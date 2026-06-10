const trustItems = [
  "Locally owned",
  "Flat-fee pricing",
  "No contracts",
  "Santa Rosa-based",
];

export default function SocialProof() {
  return (
    <section className="bg-[#18181B] py-5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-y-2">
          {trustItems.map((item, i) => (
            <span key={item} className="flex items-center">
              <span
                className="text-sm font-medium text-white/70"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item}
              </span>
              {i < trustItems.length - 1 && (
                <span aria-hidden="true" className="mx-4 text-white/20 text-xs">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
