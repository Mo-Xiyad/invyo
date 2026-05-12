'use client'

import { useEffect, useRef, useState } from 'react'

interface MusicTrack {
  id: string
  name: string
  public_url: string
  uploaded_by: string
  is_public: boolean
}

const DEFAULT_TRACKS = [
  { id: 'default-1', name: 'Gentle Oud', public_url: '', uploaded_by: '', is_public: true },
]

interface MusicPickerProps {
  value: string
  onChange: (url: string) => void
  templateId: string
}

export default function MusicPicker({ value, onChange, templateId }: MusicPickerProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>(DEFAULT_TRACKS)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/music')
      .then(r => r.json())
      .then(d => {
        if (d.tracks?.length) {
          setTracks([...DEFAULT_TRACKS, ...d.tracks.filter((t: MusicTrack) => !DEFAULT_TRACKS.find(dt => dt.public_url === t.public_url))])
        }
      })
      .catch(() => {})
  }, [])

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

  // Cleanup preview on unmount
  useEffect(() => () => { audioRef.current?.pause() }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('templateId', templateId)
      fd.append('name', file.name.replace(/\.[^.]+$/, ''))
      const res = await fetch('/api/music', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      const newTrack: MusicTrack = {
        id: data.trackId ?? Date.now().toString(),
        name: file.name.replace(/\.[^.]+$/, ''),
        public_url: data.url,
        uploaded_by: 'me',
        is_public: false,
      }
      setTracks(t => [newTrack, ...t])
      onChange(data.url)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      {/* Track list */}
      <div className="space-y-2">
        {tracks.map(track => {
          const isSelected = value === track.public_url
          const isPreviewing = previewUrl === track.public_url
          return (
            <div
              key={track.id}
              onClick={() => onChange(track.public_url)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                isSelected
                  ? 'border-lt-ink bg-lt-ink/5'
                  : 'border-lt-border hover:border-lt-ink/40'
              }`}
            >
              {/* Play preview button */}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); handlePreview(track.public_url) }}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-lt-border bg-lt-surface transition-colors hover:border-lt-ink"
              >
                {isPreviewing ? (
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-lt-ink">
                    <rect x="3" y="2" width="4" height="12" rx="1" />
                    <rect x="9" y="2" width="4" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor" className="text-lt-ink translate-x-px">
                    <path d="M1 1l10 6-10 6V1z" />
                  </svg>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-xs font-semibold text-lt-ink">{track.name}</p>
                {track.is_public && (
                  <p className="font-sans text-[10px] text-lt-muted">Community track</p>
                )}
                {!track.is_public && track.uploaded_by === 'me' && (
                  <p className="font-sans text-[10px] text-lt-muted">Your upload</p>
                )}
              </div>

              {isSelected && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-lt-ink">
                  <circle cx="8" cy="8" r="7" fill="currentColor" />
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )
        })}
      </div>

      {/* Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/x-m4a"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-lt-border py-2.5 font-sans text-xs font-semibold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 12V4M4 8l4-4 4 4" />
              </svg>
              Upload your own track (MP3, up to 15MB)
            </>
          )}
        </button>
        {uploadError && (
          <p className="mt-1.5 font-sans text-[11px] text-red-500">{uploadError}</p>
        )}
      </div>
    </div>
  )
}
