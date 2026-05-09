import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { TEMPLATES } from '@/lib/templates'
import Link from 'next/link'
import type { InvitationData } from '@/lib/invitation-types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'

  // Fetch ALL drafts for this user (one per template)
  const { data: drafts } = await supabase
    .from('invitations')
    .select('id, data, status, template_id, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const draftsByTemplate = Object.fromEntries(
    (drafts ?? []).map(d => [d.template_id, d])
  )

  const activeTemplates = TEMPLATES.filter(t => t.id !== 'coming-soon')

  const existingDrafts = activeTemplates.filter(t => draftsByTemplate[t.id])
  const untouched = activeTemplates.filter(t => !draftsByTemplate[t.id])

  function coupleName(draft: { data: unknown }) {
    const d = draft.data as Partial<InvitationData>
    const groom = [d.groomNameEn, d.groomLastNameEn].filter(Boolean).join(' ')
    const bride  = [d.brideNameEn,  d.brideLastNameEn].filter(Boolean).join(' ')
    if (groom && bride) return `${groom} & ${bride}`
    return null
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 2) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="font-display text-2xl font-extrabold text-lt-ink md:text-3xl">
          Hey {name} 👋
        </h1>
        <p className="mt-1 font-sans text-sm text-lt-muted">
          Welcome to your Invyo dashboard.
        </p>
      </div>

      {/* ── Existing drafts ── */}
      {existingDrafts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-lt-muted">
            Your invitations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {existingDrafts.map(template => {
              const draft = draftsByTemplate[template.id]
              const couple = coupleName(draft)
              const status: string = draft.status ?? 'draft'
              return (
                <div key={template.id} className="group relative flex flex-col rounded-2xl border border-lt-border bg-lt-surface p-6 shadow-sm transition-shadow hover:shadow-md">
                  {/* Status pill */}
                  <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest ${
                    status === 'published'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {status}
                  </span>

                  <h3 className="font-display text-lg font-extrabold text-lt-ink">
                    {template.name}
                  </h3>
                  {couple && (
                    <p className="mt-0.5 font-sans text-sm text-lt-muted">{couple}</p>
                  )}
                  <p className="mt-1 font-sans text-[11px] text-lt-muted/60">
                    Edited {timeAgo(draft.updated_at)}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/dashboard/invitation?template=${template.id}`}
                      className="flex-1 rounded-full bg-lt-ink px-4 py-2.5 text-center font-sans text-xs font-bold text-lt-surface transition-transform hover:scale-[1.02]"
                    >
                      Continue editing →
                    </Link>
                    <Link
                      href={template.previewPath}
                      target="_blank"
                      className="rounded-full border border-lt-border px-4 py-2.5 font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Start a new invitation ── */}
      {untouched.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-lt-muted">
            {existingDrafts.length > 0 ? 'Start another invitation' : 'Choose a template to get started'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {untouched.map(template => (
              <div key={template.id} className="flex flex-col rounded-2xl border border-lt-border bg-lt-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-extrabold text-lt-ink">{template.name}</h3>
                <p className="mt-1 font-sans text-sm text-lt-muted">{template.description}</p>
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/dashboard/invitation?template=${template.id}`}
                    className="flex-1 rounded-full bg-lt-ink px-4 py-2.5 text-center font-sans text-xs font-bold text-lt-surface transition-transform hover:scale-[1.02]"
                  >
                    Start fresh →
                  </Link>
                  <Link
                    href={template.previewPath}
                    target="_blank"
                    className="rounded-full border border-lt-border px-4 py-2.5 font-sans text-xs font-bold text-lt-muted transition-colors hover:border-lt-ink hover:text-lt-ink"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: '📋', title: 'RSVP list', desc: 'See who\'s coming', href: '/dashboard/rsvp' },
          { icon: '🔗', title: 'Your link', desc: 'yourname.invyo.uk', href: null },
          { icon: '💳', title: 'Billing', desc: 'Manage your plan', href: null },
        ].map(card => (
          card.href
            ? <Link key={card.title} href={card.href} className="rounded-2xl border border-lt-border bg-lt-surface p-5 transition-shadow hover:shadow-md">
                <div className="mb-2 text-2xl">{card.icon}</div>
                <h3 className="font-display text-sm font-bold text-lt-ink">{card.title}</h3>
                <p className="mt-1 font-sans text-xs text-lt-muted">{card.desc}</p>
              </Link>
            : <div key={card.title} className="rounded-2xl border border-lt-border bg-lt-surface p-5 opacity-40">
                <div className="mb-2 text-2xl">{card.icon}</div>
                <h3 className="font-display text-sm font-bold text-lt-ink">{card.title}</h3>
                <p className="mt-1 font-sans text-xs text-lt-muted">{card.desc}</p>
              </div>
        ))}
      </div>
    </div>
  )
}

