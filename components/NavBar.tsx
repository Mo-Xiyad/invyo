'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-parchment/95 backdrop-blur-sm shadow-sm border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-espresso tracking-tight">
          Wedvite
        </Link>
        <Link
          href="#get-started"
          className="text-sm font-sans font-bold tracking-wide px-5 py-2.5 bg-espresso text-champagne rounded-full hover:bg-espresso-dk transition-colors duration-200"
        >
          Get started free
        </Link>
      </div>
    </nav>
  )
}
