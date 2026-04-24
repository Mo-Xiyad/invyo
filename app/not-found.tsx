import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Page not found — Wedvite',
  description: 'This page does not exist or has been moved.',
}

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-[calc(100svh-12rem)] flex-col items-center justify-center bg-gradient-to-b from-lt-lime to-lt-lime-deep px-5 py-24">
        <p className="font-sans text-sm font-bold uppercase tracking-widest text-lt-muted">404</p>
        <h1 className="mt-3 max-w-md text-center font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-md text-center font-sans text-base font-medium text-lt-muted">
          The link may be wrong or the page may have been removed. Check the URL or head back home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-lt-ink px-8 py-3.5 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Back to home
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center rounded-full border-2 border-lt-ink bg-lt-surface px-8 py-3.5 font-sans text-sm font-bold text-lt-ink transition-colors hover:bg-lt-subtle"
          >
            Get started
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
