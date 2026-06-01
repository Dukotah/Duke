import { useEffect, useRef, useState } from "react";
import {
  Phone,
  PhoneOff,
  MapPin,
  Globe,
  ShieldAlert,
  Smartphone,
  Gauge,
  Link2,
  CalendarClock,
  ExternalLink,
  Tag,
} from "lucide-react";
import type { Lead, Disposition } from "@/lib/crm/types";
import { STAGE_LABELS } from "@/lib/crm/types";
import { problemList, type Problem } from "@/lib/crm/scoring";
import HeatBadge from "./HeatBadge";
import CallScript from "./CallScript";
import { fmtCurrency, fmtDuration, telHref, DISPOSITIONS, TONE_STYLES } from "../_lib";

const PROBLEM_ICON: Record<string, React.ReactNode> = {
  no_site: <Globe size={15} />,
  ssl: <ShieldAlert size={15} />,
  mobile: <Smartphone size={15} />,
  speed: <Gauge size={15} />,
  links: <Link2 size={15} />,
  stale: <Tag size={15} />,
};

const SEVERITY_RING: Record<Problem["severity"], string> = {
  high: "border-red-500/30 bg-red-500/5 text-red-300",
  medium: "border-amber-500/30 bg-amber-500/5 text-amber-200",
  low: "border-zinc-700 bg-zinc-800/40 text-zinc-300",
};

export default function ProspectCard({
  lead,
  repName,
  onDisposition,
  onSaveNote,
}: {
  lead: Lead;
  repName: string;
  onDisposition: (d: Disposition, extra: { note?: string; durationSec?: number; callbackAt?: string }) => void;
  onSaveNote: (note: string) => void;
}) {
  const [onCall, setOnCall] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState("");
  const [callbackFor, setCallbackFor] = useState<Disposition | null>(null);
  const [callbackWhen, setCallbackWhen] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Transient call state (timer, note, callback) resets automatically because
  // the parent remounts this component via `key={lead.id}` on each new prospect.

  useEffect(() => {
    if (onCall) {
      timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [onCall]);

  const problems = problemList(lead.signals);

  function disposition(d: Disposition) {
    const def = DISPOSITIONS.find((x) => x.key === d);
    if (def?.needsCallback) {
      // Two-step: reveal the scheduler, commit on confirm.
      setCallbackFor(d);
      return;
    }
    commit(d);
  }

  function commit(d: Disposition, callbackAt?: string) {
    const durationSec = elapsed > 0 ? elapsed : undefined;
    onDisposition(d, { note: note.trim() || undefined, durationSec, callbackAt });
    setOnCall(false);
  }

  function confirmCallback() {
    const iso = callbackWhen ? new Date(callbackWhen).toISOString() : undefined;
    if (callbackFor) commit(callbackFor, iso);
    setCallbackFor(null);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="truncate text-xl font-bold text-white">{lead.business}</h1>
              <HeatBadge score={lead.heatScore} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
              {lead.contactName && <span className="font-medium text-zinc-300">{lead.contactName}</span>}
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} /> {lead.city}, {lead.state}
              </span>
              <span>{lead.industry}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-emerald-400">{fmtCurrency(lead.estValue)}</div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">est. value</div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-zinc-300">
            {STAGE_LABELS[lead.stage]}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">{lead.source}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">{lead.attempts} attempt{lead.attempts === 1 ? "" : "s"}</span>
        </div>

        {/* Call controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!onCall ? (
            <a
              href={telHref(lead.phone)}
              onClick={() => setOnCall(true)}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-400"
            >
              <Phone size={16} /> Call {lead.phone}
            </a>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                On call · {fmtDuration(elapsed)}
              </span>
              <button
                onClick={() => setOnCall(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                <PhoneOff size={15} /> Hang up
              </button>
            </>
          )}
          {lead.website ? (
            <a
              href={`/audit?url=${encodeURIComponent(lead.website)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-orange-400"
            >
              <ExternalLink size={14} /> Run live audit of {lead.website}
            </a>
          ) : (
            <span className="text-sm text-zinc-500">No website on file</span>
          )}
        </div>
      </div>

      {/* Scrollable body: problems + script */}
      <div className="-mr-1 mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
        {/* Why we're calling — their actual problems */}
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            What&apos;s wrong with their site
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p.key} className={`flex gap-2.5 rounded-xl border p-3 ${SEVERITY_RING[p.severity]}`}>
                <span className="mt-0.5 shrink-0">{PROBLEM_ICON[p.key] ?? <ShieldAlert size={15} />}</span>
                <div>
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-zinc-400">{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic script */}
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Your script <span className="font-normal normal-case text-zinc-600">— tailored to this prospect</span>
          </h2>
          <CallScript lead={lead} repName={repName} />
        </section>
      </div>

      {/* Disposition footer */}
      <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notes from the call…"
          rows={2}
          className="mb-3 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />

        {callbackFor ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-300">
              <CalendarClock size={15} /> Schedule callback
            </span>
            <input
              type="datetime-local"
              value={callbackWhen}
              onChange={(e) => setCallbackWhen(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={confirmCallback}
              className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-400"
            >
              Confirm
            </button>
            <button
              onClick={() => setCallbackFor(null)}
              className="rounded-full px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {DISPOSITIONS.map((d) => (
              <button
                key={d.key}
                onClick={() => disposition(d.key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${TONE_STYLES[d.tone]}`}
              >
                {d.label}
              </button>
            ))}
            {note.trim() && (
              <button
                onClick={() => {
                  onSaveNote(note.trim());
                  setNote("");
                }}
                className="rounded-full border border-zinc-700 px-3.5 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Save note only
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
