import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import AdminTemplateMusicClient from './AdminTemplateMusicClient'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.invyo.uk'

type AdminStats = {
  total_users: number
  published_invitations: number
  draft_invitations: number
  total_revenue: number
  total_rsvps: number
}

type AdminInvitation = {
  id: string
  user_id: string
  user_email: string | null
  template_id: string
  slug: string | null
  status: 'draft' | 'published'
  amount_paid: number | null
  currency: string | null
  rsvp_count: number
  created_at: string
  published_at: string | null
}

function formatCurrency(amountInCents: number) {
  return currencyFormatter.format(amountInCents / 100)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const classes = status === 'published'
    ? 'bg-green-50 text-green-700'
    : 'bg-amber-50 text-amber-700'

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}


function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-extrabold text-lt-ink">{title}</h2>
        {subtitle ? <p className="mt-1 font-sans text-sm text-lt-muted">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()

  const [statsResult, invitationsResult, templateSettingsResult] = await Promise.all([
    supabase.rpc('admin_get_stats'),
    supabase.rpc('admin_get_invitations'),
    supabase.from('template_settings').select('template_id, music_url, music_name'),
  ])

  const stats = ((statsResult.data ?? [])[0] ?? {
    total_users: 0,
    published_invitations: 0,
    draft_invitations: 0,
    total_revenue: 0,
    total_rsvps: 0,
  }) as AdminStats
  const invitations = (invitationsResult.data ?? []) as AdminInvitation[]
  const hasError = [statsResult.error, invitationsResult.error].some(Boolean)

  // Build template music initial state
  const templateMusicInitial = Object.fromEntries(
    (templateSettingsResult.data ?? []).map(s => [
      s.template_id,
      { musicUrl: s.music_url ?? '', musicName: s.music_name ?? '' },
    ])
  )

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-sm text-lt-muted">Platform overview across clients, invitations, and responses.</p>
            {hasError ? (
              <p className="mt-2 font-sans text-sm text-red-600">Some admin data could not be loaded.</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total clients', value: stats.total_users.toLocaleString() },
            { label: 'Published invitations', value: stats.published_invitations.toLocaleString() },
            { label: 'Drafts', value: stats.draft_invitations.toLocaleString() },
            { label: 'Revenue', value: formatCurrency(stats.total_revenue ?? 0) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-lt-border bg-lt-surface p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lt-muted">{stat.label}</p>
              <p className="mt-3 font-display text-3xl font-extrabold text-lt-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Template Music */}
      <section>
        <SectionHeading title="Template music" subtitle="Set the background music for each template. Changes take effect immediately on the live preview." />
        <AdminTemplateMusicClient initial={templateMusicInitial} />
      </section>

      <section>
        <SectionHeading title="Invitations" subtitle="All invitation records across the platform." />
        <div className="overflow-hidden rounded-2xl border border-lt-border bg-lt-surface">
          {invitations.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-lt-subtle">
                  <tr className="border-b border-lt-border">
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Client email</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Template</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Slug</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Status</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">RSVPs</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Revenue</th>
                    <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Published date</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation, index) => {
                    const liveUrl = invitation.slug ? new URL(`/i/${invitation.slug}`, siteUrl).toString() : null

                    return (
                      <tr key={invitation.id} className={`border-b border-lt-border last:border-0 ${index % 2 === 0 ? '' : 'bg-lt-subtle/40'}`}>
                        <td className="px-5 py-4 font-sans text-sm text-lt-ink">{invitation.user_email ?? '—'}</td>
                        <td className="px-5 py-4 font-sans text-sm text-lt-muted">{invitation.template_id}</td>
                        <td className="px-5 py-4 font-sans text-sm">
                          {invitation.status === 'published' && liveUrl ? (
                            <Link href={liveUrl} target="_blank" className="font-semibold text-lt-ink underline underline-offset-2">
                              {invitation.slug}
                            </Link>
                          ) : (
                            <span className="text-lt-muted">{invitation.slug ?? '—'}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-sans text-sm text-lt-ink"><StatusBadge status={invitation.status} /></td>
                        <td className="px-5 py-4 font-sans text-sm text-lt-muted">{Number(invitation.rsvp_count ?? 0).toLocaleString()}</td>
                        <td className="px-5 py-4 font-sans text-sm text-lt-muted">{formatCurrency(invitation.amount_paid ?? 0)}</td>
                        <td className="px-5 py-4 font-sans text-sm text-lt-muted">{formatDate(invitation.published_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center font-sans text-sm text-lt-muted">No invitations yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}
