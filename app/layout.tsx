import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.invyo.uk'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Invyo - Digital Wedding Invitations That Work',
    template: '%s | Invyo',
  },
  description:
    'Create your sharable digital wedding invitation in minutes. No design skills needed. Track RSVPs in one place.',
  keywords: [
    'digital wedding invitation',
    'online wedding invitation',
    'wedding RSVP tracker',
    'wedding invite website',
    'wedding invitation creator',
    'Invyo',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Invyo - Digital Wedding Invitations That Work',
    description:
      'Create your sharable digital wedding invitation in minutes. No design skills needed. Track RSVPs in one place.',
    siteName: 'Invyo',
    images: [
      {
        url: '/assets/screen-1.png',
        width: 1200,
        height: 630,
        alt: 'Invyo digital wedding invitations preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invyo - Digital Wedding Invitations That Work',
    description:
      'Create your sharable digital wedding invitation in minutes. No design skills needed. Track RSVPs in one place.',
    images: ['/assets/screen-1.png'],
  },
  category: 'weddings',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  )
}
