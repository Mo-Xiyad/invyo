import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'

export default function CookiesPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 pb-20 pt-32">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-lt-border bg-lt-surface p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-lt-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-4xl">
            Cookie Notice
          </h1>
          <p className="mt-3 text-sm text-lt-muted">Last updated: 30 April 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-lt-ink/90 md:text-base">
            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">1. What Are Cookies?</h2>
              <p className="mt-2">
                Cookies are small text files stored on your device when you visit a website. They help websites
                remember preferences, improve performance, and provide a better browsing experience.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">2. How Invyo Uses Cookies</h2>
              <p className="mt-2">
                We may use essential cookies for core website functionality and may later use analytics cookies to
                understand website usage and improve user experience.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">3. Cookie Categories</h2>
              <p className="mt-2">
                Essential cookies are required for basic operation. Performance or analytics cookies help us measure
                traffic and feature usage. Marketing cookies may be introduced in future for campaign measurement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">4. Managing Cookies</h2>
              <p className="mt-2">
                You can control or delete cookies through your browser settings. Blocking some cookies may affect
                site functionality.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">5. Updates to This Notice</h2>
              <p className="mt-2">
                We may update this Cookie Notice as our product and legal requirements evolve. Updates take effect
                when posted on this page.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">6. Contact</h2>
              <p className="mt-2">
                For cookie-related questions, contact{' '}
                <a href="mailto:support@invyo.uk" className="font-semibold text-lt-ink underline">
                  support@invyo.uk
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
