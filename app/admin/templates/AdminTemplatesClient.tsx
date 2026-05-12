'use client'

import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, Music2, Play, Square, Trash2, Upload } from 'lucide-react'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const ACCEPTED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a']

export type AdminTemplateRecord = {
  id: string
  name: string
  description: string
  musicUrl: string
  musicName: string
}

type TemplateState = {
  musicUrl: string
  musicName: string
}

type UploadState = {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  message: string
}

function formatProgress(progress: number) {
  return `${Math.round(progress)}%`
}

export default function AdminTemplatesClient({ templates }: { templates: AdminTemplateRecord[] }) {
  const [templateState, setTemplateState] = useState<Record<string, TemplateState>>(() =>
    Object.fromEntries(
      templates.map((template) => [
        template.id,
        { musicUrl: template.musicUrl, musicName: template.musicName },
      ])
    )
  )
  const [uploadState, setUploadState] = useState<Record<string, UploadState>>({})
  const [playingTemplateId, setPlayingTemplateId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  function setStatus(templateId: string, next: UploadState) {
    setUploadState((current) => ({ ...current, [templateId]: next }))
  }

  async function togglePreview(templateId: string) {
    const currentTrack = templateState[templateId]
    if (!currentTrack?.musicUrl) return

    if (playingTemplateId === templateId) {
      audioRef.current?.pause()
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
      setPlayingTemplateId(null)
      return
    }

    try {
      audioRef.current?.pause()
      const audio = new Audio(currentTrack.musicUrl)
      audioRef.current = audio
      audio.addEventListener('ended', () => setPlayingTemplateId(null), { once: true })
      await audio.play()
      setPlayingTemplateId(templateId)
    } catch {
      setStatus(templateId, {
        status: 'error',
        progress: 0,
        message: 'Preview unavailable for this track.',
      })
    }
  }

  async function uploadTemplateMusic(templateId: string, file: File) {
    if (file.size > MAX_FILE_SIZE) {
      setStatus(templateId, {
        status: 'error',
        progress: 0,
        message: 'File must be 15MB or smaller.',
      })
      return
    }

    if (file.type && !ACCEPTED_TYPES.includes(file.type)) {
      setStatus(templateId, {
        status: 'error',
        progress: 0,
        message: 'Only MP3, WAV, OGG, AAC, or M4A files are allowed.',
      })
      return
    }

    setStatus(templateId, {
      status: 'uploading',
      progress: 0,
      message: 'Uploading track…',
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('templateId', templateId)
    formData.append('name', file.name)

    try {
      const payload = await new Promise<{ musicUrl: string; musicName: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/admin/template-settings')
        xhr.responseType = 'json'

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return
          setStatus(templateId, {
            status: 'uploading',
            progress: (event.loaded / event.total) * 100,
            message: 'Uploading track…',
          })
        }

        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.onload = () => {
          const response = xhr.response
          if (xhr.status >= 200 && xhr.status < 300 && response?.musicUrl) {
            resolve(response)
            return
          }

          reject(new Error(response?.error ?? 'Upload failed'))
        }

        xhr.send(formData)
      })

      if (playingTemplateId === templateId) {
        audioRef.current?.pause()
        audioRef.current = null
        setPlayingTemplateId(null)
      }

      setTemplateState((current) => ({
        ...current,
        [templateId]: {
          musicUrl: payload.musicUrl,
          musicName: payload.musicName,
        },
      }))
      setStatus(templateId, {
        status: 'success',
        progress: 100,
        message: 'Music updated successfully.',
      })
    } catch (error) {
      setStatus(templateId, {
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Upload failed',
      })
    }
  }

  async function clearTemplateMusic(templateId: string) {
    setStatus(templateId, {
      status: 'uploading',
      progress: 0,
      message: 'Clearing music…',
    })

    try {
      const response = await fetch('/api/admin/template-settings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Failed to clear music')
      }

      if (playingTemplateId === templateId) {
        audioRef.current?.pause()
        audioRef.current = null
        setPlayingTemplateId(null)
      }

      setTemplateState((current) => ({
        ...current,
        [templateId]: {
          musicUrl: '',
          musicName: '',
        },
      }))
      setStatus(templateId, {
        status: 'success',
        progress: 100,
        message: 'Music cleared.',
      })
    } catch (error) {
      setStatus(templateId, {
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Failed to clear music',
      })
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {templates.map((template) => {
        const current = templateState[template.id] ?? { musicUrl: '', musicName: '' }
        const status = uploadState[template.id] ?? { status: 'idle', progress: 0, message: '' }
        const isUploading = status.status === 'uploading'
        const isPlaying = playingTemplateId === template.id

        return (
          <article key={template.id} className="rounded-[2rem] border border-lt-border bg-lt-surface p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-extrabold text-lt-ink">{template.name}</p>
                <p className="mt-2 font-sans text-sm text-lt-muted">{template.description}</p>
              </div>
              <span className="rounded-full bg-lt-subtle px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-lt-muted">
                {template.id}
              </span>
            </div>

            <div className="mt-6 rounded-3xl border border-lt-border bg-lt-subtle p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lt-surface text-lt-ink">
                  <Music2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-semibold text-lt-ink">
                    {current.musicName || 'No music selected'}
                  </p>
                  <p className="mt-1 truncate font-sans text-xs text-lt-muted">
                    {current.musicUrl || 'No public URL set'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void togglePreview(template.id)}
                  disabled={!current.musicUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-lt-border bg-lt-surface px-4 py-2 font-sans text-sm font-semibold text-lt-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Stop' : 'Play'}
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-lt-border bg-lt-ink px-4 py-2 font-sans text-sm font-semibold text-lt-surface transition-opacity hover:opacity-90">
                {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Replace music
                <input
                  type="file"
                  className="sr-only"
                  accept=".mp3,.wav,.aac,.ogg,.m4a,audio/mpeg,audio/wav,audio/aac,audio/ogg,audio/x-m4a"
                  disabled={isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      void uploadTemplateMusic(template.id, file)
                    }
                    event.target.value = ''
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => void clearTemplateMusic(template.id)}
                disabled={isUploading || !current.musicUrl}
                className="inline-flex items-center gap-2 rounded-full border border-lt-border px-4 py-2 font-sans text-sm font-semibold text-lt-ink transition-colors hover:bg-lt-subtle disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear music
              </button>
            </div>

            <div className="mt-5 space-y-2 font-sans text-xs text-lt-muted">
              <p>Accepted formats: MP3, WAV, AAC, OGG, M4A · Max size: 15MB</p>
              {status.status !== 'idle' ? (
                <div className="space-y-2">
                  {status.status === 'uploading' ? (
                    <div className="h-2 overflow-hidden rounded-full bg-lt-border">
                      <div
                        className="h-full rounded-full bg-lt-ink transition-all"
                        style={{ width: `${Math.max(status.progress, 8)}%` }}
                      />
                    </div>
                  ) : null}
                  <p
                    className={[
                      'font-semibold',
                      status.status === 'error'
                        ? 'text-red-600'
                        : status.status === 'success'
                          ? 'text-green-700'
                          : 'text-lt-muted',
                    ].join(' ')}
                  >
                    {status.message}
                    {status.status === 'uploading' ? ` ${formatProgress(status.progress)}` : ''}
                  </p>
                </div>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
