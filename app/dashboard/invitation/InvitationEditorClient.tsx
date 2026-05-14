'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'
import type { InvitationData } from '@/lib/invitation-types'
import { TEMPLATES } from '@/lib/templates'
import ArabicMoorishTemplate from '@/templates/arabic-moorish'
import IvoryPavilionTemplate from '@/templates/ivory-pavilion'
import RivieraDreamsTemplate from '@/templates/riviera-dreams'
import { createClient } from '@/utils/supabase/client'
import MusicPicker from '@/components/MusicPicker'

const SECTIONS = [
  { id: 'names',    label: 'Names' },
  { id: 'wedding',  label: 'Wedding Details' },
  { id: 'timeline', label: 'Schedule' },
  { id: 'personal', label: 'Personalisation' },
]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type SlugState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/

function Field({
  label, value, onChange, placeholder, dir,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: 'rtl' | 'ltr' }) {
  return (
    <div>
      <label className="mb-1 block font-sans text-xs font-medium text-lt-ink/70">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="h-11 w-full rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
      />
    </div>
  )
}

/** Modal that collects the subdomain slug before redirecting to Stripe payment */
function PublishModal({
  currentSlug,
  onConfirm,
  onClose,
}: {
  currentSlug: string | null
  onConfirm: (slug: string) => Promise<{ url: string } | { error: string }>
  onClose: () => void
}) {
  const [slug, setSlug] = useState(currentSlug ?? '')
  const [slugState, setSlugState] = useState<SlugState>('idle')
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkSlug = useCallback(async (val: string) => {
    if (!SLUG_RE.test(val)) {
      setSlugState('invalid')
      return
    }
    setSlugState('checking')
    const supabase = createClient()
    const { data } = await supabase
      .from('invitations')
      .select('id')
      .eq('slug', val)
      .maybeSingle()
    setSlugState(data ? 'taken' : 'available')
  }, [])

  useEffect(() => {
    if (!slug) {
      const timeout = window.setTimeout(() => setSlugState('idle'), 0)
      return () => window.clearTimeout(timeout)
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => void checkSlug(slug), 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [slug, checkSlug])

  async function handlePublish() {
    if (slugState !== 'available') return
    setPublishing(true)
    setError(null)
    const result = await onConfirm(slug)
    if ('error' in result) {
      setError(result.error)
      setPublishing(false)
      return
    }
    // Redirect to Stripe Checkout
    window.location.href = result.url
  }

  const slugHint =
    slugState === 'checking'  ? { text: 'Checking availability…', color: 'text-lt-muted' } :
    slugState === 'available' ? { text: '✓ Available!', color: 'text-green-600' } :
    slugState === 'taken'     ? { text: '✗ Already taken — try another', color: 'text-red-500' } :
    slugState === 'invalid'   ? { text: 'Use only lowercase letters, numbers and hyphens (min 4 chars)', color: 'text-amber-600' } :
    null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-lt-border bg-lt-surface shadow-xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-extrabold text-lt-ink mb-1">Choose your URL</h2>
        <p className="font-sans text-sm text-lt-muted mb-6">
          This is the link your guests will use to open the invitation.
        </p>

        {/* URL builder */}
        <div className="mb-1 flex items-center rounded-xl border border-lt-border bg-white overflow-hidden focus-within:border-lt-ink transition-colors">
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="yournames"
            className="flex-1 min-w-0 px-4 py-3 font-sans text-sm text-lt-ink outline-none bg-transparent"
            autoFocus
          />
          <span className="px-4 py-3 font-sans text-sm text-lt-muted bg-lt-subtle border-l border-lt-border whitespace-nowrap flex-shrink-0">
            .invyo.uk
          </span>
        </div>

        {/* Hint */}
        <div className="h-5 mb-5">
          {slugHint && (
            <p className={`font-sans text-xs ${slugHint.color}`}>{slugHint.text}</p>
          )}
        </div>

        {/* Preview */}
        {slug && (
          <div className="mb-4 rounded-xl bg-lt-subtle border border-lt-border px-4 py-3 font-mono text-sm text-lt-ink break-all">
            https://<span className="font-bold">{slug}</span>.invyo.uk
          </div>
        )}

        {/* Price callout */}
        <div className="mb-6 rounded-xl border border-lt-border bg-lt-subtle px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-semibold text-lt-ink">One-time publish fee</p>
            <p className="font-sans text-xs text-lt-muted mt-0.5">Lifetime hosting on invyo.uk</p>
          </div>
          <span className="font-display text-xl font-extrabold text-lt-ink">$150</span>
        </div>

        {error && (
          <p className="mb-4 font-sans text-xs text-red-500">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-lt-border py-2.5 font-sans text-sm font-bold text-lt-muted hover:border-lt-ink hover:text-lt-ink transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handlePublish()}
            disabled={slugState !== 'available' || publishing}
            className="flex-1 rounded-full bg-lt-ink py-2.5 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
          >
            {publishing ? 'Redirecting…' : 'Pay & Publish →'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  userId: string
  invitationId: string | null
  savedData: Partial<InvitationData> | null
  templateId: string
  templateDefaults: InvitationData
}

export default function InvitationEditorClient({ userId, invitationId: initialInvId, savedData, templateId, templateDefaults }: Props) {
  const [data, setData] = useState<InvitationData>({
    ...templateDefaults,
    ...(savedData ?? {}),
  })
  const [invitationId, setInvitationId] = useState<string | null>(initialInvId)
  const [currentSlug] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('names')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [previewLang, setPreviewLang] = useState<'lang1' | 'lang2'>('lang1')
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.7)

  // Only render the template preview on the client — avoids all hydration mismatches
  // from Date.now(), language state, etc. inside the template
  useEffect(() => { setMounted(true) }, [])

  // Measure the stable outer container — never the scaled content
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth - 48
      const h = el.clientHeight - 48
      const scaleByWidth  = w / 390
      const scaleByHeight = h / 760
      setScale(Math.min(scaleByWidth, scaleByHeight, 0.52))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function set<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function saveDraft(): Promise<string | null> {
    setSaveState('saving')
    try {
      const supabase = createClient()
      let id = invitationId
      if (id) {
        const { error } = await supabase
          .from('invitations')
          .update({ data, template_id: templateId, updated_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
      } else {
        const { data: inv, error } = await supabase
          .from('invitations')
          .insert({ user_id: userId, template_id: templateId, data, status: 'draft' })
          .select('id')
          .single()
        if (error) throw error
        id = inv.id
        setInvitationId(inv.id)
      }
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
      return id
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
      return null
    }
  }

  async function handlePublishConfirm(slug: string): Promise<{ url: string } | { error: string }> {
    // Ensure invitation is saved first
    let id = invitationId
    if (!id) {
      id = await saveDraft()
      if (!id) return { error: 'Could not save invitation — please try again' }
    }
    // Call checkout API
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId: id, slug }),
    })
    const json = await res.json() as { url?: string; error?: string }
    if (!res.ok || !json.url) return { error: json.error ?? 'Payment setup failed' }
    return { url: json.url }
  }

  const saveBtnLabel =
    saveState === 'saving' ? 'Saving…' :
    saveState === 'saved'  ? '✓ Saved' :
    saveState === 'error'  ? 'Error — retry' :
    'Save draft'

  const isRiviera = templateId === 'riviera-dreams'
  const usesArabicFields = templateId === 'arabic-moorish'
  const selectedTemplate = TEMPLATES.find(t => t.id === templateId)

  function renderTemplatePreview() {
    if (templateId === 'riviera-dreams') {
      return (
        <RivieraDreamsTemplate
          data={data}
          previewMode
          controlledLang={{ value: previewLang, onChange: setPreviewLang }}
        />
      )
    }

    if (templateId === 'ivory-pavilion') {
      return <IvoryPavilionTemplate data={data} previewMode />
    }

    return <ArabicMoorishTemplate data={data} previewMode />
  }

  return (
    <>
      {showPublishModal && (
        <PublishModal
          currentSlug={currentSlug}
          onConfirm={handlePublishConfirm}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    <div className="flex h-full overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-sm">

      {/* ── Left: form panel ── */}
      <div className="flex w-[680px] flex-shrink-0 flex-col border-r border-lt-border bg-lt-surface">
        <div className="border-b border-lt-border px-6 py-5">
          <span className="inline-flex rounded-full border border-lt-border bg-lt-subtle px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-lt-muted">
            {selectedTemplate?.name ?? 'Invitation'}
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-lt-ink">
            {activeSection === 'names'
              ? 'Names'
              : activeSection === 'wedding'
              ? 'Wedding Details'
              : activeSection === 'timeline'
              ? 'Schedule'
              : 'Personalisation'}
          </h2>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex w-24 flex-col items-center gap-3 border-r border-lt-border bg-lt-subtle px-2 py-4">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-3 font-sans transition-all ${
                  activeSection === s.id
                    ? 'bg-white text-lt-ink shadow-sm'
                    : 'text-lt-muted hover:bg-white/70 hover:text-lt-ink'
                }`}
              >
                {s.id === 'names' && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 13c2.76 0 5-2.46 5-5.5S14.76 2 12 2 7 4.46 7 7.5 9.24 13 12 13Z" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                )}
                {s.id === 'wedding' && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                  </svg>
                )}
                {s.id === 'timeline' && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v5l3 2" />
                  </svg>
                )}
                {s.id === 'personal' && (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3 1.9 4.65L18.5 9l-4.6 1.35L12 15l-1.9-4.65L5.5 9l4.6-1.35L12 3Z" />
                    <path d="M19 15l.95 2.05L22 18l-2.05.95L19 21l-.95-2.05L16 18l2.05-.95L19 15Z" />
                  </svg>
                )}
                <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-6">
              <div>
                <h3 className="font-sans text-base font-bold text-lt-ink">
                  {activeSection === 'names'
                    ? 'Names'
                    : activeSection === 'wedding'
                    ? 'Wedding Details'
                    : activeSection === 'timeline'
                    ? 'Schedule'
                    : 'Personalisation'}
                </h3>
                <p className="mt-1 font-sans text-xs text-lt-muted">
                  {activeSection === 'names'
                    ? usesArabicFields
                      ? 'Enter names in both English and Arabic.'
                      : "Enter the couple's names."
                    : activeSection === 'wedding'
                    ? 'When and where is the wedding?'
                    : activeSection === 'timeline'
                    ? 'Add, edit or remove events from your celebration schedule.'
                    : 'Add a personal touch.'}
                </p>
                <div className="mt-4 h-px bg-lt-border" />
              </div>

              {activeSection === 'names' && (
                <>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Groom</p>
                    <Field label="First name" value={data.groomNameEn} onChange={v => set('groomNameEn', v)} placeholder="James" />
                    <Field label="Last name" value={data.groomLastNameEn ?? ''} onChange={v => set('groomLastNameEn', v)} placeholder="Anderson" />
                    {usesArabicFields && (
                      <Field label="Arabic name" value={data.groomNameAr} onChange={v => set('groomNameAr', v)} placeholder="عمر محمود" dir="rtl" />
                    )}
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Bride</p>
                    <Field label="First name" value={data.brideNameEn} onChange={v => set('brideNameEn', v)} placeholder="Emma" />
                    <Field label="Last name" value={data.brideLastNameEn ?? ''} onChange={v => set('brideLastNameEn', v)} placeholder="Sullivan" />
                    {usesArabicFields && (
                      <Field label="Arabic name" value={data.brideNameAr} onChange={v => set('brideNameAr', v)} placeholder="ليلى منصور" dir="rtl" />
                    )}
                  </div>
                </>
              )}

              {activeSection === 'wedding' && (
                <>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Date & time</p>
                    <Field label="Date" value={data.weddingDate} onChange={v => set('weddingDate', v)} placeholder="June 27" />
                    {usesArabicFields && (
                      <Field label="Date — Arabic" value={data.weddingDateAr} onChange={v => set('weddingDateAr', v)} placeholder="27 جوان" dir="rtl" />
                    )}
                    <Field label="Year" value={data.weddingYear} onChange={v => set('weddingYear', v)} placeholder="2026" />
                    <Field label="Time" value={data.weddingTime} onChange={v => set('weddingTime', v)} placeholder="20:00" />
                    {usesArabicFields ? (
                      <>
                        <Field label="Day — English" value={data.weddingDay} onChange={v => set('weddingDay', v)} placeholder="Saturday" />
                        <Field label="Day — Arabic" value={data.weddingDayAr} onChange={v => set('weddingDayAr', v)} placeholder="السبت" dir="rtl" />
                      </>
                    ) : (
                      <Field label="Day" value={data.weddingDay} onChange={v => set('weddingDay', v)} placeholder="Saturday" />
                    )}
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Ceremony</p>
                    <Field label="City" value={data.cityEn} onChange={v => set('cityEn', v)} placeholder="Santorini" />
                    {usesArabicFields && (
                      <Field label="City — Arabic" value={data.cityAr} onChange={v => set('cityAr', v)} placeholder="تونس" dir="rtl" />
                    )}
                    <Field label="Venue" value={data.venueEn} onChange={v => set('venueEn', v)} placeholder="Venue name" />
                    {usesArabicFields && (
                      <Field label="Venue — Arabic" value={data.venueAr} onChange={v => set('venueAr', v)} placeholder="اسم القاعة" dir="rtl" />
                    )}
                    <Field label="Ceremony — Google Maps URL" value={data.ceremonyMapsUrl ?? ''} onChange={v => set('ceremonyMapsUrl', v)} placeholder="https://maps.google.com/..." />
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Reception (optional)</p>
                    <Field label="Reception Venue" value={data.receptionVenueEn ?? ''} onChange={v => set('receptionVenueEn', v)} placeholder="Reception venue name" />
                    <Field label="Reception City" value={data.receptionCityEn ?? ''} onChange={v => set('receptionCityEn', v)} placeholder="City" />
                    <Field label="Reception — Google Maps URL" value={data.receptionMapsUrl ?? ''} onChange={v => set('receptionMapsUrl', v)} placeholder="https://maps.google.com/..." />
                  </div>
                </>
              )}

              {activeSection === 'timeline' && (
                <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Timeline events</p>
                  <div className="space-y-3">
                    {(data.timeline ?? []).map((item, i) => (
                      <div key={i} className="rounded-2xl border border-lt-border bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        <div className="flex gap-3">
                          <div className="flex w-5 shrink-0 items-start justify-center pt-3 text-lt-muted">
                            <svg viewBox="0 0 12 20" className="h-5 w-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                              <path d="M1.5 4h9M1.5 10h9M1.5 16h9" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex items-start gap-2">
                              <input
                                value={item.time ?? ''}
                                onChange={e => {
                                  const tl = [...(data.timeline ?? [])]
                                  tl[i] = { ...tl[i], time: e.target.value }
                                  set('timeline', tl as never)
                                }}
                                placeholder="18:00"
                                className="h-11 w-24 rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
                              />
                              <input
                                value={item.venue ?? ''}
                                onChange={e => {
                                  const tl = [...(data.timeline ?? [])]
                                  tl[i] = { ...tl[i], venue: e.target.value }
                                  set('timeline', tl as never)
                                }}
                                placeholder="Venue (optional)"
                                className="h-11 min-w-0 flex-1 rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const tl = (data.timeline ?? []).filter((_, idx) => idx !== i)
                                  set('timeline', tl as never)
                                }}
                                className="mt-1 shrink-0 rounded-xl p-2 text-lt-muted transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label="Remove event"
                              >
                                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M3 3l10 10M13 3L3 13" />
                                </svg>
                              </button>
                            </div>
                            <input
                              value={item.event}
                              onChange={e => {
                                const tl = [...(data.timeline ?? [])]
                                tl[i] = { ...tl[i], event: e.target.value }
                                set('timeline', tl as never)
                              }}
                              placeholder="Event name"
                              className="h-11 w-full rounded-xl border border-lt-border bg-white px-4 font-sans text-sm font-medium text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const tl = [...(data.timeline ?? []), { time: '', venue: '', event: '' }]
                      set('timeline', tl as never)
                    }}
                    className="w-full rounded-2xl border border-dashed border-lt-border bg-white py-3 font-sans text-sm font-medium text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink"
                  >
                    + Add event
                  </button>
                </div>
              )}

              {activeSection === 'personal' && (
                <>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Celebration details</p>
                    <Field label="Wedding hashtag" value={data.hashtag} onChange={v => set('hashtag', v)} placeholder="#YourNames2026" />
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Dress code</p>
                    <Field label="Dress code style" value={data.dresscodeType ?? ''} onChange={v => set('dresscodeType', v)} placeholder="e.g. Cocktail Attire, Black Tie" />
                    <Field label="Gentlemen" value={data.dresscodeMen ?? ''} onChange={v => set('dresscodeMen', v)} placeholder="e.g. Suit & Tie" />
                    <div>
                      <label className="mb-1 block font-sans text-xs font-medium text-lt-ink/70">Gentlemen colour</label>
                      <div className="flex items-center gap-3 rounded-xl border border-lt-border bg-white px-3 py-2.5">
                        <input
                          type="color"
                          value={data.dresscodeMenColor ?? '#1B2A4A'}
                          onChange={e => set('dresscodeMenColor', e.target.value)}
                          className="h-9 w-14 cursor-pointer rounded-lg border border-lt-border bg-white p-0.5"
                        />
                        <span className="font-sans text-sm text-lt-muted">{data.dresscodeMenColor ?? '#1B2A4A'}</span>
                      </div>
                    </div>
                    <Field label="Ladies" value={data.dresscodeWomen ?? ''} onChange={v => set('dresscodeWomen', v)} placeholder="e.g. Cocktail Dress or Gown" />
                    <div>
                      <label className="mb-1 block font-sans text-xs font-medium text-lt-ink/70">Ladies colour</label>
                      <div className="flex items-center gap-3 rounded-xl border border-lt-border bg-white px-3 py-2.5">
                        <input
                          type="color"
                          value={data.dresscodeWomenColor ?? '#BDD0E4'}
                          onChange={e => set('dresscodeWomenColor', e.target.value)}
                          className="h-9 w-14 cursor-pointer rounded-lg border border-lt-border bg-white p-0.5"
                        />
                        <span className="font-sans text-sm text-lt-muted">{data.dresscodeWomenColor ?? '#BDD0E4'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">RSVP</p>
                    <Field label="RSVP deadline" value={data.rsvpDeadline ?? ''} onChange={v => set('rsvpDeadline', v)} placeholder="e.g. June 1, 2026" />
                  </div>
                  <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Background music</p>
                      <button
                        type="button"
                        onClick={() => set('musicUrl', (data.musicUrl ? '' : 'pending') as never)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          data.musicUrl ? 'bg-lt-ink' : 'bg-lt-border'
                        }`}
                        role="switch"
                        aria-checked={!!data.musicUrl}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                          data.musicUrl ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    {data.musicUrl ? (
                      <MusicPicker
                        value={data.musicUrl}
                        onChange={v => set('musicUrl', v as never)}
                        templateId={templateId}
                      />
                    ) : (
                      <p className="font-sans text-xs text-lt-muted">Toggle on to add background music to your invitation.</p>
                    )}
                  </div>
                  {isRiviera && (
                    <div className="space-y-3 rounded-2xl border border-lt-border bg-lt-subtle/50 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Second language</p>
                      <div>
                        <label className="mb-1 block font-sans text-xs font-medium text-lt-ink/70">Language</label>
                        <select
                          value={data.lang2Code ?? ''}
                          onChange={e => {
                            const code = e.target.value
                            const labels: Record<string, string> = {
                              fr: 'FR', es: 'ES', it: 'IT', de: 'DE', pt: 'PT',
                              nl: 'NL', tr: 'TR', el: 'GR', pl: 'PL', ru: 'RU',
                            }
                            set('lang2Code', code as never)
                            set('lang2Label', (labels[code] ?? '') as never)
                            if (!code) setPreviewLang('lang1')
                          }}
                          className="h-11 w-full rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none focus:border-lt-ink"
                        >
                          <option value="">— None (English only) —</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                          <option value="it">Italian</option>
                          <option value="de">German</option>
                          <option value="pt">Portuguese</option>
                          <option value="nl">Dutch</option>
                          <option value="tr">Turkish</option>
                          <option value="el">Greek</option>
                          <option value="pl">Polish</option>
                          <option value="ru">Russian</option>
                        </select>
                      </div>
                      {data.lang2Code && (
                        <>
                          <p className="font-sans text-[10px] text-lt-muted">Translate the key fields below. Anything left blank will fall back to English.</p>
                          <div className="space-y-3 rounded-2xl border border-lt-border bg-white/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Core details</p>
                            <Field label="Date" value={data.lang2Date ?? ''} onChange={v => set('lang2Date', v)} placeholder="e.g. 27 juin" />
                            <Field label="City" value={data.lang2City ?? ''} onChange={v => set('lang2City', v)} placeholder="e.g. Santorin" />
                            <Field label="Venue" value={data.lang2Venue ?? ''} onChange={v => set('lang2Venue', v)} placeholder="e.g. Chapelle au bord de la mer" />
                          </div>
                          <div className="space-y-3 rounded-2xl border border-lt-border bg-white/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Dress code translations</p>
                            <Field label="Style" value={data.lang2DresscodeType ?? ''} onChange={v => set('lang2DresscodeType', v)} placeholder="e.g. Tenue de cocktail" />
                            <Field label="Gentlemen" value={data.lang2DresscodeMen ?? ''} onChange={v => set('lang2DresscodeMen', v)} placeholder="e.g. Costume et cravate" />
                            <Field label="Ladies" value={data.lang2DresscodeWomen ?? ''} onChange={v => set('lang2DresscodeWomen', v)} placeholder="e.g. Robe de cocktail" />
                          </div>
                          <div className="space-y-3 rounded-2xl border border-lt-border bg-white/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-lt-muted">Schedule translations</p>
                            {(data.timeline ?? []).map((item, i) => (
                              <div key={i} className="space-y-2 rounded-xl border border-lt-border/80 bg-lt-subtle/40 p-3">
                                <p className="font-sans text-[10px] text-lt-muted">{item.event || `Event ${i + 1}`}</p>
                                <div className="space-y-2">
                                  <input
                                    value={item.eventLang2 ?? ''}
                                    onChange={e => {
                                      const tl = [...(data.timeline ?? [])]
                                      tl[i] = { ...tl[i], eventLang2: e.target.value }
                                      set('timeline', tl as never)
                                    }}
                                    placeholder="Event name translation"
                                    className="h-11 w-full rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
                                  />
                                  {item.venue && (
                                    <input
                                      value={item.venueLang2 ?? ''}
                                      onChange={e => {
                                        const tl = [...(data.timeline ?? [])]
                                        tl[i] = { ...tl[i], venueLang2: e.target.value }
                                        set('timeline', tl as never)
                                      }}
                                      placeholder="Venue translation"
                                      className="h-11 w-full rounded-xl border border-lt-border bg-white px-4 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-lt-border bg-lt-surface p-4 shadow-[0_-8px_24px_rgba(15,23,42,0.05)]">
          <button
            onClick={() => void saveDraft()}
            disabled={saveState === 'saving'}
            className={`flex-1 rounded-full border py-3 font-sans text-xs font-bold transition-colors disabled:opacity-50 ${
              saveState === 'saved'
                ? 'border-green-500 text-green-600'
                : saveState === 'error'
                ? 'border-red-400 text-red-500'
                : 'border-lt-border text-lt-muted hover:border-lt-ink hover:text-lt-ink'
            }`}
          >
            {saveBtnLabel}
          </button>
          <button className="flex-1 rounded-full bg-lt-ink py-3 font-sans text-xs font-bold text-lt-surface transition-transform hover:scale-[1.02]"
            onClick={() => setShowPublishModal(true)}
          >
            {currentSlug ? 'Update publish →' : 'Publish →'}
          </button>
        </div>
      </div>

      {/* ── Right: live preview ── */}
      <div className="flex flex-1 flex-col bg-[#1A1A2E]/5">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between border-b border-lt-border bg-lt-surface px-5 py-2.5">
          <span className="font-sans text-xs font-semibold text-lt-muted">Live preview</span>
          <div className="flex items-center gap-2">
            {isRiviera && data.lang2Code && data.lang2Label && (
              <div className="flex rounded-full border border-lt-border bg-lt-subtle p-0.5">
                <button
                  onClick={() => setPreviewLang('lang1')}
                  className={`rounded-full px-3 py-1 font-sans text-[10px] font-semibold transition-all ${
                    previewLang === 'lang1' ? 'bg-lt-ink text-lt-surface shadow' : 'text-lt-muted hover:text-lt-ink'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setPreviewLang('lang2')}
                  className={`rounded-full px-3 py-1 font-sans text-[10px] font-semibold transition-all ${
                    previewLang === 'lang2' ? 'bg-lt-ink text-lt-surface shadow' : 'text-lt-muted hover:text-lt-ink'
                  }`}
                >
                  {data.lang2Label}
                </button>
              </div>
            )}
            <span className="rounded-full bg-lt-subtle px-3 py-1 font-sans text-[10px] font-semibold text-lt-muted">
              {selectedTemplate?.name ?? 'Invitation'}
            </span>
          </div>
        </div>

        {/* Phone simulator */}
        <div ref={containerRef} className="flex flex-1 items-center justify-center overflow-hidden p-2">
          {/* Outer phone shell */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: 390 * scale,
              height: 760 * scale,
              borderRadius: 44 * scale,
              background: '#1A1A2E',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08)',
              padding: 10 * scale,
            }}
          >
            {/* Screen */}
            <div style={{ width: '100%', height: '100%', borderRadius: 36 * scale, overflow: 'hidden', position: 'relative', background: '#000' }}>

              {/* Dynamic island */}
              <div style={{
                position: 'absolute', top: 12 * scale, left: '50%', transform: 'translateX(-50%)',
                width: 120 * scale, height: 34 * scale, background: '#000',
                borderRadius: 20 * scale, zIndex: 20,
              }} />

              {/* Status bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 50 * scale,
                zIndex: 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                padding: `0 ${20 * scale}px ${6 * scale}px`, pointerEvents: 'none',
              }}>
                <span style={{ color: '#1A1A2E', fontSize: 12 * scale, fontWeight: 600, fontFamily: 'sans-serif' }}>9:41</span>
                <div style={{ display: 'flex', gap: 5 * scale, alignItems: 'center' }}>
                  <svg width={17 * scale} height={12 * scale} viewBox="0 0 17 12" fill="#1A1A2E">
                    <rect x="0" y="8" width="3" height="4" rx="0.5"/>
                    <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
                    <rect x="9" y="2" width="3" height="10" rx="0.5"/>
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3"/>
                  </svg>
                  <svg width={25 * scale} height={12 * scale} viewBox="0 0 25 12" fill="none">
                    <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="#1A1A2E" strokeOpacity="0.35"/>
                    <rect x="22" y="3.5" width="2.5" height="5" rx="1" fill="#1A1A2E" fillOpacity="0.4"/>
                    <rect x="2" y="2" width="14" height="8" rx="1.5" fill="#1A1A2E"/>
                  </svg>
                </div>
              </div>

              {/* Scrollable template — client-only render to avoid hydration mismatches */}
              <div style={{
                width: 390,
                height: 760,
                transformOrigin: 'top left',
                transform: `scale(${scale})`,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
                {mounted && renderTemplatePreview()}
              </div>
            </div>

            {/* Home indicator */}
            <div style={{
              position: 'absolute', bottom: 8 * scale, left: '50%', transform: 'translateX(-50%)',
              width: 120 * scale, height: 5 * scale,
              background: 'rgba(255,255,255,0.3)', borderRadius: 3 * scale,
            }} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

