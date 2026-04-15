import type { Metadata, Viewport } from 'next'
import { Cinzel, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import './globals.css'

// Note: variable names here must match what globals.css @theme references:
//   --cinzel, --cormorant, --vibes
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--cormorant',
  display: 'swap',
})

const vibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--vibes',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://invyo.uk'
const previewImage = '/assets/Z-y-logo.png'
const teaserTitle = 'Celebrating Love, Joy, and Togetherness'
const teaserDescription = 'Ibrahim Zimam & Yanal Ahmed invite you to share in a beautiful celebration of their union.'

export const metadata: Metadata = {
  title: 'Ibrahim Zimam & Yanal Ahmed — Marriage Ceremony',
  description: 'You are invited.',
  robots: { index: false, follow: false },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: teaserTitle,
    description: teaserDescription,
    url: siteUrl,
    siteName: 'Ibrahim & Yanal Invitation',
    images: [
      {
        url: previewImage,
        width: 512,
        height: 512,
        alt: 'Ibrahim Zimam and Yanal Ahmed invitation monogram',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: teaserTitle,
    description: teaserDescription,
    images: [previewImage],
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
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${vibes.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
