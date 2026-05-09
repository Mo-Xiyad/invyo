import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  return (
    <div className="flex h-screen overflow-hidden bg-lt-subtle">
      <DashboardSidebar user={user} />
      <main className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
