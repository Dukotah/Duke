'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Pencil, Trash2, Lock, Plus, Download, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = 'Lead' | 'Contacted' | 'Talking' | 'Proposal' | 'Won' | 'Lost' | 'Nurture'
type LeadSource = 'Walk-in' | 'Cold email' | 'Referral' | 'LinkedIn' | 'Loom video' | 'Phone' | 'Other'

type Lead = {
  id: string
  name: string
  business: string
  city: string
  source: LeadSource
  status: LeadStatus
  nextAction: string
  dueDate: string
  value: number
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string; label: string }> = {
  Lead:      { color: '#6B7280', bg: '#F3F4F6', label: 'Lead' },
  Contacted: { color: '#2563EB', bg: '#EFF6FF', label: 'Contacted' },
  Talking:   { color: '#7C3AED', bg: '#F5F3FF', label: 'Talking' },
  Proposal:  { color: '#D97706', bg: '#FFFBEB', label: 'Proposal Sent' },
  Won:       { color: '#16A34A', bg: '#F0FDF4', label: 'Won' },
  Lost:      { color: '#DC2626', bg: '#FEF2F2', label: 'Lost' },
  Nurture:   { color: '#9D174D', bg: '#FFF1F2', label: 'Nurture' },
}

const STATUS_ORDER: LeadStatus[] = ['Lead', 'Contacted', 'Talking', 'Proposal', 'Won', 'Lost', 'Nurture']
const SOURCE_OPTIONS: LeadSource[] = ['Walk-in', 'Cold email', 'Referral', 'LinkedIn', 'Loom video', 'Phone', 'Other']
const PASSWORD = 'copper2026'
const STORAGE_KEY = 'cbt_leads'
const AUTH_KEY = 'cbt_admin_auth'

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLeads(leads: Lead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

function addLead(lead: Lead): void {
  const leads = getLeads()
  leads.push(lead)
  saveLeads(leads)
}

function updateLead(updated: Lead): void {
  const leads = getLeads().map(l => l.id === updated.id ? updated : l)
  saveLeads(leads)
}

function deleteLead(id: string): void {
  saveLeads(getLeads().filter(l => l.id !== id))
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function nowISO(): string {
  return new Date().toISOString()
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isOverdue(dateStr: string): boolean {
  return !!dateStr && dateStr < todayISO()
}

function isDueToday(dateStr: string): boolean {
  return dateStr === todayISO()
}

function currentMonthPrefix(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function formatCurrency(n: number): string {
  if (!n) return '—'
  return '$' + n.toLocaleString()
}

function sortLeads(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return a.createdAt.localeCompare(b.createdAt)
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    const dateCmp = a.dueDate.localeCompare(b.dueDate)
    if (dateCmp !== 0) return dateCmp
    return a.createdAt.localeCompare(b.createdAt)
  })
}

function exportCSV(leads: Lead[]): void {
  const headers = ['ID','Name','Business','City','Source','Status','Next Action','Due Date','Value','Notes','Created At','Updated At']
  const rows = leads.map(l => [
    l.id, l.name, l.business, l.city, l.source, l.status,
    l.nextAction, l.dueDate, l.value, l.notes, l.createdAt, l.updatedAt
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `copper-bay-leads-${todayISO()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Empty form ───────────────────────────────────────────────────────────────

const emptyForm = (): Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  business: '',
  city: '',
  source: 'Referral',
  status: 'Lead',
  nextAction: '',
  dueDate: '',
  value: 0,
  notes: '',
})

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      onAuth()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#18181B' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#18181B' }}>
            Copper Bay Tech
          </div>
          <div className="text-sm text-gray-500">Pipeline Admin</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          {error && <p className="text-red-600 text-sm">Incorrect password</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#F97316' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  )
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
      {source}
    </span>
  )
}

// ─── Lead Form Modal ──────────────────────────────────────────────────────────

type FormData = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>

function LeadModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Lead
  onSave: (data: FormData) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? { name: initial.name, business: initial.business, city: initial.city, source: initial.source,
          status: initial.status, nextAction: initial.nextAction, dueDate: initial.dueDate,
          value: initial.value, notes: initial.notes }
      : emptyForm()
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.business.trim()) errs.business = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  const showLoomTip = form.source === 'Cold email' || form.source === 'Walk-in'

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative ml-auto h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: 'slideInRight 0.25s ease-out' }}
      >
        <style>{`@keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {initial ? 'Edit Lead' : 'Add Lead'}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Contact Name */}
          <div>
            <label htmlFor="f-name" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              id="f-name"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ borderColor: errors.name ? '#DC2626' : '#D1D5DB' }}
              placeholder="Jane Smith"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="f-business" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              id="f-business"
              type="text"
              value={form.business}
              onChange={e => set('business', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              style={{ borderColor: errors.business ? '#DC2626' : '#D1D5DB' }}
              placeholder="Petaluma Bakery"
            />
            {errors.business && <p className="text-red-500 text-xs mt-1">{errors.business}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="f-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              id="f-city"
              type="text"
              value={form.city}
              onChange={e => set('city', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Petaluma"
            />
          </div>

          {/* Source */}
          <div>
            <label htmlFor="f-source" className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <select
              id="f-source"
              value={form.source}
              onChange={e => set('source', e.target.value as LeadSource)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Loom tip */}
            {showLoomTip && (
              <div className="mt-2 rounded-lg p-3 text-sm" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <span className="font-semibold" style={{ color: '#C2410C' }}>💡 Loom tip:</span>{' '}
                <span style={{ color: '#7C2D12' }}>
                  Record a 90-second screen share showing their website&apos;s speed score and top SEO gap.
                  Attach to your outreach email — conversion rates are 3–5x higher than plain text.
                </span>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="f-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="f-status"
              value={form.status}
              onChange={e => set('status', e.target.value as LeadStatus)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {STATUS_ORDER.map(s => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>

          {/* Next Action */}
          <div>
            <label htmlFor="f-next-action" className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
            <input
              id="f-next-action"
              type="text"
              value={form.nextAction}
              onChange={e => set('nextAction', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Follow up with proposal"
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="f-due-date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              id="f-due-date"
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Value */}
          <div>
            <label htmlFor="f-value" className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                id="f-value"
                type="number"
                min="0"
                value={form.value || ''}
                onChange={e => set('value', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="f-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="f-notes"
              rows={3}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Any extra context..."
            />
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 text-sm"
              style={{ background: '#F97316' }}
            >
              Save Lead
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main CRM ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState<'All' | LeadStatus>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined)
  const [toast, setToast] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})

  // Auth check on mount
  useEffect(() => {
    const ok = sessionStorage.getItem(AUTH_KEY) === 'true'
    setAuthed(ok)
  }, [])

  // Load leads once authed
  useEffect(() => {
    if (authed) {
      setLeads(sortLeads(getLeads()))
    }
  }, [authed])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  function handleAuth() {
    setAuthed(true)
    setLeads(sortLeads(getLeads()))
  }

  function handleLock() {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }

  function openAdd() {
    setEditingLead(undefined)
    setModalOpen(true)
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingLead(undefined)
  }

  function handleSave(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editingLead) {
      const updated: Lead = { ...editingLead, ...data, updatedAt: nowISO() }
      updateLead(updated)
      setLeads(sortLeads(getLeads()))
    } else {
      const newLead: Lead = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      }
      addLead(newLead)
      setLeads(sortLeads(getLeads()))
    }
    closeModal()
  }

  const handleDelete = useCallback((id: string) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return
    deleteLead(id)
    setLeads(sortLeads(getLeads()))
    showToast('Lead deleted')
  }, [])

  function scrollToLead(id: string) {
    setHighlightId(id)
    const el = rowRefs.current[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setHighlightId(null), 2500)
  }

  // Derived stats
  const today = todayISO()
  const monthPrefix = currentMonthPrefix()
  const activeLeads = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost')
  const pipelineValue = leads
    .filter(l => l.status === 'Talking' || l.status === 'Proposal')
    .reduce((sum, l) => sum + l.value, 0)
  const wonThisMonth = leads.filter(l => l.status === 'Won' && l.updatedAt.startsWith(monthPrefix))
  const revenueClosed = wonThisMonth.reduce((sum, l) => sum + l.value, 0)

  const dueTodayLeads = leads.filter(
    l => l.status !== 'Won' && l.status !== 'Lost' && l.dueDate <= today && l.dueDate !== ''
  )

  // Filtered leads
  const filteredLeads = filter === 'All' ? leads : leads.filter(l => l.status === filter)

  // Counts per status
  const countByStatus = (s: LeadStatus) => leads.filter(l => l.status === s).length

  if (authed === null) return null

  if (!authed) return <PasswordGate onAuth={handleAuth} />

  return (
    <div className="min-h-screen" style={{ background: '#F4F4F5', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <h1
            className="text-xl font-bold text-gray-900 flex-1"
            style={{ fontFamily: 'var(--font-heading)', color: '#18181B' }}
          >
            Pipeline
          </h1>
          <button
            onClick={() => exportCSV(leads)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#F97316' }}
          >
            <Plus size={15} />
            Add Lead
          </button>
          <button
            onClick={handleLock}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Lock and sign out"
            title="Lock"
          >
            <Lock size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Active', value: activeLeads.length.toString() },
            { label: 'Pipeline Value', value: pipelineValue ? '$' + pipelineValue.toLocaleString() : '—' },
            { label: 'Won This Month', value: wonThisMonth.length.toString() },
            { label: 'Revenue Closed', value: revenueClosed ? '$' + revenueClosed.toLocaleString() : '—' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
              <div className="text-xs font-medium text-gray-500 mb-1">{stat.label}</div>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: '#18181B' }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Due Today banner */}
        {dueTodayLeads.length > 0 && (
          <div
            className="rounded-xl px-4 py-3 flex flex-wrap items-center gap-2 text-sm"
            style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
          >
            <span className="font-semibold" style={{ color: '#C2410C' }}>
              {dueTodayLeads.length} follow-up{dueTodayLeads.length > 1 ? 's' : ''} due today:
            </span>
            <div className="flex flex-wrap gap-2">
              {dueTodayLeads.map(l => (
                <button
                  key={l.id}
                  onClick={() => scrollToLead(l.id)}
                  className="flex items-center gap-1.5 underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
                  style={{ color: '#EA580C' }}
                >
                  {l.business}
                  <StatusBadge status={l.status} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...STATUS_ORDER] as const).map(tab => {
            const count = tab === 'All' ? leads.length : countByStatus(tab)
            const active = filter === tab
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: active ? '#18181B' : '#fff',
                  color: active ? '#fff' : '#374151',
                  border: active ? '1px solid #18181B' : '1px solid #D1D5DB',
                }}
              >
                {tab === 'All' ? 'All' : STATUS_CONFIG[tab as LeadStatus].label}
                <span
                  className="inline-flex items-center justify-center rounded-full text-xs min-w-[18px] h-[18px] px-1"
                  style={{
                    background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                    color: active ? '#fff' : '#6B7280',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Table / Empty state */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 flex flex-col items-center gap-3">
            <p className="text-gray-500">No leads yet.</p>
            <button
              onClick={openAdd}
              className="text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#F97316' }}
            >
              Add your first lead →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['Business', 'Contact', 'Source', 'Status', 'Next Action', 'Due Date', 'Value', 'Actions'].map(h => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, idx) => {
                    const overdue = isOverdue(lead.dueDate) && lead.status !== 'Won' && lead.status !== 'Lost'
                    const dueToday = isDueToday(lead.dueDate) && lead.status !== 'Won' && lead.status !== 'Lost'
                    const highlight = highlightId === lead.id
                    return (
                      <tr
                        key={lead.id}
                        ref={el => { rowRefs.current[lead.id] = el }}
                        className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50"
                        style={{
                          background: highlight
                            ? '#FFF7ED'
                            : dueToday
                            ? '#FFFBF7'
                            : undefined,
                          borderLeft: dueToday || overdue ? '3px solid #F97316' : idx === 0 ? undefined : undefined,
                        }}
                      >
                        {/* Business */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-900">{lead.business}</div>
                          {lead.city && <div className="text-xs text-gray-400 mt-0.5">{lead.city}</div>}
                        </td>
                        {/* Contact */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.name}</td>
                        {/* Source */}
                        <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                        {/* Status */}
                        <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                        {/* Next Action */}
                        <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                          <span className="block truncate" title={lead.nextAction}>
                            {lead.nextAction || <span className="text-gray-300">—</span>}
                          </span>
                        </td>
                        {/* Due Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {!lead.dueDate ? (
                            <span className="text-gray-300">—</span>
                          ) : overdue ? (
                            <div>
                              <span className="text-red-600 font-medium">{formatDate(lead.dueDate)}</span>
                              <span className="block text-xs text-red-500">Overdue</span>
                            </div>
                          ) : dueToday ? (
                            <div>
                              <span className="font-medium" style={{ color: '#F97316' }}>{formatDate(lead.dueDate)}</span>
                              <span className="block text-xs" style={{ color: '#F97316' }}>Today</span>
                            </div>
                          ) : (
                            <span className="text-gray-600">{formatDate(lead.dueDate)}</span>
                          )}
                        </td>
                        {/* Value */}
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                          {formatCurrency(lead.value)}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(lead)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                              aria-label={`Edit ${lead.business}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              aria-label={`Delete ${lead.business}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <LeadModal
          initial={editingLead}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
