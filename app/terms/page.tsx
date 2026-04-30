import NavBar from '@/components/NavBar'
import SiteFooter from '@/components/SiteFooter'

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 pb-20 pt-32">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-lt-border bg-lt-surface p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-lt-accent">Legal</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-3 text-sm text-lt-muted">Last updated: 30 April 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-lt-ink/90 md:text-base">
            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">1. About Invyo</h2>
              <p className="mt-2">
                Invyo provides digital wedding invitation tools and related features. By using Invyo, you agree
                to these Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">2. Eligibility and Accounts</h2>
              <p className="mt-2">
                You must provide accurate information when contacting us or creating an account in the future.
                You are responsible for activity carried out using your account details.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">3. Acceptable Use</h2>
              <p className="mt-2">
                You agree not to use Invyo for unlawful, fraudulent, abusive, or harmful activity, including spam
                or content that infringes third-party rights.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">4. Service Availability</h2>
              <p className="mt-2">
                We aim to keep Invyo available and reliable, but we cannot guarantee uninterrupted access at all
                times. We may update, pause, or change parts of the service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">5. Payments and Plans</h2>
              <p className="mt-2">
                If paid plans are offered, pricing and features will be shown clearly before purchase. Any refund
                terms will be presented at checkout or in a separate policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">6. Intellectual Property</h2>
              <p className="mt-2">
                The Invyo brand, website, and service content are owned by Invyo or its licensors. You keep rights
                to content you submit, and you grant us permission to process it for service delivery.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">7. Limitation of Liability</h2>
              <p className="mt-2">
                To the maximum extent allowed by law, Invyo is not liable for indirect, incidental, or
                consequential losses arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">8. Changes to Terms</h2>
              <p className="mt-2">
                We may update these terms from time to time. Updated terms are effective once published on this
                page.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-lt-ink">9. Contact</h2>
              <p className="mt-2">
                For legal or account questions, contact us at{' '}
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
