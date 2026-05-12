import { createClient } from '@/utils/supabase/server'

type AdminUser = {
  id: string
  email: string | null
  full_name: string | null
  role: 'user' | 'admin'
  invitation_count: number
  created_at: string
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role === 'admin' ? 'bg-lt-ink text-lt-surface' : 'bg-lt-subtle text-lt-muted'}`}>
      {role}
    </span>
  )
}

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data } = await supabase.rpc('admin_get_users')
  const users = (data ?? []) as AdminUser[]

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-lt-ink">Clients</h1>
        <p className="mt-1 font-sans text-sm text-lt-muted">User accounts and invitation activity.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-lt-border bg-lt-surface">
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-lt-subtle">
                <tr className="border-b border-lt-border">
                  <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Email</th>
                  <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Name</th>
                  <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Role</th>
                  <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Invitations</th>
                  <th className="px-5 py-3 font-sans text-xs font-semibold text-lt-muted">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((client, index) => (
                  <tr key={client.id} className={`border-b border-lt-border last:border-0 ${index % 2 !== 0 ? 'bg-lt-subtle/40' : ''}`}>
                    <td className="px-5 py-4 font-sans text-sm text-lt-ink">{client.email ?? '—'}</td>
                    <td className="px-5 py-4 font-sans text-sm text-lt-muted">{client.full_name ?? '—'}</td>
                    <td className="px-5 py-4 font-sans text-sm"><RoleBadge role={client.role} /></td>
                    <td className="px-5 py-4 font-sans text-sm text-lt-muted">{Number(client.invitation_count ?? 0).toLocaleString()}</td>
                    <td className="px-5 py-4 font-sans text-sm text-lt-muted">{formatDate(client.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center font-sans text-sm text-lt-muted">No clients yet.</div>
        )}
      </div>
    </div>
  )
}
