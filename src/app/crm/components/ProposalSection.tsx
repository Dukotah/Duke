"use client";

import { useState } from "react";
import { FileText, Copy, Check, Mail } from "lucide-react";
import {
  buildProposal, suggestServices, SERVICE_LABELS, type ServiceKey,
} from "@/lib/crm/proposal";

const H = { fontFamily: "var(--font-heading)" };
const ALL_SERVICES = Object.keys(SERVICE_LABELS) as ServiceKey[];

// Templated proposal/quote generator. Builds a ready-to-send proposal from the
// canonical PRICING numbers so a rep never hand-types (or mis-quotes) a deal.
export default function ProposalSection({
  lead,
  repName,
}: {
  lead: { name: string; city?: string; contact_name?: string; email?: string; tier?: string };
  repName: string;
}) {
  const [services, setServices] = useState<Set<ServiceKey>>(() => new Set(suggestServices(lead.tier)));
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (s: ServiceKey) =>
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });

  const proposal = buildProposal({
    businessName: lead.name,
    contactName: lead.contact_name,
    city: lead.city,
    services: ALL_SERVICES.filter((s) => services.has(s)),
    repName,
    notes,
  });

  const copy = () => {
    navigator.clipboard.writeText(`Subject: ${proposal.subject}\n\n${proposal.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ALL_SERVICES.map((s) => {
          const on = services.has(s);
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                on
                  ? "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30"
                  : "bg-white/[0.03] text-white/50 border-white/10 hover:text-white/80"
              }`}
              style={H}
            >
              {on ? "✓ " : ""}{SERVICE_LABELS[s]}
            </button>
          );
        })}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional: a line or two of custom scope/notes…"
        rows={2}
        className="w-full bg-[#111113] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#F97316]/40"
      />

      {services.size === 0 ? (
        <p className="text-xs text-white/30" style={H}>Pick at least one service to generate a proposal.</p>
      ) : (
        <div className="bg-[#111113] rounded-xl border border-white/[0.06] p-3.5 relative">
          <p className="text-[11px] font-semibold text-[#F97316]/70 uppercase tracking-wider mb-1.5" style={H}>Subject</p>
          <p className="text-sm text-white/85 mb-3" style={H}>{proposal.subject}</p>
          <p className="text-[11px] font-semibold text-[#F97316]/70 uppercase tracking-wider mb-1.5" style={H}>Body</p>
          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{proposal.body}</p>
        </div>
      )}

      {services.size > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/70 border border-white/10 hover:text-white text-xs font-semibold transition-colors"
            style={H}
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} Copy proposal
          </button>
          {lead.email && (
            <a
              href={`mailto:${lead.email}?subject=${encodeURIComponent(proposal.subject)}&body=${encodeURIComponent(proposal.body)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/25 hover:bg-[#F97316]/25 text-xs font-semibold transition-colors"
              style={H}
            >
              <Mail size={12} /> Email proposal
            </a>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-white/30 ml-auto" style={H}>
            <FileText size={11} /> from canonical pricing
          </span>
        </div>
      )}
    </div>
  );
}
