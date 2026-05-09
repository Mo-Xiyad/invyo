'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const template = searchParams.get('template')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(template ? `/dashboard?template=${template}` : '/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-lt-subtle px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 flex justify-center font-display text-2xl font-extrabold text-lt-ink">
          Invyo
        </Link>

        <div className="rounded-2xl border border-lt-border bg-lt-surface p-8 shadow-sm">
          <h1 className="font-display text-xl font-extrabold text-lt-ink">Welcome back</h1>
          <p className="mt-1 font-sans text-sm text-lt-muted">Sign in to your Invyo account</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-lt-muted">
            Don&apos;t have an account?{' '}
            <Link href={`/auth/sign-up${template ? `?template=${template}` : ''}`} className="font-semibold text-lt-ink underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
