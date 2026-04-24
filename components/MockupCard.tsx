import Image from 'next/image'

interface MockupCardProps {
  variant: 'create' | 'share' | 'track'
}

/** Aligned with app/globals.css lt-* tokens */
const ink = '#252b24'
const muted = '#5c6558'
const border = '#dde2d8'
const surface = '#fdfdf9'
const subtle = '#f0f2ec'
const accent = '#8fa382'
const accentSoft = '#b9c4ae'
const footer = '#1b211a'
const white = '#ffffff'

const fontUi = 'ui-sans-serif, system-ui, sans-serif'

export default function MockupCard({ variant }: MockupCardProps) {
  if (variant === 'create') return <CreateMockup />
  if (variant === 'share') return <ShareMockup />
  return <TrackMockup />
}

/** Create section — `public/assets/custom.png` */
function CreateMockup() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] md:rounded-[1.35rem]">
        <Image
          src="/assets/custom.png"
          alt="Customize your Wedvite with themes, photos, and live preview"
          width={1402}
          height={1122}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
        />
      </div>
    </div>
  )
}

/** Share section — `public/assets/ui-edits.png` */
function ShareMockup() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] md:rounded-[1.35rem]">
        <Image
          src="/assets/ui-edits.png"
          alt="Share your Wedvite link with guests in messages, email, and social apps"
          width={1402}
          height={1122}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
        />
      </div>
    </div>
  )
}

/** Dashboard: stats + guest list with pill statuses */
function TrackMockup() {
  const stats = [
    { x: 24, label: 'Attending', value: '48', tint: 'rgba(37,43,36,0.08)' },
    { x: 128, label: 'Pending', value: '12', tint: 'rgba(143,163,130,0.22)' },
    { x: 232, label: 'Declined', value: '3', tint: 'rgba(92,101,88,0.1)' },
    { x: 336, label: 'Invited', value: '63', tint: 'rgba(185,196,174,0.45)' },
  ]
  const guests: { name: string; plus: string; status: string; pillBg: string; pillFg: string }[] = [
    { name: 'Emily & Robert Chen', plus: 'Yes', status: 'Attending', pillBg: 'rgba(37,43,36,0.1)', pillFg: ink },
    { name: 'Sophie Williams', plus: 'No', status: 'Attending', pillBg: 'rgba(37,43,36,0.1)', pillFg: ink },
    { name: 'Michael Brown', plus: '—', status: 'Pending', pillBg: 'rgba(143,163,130,0.25)', pillFg: ink },
    { name: 'Isabella Turner', plus: 'Yes', status: 'Declined', pillBg: 'rgba(92,101,88,0.12)', pillFg: muted },
  ]
  return (
    <div className="flex w-full items-center justify-center py-4">
      <svg
        viewBox="0 0 480 348"
        className="w-full max-w-md drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="14" y="14" width="452" height="320" rx="18" fill={white} stroke={border} strokeWidth="1.25" />
        <rect x="14" y="14" width="452" height="52" rx="18" fill={subtle} />
        <rect x="14" y="42" width="452" height="24" fill={subtle} />
        <text x="34" y="46" fontSize="12" fontWeight="800" fill={ink} fontFamily={fontUi} letterSpacing="-0.02em">
          RSVPs
        </text>
        <text x="34" y="60" fontSize="7.5" fontWeight="600" fill={muted} fontFamily={fontUi} letterSpacing="0.05em">
          SARAH &amp; JAMES
        </text>
        <rect x="354" y="28" width="96" height="28" rx="14" fill={footer} />
        <text x="402" y="47" textAnchor="middle" fontSize="8" fontWeight="700" fill={white} fontFamily={fontUi}>
          + Guest
        </text>
        {stats.map((stat) => (
          <g key={stat.label}>
            <rect x={stat.x} y="78" width="100" height="64" rx="14" fill={stat.tint} stroke={border} strokeWidth="1" />
            <text x={stat.x + 50} y="114" textAnchor="middle" fontSize="26" fontWeight="800" fill={ink} fontFamily={fontUi}>
              {stat.value}
            </text>
            <text x={stat.x + 50} y="132" textAnchor="middle" fontSize="7" fontWeight="600" fill={muted} fontFamily={fontUi} letterSpacing="0.04em">
              {stat.label}
            </text>
          </g>
        ))}
        <rect x="24" y="158" width="432" height="26" rx="8" fill={subtle} stroke={border} strokeWidth="0.75" />
        <text x="40" y="175" fontSize="7" fontWeight="700" fill={muted} fontFamily={fontUi} letterSpacing="0.08em">
          GUEST
        </text>
        <text x="228" y="175" fontSize="7" fontWeight="700" fill={muted} fontFamily={fontUi} letterSpacing="0.08em">
          PLUS-ONE
        </text>
        <text x="384" y="175" textAnchor="middle" fontSize="7" fontWeight="700" fill={muted} fontFamily={fontUi} letterSpacing="0.08em">
          STATUS
        </text>
        {guests.map((guest, i) => {
          const y = 196 + i * 34
          return (
            <g key={guest.name}>
              <rect x="24" y={y - 14} width="432" height="32" rx="8" fill={i % 2 === 0 ? surface : white} opacity="0.95" />
              <line x1="24" y1={y + 18} x2="456" y2={y + 18} stroke={border} strokeWidth="0.75" opacity="0.7" />
              <text x="40" y={y + 4} fontSize="8.5" fontWeight="600" fill={ink} fontFamily={fontUi}>
                {guest.name}
              </text>
              <text x="236" y={y + 4} fontSize="8.5" fontWeight="500" fill={muted} fontFamily={fontUi}>
                {guest.plus}
              </text>
              <rect x="338" y={y - 9} width="72" height="20" rx="10" fill={guest.pillBg} />
              <text x="374" y={y + 4} textAnchor="middle" fontSize="7" fontWeight="700" fill={guest.pillFg} fontFamily={fontUi}>
                {guest.status}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
