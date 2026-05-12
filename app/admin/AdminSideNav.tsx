'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, LayoutDashboard, LayoutTemplate, type LucideIcon, Users } from 'lucide-react'

const navItems: Array<{
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}> = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/admin/clients', label: 'Clients', icon: Users },
] as const

export default function AdminSideNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 flex w-56 flex-col border-r border-lt-border bg-lt-surface px-4 py-6">
      <div className="px-2">
        <p className="font-display text-2xl font-extrabold text-lt-ink">Invyo Admin</p>
        <p className="mt-1 font-sans text-sm text-lt-muted">Control panel</p>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-3 rounded-2xl border px-3 py-2.5 font-sans text-sm font-semibold transition-colors',
                isActive
                  ? 'border-lt-border bg-lt-subtle text-lt-ink'
                  : 'border-transparent text-lt-muted hover:border-lt-border hover:bg-lt-subtle/70 hover:text-lt-ink',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <Link
        href="/dashboard"
        className="mt-6 flex items-center gap-3 rounded-2xl border border-lt-border px-3 py-2.5 font-sans text-sm font-semibold text-lt-ink transition-colors hover:bg-lt-subtle"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to dashboard</span>
      </Link>
    </aside>
  )
}
