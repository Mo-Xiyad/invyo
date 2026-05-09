import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

function AttendingBadge({ attending, maybe }: { attending: boolean; maybe: boolean }) {
  if (maybe)
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-sans text-xs font-semibold text-amber-700">Maybe</span>
  if (attending)
    return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-sans text-xs font-semibold text-green-700">✓ Attending</span>
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-sans text-xs font-semibold text-red-600">Declined</span>
}

export default async function RSVPPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Load all the user's invitations
  const { data: invitations } = await supabase
    .from('invitations')
    .select('id, template_id, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const invitationIds = invitations?.map(i => i.id) ?? []

  // Load all RSVPs for those invitations
  const { data: responses } = invitationIds.length
    ? await supabase
        .from('rsvp_responses')
        .select('id, invitation_id, guest_name, attending, guests_count, message, created_at')
        .in('invitation_id', invitationIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const attending = responses?.filter(r => r.attending && r.message !== 'maybe') ?? []
  const maybe = responses?.filter(r => r.message === 'maybe') ?? []
  const declined = responses?.filter(r => !r.attending) ?? []
  const totalGuests = attending.reduce((sum, r) => sum + (r.guests_count ?? 1), 0)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-extrabold text-lt-ink md:text-3xl">RSVP List</h1>
        <p className="mt-1 font-sans text-sm text-lt-muted">Guest responses for your invitation.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total responses', value: responses?.length ?? 0, color: 'text-lt-ink' },
          { label: 'Attending', value: attending.length, color: 'text-green-600' },
          { label: 'Maybe', value: maybe.length, color: 'text-amber-600' },
          { label: 'Total guests', value: totalGuests, color: 'text-lt-ink' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-lt-border bg-lt-surface p-5 shadow-sm">
            <p className={`font-display text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 font-sans text-xs text-lt-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {!responses?.length ? (
        <div className="rounded-2xl border border-lt-border bg-lt-surface p-10 text-center">
          <p className="font-sans text-sm text-lt-muted">No RSVPs yet.</p>
          {!invitationIds.length && (
            <p className="mt-2 font-sans text-xs text-lt-muted">
              You need to{' '}
              <Link href="/dashboard/invitation" className="font-semibold text-lt-ink underline underline-offset-2">
                set up your invitation
              </Link>{' '}
              first.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-lt-border bg-lt-subtle">
                <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Guest</th>
                <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Response</th>
                <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Guests</th>
                <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr key={r.id} className={`border-b border-lt-border last:border-0 ${i % 2 === 0 ? '' : 'bg-lt-subtle/40'}`}>
                  <td className="px-5 py-3.5 font-sans text-sm font-semibold text-lt-ink">{r.guest_name}</td>
                  <td className="px-5 py-3.5">
                    <AttendingBadge attending={r.attending} maybe={r.message === 'maybe'} />
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm text-lt-muted">{r.guests_count ?? 1}</td>
                  <td className="px-5 py-3.5 font-sans text-xs text-lt-muted">
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
