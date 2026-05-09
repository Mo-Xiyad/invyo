import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ session_id?: string; slug?: string }>
}

export default async function PublishSuccessPage({ searchParams }: Props) {
  const { session_id, slug } = await searchParams

  if (!session_id || !slug) redirect('/dashboard/invitation')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Verify the invitation is now published (webhook may have already fired)
  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, status, slug')
    .eq('user_id', user.id)
    .eq('stripe_session_id', session_id)
    .maybeSingle()

  // If webhook hasn't fired yet, still show success — it will publish shortly
  const liveSlug = invitation?.slug ?? slug

  return (
    <div className="flex min-h-screen items-center justify-center bg-lt-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-lt-border bg-lt-surface p-10 shadow-xl text-center">
        <div className="mb-6 text-5xl">🎉</div>
        <h1 className="font-display text-2xl font-extrabold text-lt-ink mb-2">
          Payment confirmed!
        </h1>
        <p className="font-sans text-sm text-lt-muted mb-8">
          Your invitation is now live. Share this link with your guests:
        </p>

        {/* Live URL */}
        <a
          href={`https://${liveSlug}.invyo.uk`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-lt-border bg-lt-subtle px-5 py-4 font-mono text-sm text-lt-ink hover:border-lt-ink transition-colors mb-8 break-all"
        >
          https://<span className="font-bold">{liveSlug}</span>.invyo.uk ↗
        </a>

        {/* Copy button */}
        <CopyButton url={`https://${liveSlug}.invyo.uk`} />

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/dashboard/rsvp"
            className="rounded-full bg-lt-ink px-6 py-2.5 font-sans text-sm font-bold text-lt-surface hover:opacity-80 transition-opacity"
          >
            View RSVP list →
          </Link>
          <Link
            href="/dashboard"
            className="font-sans text-xs text-lt-muted underline underline-offset-2 hover:text-lt-ink"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

// Client component for copy-to-clipboard
function CopyButton({ url }: { url: string }) {
  return (
    <CopyButtonClient url={url} />
  )
}

import CopyButtonClient from './CopyButtonClient'
