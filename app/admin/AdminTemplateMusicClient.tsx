'use client'

import { useRef, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { TEMPLATES } from '@/lib/templates'

interface TrackState { musicUrl: string; musicName: string }
interface Props { initial: Record<string, TrackState> }

const activeTemplates = TEMPLATES.filter(t => t.id !== 'coming-soon')
const MAX_MB = 15
const ALLOWED_EXTS = ['.mp3', '.wav', '.ogg', '.aac', '.m4a']
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a']

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('413') || msg.toLowerCase().includes('too large')) return `File too large — max ${MAX_MB}MB.`
  if (msg.includes('mime') || msg.includes('type') || msg.includes('format')) return `Unsupported format. Use ${ALLOWED_EXTS.join(', ')}.`
  if (msg.includes('network') || msg.includes('Failed to fetch')) return 'Network error — check your connection and try again.'
  if (msg.includes('auth') || msg.includes('401') || msg.includes('403')) return 'Session expired — please refresh the page.'
  if (msg.includes('storage') || msg.includes('bucket')) return 'Storage error — make sure the "music" bucket exists and is public in Supabase.'
  if (msg.includes('row-level') || msg.includes('policy')) return 'Permission denied — check Supabase Storage policies for the "music" bucket.'
  return msg || 'Something went wrong. Please try again.'
}

function validateFile(file: File): string | null {
  const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTS.some(ext => file.name.toLowerCase().endsWith(ext))
  if (!isValidType) return `Unsupported format. Use ${ALLOWED_EXTS.join(', ')}.`
  if (file.size > MAX_MB * 1024 * 1024) return `File too large — ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds the ${MAX_MB}MB limit.`
  return null
}

export default function AdminTemplateMusicClient({ initial }: Props) {
  const [tracks, setTracks] = useState<Record<string, TrackState>>(initial)
  const [uploading, setUploading] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
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

  const handleUpload = useCallback(async (templateId: string, file: File) => {
    setErrors(e => ({ ...e, [templateId]: '' }))
    const validationError = validateFile(file)
    if (validationError) { setErrors(e => ({ ...e, [templateId]: validationError })); return }

    setUploading(templateId)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() ?? 'mp3'
      const path = `template/${templateId}/${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('music')
        .upload(path, file, { contentType: file.type || 'audio/mpeg', upsert: true })
      if (uploadErr) throw new Error(uploadErr.message)

      const { data: { publicUrl } } = supabase.storage.from('music').getPublicUrl(path)
      const trackName = file.name.replace(/\.[^.]+$/, '')

      const res = await fetch('/api/admin/template-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, musicUrl: publicUrl, musicName: trackName }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save settings')

      setTracks(t => ({ ...t, [templateId]: { musicUrl: publicUrl, musicName: trackName } }))
    } catch (err) {
      setErrors(e => ({ ...e, [templateId]: friendlyError(err) }))
    } finally {
      setUploading(null)
      if (fileRefs.current[templateId]) fileRefs.current[templateId]!.value = ''
    }
  }, [])

  async function handleClear(templateId: string) {
    setErrors(e => ({ ...e, [templateId]: '' }))
    setUploading(templateId)
    try {
      const res = await fetch('/api/admin/template-settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      if (!res.ok) throw new Error('Failed to remove music')
      setTracks(t => ({ ...t, [templateId]: { musicUrl: '', musicName: '' } }))
    } catch (err) {
      setErrors(e => ({ ...e, [templateId]: friendlyError(err) }))
    } finally {
      setUploading(null)
    }
  }

  function onDragOver(e: React.DragEvent, templateId: string) {
    e.preventDefault()
    setDragging(templateId)
  }
  function onDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(null)
  }
  function onDrop(e: React.DragEvent, templateId: string) {
    e.preventDefault()
    setDragging(null)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(templateId, file)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {activeTemplates.map(template => {
        const track = tracks[template.id] ?? { musicUrl: '', musicName: '' }
        const isBusy = uploading === template.id
        const isDragging = dragging === template.id
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
                  <p className="font-sans text-[10px] text-lt-muted">Active · click play to preview</p>
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
              accept={ALLOWED_EXTS.join(',')}
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(template.id, f) }}
            />
            <button
              type="button"
              disabled={isBusy}
              onClick={() => !isBusy && fileRefs.current[template.id]?.click()}
              onDragOver={e => onDragOver(e, template.id)}
              onDragLeave={onDragLeave}
              onDrop={e => onDrop(e, template.id)}
              className={[
                'flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-5 transition-colors',
                isBusy ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                isDragging
                  ? 'border-lt-ink bg-lt-subtle/80 text-lt-ink'
                  : 'border-lt-border text-lt-muted hover:border-lt-ink hover:text-lt-ink',
              ].join(' ')}
            >
              {isBusy ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  <span className="font-sans text-xs font-semibold">Uploading…</span>
                </>
              ) : isDragging ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  <span className="font-sans text-xs font-semibold">Drop to upload</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19V13H5l7-7 7 7h-4v6H9z" />
                  </svg>
                  <span className="font-sans text-xs font-semibold">{track.musicUrl ? 'Replace music' : 'Upload music'}</span>
                  <span className="font-sans text-[10px] text-lt-muted">Drag & drop or click · MP3, WAV, AAC · max {MAX_MB}MB</span>
                </>
              )}
            </button>

            {errors[template.id] && (
              <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
                <svg className="mt-px h-3.5 w-3.5 flex-shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
                </svg>
                <p className="font-sans text-[11px] leading-relaxed text-red-700">{errors[template.id]}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
