import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-espresso-dk border-t border-champagne/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif text-lg text-champagne/50 hover:text-champagne transition-colors duration-200"
        >
          Wedvite
        </Link>

        <nav className="flex flex-wrap justify-center gap-8" aria-label="Legal">
          <Link
            href="/terms"
            className="text-xs font-sans text-champagne/35 hover:text-champagne/65 transition-colors duration-200"
          >
            Terms and conditions
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-sans text-champagne/35 hover:text-champagne/65 transition-colors duration-200"
          >
            Privacy notice
          </Link>
          <Link
            href="/cookies"
            className="text-xs font-sans text-champagne/35 hover:text-champagne/65 transition-colors duration-200"
          >
            Cookie notice
          </Link>
        </nav>

        <p className="text-xs font-sans text-champagne/25">
          © {new Date().getFullYear()} Wedvite
        </p>
      </div>
    </footer>
  )
}
