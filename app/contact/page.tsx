'use client'

import { FormEvent, useState } from 'react'
import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'

type FormState = {
  name: string
  email: string
  preferredContact: 'email' | 'whatsapp'
  whatsappNumber: string
  instagram: string
  eventDate: string
  message: string
}

const initialState: FormState = {
  name: '',
  email: '',
  preferredContact: 'email',
  whatsappNumber: '',
  instagram: '',
  eventDate: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        setStatus('error')
        setStatusMessage(result?.error ?? 'Could not send your message. Please try again.')
        return
      }

      setForm(initialState)
      setStatus('success')
      setStatusMessage("Thanks! We received your message and we'll get back to you soon.")
    } catch {
      setStatus('error')
      setStatusMessage('Network error. Please try again in a moment.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 pb-20 pt-32">
        <section className="mx-auto w-full max-w-2xl rounded-3xl border border-lt-border bg-lt-surface p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-lt-accent">Contact</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-4xl">
            Let&apos;s plan your invite
          </h1>
          <p className="mt-3 text-sm text-lt-muted md:text-base">
            Send us your details and we&apos;ll help you get started quickly.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-lt-ink">Full name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-lt-ink">
                Email (required)
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
                placeholder="you@example.com"
              />
            </label>

            <fieldset>
              <legend className="mb-1.5 block text-sm font-semibold text-lt-ink">
                Preferred contact method
              </legend>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-full border border-lt-border bg-white px-4 py-2 text-sm font-medium text-lt-ink">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={form.preferredContact === 'email'}
                    onChange={() => setForm((prev) => ({ ...prev, preferredContact: 'email' }))}
                  />
                  Email
                </label>
                <label className="inline-flex items-center gap-2 rounded-full border border-lt-border bg-white px-4 py-2 text-sm font-medium text-lt-ink">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                    checked={form.preferredContact === 'whatsapp'}
                    onChange={() => setForm((prev) => ({ ...prev, preferredContact: 'whatsapp' }))}
                  />
                  WhatsApp
                </label>
              </div>
            </fieldset>

            {form.preferredContact === 'whatsapp' ? (
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-lt-ink">
                  WhatsApp number
                </span>
                <input
                  required
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, whatsappNumber: event.target.value }))
                  }
                  className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
                  placeholder="+44 7XXX XXXXXX"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-lt-ink">
                Instagram or social profile (optional)
              </span>
              <input
                value={form.instagram}
                onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))}
                className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
                placeholder="@yourhandle"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-lt-ink">
                Event date (optional)
              </span>
              <input
                type="date"
                value={form.eventDate}
                onChange={(event) => setForm((prev) => ({ ...prev, eventDate: event.target.value }))}
                className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-lt-ink">How can we help?</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                className="w-full rounded-xl border border-lt-border bg-white px-4 py-3 text-sm text-lt-ink outline-none ring-lt-accent/30 transition focus:ring-2"
                placeholder="Tell us what you need..."
              />
            </label>

            <button
              type="submit"
              disabled={isSending}
              className="inline-flex rounded-full bg-lt-ink px-6 py-3 text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSending ? 'Sending...' : 'Send message'}
            </button>

            {status !== 'idle' ? (
              <p
                className={`text-sm font-medium ${
                  status === 'success' ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {statusMessage}
              </p>
            ) : null}
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
