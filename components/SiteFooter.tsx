import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-lt-footer py-14 text-lt-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-lt-surface hover:text-lt-lime">
            Wedvite
          </Link>
          <p className="mt-3 max-w-xs font-sans text-sm font-medium text-white/45">
            Digital wedding invitations that work.
          </p>
        </div>

        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-white/40">Trust &amp; Legal</p>
          <nav className="mt-4 flex flex-col gap-3" aria-label="Legal">
            <Link
              href="/terms"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-lt-surface"
            >
              Terms and conditions
            </Link>
            <Link
              href="/privacy"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-lt-surface"
            >
              Privacy notice
            </Link>
            <Link
              href="/cookies"
              className="font-sans text-sm font-medium text-white/70 transition-colors hover:text-lt-surface"
            >
              Cookie notice
            </Link>
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-5 pt-8 md:px-8">
        <p className="font-sans text-xs font-medium text-white/35">© {new Date().getFullYear()} Wedvite</p>
      </div>
    </footer>
  )
}
