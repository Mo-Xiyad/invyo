'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

interface MusicTrack {
  id: string
  name: string
  public_url: string
  uploaded_by: string | null
  is_public: boolean
  isTemplateDefault?: boolean
}

interface MusicPickerProps {
  value: string
  onChange: (url: string) => void
  templateId: string
}

const MAX_MB = 15
const ALLOWED_EXTS = ['.mp3', '.wav', '.ogg', '.aac', '.m4a']
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a']

function validateFile(file: File): string | null {
  const valid = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTS.some(e => file.name.toLowerCase().endsWith(e))
  if (!valid) return `Unsupported format. Use ${ALLOWED_EXTS.join(', ')}.`
  if (file.size > MAX_MB * 1024 * 1024) return `File too large — ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds ${MAX_MB}MB.`
  return null
}

export default function MusicPicker({ value, onChange, templateId }: MusicPickerProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/music?templateId=${templateId}`)
      .then(r => r.json())
      .then(d => setTracks(d.tracks ?? []))
      .catch(() => setTracks([]))
      .finally(() => setLoading(false))
  }, [templateId])

  useEffect(() => () => { audioRef.current?.pause() }, [])

  function handlePreview(url: string) {
    if (previewUrl === url) {
      audioRef.current?.pause()
      setPreviewUrl(null)
      return
    }
    audioRef.current?.pause()
    const audio = new Audio(url)
    audio.volume = 0.4
    audio.play().catch(() => {})
    audioRef.current = audio
    setPreviewUrl(url)
    audio.onended = () => setPreviewUrl(null)
  }

  const handleUpload = useCallback(async (file: File) => {
    setUploadError('')
    const err = validateFile(file)
    if (err) { setUploadError(err); return }

    setUploading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      const ext = file.name.split('.').pop() ?? 'mp3'
      const storagePath = `user/${user.id}/${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('Music')
        .upload(storagePath, file, { contentType: file.type || 'audio/mpeg', upsert: false })
      if (uploadErr) throw new Error(uploadErr.message)

      const { data: { publicUrl } } = supabase.storage.from('Music').getPublicUrl(storagePath)
      const trackName = file.name.replace(/\.[^.]+$/, '')

      // Save record to DB
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trackName, storagePath, publicUrl, templateId }),
      })
      const json = await res.json()

      const newTrack: MusicTrack = {
        id: json.trackId ?? storagePath,
        name: trackName,
        public_url: publicUrl,
        uploaded_by: user.id,
        is_public: false,
      }
      setTracks(t => [newTrack, ...t])
      onChange(publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      if (msg.includes('row-level') || msg.includes('policy')) {
        setUploadError('Upload not permitted — contact support to enable user uploads.')
      } else {
        setUploadError(msg)
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [templateId, onChange])

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true) }
  function onDragLeave(e: React.DragEvent) { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const selectedTrack = tracks.find(t => t.public_url === value)

  return (
    <div className="space-y-3">
      {/* Selected track summary */}
      {value && value !== 'pending' && selectedTrack && (
        <div className="flex items-center gap-3 rounded-xl border border-lt-ink/20 bg-lt-ink/5 px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="flex-shrink-0 text-lt-ink">
            <circle cx="8" cy="8" r="7" />
            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="min-w-0 flex-1 truncate font-sans text-xs font-semibold text-lt-ink">{selectedTrack.name}</p>
          <button type="button" onClick={() => onChange('')} className="font-sans text-[10px] font-semibold text-lt-muted hover:text-red-500">Remove</button>
        </div>
      )}

      {/* Track list */}
      {loading ? (
        <div className="flex items-center gap-2 py-2 font-sans text-xs text-lt-muted">
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" /></svg>
          Loading tracks…
        </div>
      ) : tracks.length === 0 ? (
        <p className="py-1 font-sans text-xs text-lt-muted">No tracks available yet — upload your own below.</p>
      ) : (
        <div className="space-y-1.5">
          {tracks.map(track => {
            const isSelected = value === track.public_url
            const isPreviewing = previewUrl === track.public_url
            return (
              <div
                key={track.id}
                onClick={() => onChange(isSelected ? '' : track.public_url)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                  isSelected ? 'border-lt-ink/30 bg-lt-ink/5' : 'border-lt-border hover:border-lt-ink/30'
                }`}
              >
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); if (track.public_url) handlePreview(track.public_url) }}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-lt-border bg-lt-surface transition hover:border-lt-ink"
                >
                  {isPreviewing ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className="text-lt-ink">
                      <rect x="1" y="1" width="4" height="10" rx="1" /><rect x="7" y="1" width="4" height="10" rx="1" />
                    </svg>
                  ) : (
                    <svg width="9" height="10" viewBox="0 0 10 12" fill="currentColor" className="translate-x-px text-lt-ink">
                      <path d="M1 1l8 5-8 5V1z" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-xs font-semibold text-lt-ink">{track.name}</p>
                  <p className="font-sans text-[10px] text-lt-muted">
                    {track.isTemplateDefault ? 'Template default' : track.is_public ? 'Available track' : 'Your upload'}
                  </p>
                </div>
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="flex-shrink-0 text-lt-ink">
                    <circle cx="8" cy="8" r="7" />
                    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Upload — drag & drop */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTS.join(',')}
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          'flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed py-4 transition-colors',
          uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          dragging ? 'border-lt-ink bg-lt-subtle/80 text-lt-ink' : 'border-lt-border text-lt-muted hover:border-lt-ink hover:text-lt-ink',
        ].join(' ')}
      >
        {uploading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" /></svg>
            <span className="font-sans text-xs font-semibold">Uploading…</span>
          </>
        ) : dragging ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            <span className="font-sans text-xs font-semibold">Drop to upload</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19V13H5l7-7 7 7h-4v6H9z" /></svg>
            <span className="font-sans text-xs font-semibold">Upload your own track</span>
            <span className="font-sans text-[10px] text-lt-muted">Drag & drop or click · MP3, WAV, AAC · max {MAX_MB}MB</span>
          </>
        )}
      </button>

      {uploadError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <svg className="mt-px h-3.5 w-3.5 flex-shrink-0 text-red-500" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
          </svg>
          <p className="font-sans text-[11px] leading-relaxed text-red-700">{uploadError}</p>
        </div>
      )}
    </div>
  )
}
