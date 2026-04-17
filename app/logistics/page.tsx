import SectionStationeryFrame from '@/components/SectionStationeryFrame'
import { getRedis } from '@/lib/redis'
import { RSVP_REDIS_KEY, eventLabel, routeLabel, type RsvpRecord } from '@/lib/rsvp'

export const dynamic = 'force-dynamic'

function parseRecord(raw: unknown): RsvpRecord | null {
  if (typeof raw !== 'string') return null
  try {
    const o = JSON.parse(raw) as RsvpRecord
    if (!o?.guestName || typeof o.guestName !== 'string') return null
    if (o.event !== 'marriage_ceremony' && o.event !== 'wedding') return null
    if (o.route !== 'family' && o.route !== 'friends') return null
    if (typeof o.plusOne !== 'boolean') return null
    if (!o.submittedAt) return null
    return o
  } catch {
    return null
  }
}

async function loadEntries(): Promise<RsvpRecord[]> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return []
  }
  try {
    const redis = getRedis()
    const rows = await redis.lrange(RSVP_REDIS_KEY, 0, 499)
    const out: RsvpRecord[] = []
    for (const r of rows) {
      const p = parseRecord(r)
      if (p) out.push(p)
    }
    return out
  } catch {
    return []
  }
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Indian/Maldives',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-sm border border-gold/25 bg-parchment/80 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,252,248,0.6)]">
      <p className="font-cinzel text-[9px] uppercase tracking-[2.5px] text-muted">{label}</p>
      <p className="mt-1 font-cinzel text-[22px] font-light text-ink tabular-nums">{value}</p>
    </div>
  )
}

export default async function LogisticsPage() {
  const entries = await loadEntries()
  const configured = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

  let family = 0
  let friends = 0
  let marriage = 0
  let wedding = 0
  let headcount = 0
  for (const e of entries) {
    if (e.route === 'family') family += 1
    else friends += 1
    if (e.event === 'wedding') wedding += 1
    else marriage += 1
    headcount += e.plusOne ? 2 : 1
  }

  return (
    <div className="min-h-dvh bg-parchment px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto max-w-[720px]">
        <header className="mb-8 text-center">
          <p className="font-cinzel text-[8px] uppercase tracking-[4px] text-gold">Private</p>
          <h1 className="mt-2 font-cinzel text-[28px] font-light tracking-tight sm:text-[34px]">RSVP logistics</h1>
          <p className="mx-auto mt-2 max-w-md font-cinzel text-[12px] italic text-muted leading-relaxed">
            Responses from the invitation — name, event, guest count, list (family or friends), and time received.
          </p>
        </header>

        {!configured && (
          <p className="mb-6 rounded-sm border border-gold/30 bg-sand px-4 py-3 text-center font-cinzel text-[12px] text-ink">
            Redis is not configured. Set <code className="text-gold-deep">UPSTASH_REDIS_REST_URL</code> and{' '}
            <code className="text-gold-deep">UPSTASH_REDIS_REST_TOKEN</code> in the environment.
          </p>
        )}

        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <StatCard label="Total RSVPs" value={entries.length} />
          <StatCard label="Est. guests" value={headcount} />
          <StatCard label="Family" value={family} />
          <StatCard label="Friends" value={friends} />
          <StatCard label="Ceremony" value={marriage} />
          <StatCard label="Wedding" value={wedding} />
        </div>

        <SectionStationeryFrame className="max-w-[720px]">
          <h2 className="mb-4 text-center font-cinzel text-[11px] uppercase tracking-[3px] text-gold">Guest list</h2>
          {entries.length === 0 ? (
            <p className="py-8 text-center font-cinzel text-[13px] italic text-muted">No RSVPs yet.</p>
          ) : (
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-gold/20 font-cinzel text-[8px] uppercase tracking-[2px] text-muted">
                    <th className="py-2 pr-2 font-medium">Guest</th>
                    <th className="py-2 pr-2 font-medium">Event</th>
                    <th className="py-2 pr-2 font-medium">+1</th>
                    <th className="py-2 pr-2 font-medium">List</th>
                    <th className="py-2 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((row) => (
                    <tr key={row.id} className="border-b border-gold/10 font-cinzel text-[12px] text-ink last:border-0">
                      <td className="max-w-[140px] py-2.5 pr-2 align-top font-medium leading-snug">{row.guestName}</td>
                      <td className="py-2.5 pr-2 align-top text-muted">{eventLabel(row.event)}</td>
                      <td className="py-2.5 pr-2 align-top">{row.plusOne ? 'Yes' : 'No'}</td>
                      <td className="py-2.5 pr-2 align-top text-muted">{routeLabel(row.route)}</td>
                      <td className="whitespace-nowrap py-2.5 align-top text-[11px] text-muted">
                        {formatWhen(row.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionStationeryFrame>
      </div>
    </div>
  )
}
