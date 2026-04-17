import type { Metadata, Viewport } from 'next'
import { Amiri, Lato, Playfair_Display } from 'next/font/google'
import './globals.css'

// Match randa-mohamed-s-day: Playfair (display), Lato (body), Amiri (RTL / Dhivehi).
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--lato',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--amiri',
  display: 'swap',
})
/** Canonical origin for OG / metadataBase. WhatsApp must be able to fetch og:image from this host. */
function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`
  return 'https://invyo.uk'
}

const siteUrl = siteOrigin()
const teaserTitle = 'Celebrating Love, Joy, and Togetherness'
const teaserDescription = 'Ibrahim Zimam & Yanal Ahmed invite you to share in a beautiful celebration of their union.'

export const metadata: Metadata = {
  title: 'Ibrahim Zimam & Yanal Ahmed — Marriage Ceremony',
  description: 'You are invited.',
  robots: { index: false, follow: false },
  metadataBase: new URL(`${siteUrl}/`),
  openGraph: {
    title: teaserTitle,
    description: teaserDescription,
    url: `${siteUrl}/`,
    siteName: 'Ibrahim & Yanal Invitation',
    type: 'website',
    // og:image comes from `app/opengraph-image.tsx` (stable route for WhatsApp / Meta crawlers)
  },
  twitter: {
    card: 'summary',
    title: teaserTitle,
    description: teaserDescription,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${amiri.variable}`}>
      <body suppressHydrationWarning className="font-cinzel antialiased">
        {children}
      </body>
    </html>
  )
}
