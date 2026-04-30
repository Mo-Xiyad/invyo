import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 pb-20 pt-32">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-lt-border bg-lt-surface p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-lt-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-lt-muted">Last updated: 30 April 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-lt-ink/90 md:text-base">
            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">1. What We Collect</h2>
              <p className="mt-2">
                When you contact us, we may collect personal data such as your name, email address, social handle,
                event date, and message content.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">2. How We Use Your Data</h2>
              <p className="mt-2">
                We use your information to respond to enquiries, support your use of Invyo, improve our services,
                and communicate updates relevant to your request.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">3. Legal Basis</h2>
              <p className="mt-2">
                We process your data based on legitimate interest, performance of a requested service, or consent,
                depending on the context of your interaction with us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">4. Third-Party Processors</h2>
              <p className="mt-2">
                We may use trusted providers (such as Brevo for email delivery) to process data on our behalf.
                These providers are expected to handle data securely and in line with applicable law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">5. Data Retention</h2>
              <p className="mt-2">
                We keep personal data only for as long as necessary for support, legal, and operational purposes,
                then securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">6. Your Rights</h2>
              <p className="mt-2">
                Depending on your location, you may have rights to access, correct, delete, restrict, or object to
                processing of your personal data, and to request data portability.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">7. Security</h2>
              <p className="mt-2">
                We take reasonable technical and organizational measures to protect data against unauthorized access,
                loss, misuse, or alteration.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">8. Contact</h2>
              <p className="mt-2">
                For privacy-related requests, contact{' '}
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
