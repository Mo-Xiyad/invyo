'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function SignUpContent() {
  const searchParams = useSearchParams()
  const template = searchParams.get('template')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback${template ? `?template=${template}` : ''}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-lt-subtle px-4">
        <div className="w-full max-w-sm rounded-2xl border border-lt-border bg-lt-surface p-8 text-center shadow-sm">
          <div className="mb-4 text-3xl">📬</div>
          <h1 className="font-display text-xl font-extrabold text-lt-ink">Check your email</h1>
          <p className="mt-2 font-sans text-sm text-lt-muted">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-lt-subtle px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 flex justify-center font-display text-2xl font-extrabold text-lt-ink">
          Invyo
        </Link>

        <div className="rounded-2xl border border-lt-border bg-lt-surface p-8 shadow-sm">
          {template && (
            <div className="mb-6 rounded-xl bg-lt-subtle px-4 py-3 text-center">
              <p className="font-sans text-xs text-lt-muted">Creating invitation with</p>
              <p className="mt-0.5 font-display text-sm font-bold capitalize text-lt-ink">
                {template.replace(/-/g, ' ')} template
              </p>
            </div>
          )}

          <h1 className="font-display text-xl font-extrabold text-lt-ink">Create your account</h1>
          <p className="mt-1 font-sans text-sm text-lt-muted">Start building your wedding invitation</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block font-sans text-xs font-semibold text-lt-ink">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-lt-border bg-lt-subtle px-4 py-2.5 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-xs font-semibold text-lt-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-lt-border bg-lt-subtle px-4 py-2.5 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-xs font-semibold text-lt-ink">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-lt-border bg-lt-subtle px-4 py-2.5 font-sans text-sm text-lt-ink outline-none placeholder:text-lt-muted focus:border-lt-ink"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 font-sans text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-lt-ink py-3 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-lt-muted">
            Already have an account?{' '}
            <Link href={`/auth/sign-in${template ? `?template=${template}` : ''}`} className="font-semibold text-lt-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  )
}
