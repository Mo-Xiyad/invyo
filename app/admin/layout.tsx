import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import AdminSideNav from './AdminSideNav'

function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-lt-subtle px-4">
      <div className="w-full max-w-lg rounded-2xl border border-lt-border bg-lt-surface p-10 text-center shadow-sm">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lt-muted">403</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-lt-ink">Access denied</h1>
        <p className="mt-3 font-sans text-sm text-lt-muted">
          You don&apos;t have permission to view the admin dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full border border-lt-border px-5 py-2.5 font-sans text-sm font-semibold text-lt-ink transition-colors hover:bg-lt-subtle"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <AccessDenied />
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <div className="min-h-screen bg-lt-subtle text-lt-ink">
      <AdminSideNav />
      <main className="ml-56 min-h-screen bg-lt-subtle px-8 py-8">{children}</main>
    </div>
  )
}
