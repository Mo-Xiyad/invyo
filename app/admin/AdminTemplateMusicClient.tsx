'use client'

import { useRef, useState } from 'react'
import { TEMPLATES } from '@/lib/templates'

interface TrackState {
  musicUrl: string
  musicName: string
}

interface Props {
  initial: Record<string, TrackState>
}

const activeTemplates = TEMPLATES.filter(t => t.id !== 'coming-soon')

export default function AdminTemplateMusicClient({ initial }: Props) {
  const [tracks, setTracks] = useState<Record<string, TrackState>>(initial)
  const [uploading, setUploading] = useState<string | null>(null)
  const [previewing, setPreviewing] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function handlePreview(templateId: string, url: string) {
    if (previewing === templateId) {
      audioRef.current?.pause()
      setPreviewing(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(url)
    audio.volume = 0.5
    audio.play().catch(() => {})
    audioRef.current = audio
    setPreviewing(templateId)
    audio.onended = () => setPreviewing(null)
  }

  async function handleUpload(templateId: string, file: File) {
    setErrors(e => ({ ...e, [templateId]: '' }))
    setUploading(templateId)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('templateId', templateId)
      fd.append('name', file.name.replace(/\.[^.]+$/, ''))
      const res = await fetch('/api/admin/template-settings', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setTracks(t => ({ ...t, [templateId]: { musicUrl: data.musicUrl, musicName: data.musicName } }))
    } catch (err: unknown) {
      setErrors(e => ({ ...e, [templateId]: err instanceof Error ? err.message : 'Upload failed' }))
    } finally {
      setUploading(null)
      if (fileRefs.current[templateId]) fileRefs.current[templateId]!.value = ''
    }
  }

  async function handleClear(templateId: string) {
    setUploading(templateId)
    try {
      await fetch('/api/admin/template-settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      setTracks(t => ({ ...t, [templateId]: { musicUrl: '', musicName: '' } }))
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {activeTemplates.map(template => {
        const track = tracks[template.id] ?? { musicUrl: '', musicName: '' }
        const isBusy = uploading === template.id
        const isPreviewing = previewing === template.id

        return (
          <div key={template.id} className="rounded-2xl border border-lt-border bg-lt-surface p-5">
            <div className="mb-4">
              <h3 className="font-display text-base font-extrabold text-lt-ink">{template.name}</h3>
              <p className="mt-0.5 font-sans text-xs text-lt-muted">{template.description}</p>
            </div>

            {track.musicUrl ? (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-lt-border bg-lt-subtle px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => handlePreview(template.id, track.musicUrl)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-lt-border bg-lt-surface transition hover:border-lt-ink"
                >
                  {isPreviewing ? (
                    <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor" className="text-lt-ink">
                      <rect x="1" y="1" width="4" height="12" rx="1" /><rect x="7" y="1" width="4" height="12" rx="1" />
                    </svg>
                  ) : (
                    <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor" className="translate-x-px text-lt-ink">
                      <path d="M1 1l10 6-10 6V1z" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-xs font-semibold text-lt-ink">{track.musicName || 'Custom track'}</p>
                  <p className="font-sans text-[10px] text-lt-muted">Active</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleClear(template.id)}
                  disabled={isBusy}
                  className="font-sans text-[10px] font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mb-4 rounded-xl border border-lt-border bg-lt-subtle px-3 py-2.5">
                <p className="font-sans text-xs text-lt-muted">No music set — template plays silently.</p>
              </div>
            )}

            <input
              ref={el => { fileRefs.current[template.id] = el }}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(template.id, f) }}
            />
            <button
              type="button"
              disabled={isBusy}
              onClick={() => fileRefs.current[template.id]?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-lt-border py-2.5 font-sans text-xs font-semibold text-lt-muted transition hover:border-lt-ink hover:text-lt-ink disabled:opacity-50"
            >
              {isBusy ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" /></svg>Uploading…</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 12V4M4 8l4-4 4 4" /></svg>{track.musicUrl ? 'Replace music' : 'Upload music'} (MP3, up to 15MB)</>
              )}
            </button>
            {errors[template.id] && <p className="mt-1.5 font-sans text-[11px] text-red-500">{errors[template.id]}</p>}
          </div>
        )
      })}
    </div>
  )
}
