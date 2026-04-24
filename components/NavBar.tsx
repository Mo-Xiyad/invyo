'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
          Wedvite
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-lt-ink transition-colors hover:bg-lt-subtle sm:inline"
          >
            Log in
          </Link>
          <Link
            href="#get-started"
            className="rounded-full bg-lt-ink px-4 py-2.5 text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98] md:px-5"
          >
            Get started free
          </Link>
        </div>
      </nav>
    </header>
  )
}
