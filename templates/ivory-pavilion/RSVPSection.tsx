'use client'

import { useState } from 'react'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

interface RSVPSectionProps {
  invitationId?: string
}

export default function RSVPSection({ invitationId }: RSVPSectionProps) {
  const data = useInvitationData()
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(true)
  const [guests, setGuests] = useState(1)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || attending === null) return

    setIsSubmitting(true)
    setError('')

    try {
      if (!invitationId) {
        setSubmitted(true)
        return
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          name: name.trim(),
          attending,
          guests,
          notes: notes.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to submit RSVP')
      }

      setSubmitted(true)
    } catch {
      setError('Your reply could not be sent just now. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section
        className="relative overflow-hidden bg-[#F5F0EB] px-5 py-20 text-[#2C2416] sm:px-8"
        style={{ fontFamily: "'Source Serif 4', serif" }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="ivory-petal absolute top-[-12%] h-5 w-3 rounded-full bg-[#E8DFD0] opacity-80"
              style={{
                left: `${10 + index * 11}%`,
                animationDelay: `${index * 0.35}s`,
                animationDuration: `${4.8 + index * 0.18}s`,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-b-[2rem] rounded-t-[4rem] border border-[#E8DFD0] bg-[#FAF8F5] px-8 pb-10 pt-10 text-center shadow-[0_24px_60px_rgba(156,139,120,0.12)] sm:rounded-t-[7rem] sm:pt-14">
          <IvorySectionHeader eyebrow="Thank you" title="Your reply has been received" />
          <p className="mt-6 text-base leading-[1.85] text-[#827B6F]/95">
            {attending
              ? 'We look forward to celebrating together beneath the pavilion.'
              : 'Thank you for letting us know. Your warm wishes mean the world to us.'}
          </p>
        </div>
        <style jsx>{`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.9; }
            100% { transform: translateY(115vh) rotate(280deg); opacity: 0; }
          }

          .ivory-petal {
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            transform-origin: center;
          }
        `}</style>
      </section>
    )
  }

  return (
    <section
      className="bg-[#F5F0EB] px-5 py-20 text-[#2C2416] sm:px-8"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-b-[2rem] rounded-t-[4rem] border border-[#E8DFD0] bg-[#FAF8F5] px-6 pb-8 pt-14 shadow-[0_24px_60px_rgba(156,139,120,0.12)] sm:rounded-t-[7rem] sm:px-8">
        <IvorySectionHeader eyebrow="RSVP" title="Kindly let us know" />
        {data.rsvpDeadline && (
          <p className="mt-4 text-center text-sm text-[#827B6F]/90">Please respond by {data.rsvpDeadline}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-[#827B6F]/90" htmlFor="ivory-name" style={{ fontFamily: "'Source Serif 4', serif" }}>
              Name
            </label>
            <input
              id="ivory-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-[#E8DFD0] bg-white px-4 py-3 outline-none transition focus:border-[#C8B99A]"
              placeholder="Your full name"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-[#827B6F]/90" style={{ fontFamily: "'Source Serif 4', serif" }}>Attendance</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Joyfully attending', value: true },
                { label: 'With regrets', value: false },
              ].map(option => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setAttending(option.value)}
                  className={`rounded-full border px-4 py-3 text-sm transition ${
                    attending === option.value
                      ? 'border-[#C8B99A] bg-[#C8B99A] text-[#2C2416]'
                      : 'border-[#E8DFD0] bg-white text-[#827B6F]/90 hover:border-[#C8B99A]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-[#827B6F]/90" style={{ fontFamily: "'Source Serif 4', serif" }}>Number of guests</p>
            <div className="flex items-center justify-between rounded-2xl border border-[#E8DFD0] bg-white px-4 py-3">
              <span className="text-sm text-[#2C2416]">Including yourself</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests(current => Math.max(1, current - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8B99A] text-lg text-[#2C2416]"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-lg tabular-nums text-[#2C2416]">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests(current => Math.min(10, current + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C8B99A] text-lg text-[#2C2416]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#827B6F]/90" htmlFor="ivory-notes" style={{ fontFamily: "'Source Serif 4', serif" }}>
              Dietary notes
            </label>
            <textarea
              id="ivory-notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full resize-none rounded-2xl border border-[#E8DFD0] bg-white px-4 py-3 outline-none transition focus:border-[#C8B99A]"
              placeholder="Any allergies or dietary preferences?"
            />
          </div>

          {error && <p className="text-sm text-[#8F5C54]">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || attending === null || isSubmitting}
            className="w-full rounded-full bg-[#C8B99A] px-5 py-3 text-sm font-semibold text-[#2C2416] transition hover:bg-[#bfae8f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Sending…' : 'Send RSVP'}
          </button>

          {!invitationId && (
            <p className="text-center text-xs text-[#827B6F]/80">Preview mode — this response will not be saved.</p>
          )}
        </form>
      </div>
    </section>
  )
}
