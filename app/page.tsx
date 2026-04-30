import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import FeatureSection from '@/components/FeatureSection'
import ClosingSection from '@/components/ClosingSection'
import FAQSection from '@/components/FAQSection'
import SiteFooter from '@/components/SiteFooter'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.invyo.uk'

export const metadata: Metadata = {
  title: 'Wedding Invitations Made Simple',
  description:
    'Build and share your wedding invitation online, collect RSVPs, and keep guest planning simple with Invyo.',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Invyo',
                url: siteUrl,
                email: 'support@invyo.uk',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Invyo',
                url: siteUrl,
              },
            ]),
          }}
        />
        <HeroSection />
        <FeatureSection
          variant="create"
          imagePosition="left"
          title="Create and customize your Invyo in minutes"
          subtitle="Add photos of you and your beloved, choose a theme and have your Invyo running in a blink of an eye."
          bgColor="bg-lt-surface"
        />
        <FeatureSection
          variant="share"
          imagePosition="right"
          title="Share your Invyo anywhere you like!"
          subtitle="Send your unique Invyo link to your guests so they know about the good news and wedding details."
          bgColor="bg-lt-subtle"
        />
        <FeatureSection
          variant="track"
          imagePosition="left"
          title="Know who's coming"
          subtitle="Use Invyo to track who's coming and who they're bringing. Simplify your wedding planning."
          bgColor="bg-lt-surface"
        />
        <ClosingSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  )
}
