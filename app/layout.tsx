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
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${amiri.variable}`}>
      <body suppressHydrationWarning className="font-cormorant antialiased">
        {children}
      </body>
    </html>
  )
}
