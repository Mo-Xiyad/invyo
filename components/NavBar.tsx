'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

  const initials = (user?.user_metadata?.full_name as string)
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    ?? user?.email?.[0].toUpperCase()
    ?? '?'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-lt-border bg-lt-surface px-4 py-2.5 shadow-sm transition-shadow md:px-6 ${
          scrolled ? 'shadow-md' : ''
        }`}
        aria-label="Main"
      >
        <Link
          href="/"
          className="font-display text-lg font-extrabold tracking-tight text-lt-ink md:text-xl"
        >
          Invyo
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full px-4 py-2 font-sans text-sm font-semibold text-lt-muted transition-colors hover:text-lt-ink sm:block"
          >
            Contact
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full bg-lt-ink px-4 py-2.5 text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98] md:px-5"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-lt-border font-sans text-xs font-bold text-lt-ink transition-colors hover:bg-lt-subtle"
              >
                {initials}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="rounded-full border border-lt-border px-4 py-2 font-sans text-sm font-semibold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-lt-ink px-4 py-2.5 text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98] md:px-5"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
