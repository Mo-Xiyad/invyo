import Link from 'next/link'

export default function LogisticsGatePage() {
  return (
    <div className="min-h-dvh bg-parchment px-5 py-12 text-center text-ink">
      <div className="mx-auto max-w-md rounded-sm border border-gold/30 bg-[#fffefb] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,252,248,0.9)]">
        <p className="font-cinzel text-[9px] uppercase tracking-[4px] text-gold">Logistics</p>
        <h1 className="mt-3 font-cinzel text-[22px] font-light leading-snug">This page needs a passcode</h1>
        <p className="mt-4 font-cinzel text-[13px] italic leading-relaxed text-muted">
          Open the dashboard using the link the hosts gave you, including <code className="font-mono text-[11px] text-ink">?key=…</code> at the
          end of the URL.
        </p>
        <p className="mt-6 font-cinzel text-[11px] text-muted">
          Format:{' '}
          <span className="break-all font-mono text-[10px] text-gold-deep">/logistics?key=…</span>
        </p>
        <Link
          href="/friends"
          className="mt-8 inline-block font-cinzel text-[11px] uppercase tracking-wider text-gold underline-offset-4 hover:underline"
        >
          Back to invitation
        </Link>
      </div>
    </div>
  )
}
