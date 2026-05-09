'use client'

import { useState } from 'react'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

type RSVPStatus = 'accept' | 'maybe' | 'decline' | null

interface RSVPSectionProps {
  invitationId?: string
}

function thankYouMessage(response: Exclude<RSVPStatus, null>) {
  if (response === 'accept') return 'We can’t wait to celebrate with you.'
  if (response === 'maybe') return 'Thank you for your reply — we hope to see you there.'
  return 'Thank you for letting us know. Your warm wishes mean so much.'
}

export default function RSVPSection({ invitationId }: RSVPSectionProps) {
  const data = useInvitationData()
  const [status, setStatus] = useState<RSVPStatus>(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [plusOne, setPlusOne] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedResponse, setSubmittedResponse] = useState<Exclude<RSVPStatus, null> | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!status || !name.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (!invitationId) {
        setSubmittedResponse(status)
        setSubmitted(true)
        return
      }

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          name: name.trim(),
          message: message.trim() || undefined,
          plusOne,
          status,
        }),
      })

      if (!res.ok) {
        throw new Error('Unable to submit RSVP')
      }

      setSubmittedResponse(status)
      setSubmitted(true)
    } catch {
      setError('We couldn’t send your RSVP just now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && submittedResponse) {
    return (
      <section className="sbs-shell-pattern relative overflow-hidden bg-[#1C2B4A] px-6 py-24 text-white">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-8 py-14 text-center backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A96E]">Thank you</p>
          <h2 className="mt-4 text-4xl text-white">Your reply is received</h2>
          <p className="mt-5 text-base leading-7 text-white/80">{thankYouMessage(submittedResponse)}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="sbs-shell-pattern relative overflow-hidden bg-[#1C2B4A] px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#C8A96E]">RSVP</p>
          <h2 className="mt-4 text-4xl text-white">Will you join us?</h2>
          <p className="mt-3 text-sm text-white/70">A lovely evening awaits on the coast.</p>
          {data.rsvpDeadline && (
            <p className="mt-3 text-xs text-white/50">
              Kindly reply by <span className="font-semibold text-white/75">{data.rsvpDeadline}</span>
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { key: 'accept' as const, label: "Yes, I'll be there!" },
            { key: 'decline' as const, label: "No, I can't make it" },
          ].map(option => (
            <button
              key={option.key}
              type="button"
              onClick={() => setStatus(option.key)}
              className={`rounded-full border px-4 py-3 text-sm font-semibold transition-all ${
                status === option.key
                  ? 'border-[#C8A96E] bg-[#C8A96E] text-[#1C2B4A]'
                  : 'border-white/20 bg-white/5 text-white hover:border-[#6B8FBF] hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="sbs-rsvp-name" className="mb-2 block text-sm text-white/78">
              Your name
            </label>
            <input
              id="sbs-rsvp-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#6B8FBF]"
            />
          </div>

          <div>
            <label htmlFor="sbs-rsvp-message" className="mb-2 block text-sm text-white/78">
              Message for the couple <span className="text-white/40">(optional)</span>
            </label>
            <textarea
              id="sbs-rsvp-message"
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Share a warm wish or a note…"
              className="w-full resize-none rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#6B8FBF]"
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Bringing a plus-one?</p>
              <p className="mt-1 text-xs text-white/55">Let us know so we can plan your place.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={plusOne}
              onClick={() => setPlusOne(current => !current)}
              className={`relative h-8 w-14 rounded-full transition-colors ${plusOne ? 'bg-[#6B8FBF]' : 'bg-white/20'}`}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                  plusOne ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {error && <p className="text-sm text-red-200">{error}</p>}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!status || !name.trim() || isSubmitting}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1C2B4A] transition-all hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Sending…' : 'Send RSVP'}
          </button>

          {!invitationId && (
            <p className="text-center text-xs text-white/45">
              Preview mode — this form won’t be saved to a guest list.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
