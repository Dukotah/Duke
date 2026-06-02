import { heatBand } from "@/lib/crm/scoring";
import { HEAT_STYLES } from "../_lib";

export default function HeatBadge({ score, showScore = true }: { score: number; showScore?: boolean }) {
  const band = heatBand(score);
  const s = HEAT_STYLES[band];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${s.chip}`}
      title={`Heat score ${score}/100`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
      {showScore && <span className="opacity-70">{score}</span>}
    </span>
  );
}
