"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

const SONOMA_COUNTIES = [
  "Sonoma", "Marin", "Napa", "Mendocino", "Lake", "Solano",
  "Contra Costa", "Alameda", "San Francisco", "San Mateo",
];

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddLeadModal({ onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [niche, setNiche] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const H = { fontFamily: "var(--font-heading)" };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Business name is required";
    return e;
  };

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setErrors({});
    try {
      const res = await fetch("/api/crm/custom-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contactName, phone, email, website, city, county, niche, notes }),
      });
      if (res.ok) { onAdded(); onClose(); }
      else {
        const d = await res.json();
        setErrors({ form: d.error ?? "Failed to add lead" });
        setLoading(false);
      }
    } catch {
      setErrors({ form: "Network error" });
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#111113] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white" style={H}>Add Lead</h2>
            <p className="text-xs text-white/35 mt-0.5" style={H}>Manually add a business to your queue</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>
              Business Name <span className="text-[#F97316]">*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Santa Rosa Auto Repair"
              className={`w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${errors.name ? "border-red-400/50 focus:border-red-400/70" : "border-white/10 focus:border-[#F97316]/50"}`}
              style={H} />
            {errors.name && <p className="text-xs text-red-400 mt-1" style={H}>{errors.name}</p>}
          </div>

          {/* Contact Name */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Contact Name</label>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Jordan — the person you'll greet in emails"
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H} />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
                placeholder="(707) 555-0100"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                placeholder="owner@biz.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H} />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Website</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H} />
          </div>

          {/* City + County */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Santa Rosa"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>County</label>
              <select value={county} onChange={(e) => setCounty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none"
                style={H}>
                <option value="">Select…</option>
                {SONOMA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Niche / Industry</label>
            <input value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. auto_repair, restaurant, landscaping"
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5" style={H}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder="Anything you know about them already…"
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/40 transition-colors"
              style={H} />
          </div>

          {errors.form && <p className="text-sm text-red-400" style={H}>{errors.form}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: "#F97316", ...H }}>
            <Plus size={15} />{loading ? "Adding…" : "Add to Queue"}
          </button>
        </form>
      </div>
    </div>
  );
}
