import type { Metadata } from 'next'
import Link from 'next/link'
import { TEMPLATES } from '@/lib/templates'
import TemplateCard from '@/components/TemplateCard'
import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Wedding Invitation Templates',
  description:
    'Browse our collection of beautifully crafted digital wedding invitation templates. Pick a style, personalise it, and publish to your own link.',
  alternates: { canonical: '/templates' },
}

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('template_id, image_url')

  const imageMap = Object.fromEntries(
    (settings ?? []).map(s => [s.template_id, s.image_url ?? ''])
  )

  const real = TEMPLATES.filter(t => t.id !== 'coming-soon')
  const comingSoon = TEMPLATES.find(t => t.id === 'coming-soon')

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-lt-surface">
        {/* Hero */}
        <section className="bg-gradient-to-b from-lt-lime to-lt-lime-deep pb-16 pt-28 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-lt-muted">
              Templates
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-lt-ink">
              Wedding invitation styles
              <br className="hidden sm:block" /> for every couple
            </h1>
            <p className="mt-5 max-w-xl font-sans text-base font-medium leading-relaxed text-lt-ink/70 md:text-lg">
              Pick a template, personalise with your details, and publish to your own{' '}
              <span className="font-semibold text-lt-ink">name.invyo.uk</span> link. Want something
              totally bespoke?{' '}
              <Link href="/contact" className="underline underline-offset-2 hover:no-underline">
                Get in touch
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {real.map((t, i) => (
                <TemplateCard key={t.id} config={t} index={i} imageUrl={imageMap[t.id] || undefined} />
              ))}
              {comingSoon && (
                <TemplateCard key={comingSoon.id} config={comingSoon} index={real.length} />
              )}
            </div>

            {/* Custom CTA */}
            <div className="mt-16 rounded-2xl border border-lt-border bg-lt-subtle px-8 py-10 text-center">
              <h2 className="font-display text-xl font-extrabold tracking-tight text-lt-ink md:text-2xl">
                Don&apos;t see what you&apos;re looking for?
              </h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-lt-muted md:text-base">
                We design custom invitation experiences tailored to your style, culture, and story.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-lt-ink px-8 py-3 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Request a custom design
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
