'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞' },
  { href: '/dashboard/invitation', label: 'My Invitation', icon: '✉' },
  { href: '/dashboard/rsvp', label: 'RSVP List', icon: '📋' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
]

export default function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (user.user_metadata?.full_name as string)
    ?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    ?? user.email?.[0].toUpperCase()
    ?? '?'

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-lt-border bg-lt-surface md:flex">
      {/* Logo */}
      <div className="border-b border-lt-border px-6 py-5">
        <Link href="/" className="font-display text-xl font-extrabold text-lt-ink">
          Invyo
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-semibold transition-colors ${
                active
                  ? 'bg-lt-ink text-lt-surface'
                  : 'text-lt-muted hover:bg-lt-subtle hover:text-lt-ink'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-lt-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lt-ink font-sans text-xs font-bold text-lt-surface">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-xs font-semibold text-lt-ink">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            <p className="truncate font-sans text-[10px] text-lt-muted">{user.email}</p>
          </div>
          <button onClick={signOut} title="Sign out" className="text-lt-muted transition-colors hover:text-lt-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
