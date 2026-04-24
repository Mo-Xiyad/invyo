import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import FeatureSection from '@/components/FeatureSection'
import ClosingSection from '@/components/ClosingSection'
import FAQSection from '@/components/FAQSection'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <FeatureSection
          variant="create"
          imagePosition="left"
          title="Create and customize your Wedvite in minutes"
          subtitle="Add photos of you and your beloved, choose a theme and have your Wedvite running in a blink of an eye."
          bgColor="bg-lt-surface"
        />
        <FeatureSection
          variant="share"
          imagePosition="right"
          title="Share your Wedvite anywhere you like!"
          subtitle="Send your unique Wedvite link to your guests so they know about the good news and wedding details."
          bgColor="bg-lt-subtle"
        />
        <FeatureSection
          variant="track"
          imagePosition="left"
          title="Know who's coming"
          subtitle="Use Wedvite to track who's coming and who they're bringing. Simplify your wedding planning."
          bgColor="bg-lt-surface"
        />
        <ClosingSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  )
}
